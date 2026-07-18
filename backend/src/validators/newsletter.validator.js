const { body, param, validationResult } = require('express-validator');
const { GROUPS } = require('../services/newsletter.service');

const subscribeRules = [
    body('email').isEmail().withMessage('Email non valida').normalizeEmail(),
    body('nome').optional().trim().isLength({ max: 80 }).escape()
];

const sendRules = [
    body('subject').trim().isLength({ min: 1, max: 200 }).withMessage('Oggetto obbligatorio (max 200)'),
    body('title').optional().trim().isLength({ max: 120 }),
    body('message').trim().isLength({ min: 1, max: 20000 }).withMessage('Contenuto obbligatorio'),
    body('group').isIn(GROUPS).withMessage('Gruppo destinatari non valido')
];

const idRule = [param('id').isMongoId().withMessage('ID non valido')];

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({
        success: false,
        message: 'Dati non validi',
        errors: errors.array()
    });
}

module.exports = { subscribeRules, sendRules, idRule, handleValidation };
