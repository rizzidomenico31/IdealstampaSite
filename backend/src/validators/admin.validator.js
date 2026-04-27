const { body, param, validationResult } = require('express-validator');
const { PASSWORD_MIN, PASSWORD_PATTERN } = require('./auth.validator');

const idParam = [
    param('id').isMongoId().withMessage('ID utente non valido')
];

const createAdminRules = [
    body('username').trim().isLength({ min: 3, max: 50 }).toLowerCase()
        .matches(/^[a-z0-9._-]+$/i).withMessage('Username: solo lettere, numeri, ".", "_" o "-"'),
    body('password')
        .isString()
        .isLength({ min: PASSWORD_MIN, max: 200 }).withMessage(`Min ${PASSWORD_MIN} caratteri`)
        .matches(PASSWORD_PATTERN).withMessage('Password: maiuscole, minuscole, numeri e un carattere speciale'),
    body('role').optional().isIn(['admin', 'superadmin'])
];

const updateAdminRules = [
    ...idParam,
    body('username').optional().trim().isLength({ min: 3, max: 50 }).toLowerCase()
        .matches(/^[a-z0-9._-]+$/i).withMessage('Username: solo lettere, numeri, ".", "_" o "-"'),
    body('role').optional().isIn(['admin', 'superadmin']),
    body('active').optional().isBoolean()
];

const resetPasswordRules = [
    ...idParam,
    body('newPassword')
        .isString()
        .isLength({ min: PASSWORD_MIN, max: 200 }).withMessage(`Min ${PASSWORD_MIN} caratteri`)
        .matches(PASSWORD_PATTERN).withMessage('Password: maiuscole, minuscole, numeri e un carattere speciale')
];

const deleteAdminRules = [...idParam];

function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(400).json({
        success: false,
        message: 'Dati non validi',
        errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
}

module.exports = {
    createAdminRules,
    updateAdminRules,
    resetPasswordRules,
    deleteAdminRules,
    handleValidation
};
