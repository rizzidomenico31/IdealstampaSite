const preventivoService = require('../services/preventivo.service');
const logger = require('../utils/logger');

async function create(req, res, next) {
    const uploadedFilePath = req.file?.path || null;

    try {
        const { nome, cognome, email, servizio } = req.body;
        logger.info('Richiesta preventivo ricevuta:', {
            cliente: `${nome} ${cognome}`,
            email,
            servizio,
            hasFile: Boolean(req.file),
            fileName: req.file?.originalname
        });

        const result = await preventivoService.processPreventivo(req.body, req.file, req);

        res.status(200).json({
            success: true,
            message: req.file
                ? 'Richiesta preventivo e file inviati con successo! Ti ricontatteremo entro 24 ore.'
                : 'Richiesta preventivo inviata con successo! Ti ricontatteremo entro 24 ore.',
            messageId: result.companyMessageId,
            quoteId: result.quoteId,
            hasAttachment: Boolean(req.file),
            fileName: req.file?.originalname
        });
    } catch (err) {
        logger.error('Errore invio preventivo:', err.message);
        return next(err);
    } finally {
        if (uploadedFilePath) {
            setTimeout(() => preventivoService.cleanupFile(uploadedFilePath), 5000);
        }
    }
}

module.exports = { create };
