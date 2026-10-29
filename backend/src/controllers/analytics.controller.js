const analyticsService = require('../services/analytics.service');

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

async function dashboard(req, res, next) {
    try {
        const days = Math.min(365, Math.max(7, parseInt(req.query.days, 10) || 30));
        const data = await analyticsService.getDashboardAnalytics({ days });
        res.json({ success: true, analytics: data });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function revenue(req, res, next) {
    try {
        const year = parseInt(req.query.year, 10) || new Date().getFullYear();
        const data = await analyticsService.getRevenueAnalytics({ year });
        res.json({ success: true, analytics: data });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { dashboard, revenue };
