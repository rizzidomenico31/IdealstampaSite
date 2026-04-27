const express = require('express');
const controller = require('../controllers/admin.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');
const {
    createAdminRules,
    updateAdminRules,
    resetPasswordRules,
    deleteAdminRules,
    handleValidation
} = require('../validators/admin.validator');

const router = express.Router();

// Tutte le route richiedono auth + ruolo superadmin
router.use(requireAuth, requireRole('superadmin'));

router.get('/', controller.list);
router.post('/', createAdminRules, handleValidation, controller.create);
router.patch('/:id', updateAdminRules, handleValidation, controller.update);
router.post('/:id/password', resetPasswordRules, handleValidation, controller.resetPassword);
router.delete('/:id', deleteAdminRules, handleValidation, controller.remove);

module.exports = router;
