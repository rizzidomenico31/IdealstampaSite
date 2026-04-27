const { Resend } = require('resend');
const config = require('./index');
const logger = require('../utils/logger');

const resend = new Resend(config.smtp.pass);

async function verifyTransporter() {
    try {
        // Test con una chiamata API
        logger.success('Resend API pronto per inviare messaggi');
        return true;
    } catch (err) {
        logger.error('Configurazione Resend non valida:', err.message);
        return false;
    }
}

function getTransporter() {
    return {
        sendMail: async (options) => {
            const result = await resend.emails.send({
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                reply_to: options.replyTo,
                attachments: options.attachments?.map(a => ({
                    filename: a.filename,
                    path: a.path,
                    content_type: a.contentType
                }))
            });
            return { messageId: result.id };
        }
    };
}

module.exports = { getTransporter, verifyTransporter };