const { body, param } = require('express-validator');
const { handleValidation } = require('./quotes.validator');

const idRule = [param('id').isMongoId().withMessage('ID non valido')];

const createRules = [
    body('spec').isObject().withMessage('Specifiche obbligatorie'),
    body('spec.prodotto').isString().trim().isLength({ min: 1, max: 120 }).withMessage('Il prodotto è obbligatorio (max 120 caratteri)'),
    body('spec.formato').optional({ nullable: true }).isString().trim().isLength({ max: 60 }),
    body('spec.carta').optional({ nullable: true }).isString().trim().isLength({ max: 80 }),
    body('spec.grammatura').optional({ checkFalsy: true }).isFloat({ min: 0, max: 2000 }).withMessage('Grammatura non valida'),
    body('spec.colori').optional({ nullable: true }).isString().trim().isLength({ max: 20 }),
    body('spec.finiture').optional({ nullable: true }).isString().trim().isLength({ max: 200 }),
    body('quantita').isInt({ min: 1, max: 1000000 }).withMessage('Quantità non valida'),
    body('priceMin').isFloat({ min: 0 }).withMessage('Prezzo minimo non valido'),
    body('priceMax').optional({ checkFalsy: true }).isFloat({ min: 0 }).withMessage('Prezzo massimo non valido'),
    body('note').optional({ nullable: true }).isString().trim().isLength({ max: 500 })
];

module.exports = { idRule, createRules, handleValidation };
