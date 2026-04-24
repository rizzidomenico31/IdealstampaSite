const rateLimit = require('express-rate-limit');
const config = require('../config');

const preventivoLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Troppe richieste da questo IP, riprova tra qualche minuto.'
    }
});

const loginLimiter = rateLimit({
    windowMs: config.auth.loginRateLimit.windowMs,
    max: config.auth.loginRateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        success: false,
        code: 'RATE_LIMITED',
        message: 'Troppi tentativi di accesso. Riprova tra qualche minuto.'
    }
});

module.exports = { preventivoLimiter, loginLimiter };
