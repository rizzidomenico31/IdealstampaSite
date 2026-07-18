const express = require('express');
const healthRoutes = require('./health.routes');
const reviewsRoutes = require('./reviews.routes');
const preventivoRoutes = require('./preventivo.routes');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');
const quotesRoutes = require('./quotes.routes');
const newsletterRoutes = require('./newsletter.routes');
const adminNewsletterRoutes = require('./admin-newsletter.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/preventivo', preventivoRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/admin/auth', authRoutes);
router.use('/admin/users', adminRoutes);
router.use('/admin/quotes', quotesRoutes);
router.use('/admin/newsletter', adminNewsletterRoutes);

module.exports = router;
