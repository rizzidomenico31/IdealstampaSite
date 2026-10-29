const adminService = require('../services/admin.service');
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
        const admins = await adminService.listAdmins();
        res.json({ success: true, admins });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function create(req, res, next) {
    try {
        const admin = await adminService.createAdmin(req.body);
        await auditService.log({
            actor: req.admin,
            action: 'admin_created',
            target: { type: 'admin', id: admin.id, summary: `Creato utente ${admin.username} (${admin.role})` },
            req
        });
        res.status(201).json({ success: true, admin });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function update(req, res, next) {
    try {
        const admin = await adminService.updateAdmin(req.params.id, req.body, req.admin._id);
        await auditService.log({
            actor: req.admin,
            action: 'admin_updated',
            target: { type: 'admin', id: admin.id, summary: `Modificato utente ${admin.username}` },
            metadata: req.body,
            req
        });
        res.json({ success: true, admin });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function resetPassword(req, res, next) {
    try {
        const admin = await adminService.resetPassword(req.params.id, req.body.newPassword);
        await auditService.log({
            actor: req.admin,
            action: 'admin_password_reset',
            target: { type: 'admin', id: admin.id, summary: `Reset password per ${admin.username}` },
            req
        });
        res.json({ success: true, admin });
    } catch (err) { return handleServiceError(err, res, next); }
}

async function remove(req, res, next) {
    try {
        const result = await adminService.deleteAdmin(req.params.id, req.admin._id);
        await auditService.log({
            actor: req.admin,
            action: 'admin_deleted',
            target: { type: 'admin', id: result.id, summary: 'Utente admin eliminato' },
            req
        });
        res.json({ success: true, ...result });
    } catch (err) { return handleServiceError(err, res, next); }
}

module.exports = { list, create, update, resetPassword, remove };
