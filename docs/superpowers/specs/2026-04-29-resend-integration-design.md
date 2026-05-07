# Resend Email Integration — Design Spec
Date: 2026-04-29

## Overview

Wire up Resend email delivery for both website forms (contact + partner enquiry) with server-side security hardening and HTML-formatted notification emails. No auto-reply to submitters. Recipient email managed centrally via Sanity CMS.

---

## Scope

- **Forms in scope:** `/contact` (ContactForm) and `/join-us` (PartnerForm)
- **Sender:** `onboarding@resend.dev` (Resend free tier)
- **Recipient:** Central Sanity field (`formNotificationEmail`), with optional per-form overrides
- **No auto-reply** to submitters
- **No Cloudflare Turnstile** — honeypot + rate limiting sufficient for this traffic level

---

## Architecture

```
Browser form
  → react-hook-form + Zod (client-side validation)
  → Next.js server action ('use server')
      1. Origin / Referer header check
      2. Honeypot check (_hp field)
      3. Zod parse with field length caps
      4. In-memory rate limit check (3 req / 15 min / IP)
      5. Resend.send() with HTML email body
  → Resend API → notification inbox
```

Shared utilities extracted to `src/lib/server/` — no logic duplication across actions.

---

## Security Layer

### Origin Validation
Validate `Origin` or `Referer` header against `NEXT_PUBLIC_BASE_URL` at top of each server action. Return `{ success: false }` on mismatch — no error detail leaked to caller.

### Rate Limiting
- File: `src/lib/server/rate-limit.ts`
- Store: in-memory `Map<string, { count: number; resetAt: number }>`
- Limit: 3 submissions per IP per 15 minutes, per form (separate limiters)
- IP source: `x-forwarded-for` header (Coolify proxy), fallback to `127.0.0.1`
- Resets on container restart — acceptable for low-traffic site; upgrade to Upstash Redis if needed later

### Zod Field Caps
| Field | Min | Max |
|---|---|---|
| name | 1 | 100 |
| email | valid email | — |
| phone | 1 | 20 |
| message | 1 | 2000 |
| location (partner) | 1 | 200 |
| propertyType (partner) | 1 | 100 |
| status (partner) | 1 | 100 |
| operational (partner) | 1 | 100 |
| photosLink (partner) | valid URL | 500 |

### Honeypot
`_hp` field already exists on both schemas. Keep as-is.

---

## Sanity CMS — New Field

Add `formNotificationEmail` to `src/sanity/schemaTypes/documents/site.ts` under the Forms section:

```ts
{
  name: 'formNotificationEmail',
  title: 'Form Notification Email',
  type: 'string',
  description: 'Default email address to receive all form submissions. Per-form overrides below take precedence.',
}
```

**Fallback chain (both actions):**
```
site.contactFormEmail ?? site.formNotificationEmail ?? process.env.RESEND_TO_EMAIL
site.partnerEnquiryEmail ?? site.formNotificationEmail ?? process.env.RESEND_TO_EMAIL
```

Run `npm run typegen` after schema change.

---

## Email Templates

Files: `src/lib/server/email-templates/contact.ts` and `partner.ts`  
Format: Inline HTML string function — no extra dependencies.

### Contact Email
- **Subject:** `New Contact: {name}`
- **Reply-To:** submitter's email
- **Body:** Alt Homes branded header, two-column table (label / value), message in full-width block, footer with source attribution

### Partner Enquiry Email
- **Subject:** `New Partner Enquiry: {name}`
- **Reply-To:** submitter's email
- **Body:** Alt Homes branded header, two-column table with all 8 fields, footer with source attribution

### Shared Design Tokens
- Header bg: `#1a1a1a`, text: `#ffffff`
- Body bg: `#ffffff`
- Label color: `#6b7280`
- Value color: `#111827`
- Font: system-ui, sans-serif
- No external image URLs (avoids broken images in email clients)

---

## File Map

| File | Change |
|---|---|
| `src/sanity/schemaTypes/documents/site.ts` | Add `formNotificationEmail` field |
| `src/sanity/types.ts` | Regenerated via `typegen` |
| `src/lib/schemas/contact.ts` | Add field length caps |
| `src/lib/schemas/partner.ts` | Add field length caps |
| `src/lib/server/rate-limit.ts` | New — in-memory rate limiter |
| `src/lib/server/origin-check.ts` | New — Origin/Referer validator |
| `src/lib/server/email-templates/contact.ts` | New — HTML template function |
| `src/lib/server/email-templates/partner.ts` | New — HTML template function |
| `src/actions/contact.ts` | Wire origin check, rate limit, HTML template, Reply-To |
| `src/actions/partner-enquiry.ts` | Wire origin check, rate limit, HTML template, Reply-To |

---

## Environment Variables

```bash
RESEND_API_KEY=re_...             # Resend dashboard → API Keys
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=naskarakash2q@gmail.com   # fallback if Sanity field empty
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # already set
```

---

## Manual Setup Steps

1. Create Resend account at resend.com
2. Dashboard → API Keys → Create key (full access)
3. Add `RESEND_API_KEY` to `.env.local`
4. Set `RESEND_FROM_EMAIL=onboarding@resend.dev` in `.env.local`
5. Set `RESEND_TO_EMAIL` to your Gmail in `.env.local`
6. In Sanity Studio → Site → set `formNotificationEmail` to your Gmail
7. Add same 3 vars to Coolify before production deploy

---

## Testing Plan

| Test | Expected |
|---|---|
| Submit contact form (valid) | Email arrives in Gmail with HTML layout, Reply-To = submitter email |
| Submit partner form (valid) | Email arrives in Gmail with HTML layout, Reply-To = submitter email |
| Submit with `_hp` filled | `{ success: false }` — no email sent |
| Submit 4× same IP rapidly | 4th request returns rate limit error |
| `curl` POST directly to action URL with wrong Origin | `{ success: false }` — blocked |
| Missing required field | Client validation blocks — never reaches server |

---

## Out of Scope

- Auto-reply to submitters
- Cloudflare Turnstile
- Custom sending domain (requires paid Resend plan)
- Upstash Redis rate limiter (upgrade path available if traffic grows)
- `react-email` templating library
