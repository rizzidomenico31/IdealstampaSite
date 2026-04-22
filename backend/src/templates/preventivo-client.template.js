function render(data, { hasFile = false } = {}) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: white; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; }
            .highlight { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .contact-info { background: #f1f3f4; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
            .no-reply-warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Richiesta Ricevuta!</h1>
                <p>Grazie per aver scelto Idealstampa</p>
            </div>

            <div class="content">
                <div class="no-reply-warning">
                    <strong>📧 IMPORTANTE:</strong> Questa è una email automatica di conferma.<br>
                    <strong>NON rispondere a questo messaggio.</strong><br>
                    Per comunicazioni utilizza i contatti indicati di seguito.
                </div>

                <p>Gentile <strong>${data.nome} ${data.cognome}</strong>,</p>

                <p>abbiamo ricevuto la sua richiesta di preventivo per <strong>${data.servizio}</strong> ed è già in lavorazione nel nostro sistema.</p>

                ${hasFile ? `
                <div class="highlight" style="background: #e8f5e8; border-left: 4px solid #4caf50;">
                    <h3>📎 File ricevuto!</h3>
                    <p>Abbiamo ricevuto il suo file allegato e lo analizzeremo insieme alla richiesta.</p>
                </div>` : ''}

                <div class="highlight">
                    <h3>🎯 La ricontatteremo entro 24 ore</h3>
                    <p>Il nostro team sta già analizzando la sua richiesta per preparare un preventivo dettagliato e personalizzato.</p>
                </div>

                <div class="contact-info">
                    <h4>📞 Per domande o comunicazioni:</h4>
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/393770802322">+39 377 080 2322</a></p>
                    <p><strong>Email:</strong> <a href="mailto:info@idealstampa.com">info@idealstampa.com</a></p>
                    <p><strong>Orari:</strong> Lun-Ven 8:00-13:00 / 14:30-18:00</p>
                </div>

                <p><strong>Cosa succede ora?</strong></p>
                <ul>
                    <li>✅ Analizziamo le sue esigenze</li>
                    ${hasFile ? '<li>📄 Esaminiamo il file caricato</li>' : ''}
                    <li>⚙️ Valutiamo le opzioni migliori</li>
                    <li>💰 Prepariamo un preventivo dettagliato</li>
                    <li>📧 Le inviamo tutto via email</li>
                </ul>

                <p>Grazie per la fiducia accordataci!</p>

                <p style="margin-top: 30px;">
                    Cordiali saluti,<br>
                    <strong>Il Team di Idealstampa</strong>
                </p>
            </div>

            <div class="footer">
                <p>Idealstampa - Dal 1995 al vostro servizio</p>
                <p>Via Dott. Angelo Camoposeo, 23 - 70010 Turi (BA) - Puglia, Italia</p>
                <br>
                <p style="font-size: 12px; color: #999;">
                    <strong>ATTENZIONE:</strong> Questa email è stata generata automaticamente.<br>
                    Non rispondere a questo messaggio. Utilizza i contatti sopra indicati per comunicazioni.
                </p>
            </div>
        </div>
    </body>
    </html>`;
}

module.exports = { render };
