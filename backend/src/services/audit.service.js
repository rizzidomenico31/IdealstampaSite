const database = require('../config/database');
const config = require('../config');
const logger = require('../utils/logger');

let AuditLog = null;
function getModel() {
    if (!AuditLog) AuditLog = require('../models/audit.model');
    return AuditLog;
}

function isEnabled() {
    return config.audit.enabled && database.isEnabled();
}

async function log({ actor, action, target, metadata, req }) {
    if (!isEnabled()) return null;
    try {
        const entry = await getModel().create({
            actor: {
                adminId: actor?._id || actor?.id || null,
                username: actor?.username || null,
                role: actor?.role || null,
                ip: req?.ip || null
            },
            action,
            target: target || null,
            metadata: metadata || null,
            userAgent: req?.get?.('user-agent') || null
        });
        return entry;
    } catch (err) {
        logger.warn('Audit log fallito:', err.message);
        return null;
    }
}

async function list({ action, actor, targetType, page = 1, limit = 50 } = {}) {
    if (!database.isEnabled()) {
        const ServiceError = require('./quotes.service').ServiceError;
        throw new ServiceError('Database non configurato', 503, 'DB_DISABLED');
    }

    const filter = {};
    if (action) filter.action = action;
    if (actor) filter['actor.username'] = actor.toLowerCase().trim();
    if (targetType) filter['target.type'] = targetType;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const perPage = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));

    const [items, total] = await Promise.all([
        getModel()
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * perPage)
            .limit(perPage)
            .lean(),
        getModel().countDocuments(filter)
    ]);

    return {
        logs: items.map(serialize),
        total,
        page: pageNum,
        limit: perPage
    };
}

async function cleanup() {
    if (!isEnabled()) return { deleted: 0 };
    const retentionDays = config.audit.retentionDays;
    if (!retentionDays || retentionDays <= 0) return { deleted: 0 };

    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    try {
        const { deletedCount } = await getModel().deleteMany({ createdAt: { $lt: cutoff } });
        logger.info(`Pulizia audit log: ${deletedCount} record eliminati prima del ${cutoff.toISOString()}`);
        return { deleted: deletedCount };
    } catch (err) {
        logger.warn('Pulizia audit log fallita:', err.message);
        return { deleted: 0 };
    }
}

function serialize(log) {
    return {
        id: log._id.toString(),
        actor: log.actor,
        action: log.action,
        target: log.target,
        metadata: log.metadata,
        userAgent: log.userAgent,
        createdAt: log.createdAt
    };
}

module.exports = { log, list, cleanup, isEnabled };
