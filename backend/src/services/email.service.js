const { getTransporter } = require('../config/email');
const config = require('../config');
const companyTemplate = require('../templates/preventivo-company.template');
const clientTemplate = require('../templates/preventivo-client.template');

function buildAttachments(file) {
    if (!file) return [];
    return [{
        filename: file.originalname,
        path: file.path,
        contentType: file.mimetype
    }];
}

async function sendPreventivoEmails(formData, file) {
    const transporter = getTransporter();
    const hasFile = Boolean(file);
    const fileName = file?.originalname || null;

    const companyMail = {
        from: `"${formData.nome} ${formData.cognome}" <${config.smtp.user}>`,
        to: config.email.companyEmail,
        subject: `🎯 Nuovo Preventivo: ${formData.servizio} - ${formData.nome} ${formData.cognome}${hasFile ? ' 📎' : ''}`,
        html: companyTemplate.render(formData, { hasAttachment: hasFile, fileName }),
        replyTo: formData.email,
        attachments: buildAttachments(file)
    };

    const clientMail = {
        from: `"${config.email.fromName}" <${config.smtp.user}>`,
        to: formData.email,
        subject: '✅ Richiesta Preventivo Ricevuta - Idealstampa',
        html: clientTemplate.render(formData, { hasFile })
    };

    const [companyResult, clientResult] = await Promise.all([
        transporter.sendMail(companyMail),
        transporter.sendMail(clientMail)
    ]);

    return {
        companyMessageId: companyResult.messageId,
        clientMessageId: clientResult.messageId
    };
}

module.exports = { sendPreventivoEmails };
