const SERVIZI = {
    offset: 'Stampa Offset',
    digitale: 'Stampa Digitale',
    'grande-formato': 'Grande Formato',
    packaging: 'Packaging',
    editoria: 'Editoria',
    finiture: 'Finiture Speciali'
};

const TIPI_PROGETTO = {
    business: 'Materiale Aziendale',
    marketing: 'Materiale Promozionale',
    eventi: 'Eventi Speciali',
    editoria: 'Prodotti Editoriali',
    packaging: 'Packaging',
    altro: 'Altro Progetto'
};

const URGENZE = {
    urgente: { label: 'Urgente (1-3 giorni)', note: 'Sovrapprezzo +20%', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
    normale: { label: 'Normale (5-7 giorni)', note: 'Tempistiche standard', color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
    rilassato: { label: 'Non ho fretta (10-15 giorni)', note: 'Sconto -10%', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }
};

function parseFiniture(raw) {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function infoRow(label, value, options = {}) {
    if (!value && value !== 0) return '';
    const { isLink = false, href = '' } = options;
    const valueHtml = isLink
        ? `<a href="${escapeHtml(href)}" style="color:#0d9488; text-decoration:none; font-weight:600;">${escapeHtml(value)}</a>`
        : `<span style="color:#0f172a; font-weight:600;">${escapeHtml(value)}</span>`;
    return `
        <tr>
            <td style="padding:12px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:13px; width:40%; vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:12px 0; border-bottom:1px solid #f1f5f9; font-size:14px; vertical-align:top;">${valueHtml}</td>
        </tr>`;
}

function render(data, { hasAttachment = false, fileName = null } = {}) {
    const finiture = parseFiniture(data.finiture);
    const quantita = parseInt(data.quantita, 10);
    const quantitaFmt = Number.isFinite(quantita) ? quantita.toLocaleString('it-IT') : data.quantita;

    const now = new Date();
    const nowIt = now.toLocaleDateString('it-IT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const urgenza = URGENZE[data.urgenza] || { label: data.urgenza || '—', note: '', color: '#475569', bg: '#f8fafc', border: '#e2e8f0' };
    const tipoProgetto = TIPI_PROGETTO[data.tipoProgetto] || data.tipoProgetto;
    const servizio = SERVIZI[data.servizio] || data.servizio;
    const nomeCompleto = `${data.nome || ''} ${data.cognome || ''}`.trim();

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>Nuova richiesta preventivo - ${escapeHtml(nomeCompleto)}</title>
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
        @media only screen and (max-width: 700px) {
            .container { width: 100% !important; }
            .px-mobile { padding-left: 24px !important; padding-right: 24px !important; }
            .stack { display: block !important; width: 100% !important; padding: 0 0 12px 0 !important; }
            .h1-mobile { font-size: 24px !important; line-height: 30px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">
        Nuovo preventivo da ${escapeHtml(nomeCompleto)} - ${escapeHtml(servizio)} - ${escapeHtml(quantitaFmt)} pezzi${hasAttachment ? ' - Con file allegato' : ''}
    </div>

    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;">
        <tr>
            <td align="center" style="padding:24px 12px;">

                <table role="presentation" class="container" width="680" border="0" cellspacing="0" cellpadding="0" style="max-width:680px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(15,23,42,0.08);">

                    <tr>
                        <td style="background-color:#0f172a; padding:24px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left" style="color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.3px;">
                                        Idealstampa &middot; <span style="color:#5eead4; font-weight:600;">CRM Preventivi</span>
                                    </td>
                                    <td align="right" style="color:#94a3b8; font-size:12px; font-weight:500;">
                                        ${escapeHtml(now.toLocaleDateString('it-IT'))} &middot; ${escapeHtml(now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }))}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:linear-gradient(135deg, #0d9488 0%, #0891b2 100%); background-color:#0d9488; padding:36px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 6px 0; color:rgba(255,255,255,0.85); font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:1.5px;">
                                            Nuova richiesta &middot; ${hasAttachment ? 'Con allegato' : 'Senza allegato'}
                                        </p>
                                        <h1 class="h1-mobile" style="margin:0 0 4px 0; color:#ffffff; font-size:28px; line-height:34px; font-weight:700; letter-spacing:-0.5px;">
                                            ${escapeHtml(nomeCompleto)}
                                        </h1>
                                        <p style="margin:0; color:rgba(255,255,255,0.92); font-size:15px; line-height:22px;">
                                            ${escapeHtml(servizio)} &middot; ${escapeHtml(quantitaFmt)} pezzi
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#f8fafc; padding:20px 40px; border-bottom:1px solid #e2e8f0;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="stack" width="33%" valign="top" style="padding-right:8px;">
                                        <p style="margin:0 0 4px 0; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Urgenza</p>
                                        <span style="display:inline-block; padding:6px 12px; background-color:${urgenza.bg}; color:${urgenza.color}; border:1px solid ${urgenza.border}; border-radius:999px; font-size:13px; font-weight:600;">
                                            ${escapeHtml(urgenza.label)}
                                        </span>
                                        ${urgenza.note ? `<p style="margin:6px 0 0 0; color:#64748b; font-size:12px;">${escapeHtml(urgenza.note)}</p>` : ''}
                                    </td>
                                    <td class="stack" width="33%" valign="top" style="padding:0 8px;">
                                        <p style="margin:0 0 4px 0; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Tipo progetto</p>
                                        <p style="margin:0; color:#0f172a; font-size:14px; font-weight:600;">${escapeHtml(tipoProgetto || '—')}</p>
                                    </td>
                                    <td class="stack" width="33%" valign="top" style="padding-left:8px;">
                                        <p style="margin:0 0 4px 0; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px;">Budget</p>
                                        <p style="margin:0; color:#0f172a; font-size:14px; font-weight:600;">${data.budget ? '&euro; ' + escapeHtml(data.budget) : '<span style="color:#94a3b8; font-weight:500;">Non indicato</span>'}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    ${hasAttachment ? `
                    <tr>
                        <td style="padding:20px 40px 0 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#fffbeb; border:1px solid #fde68a; border-radius:10px;">
                                <tr>
                                    <td style="padding:14px 18px;">
                                        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td width="32" valign="top" style="font-size:18px;">&#128206;</td>
                                                <td valign="top">
                                                    <p style="margin:0 0 2px 0; color:#92400e; font-size:13px; font-weight:700;">File allegato</p>
                                                    <p style="margin:0; color:#b45309; font-size:13px; line-height:18px; word-break:break-all;">${escapeHtml(fileName || 'file allegato all\'email')}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>` : ''}

                    <tr>
                        <td style="padding:32px 40px 8px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px 0; color:#0f172a; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Cliente</p>
                                        <div style="height:2px; width:32px; background-color:#0d9488; border-radius:2px;"></div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                ${infoRow('Nome completo', nomeCompleto)}
                                ${infoRow('Email', data.email, { isLink: true, href: `mailto:${data.email}` })}
                                ${infoRow('Telefono', data.telefono, { isLink: true, href: `tel:${data.telefono}` })}
                                ${data.azienda ? infoRow('Azienda', data.azienda) : ''}
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:24px 40px 8px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px 0; color:#0f172a; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Specifiche tecniche</p>
                                        <div style="height:2px; width:32px; background-color:#0d9488; border-radius:2px;"></div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                ${infoRow('Quantità', `${quantitaFmt} pezzi`)}
                                ${infoRow('Formato', data.formato)}
                                ${data.pagine ? infoRow('Numero pagine', data.pagine) : ''}
                                ${infoRow('Colori', data.colori)}
                                ${infoRow('Tipo di carta', data.carta)}
                            </table>

                            ${finiture.length > 0 ? `
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:16px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 8px 0; color:#64748b; font-size:13px;">Finiture speciali richieste:</p>
                                        <div>
                                            ${finiture.map(f => `<span style="display:inline-block; margin:0 6px 6px 0; padding:5px 12px; background-color:#f0fdfa; color:#0f766e; border:1px solid #99f6e4; border-radius:6px; font-size:12px; font-weight:600;">${escapeHtml(f)}</span>`).join('')}
                                        </div>
                                    </td>
                                </tr>
                            </table>` : ''}
                        </td>
                    </tr>

                    ${(data.hasFile === 'true' || data.hasFile === 'false' || data.fileInfo) ? `
                    <tr>
                        <td style="padding:24px 40px 8px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px 0; color:#0f172a; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">File grafici</p>
                                        <div style="height:2px; width:32px; background-color:#0d9488; border-radius:2px;"></div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:${data.hasFile === 'false' ? '#fffbeb' : '#f0fdf4'}; border:1px solid ${data.hasFile === 'false' ? '#fde68a' : '#bbf7d0'}; border-radius:8px;">
                                <tr>
                                    <td style="padding:14px 18px;">
                                        <p style="margin:0 0 4px 0; color:${data.hasFile === 'false' ? '#92400e' : '#166534'}; font-size:14px; font-weight:600;">
                                            ${data.hasFile === 'true' ? (hasAttachment ? 'File allegato a questa email' : 'Il cliente ha file pronti') : data.hasFile === 'false' ? 'Servizio di progettazione richiesto' : 'Informazioni sul file'}
                                        </p>
                                        ${data.fileInfo ? `<p style="margin:0; color:#475569; font-size:13px; line-height:18px;">${escapeHtml(data.fileInfo)}</p>` : ''}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>` : ''}

                    ${data.note ? `
                    <tr>
                        <td style="padding:24px 40px 8px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:8px;">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px 0; color:#0f172a; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Note del cliente</p>
                                        <div style="height:2px; width:32px; background-color:#0d9488; border-radius:2px;"></div>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border-left:3px solid #0d9488; border-radius:6px;">
                                <tr>
                                    <td style="padding:16px 20px; color:#334155; font-size:14px; line-height:22px; white-space:pre-wrap;">${escapeHtml(data.note)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>` : ''}

                    <tr>
                        <td style="padding:24px 40px 32px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="stack" width="50%" valign="top" style="padding-right:6px;">
                                        <a href="mailto:${escapeHtml(data.email)}" style="display:block; background-color:#0d9488; color:#ffffff; text-decoration:none; padding:14px 18px; border-radius:8px; font-size:14px; font-weight:600; text-align:center;">
                                            Rispondi al cliente
                                        </a>
                                    </td>
                                    <td class="stack" width="50%" valign="top" style="padding-left:6px;">
                                        <a href="tel:${escapeHtml(data.telefono)}" style="display:block; background-color:#ffffff; color:#0f172a; text-decoration:none; padding:13px 18px; border-radius:8px; font-size:14px; font-weight:600; text-align:center; border:1px solid #cbd5e1;">
                                            Chiama ${escapeHtml(data.telefono || '')}
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#0f172a; padding:24px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td>
                                        <p style="margin:0 0 4px 0; color:#94a3b8; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px;">Promemoria</p>
                                        <p style="margin:0; color:#ffffff; font-size:14px; line-height:20px;">
                                            Ricontattare entro 24 ore. ${hasAttachment ? 'Scaricare e analizzare il file allegato. ' : ''}Inviare preventivo dettagliato via email.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>

                <table role="presentation" width="680" border="0" cellspacing="0" cellpadding="0" style="max-width:680px; width:100%; margin-top:16px;">
                    <tr>
                        <td align="center" style="color:#94a3b8; font-size:11px; line-height:16px; padding:0 40px;">
                            Email automatica generata da idealstampa.com &middot; ${escapeHtml(nowIt)}
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
