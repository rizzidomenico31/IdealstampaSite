const database = require('../config/database');
const emailService = require('./email.service');
const logger = require('../utils/logger');

const SOURCES = ['footer', 'preventivo'];
const GROUPS = ['footer', 'preventivo', 'all'];

const UNSUBSCRIBE_BASE =
    process.env.BACKEND_PUBLIC_URL || 'https://nodejs-p9se-production.up.railway.app';

class ServiceError extends Error {
    constructor(message, status = 400, code = 'BAD_REQUEST') {
        super(message);
        this.status = status;
        this.code = code;
        this.expose = true;
    }
}

function getModel() {
    if (!database.isEnabled()) {
        throw new ServiceError('Database non configurato', 503, 'DB_DISABLED');
    }
    return require('../models/subscriber.model');
}

function unsubscribeUrlFor(email) {
    return `${UNSUBSCRIBE_BASE}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
}

function groupFilter(group) {
    if (group === 'footer') return { sources: 'footer' };
    if (group === 'preventivo') return { sources: 'preventivo' };
    return {};
}

// Upsert idempotente: aggiunge la sorgente e (ri)attiva il contatto.
async function subscribe({ email, nome, source }) {
    const Subscriber = getModel();
    if (!SOURCES.includes(source)) {
        throw new ServiceError('Sorgente iscrizione non valida', 400, 'INVALID_SOURCE');
    }
    const normalized = String(email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
        throw new ServiceError('Email non valida', 400, 'INVALID_EMAIL');
    }

    const update = {
        $addToSet: { sources: source },
        $set: { active: true, unsubscribedAt: null }
    };
    if (nome) update.$setOnInsert = { nome: String(nome).trim() };

    const before = await Subscriber.findOne({ email: normalized });
    const subscriber = await Subscriber.findOneAndUpdate(
        { email: normalized },
        update,
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    logger.info(`Iscrizione newsletter (${source}): ${normalized}`);
    return { created: !before, subscriber: serialize(subscriber) };
}

async function unsubscribe(email) {
    const Subscriber = getModel();
    const normalized = String(email || '').trim().toLowerCase();
    const sub = await Subscriber.findOne({ email: normalized });
    if (!sub) return { ok: true };
    sub.active = false;
    sub.unsubscribedAt = new Date();
    await sub.save();
    logger.info(`Disiscrizione newsletter: ${normalized}`);
    return { ok: true };
}

async function listSubscribers({ group, search } = {}) {
    const Subscriber = getModel();
    const filter = groupFilter(group);
    if (search) {
        const rx = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ email: rx }, { nome: rx }];
    }
    const items = await Subscriber.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    return items.map(serialize);
}

async function getStats() {
    const Subscriber = getModel();
    const [total, footer, preventivo] = await Promise.all([
        Subscriber.countDocuments({ active: true }),
        Subscriber.countDocuments({ active: true, sources: 'footer' }),
        Subscriber.countDocuments({ active: true, sources: 'preventivo' })
    ]);
    return { total, footer, preventivo };
}

async function deleteSubscriber(id) {
    const Subscriber = getModel();
    let sub;
    try {
        sub = await Subscriber.findById(id);
    } catch {
        throw new ServiceError('Iscritto non trovato', 404, 'NOT_FOUND');
    }
    if (!sub) throw new ServiceError('Iscritto non trovato', 404, 'NOT_FOUND');
    await sub.deleteOne();
    return { id: sub._id.toString() };
}

async function countRecipients(group) {
    const Subscriber = getModel();
    return Subscriber.countDocuments({ active: true, ...groupFilter(group) });
}

async function sendNewsletter({ subject, title, message, group }, adminUsername) {
    const Subscriber = getModel();
    if (!GROUPS.includes(group)) {
        throw new ServiceError('Gruppo destinatari non valido', 400, 'INVALID_GROUP');
    }
    if (!subject || !subject.trim()) {
        throw new ServiceError('L\'oggetto è obbligatorio', 400, 'EMPTY_SUBJECT');
    }
    if (!message || !message.trim()) {
        throw new ServiceError('Il contenuto è obbligatorio', 400, 'EMPTY_MESSAGE');
    }

    const recipients = await Subscriber.find({ active: true, ...groupFilter(group) })
        .select('email')
        .lean();

    if (recipients.length === 0) {
        throw new ServiceError('Nessun destinatario nel gruppo selezionato', 400, 'NO_RECIPIENTS');
    }

    let sent = 0;
    const failed = [];
    const BATCH = 20;

    for (let i = 0; i < recipients.length; i += BATCH) {
        const chunk = recipients.slice(i, i + BATCH);
        const results = await Promise.allSettled(chunk.map(r =>
            emailService.sendNewsletterEmail({
                to: r.email,
                subject,
                title,
                message,
                unsubscribeUrl: unsubscribeUrlFor(r.email)
            })
        ));
        results.forEach((res, idx) => {
            if (res.status === 'fulfilled') sent += 1;
            else failed.push(chunk[idx].email);
        });
    }

    logger.success(`Newsletter inviata da ${adminUsername || 'admin'} → gruppo "${group}": ${sent}/${recipients.length} ok`);
    return { total: recipients.length, sent, failed };
}

function serialize(s) {
    return {
        id: s._id.toString(),
        email: s.email,
        nome: s.nome || null,
        sources: s.sources || [],
        active: s.active,
        createdAt: s.createdAt
    };
}

module.exports = {
    subscribe,
    unsubscribe,
    listSubscribers,
    getStats,
    deleteSubscriber,
    countRecipients,
    sendNewsletter,
    SOURCES,
    GROUPS,
    ServiceError
};
