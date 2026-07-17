const database = require('../config/database');
const emailService = require('./email.service');
const logger = require('../utils/logger');

const VALID_STATUSES = ['pending', 'processing', 'quoted', 'accepted', 'rejected', 'archived'];

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
    return require('../models/quote.model');
}

async function findOrThrow(id) {
    const Quote = getModel();
    let quote;
    try {
        quote = await Quote.findById(id);
    } catch {
        throw new ServiceError('Preventivo non trovato', 404, 'NOT_FOUND');
    }
    if (!quote) throw new ServiceError('Preventivo non trovato', 404, 'NOT_FOUND');
    return quote;
}

async function listQuotes({ status, search, page = 1, limit = 50 } = {}) {
    const Quote = getModel();

    const filter = {};
    if (status && VALID_STATUSES.includes(status)) filter.status = status;
    if (search) {
        const rx = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ nome: rx }, { cognome: rx }, { email: rx }, { azienda: rx }];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
        Quote.find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .lean(),
        Quote.countDocuments(filter)
    ]);

    return {
        quotes: items.map(serialize),
        total,
        page: pageNum,
        limit: perPage
    };
}

async function getQuote(id) {
    const quote = await findOrThrow(id);
    return serialize(quote.toObject());
}

async function getStats() {
    const Quote = getModel();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [total, pending, thisMonth, accepted] = await Promise.all([
        Quote.countDocuments(),
        Quote.countDocuments({ status: 'pending' }),
        Quote.countDocuments({ createdAt: { $gte: startOfMonth } }),
        Quote.countDocuments({ status: 'accepted' })
    ]);

    const conversion = total > 0 ? Math.round((accepted / total) * 100) : 0;
    return { total, pending, thisMonth, accepted, conversion };
}

async function updateStatus(id, status) {
    if (!VALID_STATUSES.includes(status)) {
        throw new ServiceError('Stato non valido', 400, 'INVALID_STATUS');
    }
    const quote = await findOrThrow(id);
    quote.status = status;
    await quote.save();
    return serialize(quote.toObject());
}

async function respond(id, { subject, message }, adminUsername) {
    if (!message || !message.trim()) {
        throw new ServiceError('Il messaggio di risposta è obbligatorio', 400, 'EMPTY_MESSAGE');
    }
    const quote = await findOrThrow(id);

    try {
        await emailService.sendQuoteReply({
            to: quote.email,
            clientName: `${quote.nome} ${quote.cognome}`.trim(),
            subject,
            message
        });
    } catch (err) {
        logger.error('Invio risposta preventivo fallito:', err.message);
        throw new ServiceError('Invio email non riuscito. Riprova più tardi.', 502, 'EMAIL_FAILED');
    }

    quote.adminResponse = {
        subject: subject || null,
        message,
        sentAt: new Date(),
        by: adminUsername || null
    };
    if (quote.status === 'pending' || quote.status === 'processing') {
        quote.status = 'quoted';
    }
    await quote.save();
    logger.success(`Risposta inviata al preventivo ${id} da ${adminUsername || 'admin'}`);
    return serialize(quote.toObject());
}

async function deleteQuote(id) {
    const quote = await findOrThrow(id);
    await quote.deleteOne();
    return { id: quote._id.toString() };
}

function serialize(q) {
    return {
        id: q._id.toString(),
        nome: q.nome,
        cognome: q.cognome,
        email: q.email,
        telefono: q.telefono,
        azienda: q.azienda || null,
        quantita: q.quantita,
        note: q.note || '',
        privacy: q.privacy,
        file: q.file || null,
        status: q.status,
        adminResponse: q.adminResponse || null,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt
    };
}

module.exports = {
    listQuotes,
    getQuote,
    getStats,
    updateStatus,
    respond,
    deleteQuote,
    VALID_STATUSES,
    ServiceError
};
