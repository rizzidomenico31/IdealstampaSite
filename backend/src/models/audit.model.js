const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema(
    {
        actor: {
            adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', index: true },
            username: { type: String, index: true },
            role: String,
            ip: String
        },
        action: {
            type: String,
            required: true,
            index: true,
            enum: [
                'login', 'logout', 'login_failed', 'password_changed',
                'quote_viewed', 'quote_status_changed', 'quote_pricing_updated', 'quote_analyzed',
                'quote_responded', 'quote_deleted',
                'newsletter_sent', 'subscriber_deleted',
                'admin_created', 'admin_updated', 'admin_password_reset', 'admin_deleted'
            ]
        },
        target: {
            type: { type: String, enum: ['quote', 'admin', 'subscriber', 'system'] },
            id: String,
            summary: String
        },
        metadata: { type: mongoose.Schema.Types.Mixed, default: null },
        userAgent: String
    },
    { timestamps: true, collection: 'audit_logs' }
);

auditSchema.index({ createdAt: -1 });
auditSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditSchema);
