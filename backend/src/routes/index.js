const express = require('express');
const healthRoutes = require('./health.routes');
const reviewsRoutes = require('./reviews.routes');
const preventivoRoutes = require('./preventivo.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/preventivo', preventivoRoutes);
router.use('/admin/auth', authRoutes);
router.use('/admin/users', adminRoutes);

module.exports = router;
