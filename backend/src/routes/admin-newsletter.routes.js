const express = require('express');
const controller = require('../controllers/newsletter.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { sendRules, idRule, handleValidation } = require('../validators/newsletter.validator');

const router = express.Router();

// Tutte le route richiedono autenticazione (qualsiasi ruolo admin)
router.use(requireAuth);

router.get('/subscribers', controller.listSubscribers);
router.get('/stats', controller.stats);
router.post('/send', sendRules, handleValidation, controller.send);
router.delete('/subscribers/:id', idRule, handleValidation, controller.removeSubscriber);

module.exports = router;
