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

module.exports = { preventivoLimiter };
