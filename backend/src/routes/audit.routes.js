const express = require('express');
const controller = require('../controllers/audit.controller');
const { requireAuth, requireRole } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(requireAuth, requireRole('superadmin'));

router.get('/', controller.list);
router.post('/cleanup', controller.cleanup);

module.exports = router;
