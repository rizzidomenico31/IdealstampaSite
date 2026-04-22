const express = require('express');
const upload = require('../middleware/upload');
const { preventivoLimiter } = require('../middleware/rateLimiter');
const { preventivoRules, handleValidation } = require('../validators/preventivo.validator');
const controller = require('../controllers/preventivo.controller');
const preventivoService = require('../services/preventivo.service');

const router = express.Router();

router.post(
    '/',
    preventivoLimiter,
    upload.single('file'),
    preventivoRules,
    async (req, res, next) => {
        // cleanup del file se validazione fallisce
        const { validationResult } = require('express-validator');
        const errors = validationResult(req);
        if (!errors.isEmpty() && req.file?.path) {
            await preventivoService.cleanupFile(req.file.path);
        }
        return handleValidation(req, res, next);
    },
    controller.create
);

module.exports = router;
