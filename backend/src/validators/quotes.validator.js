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

const pricingRules = [
    ...idRule,
    body('unitPrice').optional().isFloat({ min: 0 }).withMessage('Prezzo unitario non valido'),
    body('setupCost').optional().isFloat({ min: 0 }).withMessage('Costo impostazione non valido'),
    body('discount').optional().isFloat({ min: 0, max: 100 }).withMessage('Sconto deve essere tra 0 e 100'),
    body('finalTotal').optional().isFloat({ min: 0 }).withMessage('Totale non valido')
];

const specString = (field, max) =>
    body(`spec.${field}`).optional({ nullable: true }).isString().trim().isLength({ max }).withMessage(`Campo ${field} non valido (max ${max} caratteri)`);

const analyzeRules = [
    ...idRule,
    body('webSearch').optional().isBoolean().withMessage('webSearch deve essere booleano'),
    body('operatorContext').optional({ nullable: true }).isString().trim().isLength({ max: 1500 }).withMessage('Contesto troppo lungo (max 1500 caratteri)'),
    body('spec').optional().isObject().withMessage('Specifiche non valide'),
    specString('prodotto', 120),
    specString('formato', 60),
    specString('carta', 80),
    specString('colori', 20),
    specString('finiture', 200),
    specString('consegna', 80),
    body('spec.grammatura').optional({ checkFalsy: true }).isFloat({ min: 0, max: 2000 }).withMessage('Grammatura non valida')
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

module.exports = { idRule, updateStatusRules, respondRules, pricingRules, analyzeRules, handleValidation };
