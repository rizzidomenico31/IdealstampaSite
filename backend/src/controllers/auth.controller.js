const authService = require('../services/auth.service');
const auditService = require('../services/audit.service');

async function login(req, res, next) {
    const { username } = req.body;
    try {
        const result = await authService.login({
            username,
            password: req.body.password,
            ip: req.ip
        });

        await auditService.log({
            actor: result.admin,
            action: 'login',
            target: { type: 'admin', id: result.admin.id, summary: 'Login riuscito' },
            req
        });

        res.json({ success: true, ...result });
    } catch (err) {
        await auditService.log({
            actor: { username: String(username || '').toLowerCase() },
            action: 'login_failed',
            target: { type: 'admin', summary: `Login fallito: ${err.code || 'UNKNOWN'}` },
            metadata: { code: err?.code, status: err?.status },
            req
        });

        if (err.status) {
            return res.status(err.status).json({
                success: false,
                code: err.code,
                message: err.message
            });
        }
        next(err);
    }
}

function me(req, res) {
    res.json({ success: true, admin: req.admin.toSafeJSON() });
}

async function logout(req, res) {
    await auditService.log({
        actor: req.admin,
        action: 'logout',
        target: { type: 'admin', id: req.admin._id.toString(), summary: 'Logout' },
        req
    });
    res.json({ success: true, message: 'Logout effettuato' });
}

async function changePassword(req, res, next) {
    try {
        const admin = await authService.changePassword(req.admin._id, req.body);

        await auditService.log({
            actor: req.admin,
            action: 'password_changed',
            target: { type: 'admin', id: admin.id, summary: 'Cambio password' },
            req
        });

        res.json({ success: true, admin });
    } catch (err) {
        if (err.status) {
            return res.status(err.status).json({
                success: false,
                code: err.code,
                message: err.message
            });
        }
        next(err);
    }
}

module.exports = { login, me, logout, changePassword };
