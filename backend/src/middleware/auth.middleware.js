const authService = require('../services/auth.service');

function extractToken(req) {
    const header = req.headers.authorization || '';
    if (header.startsWith('Bearer ')) return header.slice(7).trim();
    return null;
}

async function requireAuth(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({
                success: false,
                code: 'NO_TOKEN',
                message: 'Autenticazione richiesta'
            });
        }

        const payload = authService.verifyToken(token);
        const admin = await authService.getAdminById(payload.sub);
        if (!admin) {
            return res.status(401).json({
                success: false,
                code: 'INVALID_USER',
                message: 'Utente non valido o disattivato'
            });
        }

        req.admin = admin;
        req.tokenPayload = payload;
        return next();
    } catch (err) {
        return res.status(err.status || 401).json({
            success: false,
            code: err.code || 'AUTH_ERROR',
            message: err.message || 'Errore di autenticazione'
        });
    }
}

function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Autenticazione richiesta' });
        }
        if (!roles.includes(req.admin.role)) {
            return res.status(403).json({ success: false, message: 'Permessi insufficienti' });
        }
        return next();
    };
}

module.exports = { requireAuth, requireRole };
