const { body, param, validationResult } = require('express-validator');
const { VALID_STATUSES } = require('../services/quotes.service');

const idRule = [param('id').isMongoId().withMessage('ID preventivo non valido')];

const updateStatusRules = [
    ...idRule,
    body('status').isIn(VALID_STATUSES).withMessage('Stato non valido')
];

const respondRules = [
    ...idRule,
    body('subject').optional().trim().isLength({ max: 200 }),
    body('message').trim().isLength({ min: 1, max: 5000 }).withMessage('Il messaggio è obbligatorio (max 5000 caratteri)')
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

module.exports = { idRule, updateStatusRules, respondRules, handleValidation };
