# Pre-Deployment Checklist

**Target:** Hetzner / Coolify production deployment

---

## 1. Environment Variables

Set all of these in Coolify before deploying:

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `0uc19iuo` | From Sanity dashboard |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | |
| `SANITY_API_READ_TOKEN` | `sk...` | **Viewer scope only** — never Editor |
| `NEXT_PUBLIC_BASE_URL` | `https://yourdomain.com` | No trailing slash |
| `REVALIDATE_SECRET` | random string | Must match Sanity webhook secret |
| `RESEND_API_KEY` | `re_...` | From Resend dashboard |
| `RESEND_FROM_EMAIL` | `hello@yourdomain.com` | Must be verified domain in Resend |
| `RESEND_TO_EMAIL` | fallback email | Used if CMS fields not set |
| `RENTALWISE_API_HOST` | `https://app.onemineral.com` | **Swap from staging URL** |
| `RENTALWISE_API_TOKEN` | `...` | Production token |

---

## 2. Sanity CMS — Content Check

Open `/studio` and verify every singleton page has content:

- [ ] **Site settings** — logo, colours, social URLs, `contactFormEmail`, `partnerEnquiryEmail`
- [ ] **Home page** — heroHeadline, heroImage, 6 navLabels with correct links/positions
- [ ] **Our Homes page** — heroHeadline
- [ ] **The Alt Way page** — heroBackground, heroHeadline, missionImage, missionText, at least 1 valueProp, at least 1 stat, promiseText, promiseCTALabel, bottomCTAHeadline, bottomCTALabel, reviewsMaxShown
- [ ] **Experiences page** — heroBackground, heroHeadline, heroSubtext, discountBadgeText, cardsMaxShown
- [ ] **Join Us page** — heroImage, heroHeadline, pullQuote, bodyParagraph, bulletPoints, formCTAText, propertyImage, formHeadline
- [ ] **Contact page** — heroImage, sectionTitle, phone, email, officeCity, officeAddress, formHeadline
- [ ] **At least 1 property** — heroImage, gallery, description, all spec fields, location with googleMapsUrl
- [ ] **At least 1 experience** linked to a property
- [ ] **At least 1 review** (featured: true, published: true) for The Alt Way carousel
- [ ] **Privacy Policy** legal page exists at slug `privacy-policy` (required for form consent links)

---

## 3. Sanity Webhooks

In Sanity → API → Webhooks, create a webhook:

- URL: `https://yourdomain.com/api/revalidate`
- Secret: same value as `REVALIDATE_SECRET` env var
- Trigger on: all document mutations
- Filter: `_type in ["site","homePage","ourHomesPage","altWayPage","experiencesPage","joinUsPage","contactPage","legalPage","blog.post","property","experience","review","redirect"]`

---

## 4. Resend Setup

- [ ] Domain verified in Resend (SPF + DKIM records on DNS)
- [ ] `RESEND_FROM_EMAIL` uses that verified domain
- [ ] Set `site.contactFormEmail` in Sanity → Site Settings (where contact form emails go)
- [ ] Set `site.partnerEnquiryEmail` in Sanity → Site Settings (where partner enquiries go)
- [ ] Test: submit contact form → email arrives in inbox
- [ ] Test: submit partner form → email arrives in inbox

---

## 5. RentalWise

- [ ] Swap `RENTALWISE_API_HOST` from staging (`app.onemineralstaging.com`) to production (`app.onemineral.com`)
- [ ] Verify `RENTALWISE_API_TOKEN` is the production token
- [ ] Each property in Sanity has `rentalwisePropertyId` set (used for availability filtering)
- [ ] Test availability search on `/our-homes` — returns filtered results

---

## 6. Build + Type Safety

```bash
npm run typegen    # must be clean — 21 queries, 74 types, 0 errors
npm run typecheck  # must be clean — 0 errors
npm run build      # must succeed — 0 webpack errors
npm run test:unit  # 25 tests must pass
```

---

## 7. Manual Page Review

Open each page in production and verify:

- [ ] `/` — hero renders, nav links work
- [ ] `/our-homes` — property cards load, availability form visible
- [ ] `/our-homes/[slug]` — hero, gallery, specs, location, booking widget placeholder visible
- [ ] `/the-alt-way` — all 8 sections render, reviews carousel shows
- [ ] `/experiences` — hero, filter chips, experience cards render
- [ ] `/join-us` — hero, form renders with all 9 fields
- [ ] `/contact` — hero, contact details, social links, form renders
- [ ] `/privacy-policy` — page renders (required for form consent links)
- [ ] `/blog` — post grid renders, no raw `<img>` tags
- [ ] `/studio` — Sanity Studio loads and is accessible

---

## 8. Sanity Presentation View

- [ ] Open Studio → Presentation
- [ ] Click each singleton page — correct URL resolves in preview
- [ ] Edit a field live → change reflects on site without full reload

---

## 9. Forms End-to-End

- [ ] Contact form: fill + submit → success state shows → email arrives
- [ ] Partner form: fill + submit → success state shows → email arrives
- [ ] Both forms: submit empty → validation errors appear inline
- [ ] Both forms: fill `_hp` honeypot field via browser DevTools → submit → email NOT sent

---

## 10. SEO + Meta

- [ ] Each page has `metaTitle` and `metaDescription` set in CMS
- [ ] OG image endpoint `/api/og` returns an image
- [ ] `NEXT_PUBLIC_BASE_URL` set to production domain (used in OG image URL)
- [ ] `robots.txt` / `sitemap.xml` generate correctly (if configured)

---

## 11. Performance

- [ ] Hero images on all pages use `loading="eager"` (already coded — verify renders)
- [ ] No raw `<img>` tags anywhere (run E2E blog test as sanity check)
- [ ] Run Lighthouse on `/` and `/our-homes/[slug]` — LCP < 2.5s target

---

## 12. What Is NOT Done Yet (deferred)

| Item | Status |
|---|---|
| RentalWise booking widget (`rw-widget`) | Not wired — placeholder in hero |
| RentalWise availability API filtering | Stub returns null — shows all properties |
| E2E tests passing in CI | Written but not run against production data |
| Blog post detail page modules | Existing template — not regressed |
| Resend email HTML templates | Plain text only — no branded HTML email |
