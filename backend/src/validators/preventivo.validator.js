const { body, validationResult } = require('express-validator');

const preventivoRules = [
    body('nome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('cognome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('telefono').trim().isLength({ min: 8, max: 20 }).escape(),
    body('azienda').optional().trim().isLength({ max: 100 }).escape(),
    body('tipoProgetto').isIn(['business', 'marketing', 'eventi', 'editoria', 'packaging', 'altro']),
    body('servizio').isIn(['offset', 'digitale', 'grande-formato', 'packaging', 'editoria', 'finiture']),
    body('urgenza').isIn(['urgente', 'normale', 'rilassato']),
    body('quantita').isInt({ min: 1, max: 1000000 }),
    body('formato').trim().isLength({ min: 1, max: 100 }).escape(),
    body('colori').isIn(['1+0', '1+1', '4+0', '4+1', '4+4', 'pantone']),
    body('carta').trim().isLength({ min: 1, max: 100 }).escape(),
    body('finiture').optional().isJSON(),
    body('note').optional().trim().isLength({ max: 1000 }).escape(),
    body('budget').optional().isIn(['0-100', '100-300', '300-500', '500-1000', '1000-2000', '2000+']),
    body('privacy').custom(value => {
        const isTrue = value === true || value === 'true';
        if (!isTrue) throw new Error('Devi accettare la privacy policy');
        return true;
    }),
    body('hasFile').optional().isIn(['true', 'false']),
    body('fileInfo').optional().trim().isLength({ max: 500 }).escape(),
    body('fileName').optional().trim().isLength({ max: 255 }).escape(),
    body('newsletter').optional().custom(value =>
        value === true || value === 'true' || value === false || value === 'false' || value === undefined || value === ''
    )
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
