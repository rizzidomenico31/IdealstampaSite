const express = require('express');
const controller = require('../controllers/newsletter.controller');
const { newsletterLimiter } = require('../middleware/rateLimiter');
const { subscribeRules, handleValidation } = require('../validators/newsletter.validator');

const router = express.Router();

// Iscrizione pubblica dal footer del sito
router.post('/subscribe', newsletterLimiter, subscribeRules, handleValidation, controller.subscribe);

// Disiscrizione tramite link nella email (pagina HTML)
router.get('/unsubscribe', controller.unsubscribe);

module.exports = router;
