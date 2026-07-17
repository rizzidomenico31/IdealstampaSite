const { body, validationResult } = require('express-validator');

const preventivoRules = [
    body('nome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('cognome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('telefono').trim().isLength({ min: 8, max: 20 }).escape(),
    body('azienda').optional().trim().isLength({ max: 100 }).escape(),
    body('quantita').isInt({ min: 1, max: 1000000 }),
    body('note').trim().isLength({ min: 1, max: 2000 }).escape(),
    body('privacy').custom(value => {
        const isTrue = value === true || value === 'true';
        if (!isTrue) throw new Error('Devi accettare la privacy policy');
        return true;
    }),
    body('fileName').optional().trim().isLength({ max: 255 }).escape()
];

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    return res.status(400).json({
        success: false,
        message: 'Dati non validi',
        errors: errors.array()
    });
}

module.exports = { preventivoRules, handleValidation };
