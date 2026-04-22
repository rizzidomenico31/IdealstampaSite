const express = require('express');
const controller = require('../controllers/reviews.controller');

const router = express.Router();

router.get('/', controller.list);
router.post('/refresh-cache', controller.refreshCache);

module.exports = router;
