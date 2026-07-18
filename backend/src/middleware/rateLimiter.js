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

const newsletterLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Troppe iscrizioni da questo IP, riprova più tardi.'
    }
});

module.exports = { preventivoLimiter, loginLimiter, newsletterLimiter };
