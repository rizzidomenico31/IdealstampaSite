function render(data, { hasFile = false } = {}) {
    const nome = `${data.nome || ''} ${data.cognome || ''}`.trim();
    const servizio = data.servizio || 'il servizio richiesto';

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Richiesta ricevuta - Idealstampa</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style>
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; }
            .px-mobile { padding-left: 24px !important; padding-right: 24px !important; }
            .py-mobile { padding-top: 32px !important; padding-bottom: 32px !important; }
            .h1-mobile { font-size: 26px !important; line-height: 32px !important; }
            .stack { display: block !important; width: 100% !important; }
            .hide-mobile { display: none !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
        Abbiamo ricevuto la tua richiesta di preventivo. Ti ricontatteremo entro 24 ore.
    </div>

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;">
        <tr>
            <td align="center" style="padding:32px 16px;">

                <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(15,23,42,0.06);">

                    <tr>
                        <td style="background-color:#0f172a; padding:24px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left" style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:-0.3px;">
                                        Idealstampa
                                    </td>
                                    <td align="right" style="color:#94a3b8; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:1px;">
                                        Dal 1995
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:linear-gradient(135deg, #0d9488 0%, #0891b2 100%); background-color:#0d9488; padding:48px 40px;" class="px-mobile py-mobile" align="center">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center">
                                <tr>
                                    <td align="center" style="background-color:rgba(255,255,255,0.15); width:64px; height:64px; border-radius:50%; vertical-align:middle;">
                                        <span style="font-size:32px; line-height:64px;">&#10003;</span>
                                    </td>
                                </tr>
                            </table>
                            <h1 class="h1-mobile" style="margin:24px 0 8px 0; color:#ffffff; font-size:30px; line-height:36px; font-weight:700; letter-spacing:-0.5px;">
                                Richiesta ricevuta
                            </h1>
                            <p style="margin:0; color:rgba(255,255,255,0.9); font-size:16px; line-height:24px;">
                                Grazie per averci scelto, ${data.nome || 'cliente'}.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 40px 8px 40px;" class="px-mobile">
                            <p style="margin:0 0 16px 0; color:#0f172a; font-size:16px; line-height:24px;">
                                Gentile <strong>${nome}</strong>,
                            </p>
                            <p style="margin:0 0 24px 0; color:#475569; font-size:16px; line-height:24px;">
                                la sua richiesta di preventivo per <strong style="color:#0f172a;">${servizio}</strong> è stata registrata correttamente ed è già stata presa in carico dal nostro team.
                            </p>

                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdfa; border-left:4px solid #0d9488; border-radius:8px; margin:0 0 24px 0;">
                                <tr>
                                    <td style="padding:20px 24px;">
                                        <p style="margin:0 0 4px 0; color:#0f766e; font-size:13px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">
                                            Tempi di risposta
                                        </p>
                                        <p style="margin:0; color:#0f172a; font-size:16px; line-height:24px; font-weight:600;">
                                            La ricontatteremo entro 24 ore lavorative
                                        </p>
                                        <p style="margin:8px 0 0 0; color:#475569; font-size:14px; line-height:20px;">
                                            Stiamo già analizzando le sue esigenze per preparare un preventivo dettagliato e personalizzato.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            ${hasFile ? `
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; margin:0 0 24px 0;">
                                <tr>
                                    <td style="padding:16px 24px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="32" valign="top" style="font-size:20px; line-height:24px;">&#128206;</td>
                                                <td valign="top">
                                                    <p style="margin:0 0 2px 0; color:#166534; font-size:14px; font-weight:600;">File allegato ricevuto</p>
                                                    <p style="margin:0; color:#15803d; font-size:13px; line-height:18px;">Lo analizzeremo insieme alla richiesta.</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>` : ''}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 32px 40px;" class="px-mobile">
                            <p style="margin:0 0 16px 0; color:#0f172a; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">
                                I prossimi passi
                            </p>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="32" valign="top" style="padding:6px 0;">
                                        <div style="width:24px; height:24px; background-color:#0d9488; color:#ffffff; border-radius:50%; text-align:center; font-size:12px; font-weight:700; line-height:24px;">1</div>
                                    </td>
                                    <td valign="top" style="padding:6px 0 6px 12px; color:#334155; font-size:15px; line-height:22px;">
                                        <strong style="color:#0f172a;">Analisi della richiesta</strong><br>
                                        <span style="color:#64748b; font-size:14px;">Valutiamo specifiche tecniche ed esigenze</span>
                                    </td>
                                </tr>
                                ${hasFile ? `
                                <tr>
                                    <td width="32" valign="top" style="padding:6px 0;">
                                        <div style="width:24px; height:24px; background-color:#0d9488; color:#ffffff; border-radius:50%; text-align:center; font-size:12px; font-weight:700; line-height:24px;">2</div>
                                    </td>
                                    <td valign="top" style="padding:6px 0 6px 12px; color:#334155; font-size:15px; line-height:22px;">
                                        <strong style="color:#0f172a;">Verifica del file</strong><br>
                                        <span style="color:#64748b; font-size:14px;">Controllo qualità e compatibilità di stampa</span>
                                    </td>
                                </tr>` : ''}
                                <tr>
                                    <td width="32" valign="top" style="padding:6px 0;">
                                        <div style="width:24px; height:24px; background-color:#0d9488; color:#ffffff; border-radius:50%; text-align:center; font-size:12px; font-weight:700; line-height:24px;">${hasFile ? '3' : '2'}</div>
                                    </td>
                                    <td valign="top" style="padding:6px 0 6px 12px; color:#334155; font-size:15px; line-height:22px;">
                                        <strong style="color:#0f172a;">Preventivo personalizzato</strong><br>
                                        <span style="color:#64748b; font-size:14px;">Soluzione su misura con prezzo dettagliato</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td width="32" valign="top" style="padding:6px 0;">
                                        <div style="width:24px; height:24px; background-color:#0d9488; color:#ffffff; border-radius:50%; text-align:center; font-size:12px; font-weight:700; line-height:24px;">${hasFile ? '4' : '3'}</div>
                                    </td>
                                    <td valign="top" style="padding:6px 0 6px 12px; color:#334155; font-size:15px; line-height:22px;">
                                        <strong style="color:#0f172a;">Invio via email</strong><br>
                                        <span style="color:#64748b; font-size:14px;">Riceverà la proposta direttamente nella sua casella</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 32px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                                <tr>
                                    <td style="padding:24px;">
                                        <p style="margin:0 0 16px 0; color:#0f172a; font-size:14px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">
                                            Hai bisogno di parlare con noi?
                                        </p>
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td class="stack" width="50%" valign="top" style="padding:0 8px 12px 0;">
                                                    <a href="https://wa.me/393770802322" style="display:block; background-color:#22c55e; color:#ffffff; text-decoration:none; padding:14px 16px; border-radius:8px; font-size:14px; font-weight:600; text-align:center;">
                                                        WhatsApp diretto
                                                    </a>
                                                </td>
                                                <td class="stack" width="50%" valign="top" style="padding:0 0 12px 8px;">
                                                    <a href="mailto:info@idealstampa.com" style="display:block; background-color:#ffffff; color:#0f172a; text-decoration:none; padding:13px 16px; border-radius:8px; font-size:14px; font-weight:600; text-align:center; border:1px solid #cbd5e1;">
                                                        Scrivici un'email
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:8px;">
                                            <tr>
                                                <td style="color:#64748b; font-size:13px; line-height:20px;">
                                                    <strong style="color:#475569;">Telefono:</strong> +39 377 080 2322<br>
                                                    <strong style="color:#475569;">Orari:</strong> Lun-Ven 8:00&#8211;13:00 / 14:30&#8211;18:00
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:0 40px 40px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#fffbeb; border:1px solid #fde68a; border-radius:8px;">
                                <tr>
                                    <td style="padding:14px 18px; color:#92400e; font-size:13px; line-height:18px;">
                                        <strong>Email automatica.</strong> Non rispondere a questo messaggio: utilizza i contatti qui sopra per qualsiasi comunicazione.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#0f172a; padding:32px 40px;" class="px-mobile" align="center">
                            <p style="margin:0 0 8px 0; color:#ffffff; font-size:16px; font-weight:700; letter-spacing:-0.2px;">
                                Idealstampa
                            </p>
                            <p style="margin:0 0 16px 0; color:#94a3b8; font-size:13px; line-height:20px;">
                                Stampa di qualità dal 1995
                            </p>
                            <p style="margin:0; color:#64748b; font-size:12px; line-height:18px;">
                                Via Dott. Angelo Camoposeo, 23<br>
                                70010 Turi (BA) &middot; Puglia, Italia
                            </p>
                        </td>
                    </tr>

                </table>

                <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; margin-top:16px;">
                    <tr>
                        <td align="center" style="color:#94a3b8; font-size:11px; line-height:16px; padding:0 40px;">
                            &copy; ${new Date().getFullYear()} Idealstampa. Tutti i diritti riservati.
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
}

module.exports = { render };
