const express = require('express');
const { adminLimiter } = require('../middleware/rateLimiter');
const healthRoutes = require('./health.routes');
const reviewsRoutes = require('./reviews.routes');
const preventivoRoutes = require('./preventivo.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const quotesRoutes = require('./quotes.routes');
const newsletterRoutes = require('./newsletter.routes');
const adminNewsletterRoutes = require('./admin-newsletter.routes');
const analyticsRoutes = require('./analytics.routes');
const auditRoutes = require('./audit.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/preventivo', preventivoRoutes);
router.use('/newsletter', newsletterRoutes);

// Rate limiting globale per tutte le route admin (escluso login che ha già il suo limiter)
router.use('/admin', adminLimiter);

router.use('/admin/auth', authRoutes);
router.use('/admin/users', adminRoutes);
router.use('/admin/quotes', quotesRoutes);
router.use('/admin/newsletter', adminNewsletterRoutes);
router.use('/admin/analytics', analyticsRoutes);
router.use('/admin/audit', auditRoutes);

module.exports = router;
