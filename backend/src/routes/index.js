const express = require('express');
const healthRoutes = require('./health.routes');
const reviewsRoutes = require('./reviews.routes');
const preventivoRoutes = require('./preventivo.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/preventivo', preventivoRoutes);

module.exports = router;
