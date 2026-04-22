const nodemailer = require('nodemailer');
const config = require('./index');
const logger = require('../utils/logger');

let transporter = null;

function createTransporter() {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.pass
        },
        connectionTimeout: config.smtp.connectionTimeout,
        greetingTimeout: config.smtp.greetingTimeout,
        socketTimeout: config.smtp.socketTimeout
    });

    return transporter;
}

async function verifyTransporter() {
    const t = createTransporter();
    try {
        await t.verify();
        logger.success('SMTP pronto per inviare messaggi');
        return true;
    } catch (err) {
        logger.error('Configurazione SMTP non valida:', err.message);
        return false;
    }
}

module.exports = {
    getTransporter: createTransporter,
    verifyTransporter
};
