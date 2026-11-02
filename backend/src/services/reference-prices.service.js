const database = require('../config/database');
const config = require('../config');

/**
 * Listino prezzi di riferimento: cache dei prezzi trovati online + prezzi inseriti a mano.
 * La chiave è derivata dalle specifiche normalizzate e dalla fascia di quantità, così una
 * ricerca web fatta per un preventivo viene riutilizzata gratis per richieste equivalenti.
 */

const QTY_BUCKETS = [25, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
const SPEC_FIELDS = ['prodotto', 'formato', 'carta', 'grammatura', 'colori', 'finiture'];

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
    return require('../models/reference-price.model');
}

function norm(v) {
    return String(v ?? '')
        .toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9/]+/g, ' ')
        .trim();
}

function qtyBucket(quantita) {
    const q = Math.max(1, Number(quantita) || 1);
    return QTY_BUCKETS.find(b => q <= b) || QTY_BUCKETS[QTY_BUCKETS.length - 1];
}

function buildProductKey(spec = {}) {
    return SPEC_FIELDS.map(f => norm(spec[f])).join('|');
}

function buildKey(spec, quantita) {
    return `${buildProductKey(spec)}|q${qtyBucket(quantita)}`;
}

function cleanSpec(spec = {}) {
    const out = {};
    for (const f of SPEC_FIELDS) {
        if (spec[f] !== undefined && spec[f] !== null && spec[f] !== '') out[f] = spec[f];
    }
    return out;
}

function validFilter() {
    return { $or: [{ validUntil: null }, { validUntil: { $gt: new Date() } }] };
}

/** Prezzo valido per esattamente questa spec + fascia quantità (anche "nessun risultato"). */
async function findExact(spec, quantita) {
    const Ref = getModel();
    return Ref.findOne({ key: buildKey(spec, quantita), ...validFilter() })
        .sort({ source: 1, updatedAt: -1 }) // 'manual' prima di 'web'
        .lean();
}

/** Prezzi validi per lo stesso prodotto, ordinati per vicinanza di quantità. */
async function findForProduct(spec, quantita, limit = 4) {
    const Ref = getModel();
    const docs = await Ref.find({ productKey: buildProductKey(spec), found: true, ...validFilter() })
        .sort({ updatedAt: -1 })
        .limit(30)
        .lean();
    const q = Math.max(1, Number(quantita) || 1);
    return docs
        .sort((a, b) => Math.abs(Math.log(a.quantita / q)) - Math.abs(Math.log(b.quantita / q)))
        .slice(0, limit);
}

/** Salva (o sostituisce) il risultato di una ricerca web per questa spec + fascia. */
async function saveWebResult(spec, quantita, { priceMin, priceMax, offers = [], sources = [] }) {
    const Ref = getModel();
    const found = Number.isFinite(priceMin) && Number.isFinite(priceMax) && priceMax > 0;
    const days = found ? config.referencePrices.webTtlDays : config.referencePrices.emptyTtlDays;
    const key = buildKey(spec, quantita);

    return Ref.findOneAndUpdate(
        { key, source: 'web' },
        {
            key,
            productKey: buildProductKey(spec),
            spec: cleanSpec(spec),
            quantita,
            priceMin: found ? priceMin : null,
            priceMax: found ? priceMax : null,
            found,
            offers,
            sources,
            source: 'web',
            validUntil: new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();
}

async function list({ search, page = 1, limit = 50 } = {}) {
    const Ref = getModel();
    const filter = {};
    if (search) {
        const rx = new RegExp(String(search).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        filter.$or = [{ 'spec.prodotto': rx }, { 'spec.formato': rx }, { 'spec.carta': rx }];
    }
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
        Ref.find(filter).sort({ updatedAt: -1 }).skip((pageNum - 1) * perPage).limit(perPage).lean(),
        Ref.countDocuments(filter)
    ]);
    return { items: items.map(serialize), total, page: pageNum, pages: Math.ceil(total / perPage) };
}

async function createManual({ spec, quantita, priceMin, priceMax, note }, adminUsername) {
    const Ref = getModel();
    if (!spec?.prodotto) throw new ServiceError('Il prodotto è obbligatorio', 400, 'MISSING_PRODUCT');
    const min = Number(priceMin);
    const max = priceMax === undefined || priceMax === null || priceMax === '' ? min : Number(priceMax);
    if (!(min >= 0) || !(max >= min)) throw new ServiceError('Prezzi non validi', 400, 'INVALID_PRICE');

    const doc = await Ref.create({
        key: buildKey(spec, quantita),
        productKey: buildProductKey(spec),
        spec: cleanSpec(spec),
        quantita: Number(quantita),
        priceMin: min,
        priceMax: max,
        found: true,
        source: 'manual',
        note,
        createdBy: adminUsername || null,
        validUntil: null
    });
    return serialize(doc.toObject());
}

async function remove(id) {
    const Ref = getModel();
    let doc;
    try {
        doc = await Ref.findByIdAndDelete(id);
    } catch {
        doc = null;
    }
    if (!doc) throw new ServiceError('Prezzo di riferimento non trovato', 404, 'NOT_FOUND');
    return { id: doc._id.toString() };
}

function serialize(r) {
    return {
        id: r._id.toString(),
        spec: r.spec || {},
        quantita: r.quantita,
        priceMin: r.priceMin,
        priceMax: r.priceMax,
        found: r.found,
        offers: r.offers || [],
        sources: r.sources || [],
        source: r.source,
        note: r.note || null,
        createdBy: r.createdBy || null,
        validUntil: r.validUntil,
        updatedAt: r.updatedAt
    };
}

module.exports = {
    buildKey,
    buildProductKey,
    qtyBucket,
    findExact,
    findForProduct,
    saveWebResult,
    list,
    createManual,
    remove,
    ServiceError
};
