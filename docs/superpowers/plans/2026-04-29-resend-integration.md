# Resend Email Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden existing Resend email infrastructure with rate limiting, origin validation, field length caps, HTML email templates, and a central CMS notification email field — so both forms reliably deliver well-formatted emails and resist spam/bot abuse.

**Architecture:** Two server actions (`contact.ts`, `partner-enquiry.ts`) share a rate limiter and origin checker from `src/lib/server/`. HTML templates are pure string functions in `src/lib/server/email-templates/`. Sanity `site` document gains a `formNotificationEmail` field as the default recipient, with per-form overrides preserved.

**Tech Stack:** Next.js 16 App Router, Resend SDK v6, Zod v4, Vitest, `next/headers` (async API)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/sanity/schemaTypes/documents/site.ts` | Modify | Add `formNotificationEmail` field |
| `src/sanity/types.ts` | Regenerate | Auto-generated — run typegen only |
| `src/lib/schemas/contact.ts` | Modify | Add field length caps |
| `src/lib/schemas/partner.ts` | Modify | Add field length caps |
| `src/lib/server/rate-limit.ts` | Create | In-memory rate limiter |
| `src/lib/server/origin-check.ts` | Create | Origin/Referer validator |
| `src/lib/server/email-templates/contact.ts` | Create | HTML template for contact email |
| `src/lib/server/email-templates/partner.ts` | Create | HTML template for partner enquiry email |
| `src/actions/contact.ts` | Modify | Wire rate limit, origin check, HTML template, Reply-To |
| `src/actions/partner-enquiry.ts` | Modify | Wire rate limit, origin check, HTML template, Reply-To |
| `tests/unit/rate-limit.test.ts` | Create | Unit tests for rate limiter |
| `tests/unit/origin-check.test.ts` | Create | Unit tests for origin validator |

---

## Task 1: Add `formNotificationEmail` to Sanity site schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/site.ts:251-262`

- [ ] **Step 1: Insert new field before `contactFormEmail`**

Open `src/sanity/schemaTypes/documents/site.ts`. Find the block at line 251 (the `contactFormEmail` defineField). Insert the new field immediately before it:

```typescript
defineField({
  name: 'formNotificationEmail',
  title: 'Form Notification Email',
  type: 'string',
  description:
    'Default address for all form submission notifications. Per-form overrides below take precedence.',
  group: 'forms',
}),
```

The block at lines 251–262 should now read:

```typescript
defineField({
  name: 'formNotificationEmail',
  title: 'Form Notification Email',
  type: 'string',
  description:
    'Default address for all form submission notifications. Per-form overrides below take precedence.',
  group: 'forms',
}),
defineField({
  name: 'contactFormEmail',
  title: 'Contact Form Email',
  type: 'string',
  group: 'forms',
}),
defineField({
  name: 'partnerEnquiryEmail',
  title: 'Partner Enquiry Email',
  type: 'string',
  group: 'forms',
}),
```

- [ ] **Step 2: Regenerate Sanity types**

```bash
npm run typegen
```

Expected: exits 0, `src/sanity/types.ts` updated. Check that `formNotificationEmail` appears in the `Site` type.

```bash
grep "formNotificationEmail" src/sanity/types.ts
```

