function esc(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}

function row(label: string, value: string, isLast = false): string {
	const border = isLast ? '' : 'border-bottom:1px solid #f3f4f6;'
	return `<tr>
    <td style="padding:10px 0;${border}width:35%;vertical-align:top;">
      <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;">${label}</span>
    </td>
    <td style="padding:10px 0 10px 16px;${border}vertical-align:top;">
      <span style="font-size:14px;color:#111827;">${esc(value)}</span>
    </td>
  </tr>`
}

export interface ContactEmailData {
	name: string
	email: string
	phone: string
	message: string
}

export function contactEmailHtml(data: ContactEmailData): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:40px 16px;" align="center">
        <table role="presentation" width="100%" style="max-width:560px;">
          <tr>
            <td style="background:#1a1a1a;border-radius:8px 8px 0 0;padding:28px 32px;">
              <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Alt Homes</div>
              <div style="font-size:13px;color:#9ca3af;margin-top:4px;">New contact form submission</div>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Name', data.name)}
                ${row('Email', data.email)}
                ${row('Phone', data.phone, true)}
              </table>
              <div style="margin-top:24px;">
                <div style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;">Message</div>
                <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;font-size:14px;color:#111827;line-height:1.7;white-space:pre-wrap;">${esc(data.message)}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 8px 8px;padding:16px 32px;">
              <span style="font-size:12px;color:#9ca3af;">Sent via <a href="https://althomes.co" style="color:#6b7280;text-decoration:none;">althomes.co</a> contact form</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
