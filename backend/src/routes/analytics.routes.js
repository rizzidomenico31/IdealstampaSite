const express = require('express');
const controller = require('../controllers/analytics.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth);

router.get('/dashboard', controller.dashboard);
router.get('/revenue', controller.revenue);

module.exports = router;
