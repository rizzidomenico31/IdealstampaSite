const { body, validationResult } = require('express-validator');

const PASSWORD_MIN = 10;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const loginRules = [
    body('username').trim().isLength({ min: 3, max: 50 }).toLowerCase(),
    body('password').isString().isLength({ min: 1, max: 200 })
];

const changePasswordRules = [
    body('currentPassword').isString().isLength({ min: 1, max: 200 }),
    body('newPassword')
        .isString()
        .isLength({ min: PASSWORD_MIN, max: 200 }).withMessage(`La nuova password deve essere di almeno ${PASSWORD_MIN} caratteri`)
        .matches(PASSWORD_PATTERN).withMessage('La password deve contenere maiuscole, minuscole, numeri e un carattere speciale')
];

function isPasswordStrong(password) {
    return typeof password === 'string'
        && password.length >= PASSWORD_MIN
        && PASSWORD_PATTERN.test(password);
}

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
    loginRules,
    changePasswordRules,
    handleValidation,
    isPasswordStrong,
    PASSWORD_MIN,
    PASSWORD_PATTERN
};