Expected: one line with `formNotificationEmail?: string`

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemaTypes/documents/site.ts src/sanity/types.ts
git commit -m "feat(sanity): add formNotificationEmail field to site schema"
```

---

## Task 2: Tighten Zod schemas with field length caps

**Files:**
- Modify: `src/lib/schemas/contact.ts`
- Modify: `src/lib/schemas/partner.ts`

- [ ] **Step 1: Update contact schema**

Replace the full contents of `src/lib/schemas/contact.ts`:

```typescript
import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone is required').max(20, 'Phone too long'),
	message: z
		.string()
		.min(1, 'Message is required')
		.max(2000, 'Message must be 2000 characters or less'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
```

- [ ] **Step 2: Update partner schema**

Replace the full contents of `src/lib/schemas/partner.ts`:

```typescript
import { z } from 'zod'

export const partnerSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone number is required').max(20, 'Phone too long'),
	location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
	propertyType: z.string().min(1, 'Property type is required').max(100, 'Property type too long'),
	status: z.string().min(1, 'Status is required').max(100, 'Status too long'),
	operational: z.string().min(1, 'Operational status is required').max(100, 'Value too long'),
	photosLink: z.url('Must be a valid URL').max(500, 'URL too long'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type PartnerInput = z.infer<typeof partnerSchema>
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/schemas/contact.ts src/lib/schemas/partner.ts
git commit -m "feat(validation): add field length caps to contact and partner schemas"
```

---

## Task 3: Build in-memory rate limiter

**Files:**
- Create: `src/lib/server/rate-limit.ts`
- Create: `tests/unit/rate-limit.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/rate-limit.test.ts`:

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { checkRateLimit } from '@/lib/server/rate-limit'

describe('checkRateLimit', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('allows first request', () => {
		expect(checkRateLimit('contact', '1.2.3.4')).toBe(true)
	})

	it('allows up to limit requests', () => {
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
	})

	it('blocks request exceeding limit', () => {
		const ip = '10.0.0.2'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		expect(checkRateLimit('contact', ip)).toBe(false)
	})

	it('allows request after window expires', () => {
		const ip = '10.0.0.3'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		// advance past 15-minute window
		vi.advanceTimersByTime(15 * 60 * 1000 + 1)
		expect(checkRateLimit('contact', ip)).toBe(true)
	})

	it('tracks separate limits per form key', () => {
		const ip = '10.0.0.4'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		// blocked on contact
		expect(checkRateLimit('contact', ip)).toBe(false)
		// still allowed on partner (different key)
		expect(checkRateLimit('partner', ip)).toBe(true)
	})

	it('tracks separate limits per IP', () => {
		checkRateLimit('contact', '5.5.5.5')
		checkRateLimit('contact', '5.5.5.5')
		checkRateLimit('contact', '5.5.5.5')
		expect(checkRateLimit('contact', '5.5.5.5')).toBe(false)
		// different IP is unaffected
		expect(checkRateLimit('contact', '6.6.6.6')).toBe(true)
	})
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/unit/rate-limit.test.ts
```

Expected: FAIL — `checkRateLimit` not found.

- [ ] **Step 3: Implement the rate limiter**

Create `src/lib/server/rate-limit.ts`:

```typescript
interface Entry {
	count: number
	resetAt: number
}

const stores = new Map<string, Map<string, Entry>>()

export function checkRateLimit(
	key: string,
	ip: string,
	limit = 3,
	windowMs = 15 * 60 * 1000,
): boolean {
	if (!stores.has(key)) stores.set(key, new Map())
	const store = stores.get(key)!
	const now = Date.now()
	const entry = store.get(ip)

	if (!entry || now > entry.resetAt) {
		store.set(ip, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (entry.count >= limit) return false

	entry.count++
	return true
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/rate-limit.test.ts
```

Expected: all 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/rate-limit.ts tests/unit/rate-limit.test.ts
git commit -m "feat(security): add in-memory rate limiter for form server actions"
```

---

## Task 4: Build origin checker

**Files:**
- Create: `src/lib/server/origin-check.ts`
- Create: `tests/unit/origin-check.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/origin-check.test.ts`:

```typescript
import { describe, expect, it } from 'vitest'
import { isAllowedOrigin } from '@/lib/server/origin-check'

describe('isAllowedOrigin', () => {
	it('allows matching origin', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://althomes.co')).toBe(true)
	})

	it('allows origin with path (referer format)', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://althomes.co/contact')).toBe(true)
	})

	it('blocks different origin', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://evil.com')).toBe(false)
	})

	it('blocks null source', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin(null)).toBe(false)
	})

	it('allows any origin when BASE_URL not configured', () => {
		delete process.env.NEXT_PUBLIC_BASE_URL
		expect(isAllowedOrigin(null)).toBe(true)
	})
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run tests/unit/origin-check.test.ts
```

Expected: FAIL — `isAllowedOrigin` not found.

- [ ] **Step 3: Implement origin checker**

Create `src/lib/server/origin-check.ts`:

```typescript
import { headers } from 'next/headers'

export function isAllowedOrigin(source: string | null): boolean {
	const base = process.env.NEXT_PUBLIC_BASE_URL
	if (!base) return true
	if (!source) return false
	return source.startsWith(base)
}

export async function checkOrigin(): Promise<boolean> {
	const h = await headers()
	const source = h.get('origin') ?? h.get('referer')
	return isAllowedOrigin(source)
}

