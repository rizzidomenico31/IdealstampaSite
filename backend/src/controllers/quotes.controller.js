const quotesService = require('../services/quotes.service');
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
        const { status, search, page, limit } = req.query;
        const result = await quotesService.listQuotes({ status, search, page, limit });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function stats(req, res, next) {
    try {
        const data = await quotesService.getStats();
        res.json({ success: true, stats: data });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function getOne(req, res, next) {
    try {
        const quote = await quotesService.getQuote(req.params.id);
        await auditService.log({
            actor: req.admin,
            action: 'quote_viewed',
            target: { type: 'quote', id: quote.id, summary: `Visualizzato preventivo ${quote.nome} ${quote.cognome}` },
            req
        });
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function updateStatus(req, res, next) {
    try {
        const quote = await quotesService.updateStatus(req.params.id, req.body.status);
        await auditService.log({
            actor: req.admin,
            action: 'quote_status_changed',
            target: { type: 'quote', id: quote.id, summary: `Stato cambiato in ${quote.status}` },
            metadata: { newStatus: quote.status },
            req
        });
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function updatePricing(req, res, next) {
    try {
        const quote = await quotesService.updatePricing(req.params.id, req.body);
        await auditService.log({
            actor: req.admin,
            action: 'quote_pricing_updated',
            target: { type: 'quote', id: quote.id, summary: `Aggiornati prezzi` },
            metadata: { pricing: quote.pricing },
            req
        });
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function analyze(req, res, next) {
    try {
        const quote = await quotesService.analyzeQuote(req.params.id);
        await auditService.log({
            actor: req.admin,
            action: 'quote_analyzed',
            target: { type: 'quote', id: quote.id, summary: 'Analisi AI eseguita' },
            metadata: {
                aiStatus: quote.aiAnalysis?.status,
                confidence: quote.aiAnalysis?.confidence
            },
            req
        });
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function respond(req, res, next) {
    try {
        const quote = await quotesService.respond(
            req.params.id,
            { subject: req.body.subject, message: req.body.message },
            req.admin?.username
        );
        await auditService.log({
            actor: req.admin,
            action: 'quote_responded',
            target: { type: 'quote', id: quote.id, summary: `Risposta inviata a ${quote.email}` },
            metadata: { subject: req.body.subject },
            req
        });
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function remove(req, res, next) {
    try {
        const result = await quotesService.deleteQuote(req.params.id);
        await auditService.log({
            actor: req.admin,
            action: 'quote_deleted',
            target: { type: 'quote', id: result.id, summary: 'Preventivo eliminato' },
            req
        });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { list, stats, getOne, updateStatus, updatePricing, analyze, respond, remove };
