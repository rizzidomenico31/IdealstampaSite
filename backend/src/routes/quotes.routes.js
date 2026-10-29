const express = require('express');
const controller = require('../controllers/quotes.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const {
    idRule,
    updateStatusRules,
    respondRules,
    pricingRules,
    handleValidation
} = require('../validators/quotes.validator');

const router = express.Router();

// Tutte le route richiedono autenticazione (qualsiasi ruolo admin)
router.use(requireAuth);

router.get('/', controller.list);
router.get('/stats', controller.stats);
router.get('/:id', idRule, handleValidation, controller.getOne);
router.patch('/:id/status', updateStatusRules, handleValidation, controller.updateStatus);
router.patch('/:id/pricing', pricingRules, handleValidation, controller.updatePricing);
router.post('/:id/analyze', idRule, handleValidation, controller.analyze);
router.post('/:id/respond', respondRules, handleValidation, controller.respond);
router.delete('/:id', idRule, handleValidation, controller.remove);

module.exports = router;
