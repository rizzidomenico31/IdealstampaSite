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
        const { action, actor, targetType, page, limit } = req.query;
        const result = await auditService.list({ action, actor, targetType, page, limit });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function cleanup(req, res, next) {
    try {
        const result = await auditService.cleanup();
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { list, cleanup };
