// server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware di sicurezza
app.use(helmet());
if (process.env.NODE_ENV !== 'production') {
    app.use(cors({
        origin: ['http://localhost:3000',
        "https://react-frontend-backend.up.railway.app"
        ],
        credentials: true
    }));
}

// Rate limiting - massimo 5 richieste per IP ogni 15 minuti
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 5, // limite di 5 richieste per windowMs
    message: {
        error: 'Troppe richieste da questo IP, riprova tra 15 minuti.'
    }
});

app.use('/api/preventivo', limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Configurazione Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true per 465, false per altri ports
    auth: {
        user: process.env.SMTP_USER, // il tuo email
        pass: process.env.SMTP_PASS  // password app o password email
    }
});

// Verificare la configurazione email all'avvio
transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ Errore configurazione email:', error);
    } else {
        console.log('✅ Server email pronto per inviare messaggi');
    }
});

// Validatori per i campi del form
const validatePreventivo = [
    body('nome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('cognome').trim().isLength({ min: 2, max: 50 }).escape(),
    body('email').isEmail().normalizeEmail(),
    body('telefono').trim().isLength({ min: 8, max: 20 }).escape(),
    body('azienda').optional().trim().isLength({ max: 100 }).escape(),
    body('tipoProgetto').isIn(['business', 'marketing', 'eventi', 'editoria', 'packaging', 'altro']),
    body('servizio').isIn(['offset', 'digitale', 'grande-formato', 'packaging', 'editoria', 'finiture']),
    body('urgenza').isIn(['urgente', 'normale', 'rilassato']),
    body('quantita').isInt({ min: 1, max: 1000000 }),
    body('formato').trim().isLength({ min: 1, max: 100 }).escape(),
    body('colori').isIn(['1+0', '1+1', '4+0', '4+1', '4+4', 'pantone']),
    body('carta').trim().isLength({ min: 1, max: 100 }).escape(),
    body('note').optional().trim().isLength({ max: 1000 }).escape(),
    body('privacy').isBoolean().custom(value => {
        if (!value) {
            throw new Error('Devi accettare la privacy policy');
        }
        return true;
    })
];

// Funzione per generare HTML email
function generateEmailHTML(data) {
    const servizi = {
        'offset': 'Stampa Offset',
        'digitale': 'Stampa Digitale',
        'grande-formato': 'Grande Formato',
        'packaging': 'Packaging',
        'editoria': 'Editoria',
        'finiture': 'Finiture Speciali'
    };

    const tipi = {
        'business': 'Materiale Aziendale',
        'marketing': 'Materiale Promozionale',
        'eventi': 'Eventi Speciali',
        'editoria': 'Prodotti Editoriali',
        'packaging': 'Packaging',
        'altro': 'Altro Progetto'
    };

    const urgenze = {
        'urgente': 'Urgente (1-3 giorni) - Sovrapprezzo 20%',
        'normale': 'Normale (5-7 giorni)',
        'rilassato': 'Non ho fretta (10-15 giorni) - Sconto 10%'
    };

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
            .highlight { background: #e3f2fd; padding: 15px; border-radius: 6px; border-left: 4px solid #2196f3; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; padding: 20px; background: #f1f3f4; border-radius: 6px; }
            .badge { background: #667eea; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Nuova Richiesta Preventivo</h1>
                <p>Ricevuta il ${new Date().toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })}</p>
            </div>
            
            <div class="content">
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
                    <h3>🎯 Dettagli Progetto</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Tipo di Progetto</div>
                            <div class="info-value">${tipi[data.tipoProgetto] || data.tipoProgetto}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Servizio Richiesto</div>
                            <div class="info-value">${servizi[data.servizio] || data.servizio}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Urgenza</div>
                            <div class="info-value">${urgenze[data.urgenza] || data.urgenza}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3>⚙️ Specifiche Tecniche</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">Quantità</div>
                            <div class="info-value">${data.quantita.toLocaleString('it-IT')} pezzi</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Formato</div>
                            <div class="info-value">${data.formato}</div>
                        </div>
                        ${data.pagine ? `<div class="info-item">
                            <div class="info-label">Numero Pagine</div>
                            <div class="info-value">${data.pagine}</div>
                        </div>` : ''}
                        <div class="info-item">
                            <div class="info-label">Colori</div>
                            <div class="info-value">${data.colori}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">Tipo di Carta</div>
                            <div class="info-value">${data.carta}</div>
                        </div>
                    </div>
                    
                    ${data.finiture && data.finiture.length > 0 ? `
                    <div class="highlight">
                        <div class="info-label">Finiture Speciali Richieste:</div>
                        <div class="info-value">
                            ${data.finiture.map(f => `<span class="badge">${f}</span>`).join(' ')}
                        </div>
                    </div>` : ''}
                </div>

                ${data.hasFile || data.note || data.budget ? `
                <div class="section">
                    <h3>📎 Informazioni Aggiuntive</h3>
                    
                    ${data.hasFile === 'true' ? `
                    <div class="highlight">
                        <div class="info-label">File:</div>
                        <div class="info-value">✅ Il cliente ha file pronti</div>
                        ${data.fileInfo ? `<div style="margin-top: 10px;"><strong>Dettagli:</strong> ${data.fileInfo}</div>` : ''}
                    </div>` : data.hasFile === 'false' ? `
                    <div class="highlight">
                        <div class="info-label">File:</div>
                        <div class="info-value">⚠️ Il cliente ha bisogno di aiuto per la progettazione</div>
                    </div>` : ''}
                    
                    ${data.budget ? `
                    <div class="info-item">
                        <div class="info-label">Budget Indicativo</div>
                        <div class="info-value">${data.budget}</div>
                    </div>` : ''}
                    
                    ${data.note ? `
                    <div style="margin-top: 20px;">
                        <div class="info-label">Note del Cliente:</div>
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 10px; white-space: pre-wrap;">${data.note}</div>
                    </div>` : ''}
                </div>` : ''}

                <div class="footer">
                    <p><strong>⏰ Prossimi Passi:</strong></p>
                    <p>1. Ricontattare il cliente entro 24 ore</p>
                    <p>2. Preparare preventivo dettagliato</p>
                    <p>3. Inviare preventivo via email</p>
                    <br>
                    <p style="font-size: 12px; color: #666;">
                        Questa richiesta è stata inviata automaticamente dal sito web di Idealstampa
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Funzione per generare email di conferma per il cliente
function generateClientConfirmationHTML(data) {
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
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>✅ Richiesta Ricevuta!</h1>
                <p>Grazie per aver scelto Idealstampa</p>
            </div>
            
            <div class="content">
                <p>Gentile <strong>${data.nome} ${data.cognome}</strong>,</p>
                
                <p>abbiamo ricevuto la sua richiesta di preventivo per <strong>${data.servizio}</strong> ed è già in lavorazione nel nostro sistema.</p>
                
                <div class="highlight">
                    <h3>🎯 La ricontatteremo entro 24 ore</h3>
                    <p>Il nostro team sta già analizzando la sua richiesta per preparare un preventivo dettagliato e personalizzato.</p>
                </div>
                
                <div class="contact-info">
                    <h4>📞 Nel frattempo, se ha domande urgenti:</h4>
                    <p><strong>WhatsApp:</strong> <a href="https://wa.me/393770802322">+39 377 080 2322</a></p>
                    <p><strong>Email:</strong> <a href="mailto:info@idealstampa.com">info@idealstampa.com</a></p>
                    <p><strong>Orari:</strong> Lun-Ven 8:00-13:00 / 14:30-18:00</p>
                </div>
                
                <p><strong>Cosa succede ora?</strong></p>
                <ul>
                    <li>✅ Analizziamo le sue esigenze</li>
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
                <p>Via Roma, 123 - 70010 Turi (BA) - Puglia, Italia</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Endpoint principale per ricevere richieste preventivo
app.post('/api/preventivo', validatePreventivo, async (req, res) => {
    try {
        // Controlla errori di validazione
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Dati non validi',
                errors: errors.array()
            });
        }

        const formData = req.body;

        // Opzioni email per l'azienda
        const mailOptionsCompany = {
            from: `"${formData.nome} ${formData.cognome}" <${process.env.SMTP_USER}>`,
            to: process.env.COMPANY_EMAIL || process.env.SMTP_USER,
            subject: `🎯 Nuovo Preventivo: ${formData.servizio} - ${formData.nome} ${formData.cognome}`,
            html: generateEmailHTML(formData),
            replyTo: formData.email
        };

        // Opzioni email di conferma per il cliente
        const mailOptionsClient = {
            from: `"Idealstampa" <${process.env.SMTP_USER}>`,
            to: formData.email,
            subject: '✅ Richiesta Preventivo Ricevuta - Idealstampa',
            html: generateClientConfirmationHTML(formData)
        };

        // Invia entrambe le email
        const [companyResult, clientResult] = await Promise.all([
            transporter.sendMail(mailOptionsCompany),
            transporter.sendMail(mailOptionsClient)
        ]);

        console.log('✅ Email inviata all\'azienda:', companyResult.messageId);
        console.log('✅ Conferma inviata al cliente:', clientResult.messageId);

        // Risposta di successo
        res.status(200).json({
            success: true,
            message: 'Richiesta preventivo inviata con successo! Ti ricontatteremo entro 24 ore.',
            messageId: companyResult.messageId
        });

    } catch (error) {
        console.error('❌ Errore invio email:', error);

        res.status(500).json({
            success: false,
            message: 'Errore temporaneo del server. Riprova tra qualche minuto o contattaci direttamente.',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Errore interno'
        });
    }
});

// Endpoint di test per verificare che il server funzioni
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Idealstampa Preventivi API'
    });
});

// Middleware per gestire routes non trovate
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint non trovato'
    });
});

// Middleware globale per gestire errori
app.use((error, req, res, next) => {
    console.error('❌ Errore globale:', error);
    res.status(500).json({
        success: false,
        message: 'Errore interno del server'
    });
});

// Avvia il server
app.listen(PORT, () => {
    console.log(`🚀 Server avviato sulla porta ${PORT}`);
    console.log(`📧 Endpoint preventivi: http://localhost:${PORT}/api/preventivo`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;