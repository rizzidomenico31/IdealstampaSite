const database = require('../config/database');
const logger = require('../utils/logger');

function getQuoteModel() {
    return require('../models/quote.model');
}

class ServiceError extends Error {
    constructor(message, status = 400, code = 'BAD_REQUEST') {
        super(message);
        this.status = status;
        this.code = code;
        this.expose = true;
    }
}

function assertDb() {
    if (!database.isEnabled()) throw new ServiceError('Database non configurato', 503, 'DB_DISABLED');
}

function getDateRange(days) {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - days);
    start.setHours(0, 0, 0, 0);
    return { start, end };
}

async function getDashboardAnalytics({ days = 30 } = {}) {
    assertDb();
    const Quote = getQuoteModel();
    const { start, end } = getDateRange(days);

    const [
        total,
        pending,
        quoted,
        accepted,
        rejected,
        thisMonth,
        totalRevenue,
        byStatus,
        daily,
        topSources,
        conversionFunnel,
        avgResponseHours
    ] = await Promise.all([
        Quote.countDocuments(),
        Quote.countDocuments({ status: 'pending' }),
        Quote.countDocuments({ status: 'quoted' }),
        Quote.countDocuments({ status: 'accepted' }),
        Quote.countDocuments({ status: 'rejected' }),
        Quote.countDocuments({ createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
        Quote.aggregate([
            { $match: { 'pricing.finalTotal': { $gt: 0 } } },
            { $group: { _id: null, revenue: { $sum: '$pricing.finalTotal' } } }
        ]),
        Quote.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } }
                }
            },
            { $sort: { _id: 1 } }
        ]),
        Quote.aggregate([
            { $match: { createdAt: { $gte: start } } },
            {
                $group: {
                    _id: { $ifNull: ['$azienda', 'Privato'] },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]),
        Quote.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    quoted: { $sum: { $cond: [{ $eq: ['$status', 'quoted'] }, 1, 0] } },
                    accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                    rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } }
                }
            }
        ]),
        Quote.aggregate([
            {
                $match: {
                    status: { $in: ['quoted', 'accepted', 'rejected'] },
                    adminResponse: { $exists: true, $ne: null },
                    'adminResponse.sentAt': { $exists: true }
                }
            },
            {
                $project: {
                    hours: {
                        $divide: [
                            { $subtract: ['$adminResponse.sentAt', '$createdAt'] },
                            1000 * 60 * 60
                        ]
                    }
                }
            },
            { $match: { hours: { $gte: 0, $lte: 720 } } },
            { $group: { _id: null, avg: { $avg: '$hours' } } }
        ])
    ]);

    const statusMap = byStatus.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
    }, {});

    const funnel = conversionFunnel[0] || { total: 0, quoted: 0, accepted: 0, rejected: 0 };
    const conversionRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

    return {
        summary: {
            total,
            pending,
            quoted,
            accepted,
            rejected,
            thisMonth,
            conversionRate,
            revenue: totalRevenue[0]?.revenue ? Math.round(totalRevenue[0].revenue * 100) / 100 : 0
        },
        statusDistribution: statusMap,
        dailyTrend: fillDailyGaps(daily, start, end),
        topSources: topSources.map(s => ({ name: s._id || 'Sconosciuto', count: s.count })),
        funnel: {
            total: funnel.total,
            quoted: funnel.quoted,
            accepted: funnel.accepted,
            rejected: funnel.rejected
        },
        avgResponseHours: avgResponseHours[0]?.avg
            ? Math.round(avgResponseHours[0].avg * 10) / 10
            : null
    };
}

function fillDailyGaps(data, start, end) {
    const map = new Map(data.map(d => [d._id, d]));
    const out = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
        const key = cur.toISOString().slice(0, 10);
        const item = map.get(key) || { _id: key, count: 0, accepted: 0 };
        out.push({ date: item._id, count: item.count, accepted: item.accepted });
        cur.setDate(cur.getDate() + 1);
    }
    return out;
}

async function getRevenueAnalytics({ year = new Date().getFullYear() } = {}) {
    assertDb();
    const Quote = getQuoteModel();

    const data = await Quote.aggregate([
        {
            $match: {
                'pricing.finalTotal': { $gt: 0 },
                $expr: { $eq: [{ $year: '$createdAt' }, Number(year)] }
            }
        },
        {
            $group: {
                _id: { $month: '$createdAt' },
                revenue: { $sum: '$pricing.finalTotal' },
                quotes: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const months = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
    const revenueByMonth = months.map((label, idx) => {
        const item = data.find(d => d._id === idx + 1);
        return { month: label, revenue: item ? Math.round(item.revenue * 100) / 100 : 0, quotes: item ? item.quotes : 0 };
    });

    const totals = await Quote.aggregate([
        { $match: { 'pricing.finalTotal': { $gt: 0 } } },
        { $group: { _id: null, totalRevenue: { $sum: '$pricing.finalTotal' }, avgQuote: { $avg: '$pricing.finalTotal' } } }
    ]);

    return {
        year: Number(year),
        revenueByMonth,
        totalRevenue: totals[0]?.totalRevenue ? Math.round(totals[0].totalRevenue * 100) / 100 : 0,
        avgQuoteValue: totals[0]?.avgQuote ? Math.round(totals[0].avgQuote * 100) / 100 : 0
    };
}

module.exports = { getDashboardAnalytics, getRevenueAnalytics, ServiceError };
