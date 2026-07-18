function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Converte il testo dell'admin in paragrafi HTML sicuri, preservando gli a-capo.
function toParagraphs(message) {
    const safe = escapeHtml(message || '').trim();
    if (!safe) return '';
    return safe
        .split(/\n{2,}/)
        .map(block => `<p style="margin:0 0 16px 0; color:#334155; font-size:16px; line-height:26px;">${block.replace(/\n/g, '<br>')}</p>`)
        .join('');
}

function render({ title = '', message = '', unsubscribeUrl = '#' } = {}) {
    const heading = escapeHtml(title).trim();

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <title>${heading || 'Newsletter Idealstampa'}</title>
    <style>
        @media only screen and (max-width: 620px) {
            .container { width: 100% !important; }
            .px-mobile { padding-left: 24px !important; padding-right: 24px !important; }
        }
    </style>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f4f6f8;">
        <tr>
            <td align="center" style="padding:32px 16px;">

                <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 1px 3px rgba(15,23,42,0.06);">

                    <tr>
                        <td style="background-color:#0f172a; padding:24px 40px;" class="px-mobile">
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td align="left" style="color:#ffffff; font-size:20px; font-weight:700; letter-spacing:-0.3px;">Idealstampa</td>
                                    <td align="right" style="color:#94a3b8; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Newsletter</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    ${heading ? `
                    <tr>
                        <td style="background:linear-gradient(135deg, #0d9488 0%, #0891b2 100%); background-color:#0d9488; padding:40px 40px;" class="px-mobile">
                            <h1 style="margin:0; color:#ffffff; font-size:28px; line-height:34px; font-weight:700; letter-spacing:-0.5px;">
                                ${heading}
                            </h1>
                        </td>
                    </tr>` : ''}

                    <tr>
                        <td style="padding:40px 40px 8px 40px;" class="px-mobile">
                            ${toParagraphs(message)}
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:8px 40px 40px 40px;" class="px-mobile">
                            <a href="https://wa.me/393770802322" style="display:inline-block; background-color:#0d9488; color:#ffffff; text-decoration:none; padding:14px 28px; border-radius:8px; font-size:15px; font-weight:600;">
                                Contattaci su WhatsApp
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#0f172a; padding:28px 40px;" class="px-mobile" align="center">
                            <p style="margin:0 0 8px 0; color:#ffffff; font-size:16px; font-weight:700;">Idealstampa</p>
                            <p style="margin:0 0 12px 0; color:#64748b; font-size:12px; line-height:18px;">
                                Via Dott. Angelo Camposeo, 23 &middot; 70010 Turi (BA)<br>
                                +39 377 080 2322 &middot; info@idealstampa.com
                            </p>
                            <p style="margin:0; color:#64748b; font-size:12px;">
                                Ricevi questa email perché sei iscritto agli aggiornamenti di Idealstampa.<br>
                                <a href="${escapeHtml(unsubscribeUrl)}" style="color:#94a3b8; text-decoration:underline;">Annulla l'iscrizione</a>
                            </p>
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
