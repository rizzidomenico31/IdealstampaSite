function render(data, { hasAttachment = false, fileName = null } = {}) {
    const quantita = parseInt(data.quantita, 10);
    const quantitaFmt = Number.isFinite(quantita) ? quantita.toLocaleString('it-IT') : data.quantita;

    const nowIt = new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .section h3 { color: #667eea; margin-top: 0; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
            .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin: 20px 0; }
            .info-item { background: #f1f3f4; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea; }
            .info-label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .info-value { color: #333; }
            .attachment-alert { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 6px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Nuova Richiesta Preventivo ${hasAttachment ? '📎' : ''}</h1>
                <p>Ricevuta il ${nowIt}</p>
            </div>

            <div class="content">
                ${hasAttachment ? `
                <div class="attachment-alert">
                    <strong>📎 ATTENZIONE: Questa richiesta include un file allegato!</strong><br>
                    Nome file: <strong>${fileName || 'File allegato'}</strong>
                </div>` : ''}

                <div class="section">
                    <h3>👤 Dati Cliente</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Nome Completo</div>
                            <div class="info-value">${data.nome} ${data.cognome}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Email</div>
                            <div class="info-value"><a href="mailto:${data.email}">${data.email}</a></div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Telefono</div>
                            <div class="info-value"><a href="tel:${data.telefono}">${data.telefono}</a></div>
                        </div>
                        ${data.azienda ? `<div class="info-item">
                            <div class="info-label">Azienda</div>
                            <div class="info-value">${data.azienda}</div>
                        </div>` : ''}
                    </div>
                </div>

                <div class="section">
                    <h3>📦 Dettagli Richiesta</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Quantità</div>
                            <div class="info-value">${quantitaFmt} pezzi</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">File</div>
                            <div class="info-value">${hasAttachment ? '📎 File allegato alla email' : '— Nessun file allegato'}</div>
                        </div>
                    </div>

                    ${data.note ? `
                    <div style="margin-top: 20px;">
                        <div class="info-label">Messaggio del Cliente:</div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap;">${data.note}</div>
                    </div>` : ''}
                </div>

                <div class="footer">
                    <p><strong>⏰ Prossimi Passi:</strong></p>
                    <p>1. Ricontattare il cliente entro 24 ore</p>
                    <p>2. ${hasAttachment ? 'Scaricare e analizzare il file allegato' : 'Preparare preventivo dettagliato'}</p>
                    <p>3. Inviare preventivo via email</p>
                    <br>
                    <p style="font-size: 12px; color: #666;">
                        Questa richiesta è stata inviata automaticamente dal sito web di Idealstampa
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>`;
}

module.exports = { render };
