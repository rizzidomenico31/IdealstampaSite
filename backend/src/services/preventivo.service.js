const fs = require('fs').promises;
const emailService = require('./email.service');
const database = require('../config/database');
const logger = require('../utils/logger');

let Quote = null;
function getQuoteModel() {
    if (!Quote) Quote = require('../models/quote.model');
    return Quote;
}

function toBool(v) {
    return v === true || v === 'true';
}

function parseFiniture(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try { return JSON.parse(raw); } catch { return []; }
}

function buildQuoteDoc(formData, file, req) {
    return {
        nome: formData.nome,
        cognome: formData.cognome,
        email: formData.email,
        telefono: formData.telefono,
        azienda: formData.azienda || undefined,
        tipoProgetto: formData.tipoProgetto,
        servizio: formData.servizio,
        urgenza: formData.urgenza,
        quantita: parseInt(formData.quantita, 10),
        formato: formData.formato,
        colori: formData.colori,
        carta: formData.carta,
        pagine: formData.pagine ? parseInt(formData.pagine, 10) : undefined,
        finiture: parseFiniture(formData.finiture),
        note: formData.note || undefined,
        budget: formData.budget || undefined,
        privacy: toBool(formData.privacy),
        newsletter: toBool(formData.newsletter),
        file: file ? {
            originalName: file.originalname,
            storedName: file.filename,
            mimeType: file.mimetype,
            size: file.size
        } : null,
        meta: {
            ip: req?.ip,
            userAgent: req?.get?.('user-agent')
        }
    };
}

async function persistQuote(doc) {
    if (!database.isEnabled()) return null;
    try {
        const QuoteModel = getQuoteModel();
        const saved = await QuoteModel.create(doc);
        logger.success('Preventivo salvato su MongoDB:', saved._id.toString());
        return saved;
    } catch (err) {
        logger.error('Salvataggio preventivo su MongoDB fallito:', err.message);
        return null;
    }
}

async function updateQuoteEmailStatus(quoteDoc, status) {
    if (!quoteDoc) return;
    try {
        quoteDoc.emailStatus = { ...status, sentAt: new Date() };
        await quoteDoc.save();
    } catch (err) {
        logger.warn('Aggiornamento stato email fallito:', err.message);
    }
}

async function cleanupFile(filePath) {
    if (!filePath) return;
    try {
        await fs.unlink(filePath);
        logger.debug('File temporaneo eliminato:', filePath);
    } catch (err) {
        logger.warn('Errore eliminazione file temporaneo:', err.message);
    }
}

async function processPreventivo(formData, file, req) {
    if (file) formData.fileName = file.originalname;

    const doc = buildQuoteDoc(formData, file, req);
    const saved = await persistQuote(doc);

    try {
        const result = await emailService.sendPreventivoEmails(formData, file);
        await updateQuoteEmailStatus(saved, result);
        return { ...result, quoteId: saved?._id?.toString() || null };
    } catch (err) {
        await updateQuoteEmailStatus(saved, { error: err.message });
        throw err;
    }
}

module.exports = { processPreventivo, cleanupFile };
