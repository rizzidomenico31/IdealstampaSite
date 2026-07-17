function escapeHtml(value) {
    if (value === undefined || value === null) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function render({ clientName = '', message = '' } = {}) {
    const nome = String(clientName || '').trim();
    const messageHtml = escapeHtml(message).replace(/\n/g, '<br>');

    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light">
    <title>Risposta alla tua richiesta - Idealstampa</title>
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
                                    <td align="right" style="color:#94a3b8; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:1px;">Dal 1995</td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background:linear-gradient(135deg, #0d9488 0%, #0891b2 100%); background-color:#0d9488; padding:36px 40px;" class="px-mobile">
                            <h1 style="margin:0; color:#ffffff; font-size:26px; line-height:32px; font-weight:700; letter-spacing:-0.5px;">
                                Risposta alla tua richiesta
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px 40px 8px 40px;" class="px-mobile">
                            <p style="margin:0 0 16px 0; color:#0f172a; font-size:16px; line-height:24px;">
                                Gentile <strong>${escapeHtml(nome) || 'cliente'}</strong>,
                            </p>
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border-left:3px solid #0d9488; border-radius:6px; margin:0 0 24px 0;">
                                <tr>
                                    <td style="padding:20px 24px; color:#334155; font-size:15px; line-height:24px;">${messageHtml}</td>
                                </tr>
                            </table>
                            <p style="margin:0 0 24px 0; color:#475569; font-size:15px; line-height:22px;">
                                Per qualsiasi domanda può rispondere direttamente a questa email o contattarci su
                                <a href="https://wa.me/393770802322" style="color:#0d9488; text-decoration:none; font-weight:600;">WhatsApp</a>.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color:#0f172a; padding:28px 40px;" class="px-mobile" align="center">
                            <p style="margin:0 0 8px 0; color:#ffffff; font-size:16px; font-weight:700;">Idealstampa</p>
                            <p style="margin:0; color:#64748b; font-size:12px; line-height:18px;">
                                Via Dott. Angelo Camposeo, 23 &middot; 70010 Turi (BA)<br>
                                +39 377 080 2322 &middot; info@idealstampa.com
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
