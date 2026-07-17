const quotesService = require('../services/quotes.service');

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
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function updateStatus(req, res, next) {
    try {
        const quote = await quotesService.updateStatus(req.params.id, req.body.status);
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
        res.json({ success: true, quote });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function remove(req, res, next) {
    try {
        const result = await quotesService.deleteQuote(req.params.id);
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { list, stats, getOne, updateStatus, respond, remove };
