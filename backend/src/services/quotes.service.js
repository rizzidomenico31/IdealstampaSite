const database = require('../config/database');
const emailService = require('./email.service');
const aiService = require('./ai.service');
const referencePrices = require('./reference-prices.service');
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

function escapeRegex(s) {
    return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildSimilarityFilter(quote) {
    // Trova preventivi simili: stessa email, stesso prodotto, parola chiave prodotto, o range quantità simile
    const category = aiService.detectProductCategory(`${quote.spec?.prodotto || ''} ${quote.note || ''}`);
    const quantita = Number(quote.quantita) || 0;
    const filters = [];

    if (quote.email) {
        filters.push({ email: quote.email });
    }

    if (quote.spec?.prodotto) {
        filters.push({ 'spec.prodotto': { $regex: escapeRegex(quote.spec.prodotto), $options: 'i' } });
    }

    if (category) {
        filters.push({ note: { $regex: category.split(' ').join('|'), $options: 'i' } });
    }

    if (quantita > 0) {
        filters.push({ quantita: { $gte: Math.floor(quantita * 0.5), $lte: Math.ceil(quantita * 2) } });
    }

    return filters;
}

/** Preventivi simili già prezzati: solo quelli con un totale servono come riferimento. */
async function findSimilarQuotes(quote, limit = 3) {
    const Quote = getModel();
    const filters = buildSimilarityFilter(quote);
    if (filters.length === 0) return [];

    return Quote.find({ _id: { $ne: quote._id }, 'pricing.finalTotal': { $gt: 0 }, $or: filters })
        .select('quantita note spec pricing.finalTotal')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
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

async function updatePricing(id, { unitPrice, setupCost, discount, finalTotal }) {
    const quote = await findOrThrow(id);

    const pricing = { ...quote.pricing?.toObject?.() || quote.pricing || {} };

    if (unitPrice !== undefined) pricing.unitPrice = Math.max(0, Number(unitPrice) || 0);
    if (setupCost !== undefined) pricing.setupCost = Math.max(0, Number(setupCost) || 0);
    if (discount !== undefined) pricing.discount = Math.min(100, Math.max(0, Number(discount) || 0));

    // Calcola automaticamente il totale se manca
    if (finalTotal !== undefined) {
        pricing.finalTotal = Math.max(0, Number(finalTotal) || 0);
    } else if (unitPrice !== undefined || setupCost !== undefined || discount !== undefined) {
        const qty = Math.max(1, Number(quote.quantita) || 1);
        const subtotal = (pricing.unitPrice || 0) * qty + (pricing.setupCost || 0);
        const discounted = subtotal * (1 - (pricing.discount || 0) / 100);
        pricing.finalTotal = Math.round(discounted * 100) / 100;
    }

    quote.pricing = pricing;
    await quote.save();
    return serialize(quote.toObject());
}

const SPEC_FIELDS = ['prodotto', 'formato', 'carta', 'grammatura', 'colori', 'finiture', 'consegna'];

function sanitizeSpec(spec = {}) {
    const out = {};
    for (const f of SPEC_FIELDS) {
        const v = spec[f];
        if (v === undefined || v === null || v === '') continue;
        out[f] = f === 'grammatura' ? Number(v) : String(v).trim();
    }
    return out;
}

/** Specifiche suggerite dalla nota del cliente (non salvate: l'operatore le rivede prima). */
async function extractSpec(id) {
    const quote = await findOrThrow(id);
    try {
        return await aiService.extractSpec(quote.note, quote.quantita);
    } catch (err) {
        logger.error('Estrazione specifiche fallita:', err.message);
        throw new ServiceError('Estrazione specifiche non riuscita. Compilale a mano.', 502, 'AI_FAILED');
    }
}

/**
 * Analisi prezzo: salva spec/contesto dell'operatore, consulta il listino di riferimento,
 * esegue la ricerca web solo se richiesta e non già in cache, poi chiede la stima finale.
 */
async function analyzeQuote(id, { spec, operatorContext, webSearch = false } = {}) {
    const quote = await findOrThrow(id);

    if (spec !== undefined) quote.spec = sanitizeSpec(spec);
    if (operatorContext !== undefined) quote.operatorContext = String(operatorContext || '').trim();

    const q = quote.toObject();
    const hasSpec = Boolean(q.spec?.prodotto);

    if (webSearch && !hasSpec) {
        throw new ServiceError('Per la ricerca web indica almeno il prodotto nelle specifiche', 400, 'MISSING_SPEC');
    }

    const extraWarnings = [];
    let searchUsage = null;

    if (webSearch) {
        const cachedRef = await referencePrices.findExact(q.spec, q.quantita);
        if (!cachedRef) {
            try {
                const web = await aiService.searchWebPrices(q.spec, q.quantita);
                await referencePrices.saveWebResult(q.spec, q.quantita, web);
                searchUsage = web.usage;
                if (web.priceMin === null) {
                    extraWarnings.push('Ricerca web: nessun prezzo affidabile trovato per questa quantità.');
                }
            } catch (err) {
                logger.error('Ricerca prezzi web fallita:', err.message);
                extraWarnings.push('Ricerca web non riuscita, stima basata su listino e storico.');
            }
        } else if (!cachedRef.found) {
            extraWarnings.push('Una ricerca web recente non ha trovato prezzi: non viene ripetuta fino alla scadenza.');
        }
    }

    const references = hasSpec ? await referencePrices.findForProduct(q.spec, q.quantita, 4) : [];
    const history = await findSimilarQuotes(q, 3);

    const { analysis, cached } = await aiService.analyzeQuote({
        quote: q,
        references,
        history,
        previous: q.aiAnalysis,
        searchUsage,
        extraWarnings
    });

    if (!cached) quote.aiAnalysis = analysis;
    await quote.save();

    return { quote: serialize(quote.toObject()), cached };
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
        pricing: q.pricing || null,
        spec: q.spec || null,
        operatorContext: q.operatorContext || '',
        aiAnalysis: q.aiAnalysis || null,
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
    updatePricing,
    analyzeQuote,
    extractSpec,
    findSimilarQuotes,
    respond,
    deleteQuote,
    VALID_STATUSES,
    ServiceError
};
