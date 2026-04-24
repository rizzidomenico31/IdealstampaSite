const express = require('express');
const controller = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');
const { requireAuth } = require('../middleware/auth.middleware');
const {
    loginRules,
    changePasswordRules,
    handleValidation
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', loginLimiter, loginRules, handleValidation, controller.login);
router.post('/logout', requireAuth, controller.logout);
router.get('/me', requireAuth, controller.me);
router.post(
    '/change-password',
    requireAuth,
    changePasswordRules,
    handleValidation,
    controller.changePassword
);

module.exports = router;
