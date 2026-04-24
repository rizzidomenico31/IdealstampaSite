const authService = require('../services/auth.service');

async function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const result = await authService.login({
            username,
            password,
            ip: req.ip
        });
        res.json({ success: true, ...result });
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

function me(req, res) {
    res.json({ success: true, admin: req.admin.toSafeJSON() });
}

function logout(req, res) {
    // JWT stateless: il client elimina il token
    res.json({ success: true, message: 'Logout effettuato' });
}

async function changePassword(req, res, next) {
    try {
        const admin = await authService.changePassword(req.admin._id, req.body);
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
