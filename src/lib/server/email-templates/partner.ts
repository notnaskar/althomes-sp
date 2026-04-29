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
    <td style="padding:10px 0;${border}width:40%;vertical-align:top;">
      <span style="font-size:11px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;">${label}</span>
    </td>
    <td style="padding:10px 0 10px 16px;${border}vertical-align:top;">
      <span style="font-size:14px;color:#111827;">${esc(value)}</span>
    </td>
  </tr>`
}

export interface PartnerEmailData {
	name: string
	email: string
	phone: string
	location: string
	propertyType: string
	status: string
	operational: string
	photosLink: string
}

export function partnerEmailHtml(data: PartnerEmailData): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Partner Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding:40px 16px;" align="center">
        <table role="presentation" width="100%" style="max-width:560px;">
          <tr>
            <td style="background:#1a1a1a;border-radius:8px 8px 0 0;padding:28px 32px;">
              <div style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">Alt Homes</div>
              <div style="font-size:13px;color:#9ca3af;margin-top:4px;">New partner enquiry</div>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${row('Name', data.name)}
                ${row('Email', data.email)}
                ${row('Phone', data.phone)}
                ${row('Location', data.location)}
                ${row('Property Type', data.propertyType)}
                ${row('Status', data.status)}
                ${row('Operational', data.operational)}
                ${row('Photos / Website', data.photosLink, true)}
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 8px 8px;padding:16px 32px;">
              <span style="font-size:12px;color:#9ca3af;">Sent via <a href="https://althomes.co" style="color:#6b7280;text-decoration:none;">althomes.co</a> partner form</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
