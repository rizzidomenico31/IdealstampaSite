const jwt = require('jsonwebtoken');
const config = require('../config');
const database = require('../config/database');
const logger = require('../utils/logger');

class AuthError extends Error {
    constructor(message, status = 401, code = 'AUTH_ERROR') {
        super(message);
        this.status = status;
        this.code = code;
        this.expose = true;
    }
}

function assertJwtSecret() {
    if (!config.auth.jwtSecret || config.auth.jwtSecret.length < 32) {
        throw new AuthError(
            'Configurazione server incompleta (JWT_SECRET mancante o troppo corto)',
            500,
            'SERVER_MISCONFIG'
        );
    }
}

function signToken(admin) {
    assertJwtSecret();
    return jwt.sign(
        { sub: admin._id.toString(), role: admin.role, username: admin.username },
        config.auth.jwtSecret,
        { expiresIn: config.auth.jwtExpiresIn, algorithm: 'HS256' }
    );
}

function verifyToken(token) {
    assertJwtSecret();
    try {
        return jwt.verify(token, config.auth.jwtSecret, { algorithms: ['HS256'] });
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            throw new AuthError('Sessione scaduta', 401, 'TOKEN_EXPIRED');
        }
        throw new AuthError('Token non valido', 401, 'TOKEN_INVALID');
    }
}

async function login({ username, password, ip }) {
    if (!database.isEnabled()) {
        throw new AuthError('Database non configurato', 503, 'DB_DISABLED');
    }

    const Admin = require('../models/admin.model');
    const admin = await Admin.findOne({ username }).select('+passwordHash');

    // Non rivelare se l'utente esiste: risposta generica a prescindere
    const genericFail = () => new AuthError('Credenziali non valide', 401, 'INVALID_CREDENTIALS');

    if (!admin || !admin.active) {
        logger.warn(`Login fallito (utente inesistente/disattivato): ${username} da ${ip}`);
        throw genericFail();
    }

    if (admin.isLocked) {
        const retryIn = Math.max(0, admin.lockUntil.getTime() - Date.now());
        logger.warn(`Login su account bloccato: ${username} da ${ip}`);
        throw new AuthError(
            `Account temporaneamente bloccato. Riprova tra ${Math.ceil(retryIn / 60000)} minuti.`,
            423,
            'ACCOUNT_LOCKED'
        );
    }

    const ok = await admin.verifyPassword(password);
    if (!ok) {
        await admin.registerFailedAttempt();
        logger.warn(`Login fallito (password errata): ${username} da ${ip}`);
        throw genericFail();
    }

    await admin.registerSuccessfulLogin(ip);
    logger.success(`Login riuscito: ${username} da ${ip}`);

    return {
        token: signToken(admin),
        admin: admin.toSafeJSON()
    };
}

async function getAdminById(id) {
    if (!database.isEnabled()) return null;
    const Admin = require('../models/admin.model');
    const admin = await Admin.findById(id);
    if (!admin || !admin.active) return null;
    return admin;
}

async function changePassword(adminId, { currentPassword, newPassword }) {
    const Admin = require('../models/admin.model');
    const admin = await Admin.findById(adminId).select('+passwordHash');

    if (!admin || !admin.active) {
        throw new AuthError('Utente non trovato', 404, 'NOT_FOUND');
    }

    const ok = await admin.verifyPassword(currentPassword);
    if (!ok) throw new AuthError('Password attuale non corretta', 401, 'INVALID_CREDENTIALS');

    admin.passwordHash = await Admin.hashPassword(newPassword);
    await admin.save();

    return admin.toSafeJSON();
}

module.exports = {
    login,
    getAdminById,
    changePassword,
    verifyToken,
    signToken,
    AuthError
};
