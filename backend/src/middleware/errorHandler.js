const multer = require('multer');
const logger = require('../utils/logger');
const config = require('../config');

function multerErrorHandler(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        logger.error('Errore Multer:', err.code, err.message);

        if (err.code === 'LIMIT_FILE_SIZE') {
            const maxMb = Math.round(config.upload.maxFileSize / (1024 * 1024));
            return res.status(400).json({
                success: false,
                message: `File troppo grande. Dimensione massima: ${maxMb}MB`
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Campo file non valido'
            });
        }
        return res.status(400).json({
            success: false,
            message: "Errore durante l'upload del file"
        });
    }

    if (err && err.message === 'Tipo di file non supportato') {
        return res.status(400).json({
            success: false,
            message: 'Tipo di file non supportato. Formati accettati: PDF, DOC, DOCX, TXT, JPG, PNG, GIF, ZIP, RAR'
        });
    }

    return next(err);
}

function notFoundHandler(req, res) {
    res.status(404).json({ success: false, message: 'Endpoint non trovato' });
}

function globalErrorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
    logger.error('Errore non gestito:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.expose ? err.message : 'Errore interno del server',
        ...(config.env === 'development' ? { error: err.message } : {})
    });
}

module.exports = { multerErrorHandler, notFoundHandler, globalErrorHandler };
