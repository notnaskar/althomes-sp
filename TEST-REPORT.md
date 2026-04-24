# Test Report — CMS TDD Phase

**Branch:** `feature/cms-tdd`  
**Date:** 2026-04-24  
**Total tests:** 88 (25 unit · 63 E2E)

---

## Unit Tests — 25 passing

Run: `npm run test:unit`  
Tool: Vitest 4.x

### Contact Form Schema (`tests/unit/forms/contact.schema.test.ts`) — 8 tests

| # | Test | Status |
|---|---|---|
| 1 | Valid data returns `success: true` | ✅ Pass |
| 2 | Missing name → error on `name` field | ✅ Pass |
| 3 | Missing email → error on `email` field | ✅ Pass |
| 4 | Invalid email format → error on `email` field | ✅ Pass |
| 5 | Missing phone → error on `phone` field | ✅ Pass |
| 6 | Missing message → error on `message` field | ✅ Pass |
| 7 | `privacyConsent: false` → error on `privacyConsent` field | ✅ Pass |
| 8 | Honeypot populated → server action returns `{ success: false }` | ✅ Pass |

### Partner Enquiry Schema (`tests/unit/forms/join-us.schema.test.ts`) — 12 tests

| # | Test | Status |
|---|---|---|
| 1 | Valid 9-field data + consent → `success: true` | ✅ Pass |
| 2 | Missing name → error on `name` | ✅ Pass |
| 3 | Missing email → error on `email` | ✅ Pass |
| 4 | Invalid email format → error on `email` | ✅ Pass |
| 5 | Missing phone → error on `phone` | ✅ Pass |
| 6 | Missing location → error on `location` | ✅ Pass |
| 7 | Missing propertyType → error on `propertyType` | ✅ Pass |
| 8 | Missing status → error on `status` | ✅ Pass |
| 9 | Missing operational → error on `operational` | ✅ Pass |
| 10 | Invalid `photosLink` URL → error on `photosLink` | ✅ Pass |
| 11 | `privacyConsent: false` → error on `privacyConsent` | ✅ Pass |
| 12 | Honeypot populated → server action returns `{ success: false }` | ✅ Pass |

### Availability Schema (`tests/unit/forms/availability.schema.test.ts`) — 5 tests

| # | Test | Status |
|---|---|---|
| 1 | Valid checkIn + checkOut + guests → `success: true` | ✅ Pass |
| 2 | Missing checkIn → error on `checkIn` | ✅ Pass |
| 3 | Missing checkOut → error on `checkOut` | ✅ Pass |
| 4 | checkOut before checkIn → error on `checkOut` (cross-field refine) | ✅ Pass |
| 5 | `guests: 0` → error on `guests` | ✅ Pass |

---

## E2E Tests — 63 tests

Run: `npm run test:e2e`  
Tool: Playwright 1.59.1 · Chromium  
Requires: `.env.local` + `npm run dev` on port 3001

### Home page (`tests/e2e/home.spec.ts`) — 3 tests

| # | Test |
|---|---|
| 1 | Renders `<h1>` heroHeadline |
| 2 | Renders exactly 6 nav links |
| 3 | Nav link click navigates away from `/` |

### Our Homes page (`tests/e2e/our-homes.spec.ts`) — 6 tests

| # | Test |
|---|---|
| 1 | Renders `<h1>` heroHeadline |
| 2 | Renders at least one property card link |
| 3 | Availability form has `#av-checkIn` input |
| 4 | Availability form has `#av-checkOut` input |
| 5 | Availability form has `#av-guests` input |
| 6 | Empty submit → validation error visible |

### Property Detail page (`tests/e2e/our-homes-slug.spec.ts`) — 11 tests

*Slug auto-discovered from first property card on `/our-homes`.*

| # | Test |
|---|---|
| 1 | Renders `section#booking` hero |
| 2 | Renders `<h1>` property title |
| 3 | Renders gallery (`img[data-nimg]`) |
| 4 | Renders specs strip (Guests / Bedrooms / Bathrooms) |
| 5 | Renders location section |
| 6 | Renders highlights — "WHAT'S WAITING FOR YOU?" |
| 7 | Renders amenities — "FOR US, IT'S COMFORT FIRST" |
| 8 | Renders bottom CTA — "FIND AVAILABILITY" |
| 9 | Causes section — page loads without error (conditional) |
| 10 | Reviews section — page loads without error (conditional) |
| 11 | Experiences section — page loads without error (conditional) |

### The Alt Way page (`tests/e2e/the-alt-way.spec.ts`) — 7 tests

| # | Test |
|---|---|
| 1 | Renders `<h1>` heroHeadline |
| 2 | Renders mission section |
| 3 | Renders at least one value prop card |
| 4 | Renders promise CTA link → `/our-homes` |
| 5 | Renders stats bar (`.text-5xl.font-bold` value visible) |
| 6 | Renders "What Our Guests Say" reviews section |
| 7 | Renders bottom CTA link → `/experiences` |

### Experiences page (`tests/e2e/experiences.spec.ts`) — 5 tests

| # | Test |
|---|---|
| 1 | Renders `<h1>` heroHeadline |
| 2 | Renders discount badge (`.bg-yellow-400`) |
| 3 | Renders at least one experience card link |
| 4 | Renders "All" property filter chip |
| 5 | Renders "BOOK A STAY" bottom CTA |

### Join Us page (`tests/e2e/join-us.spec.ts`) — 15 tests

| # | Test |
|---|---|
| 1 | Renders `<h1>` heroHeadline |
| 2 | Renders pullQuote italic text |
| 3 | Renders bullet points list |
| 4 | Renders body paragraph |
| 5 | Form has `#pf-name` input |
| 6 | Form has `#pf-email` input |
| 7 | Form has `#pf-phone` input |
| 8 | Form has `#pf-location` input |
| 9 | Form has `#pf-propertyType` input |
| 10 | Form has `#pf-status` input |
| 11 | Form has `#pf-operational` input |
| 12 | Form has `#pf-photosLink` input |
| 13 | Form has `#pf-consent` checkbox |
| 14 | Empty submit → validation errors visible |
| 15 | Valid submit → "Thank you" success state |

### Contact page (`tests/e2e/contact.spec.ts`) — 12 tests

| # | Test |
|---|---|
| 1 | Renders hero section |
| 2 | Renders `tel:` phone link |
| 3 | Renders `mailto:` email link |
| 4 | Renders office address label |
| 5 | Renders Facebook social link |
| 6 | Renders Instagram social link |
| 7 | Form has `#cf-name` input |
| 8 | Form has `#cf-email` input |
| 9 | Form has `#cf-phone` input |
| 10 | Form has `#cf-message` textarea |
| 11 | Empty submit → validation errors visible |
| 12 | Valid submit → "Thanks for reaching out" success state |

### Legal page (`tests/e2e/legal.spec.ts`) — 2 tests

*Tests against `/privacy-policy`.*

| # | Test |
|---|---|
| 1 | Renders `<h1>` displayTitle |
| 2 | Renders prose body content |

### Blog index page (`tests/e2e/blog.spec.ts`) — 2 tests

| # | Test |
|---|---|
| 1 | Renders at least one post card |
| 2 | Zero raw `<img>` tags — all images use `next/image` (`data-nimg`) |

---

## What is NOT covered

- Sanity Studio CRUD (manual — verified via `/studio` Presentation view)
- Resend email delivery (deferred to testing phase)
- RentalWise availability API (deferred to RentalWise phase)
- Blog post detail page (`/blog/[slug]`)
- Form `_hp` honeypot at network level (covered by unit test on action directly)
