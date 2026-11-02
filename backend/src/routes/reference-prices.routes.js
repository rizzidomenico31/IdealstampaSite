const express = require('express');
const controller = require('../controllers/reference-prices.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { idRule, createRules, handleValidation } = require('../validators/reference-prices.validator');

const router = express.Router();

// Listino prezzi di riferimento: accessibile a tutti gli admin
router.use(requireAuth);

router.get('/', controller.list);
router.post('/', createRules, handleValidation, controller.create);
router.delete('/:id', idRule, handleValidation, controller.remove);

module.exports = router;