export async function getClientIp(): Promise<string> {
	const h = await headers()
	return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npx vitest run tests/unit/origin-check.test.ts
```

Expected: all 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/server/origin-check.ts tests/unit/origin-check.test.ts
git commit -m "feat(security): add origin/referer validation for form server actions"
```

---

## Task 5: Build HTML email templates

**Files:**
- Create: `src/lib/server/email-templates/contact.ts`
- Create: `src/lib/server/email-templates/partner.ts`

- [ ] **Step 1: Create contact email template**

Create `src/lib/server/email-templates/contact.ts`:

```typescript
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
```

- [ ] **Step 2: Create partner enquiry email template**

Create `src/lib/server/email-templates/partner.ts`:

```typescript
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
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/server/email-templates/
git commit -m "feat(email): add HTML templates for contact and partner notification emails"
```

---

## Task 6: Wire contact server action

**Files:**
- Modify: `src/actions/contact.ts`

- [ ] **Step 1: Replace full contents of `src/actions/contact.ts`**

```typescript
'use server'

import { Resend } from 'resend'
import type { ContactInput } from '@/lib/schemas/contact'
import { getSite } from '@/sanity/lib/data'
import { checkOrigin, checkRateLimit, getClientIp } from '@/lib/server/security'
import { contactEmailHtml } from '@/lib/server/email-templates/contact'

export async function submitContact(data: ContactInput) {
	if (data._hp) return { success: false, error: 'Bot detected' }

	if (!(await checkOrigin())) return { success: false, error: 'Forbidden' }

	const ip = await getClientIp()
	if (!checkRateLimit('contact', ip)) {
		return { success: false, error: 'Too many requests. Please wait before trying again.' }
	}

	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY not set')
		return { success: false, error: 'Email service not configured' }
	}

	const site = await getSite()
	const to =
		site?.contactFormEmail ?? site?.formNotificationEmail ?? process.env.RESEND_TO_EMAIL
	const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

	if (!to) {
		console.error('No contact form destination email configured')
		return { success: false, error: 'Email destination not configured' }
	}

	const resend = new Resend(apiKey)

	const { error } = await resend.emails.send({
		from,
		to,
		replyTo: data.email,
		subject: `New Contact: ${data.name}`,
		html: contactEmailHtml({
			name: data.name,
			email: data.email,
			phone: data.phone,
			message: data.message,
		}),
	})

	if (error) {
		console.error('Resend error (contact):', error)
		return { success: false, error: 'Failed to send message' }
	}

	return { success: true }
}
```

Note the import path uses `@/lib/server/security` — we need a barrel file for the two utilities. See step 2.

- [ ] **Step 2: Create security barrel `src/lib/server/security.ts`**

```typescript
export { checkRateLimit } from './rate-limit'
export { checkOrigin, getClientIp } from './origin-check'
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/actions/contact.ts src/lib/server/security.ts
git commit -m "feat(contact): wire rate limiting, origin check, and HTML email template"
```

---

## Task 7: Wire partner enquiry server action

**Files:**
- Modify: `src/actions/partner-enquiry.ts`

- [ ] **Step 1: Replace full contents of `src/actions/partner-enquiry.ts`**

```typescript
'use server'

import { Resend } from 'resend'
import type { PartnerInput } from '@/lib/schemas/partner'
import { getSite } from '@/sanity/lib/data'
import { checkOrigin, checkRateLimit, getClientIp } from '@/lib/server/security'
import { partnerEmailHtml } from '@/lib/server/email-templates/partner'

export async function submitPartner(data: PartnerInput) {
	if (data._hp) return { success: false, error: 'Bot detected' }

	if (!(await checkOrigin())) return { success: false, error: 'Forbidden' }

	const ip = await getClientIp()
	if (!checkRateLimit('partner', ip)) {
		return { success: false, error: 'Too many requests. Please wait before trying again.' }
	}

	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY not set')
		return { success: false, error: 'Email service not configured' }
	}

	const site = await getSite()
	const to =
		site?.partnerEnquiryEmail ?? site?.formNotificationEmail ?? process.env.RESEND_TO_EMAIL
	const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

	if (!to) {
		console.error('No partner enquiry destination email configured')
		return { success: false, error: 'Email destination not configured' }
	}

	const resend = new Resend(apiKey)

	const { error } = await resend.emails.send({
		from,
		to,
		replyTo: data.email,
		subject: `New Partner Enquiry: ${data.name}`,
		html: partnerEmailHtml({
			name: data.name,
			email: data.email,
			phone: data.phone,
			location: data.location,
			propertyType: data.propertyType,
			status: data.status,
			operational: data.operational,
			photosLink: data.photosLink,
		}),
	})

	if (error) {
		console.error('Resend error (partner):', error)
		return { success: false, error: 'Failed to send enquiry' }
	}

	return { success: true }
}
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

Expected: all tests pass.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/actions/partner-enquiry.ts
git commit -m "feat(partner): wire rate limiting, origin check, and HTML email template"
```

---

## Task 8: Configure environment and manual end-to-end test

**Files:** `.env.local` (already has API key per user)

- [ ] **Step 1: Verify `.env.local` has all required vars**

Check that `.env.local` contains:
```bash
RESEND_API_KEY=re_...           # already added
RESEND_FROM_EMAIL=onboarding@resend.dev
RESEND_TO_EMAIL=naskarakash2q@gmail.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 2: Set `formNotificationEmail` in Sanity Studio**

Start Sanity Studio at `/studio`, navigate to **Site → Forms**, set `Form Notification Email` to `naskarakash2q@gmail.com`. Save.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

Expected: server running on `http://localhost:3000`.

- [ ] **Step 4: Test contact form submission**

Navigate to `http://localhost:3000/contact`. Fill in:
- Name: Test User
- Email: naskarakash2q@gmail.com
- Phone: +91 98765 43210
- Message: This is an end-to-end test submission.
- Check privacy consent

Submit. Expected:
- Form shows success state ("Thanks for reaching out!")
- Email arrives at `naskarakash2q@gmail.com` within 30 seconds
- Email has Alt Homes branded header, table layout, correct Reply-To

- [ ] **Step 5: Test partner form submission**

Navigate to `http://localhost:3000/join-us`. Fill in all fields and submit. Expected:
- Form shows success state
- Email arrives with partner enquiry template, all 8 fields visible

- [ ] **Step 6: Test honeypot**

Open browser DevTools → Console. Run:

```javascript
// Simulate honeypot-filled submission
fetch('/join-us', { method: 'POST' })
```

This tests via the form itself — manually set the hidden `_hp` field value via DevTools:

```javascript
document.querySelector('input[name="_hp"]').value = 'bot'
```

Then submit the form. Expected: form returns error state, no email sent.

- [ ] **Step 7: Test rate limiting**

Submit the contact form 4 times rapidly using the same browser. Expected:
- First 3: success
- 4th: server error shown ("Something went wrong. Please try again.")

- [ ] **Step 8: Test origin check via curl**

```bash
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil.com" \
  -d '{"name":"Bot","email":"bot@evil.com","phone":"123","message":"spam","privacyConsent":true}'
```

Expected: response contains `{ "success": false }` or non-200 (Next.js server actions respond differently to direct POST — the action won't execute if the request isn't a valid server action call, so this primarily tests the in-action guard).

- [ ] **Step 9: Final typecheck and lint**

```bash
npm run typecheck && npm run lint
```

Expected: no errors.

- [ ] **Step 10: Commit**

```bash
git add .
git commit -m "test: verify Resend end-to-end — contact and partner forms deliver HTML emails"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] `formNotificationEmail` CMS field — Task 1
- [x] Zod field length caps — Task 2
- [x] Rate limiter (3 req / 15 min / IP, per form) — Task 3
- [x] Origin/Referer validation — Task 4
- [x] HTML email templates (contact + partner) — Task 5
- [x] Reply-To header — Tasks 6 & 7
- [x] Fallback chain (per-form → central → env) — Tasks 6 & 7
- [x] Honeypot preserved — Tasks 6 & 7
- [x] End-to-end manual test plan — Task 8

**Type consistency:**
- `checkRateLimit(key, ip)` — defined Task 3, imported via barrel Task 6 & 7 ✓
- `checkOrigin()` — defined Task 4, imported via barrel Task 6 & 7 ✓
- `getClientIp()` — defined Task 4, imported via barrel Task 6 & 7 ✓
- `contactEmailHtml(ContactEmailData)` — defined Task 5, called Task 6 ✓
- `partnerEmailHtml(PartnerEmailData)` — defined Task 5, called Task 7 ✓
- `site?.formNotificationEmail` — typed via typegen in Task 1 ✓
