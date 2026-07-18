const newsletterService = require('../services/newsletter.service');

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

// ───────────────────────────── Pubblico
async function subscribe(req, res, next) {
    try {
        const { email, nome } = req.body;
        const result = await newsletterService.subscribe({ email, nome, source: 'footer' });
        res.status(result.created ? 201 : 200).json({
            success: true,
            message: 'Iscrizione confermata! Grazie.'
        });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function unsubscribe(req, res, next) {
    try {
        await newsletterService.unsubscribe(req.query.email);
        res.set('Content-Type', 'text/html; charset=utf-8').send(`<!DOCTYPE html>
<html lang="it"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Disiscrizione - Idealstampa</title></head>
<body style="margin:0;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;background:#f4f6f8;">
<div style="max-width:480px;margin:80px auto;background:#fff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 1px 3px rgba(15,23,42,.08)">
<h1 style="color:#0f172a;font-size:22px;margin:0 0 12px">Iscrizione annullata</h1>
<p style="color:#475569;font-size:15px;line-height:22px;margin:0">Non riceverai più le nostre newsletter. Ci dispiace vederti andare via!</p>
</div></body></html>`);
    } catch (err) { return handleServiceError(err, res, next); }
}

// ───────────────────────────── Admin
async function listSubscribers(req, res, next) {
    try {
        const subscribers = await newsletterService.listSubscribers({
            group: req.query.group,
            search: req.query.search
        });
        res.json({ success: true, subscribers });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function stats(req, res, next) {
    try {
        const data = await newsletterService.getStats();
        res.json({ success: true, stats: data });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function send(req, res, next) {
    try {
        const { subject, title, message, group } = req.body;
        const result = await newsletterService.sendNewsletter(
            { subject, title, message, group },
            req.admin?.username
        );
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function removeSubscriber(req, res, next) {
    try {
        const result = await newsletterService.deleteSubscriber(req.params.id);
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { subscribe, unsubscribe, listSubscribers, stats, send, removeSubscriber };
