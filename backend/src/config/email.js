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
                attachments: options.attachments?.length > 0
                    ? await Promise.all(options.attachments.map(async a => {
                        const fs = require('fs').promises;
                        const content = await fs.readFile(a.path);
                        return {
                            filename: a.filename,
                            content: content.toString('base64'),
                            content_type: a.contentType
                        };
                    }))
                    : undefined
            });

            // Log risposta completa Resend
            console.log('RESEND RESPONSE:', JSON.stringify(result));

            if (result.error) {
                throw new Error(`Resend error: ${JSON.stringify(result.error)}`);
            }

            return { messageId: result.data?.id };
        }
    };
}

module.exports = { getTransporter, verifyTransporter };