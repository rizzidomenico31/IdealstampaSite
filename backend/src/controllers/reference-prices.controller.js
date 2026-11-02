const referencePrices = require('../services/reference-prices.service');
const auditService = require('../services/audit.service');

function handleServiceError(err, res, next) {
    if (err && err.status) {
        return res.status(err.status).json({
            success: false,
            code: err.code,
            message: err.message
        });
    }
    return next(err);
}

async function list(req, res, next) {
    try {
        const { search, page, limit } = req.query;
        const result = await referencePrices.list({ search, page, limit });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function create(req, res, next) {
    try {
        const { spec, quantita, priceMin, priceMax, note } = req.body;
        const item = await referencePrices.createManual({ spec, quantita, priceMin, priceMax, note }, req.admin?.username);
        await auditService.log({
            actor: req.admin,
            action: 'reference_price_created',
            target: { type: 'reference_price', id: item.id, summary: `${item.spec.prodotto} · ${item.quantita} pz` },
            metadata: { priceMin: item.priceMin, priceMax: item.priceMax },
            req
        });
        res.status(201).json({ success: true, item });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function remove(req, res, next) {
    try {
        const result = await referencePrices.remove(req.params.id);
        await auditService.log({
            actor: req.admin,
            action: 'reference_price_deleted',
            target: { type: 'reference_price', id: result.id, summary: 'Prezzo di riferimento eliminato' },
            req
        });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { list, create, remove };
