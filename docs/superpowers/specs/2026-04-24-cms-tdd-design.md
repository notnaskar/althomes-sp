# CMS TDD — Schema Correctness, Page Completion & Forms

**Date:** 2026-04-24  
**Project:** althomes-sp  
**Approach:** Skeleton-first TDD (Playwright E2E + Vitest unit)

---

## Context

Four Sanity schemas diverge from the althomes-master.md spec. Multiple pages are stub/partial implementations missing entire sections. Three forms (contact, partner enquiry, availability search) have no UI. This spec covers:

1. Correcting all schema mismatches  
2. Completing all page layouts to spec  
3. Implementing form UIs with validation (Resend wiring deferred)  
4. Writing Playwright E2E + Vitest unit tests using skeleton-first TDD  

---

## TDD Approach

**Skeleton-first**: Write `describe`/`it` blocks with `test.todo()` markers before implementation. Each todo defines a success criterion. Implement schema → page → form, then replace todos with real assertions. Tests go red → green through implementation.

**Test tools:**
- Playwright — E2E tests against `npm run dev` (localhost)
- Vitest — unit tests for Zod validation schemas

**Test file layout:**
```
tests/
  e2e/
    home.spec.ts
    our-homes.spec.ts
    our-homes-slug.spec.ts
    the-alt-way.spec.ts
    experiences.spec.ts
    join-us.spec.ts
    contact.spec.ts
    legal.spec.ts
    blog.spec.ts
  unit/
    forms/
      contact.schema.test.ts
      join-us.schema.test.ts
      availability.schema.test.ts
```

**CMS CRUD coverage**: No Studio automation. Covered via page render tests (field present in CMS → appears on page). Manual checklist covers Sanity Presentation + structure sidebar.

---

## Phase 0 — Test Tooling Setup

Neither Playwright nor Vitest is installed. Install before writing skeletons:

```bash
npm install -D @playwright/test vitest @vitejs/plugin-react
npx playwright install chromium
```

Add `playwright.config.ts` (baseURL: `http://localhost:3001`) and `vitest.config.ts` at project root. Add scripts to `package.json`:
```json
"test:e2e": "playwright test",
"test:unit": "vitest run"
```

---

## Phase 1 — Test Skeletons

Write skeleton test files for all pages and form schemas before any implementation. Each `it()` block uses `test.todo()` to define what must pass.

### E2E skeleton expectations per page

| Page | Key expectations |
|---|---|
| `/` | heroHeadline renders; 6 navLabel buttons present with correct links |
| `/our-homes` | heroHeadline renders; property cards grid; availability search form (checkIn, checkOut, guests) |
| `/our-homes/[slug]` | hero image; title; description; gallery; specs strip; location section; highlights; experiences; amenities + house rules; causes; reviews; bottom CTA |
| `/the-alt-way` | heroHeadline; mission section; value props (4 items); promise CTA; stats bar (4 items); reviews carousel; bottom CTA |
| `/experiences` | heroHeadline; experience card grid; property filter; bottom CTA |
| `/join-us` | heroHeadline; pullQuote; body paragraph; bullets; form (9 fields + consent + submit) |
| `/contact` | hero; contact details (phone, email, address); socials; form (4 fields + consent + submit) |
| `/[slug]` (legal) | displayTitle; body content |
| `/blog` | post cards grid; images use next/image (no raw img) |

### Unit skeleton expectations

| Schema | Key validations |
|---|---|
| contact Zod | name/email/phone/message required; email format; honeypot must be empty |
| partner Zod | all 9 fields required; email format; photosLink valid URL; honeypot must be empty |
| availability Zod | checkIn/checkOut required; checkOut > checkIn; guests ≥ 1 |

---

## Phase 2 — Schema Corrections

Run `npm run typegen` after each schema file change. Update queries to project new fields.

### `contactPage` schema — replace `contactDetails[]` + blockContent `officeAddress`

**Remove:** `contactDetails[]`, `officeAddress` (blockContent)  
**Add:**
```
heroImage       image     hotspot: true
sectionTitle    string
phone           string
email           string
officeCity      string
officeAddress   text
formHeadline    string    (already exists — keep)
seo             seo       (already exists — keep)
```
Socials (Facebook, Instagram) display from `site` doc — no change needed.

### `joinUsPage` schema — replace `introBody + benefits[]`

**Remove:** `introBody` (blockContent), `benefits[]`  
**Add:**
```
heroHeadline    string    (already exists — keep)
pullQuote       text
heroImage       image     hotspot: true
bodyParagraph   text
bulletPoints    array of string
formCTAText     string
propertyImage   image     hotspot: true
formHeadline    string    (already exists — keep)
seo             seo       (already exists — keep)
```

### `altWayPage` schema — add 10 missing fields

**Remove:** `introBody` (blockContent), `sections[]`  
**Add:**
```
heroHeadlineLine2 string    (spec splits hero into 2 lines for stacked display)
heroBackground    image     hotspot: true
missionImage      image     hotspot: true
missionText       text
valuePropHeadline string
valueProps        array of {title: string, body: text}  (validation: max 4)
editorialImages   image[]   hotspot: true each
promiseText       string
promiseCTALabel   string
statsHeadline     string
stats             array of {value: string, label: string, subtext: string}  (validation: max 4)
bottomCTAHeadline string
bottomCTALabel    string
heroHeadline      string    (already exists — keep)
reviewsMaxShown   number    (already exists — keep)
seo               seo       (already exists — keep)
```

### `experiencesPage` schema — add 2 missing fields

**Add:**
```
heroSubtext       text
heroBackground    image     hotspot: true
```
**Note:** `introBody` kept as blockContent (spec says plain text, but richer formatting is harmless here — explicit deviation).

### Query updates required

After typegen, expand these queries in `src/sanity/lib/queries.ts`:

| Query constant | New projections needed |
|---|---|
| `CONTACT_PAGE_QUERY` | `heroImage { asset-> }`, individual fields auto-projected via `...` |
| `JOIN_US_PAGE_QUERY` | `heroImage { asset-> }`, `propertyImage { asset-> }` |
| `ALT_WAY_PAGE_QUERY` | `heroBackground { asset-> }`, `missionImage { asset-> }`, `editorialImages[]{ asset-> }`, `valueProps`, `stats` |
| `EXPERIENCES_PAGE_QUERY` | `heroBackground { asset-> }` |
| `PROPERTY_QUERY` | `gallery[]{ asset-> }`, `heroImage { asset-> }`, `highlights[]{ ..., image { asset-> } }`, `causeImages[]{ asset-> }`, `amenities[]->`, `experiences[]->{title, slug, image{ asset-> }}` |
| `ALT_WAY_PAGE_QUERY` | Add review join: `"reviews": *[_type=='review' && featured==true && published==true][0...^.reviewsMaxShown]{guestName, rating, body, guestLocation, stayDate}` |

---

## Phase 3 — Page Completion

All pages implement full sectioned layouts matching the spec. Component architecture: each major section is a sub-component in `src/ui/pages/<page>/`. All images via `next/image` through existing `Img` component (`src/ui/img.tsx`). PortableText via `next-sanity`.

### `/contact` page
Sections: hero (fullscreen bg image + formHeadline overlay) → two-column: left (sectionTitle + phone/email/city/address + FB/IG links from `site`) + right (contact form).

### `/join-us` page
Sections: hero (bg image + heroHeadline + pullQuote) → body (bodyParagraph + bulletPoints + formCTAText + propertyImage) → form (formHeadline + partner form).

### `/the-alt-way` page
Sections: hero → mission split (missionImage left, missionText right) → value props 2×2 grid → promise CTA → stats bar (4 stats) → reviews carousel (`reviewsMaxShown` items from featured+published reviews) → bottom CTA.

### `/experiences` page
Sections: hero (bg + headline + subtext + badge) → intro → property filter bar (chips from active property names) → experience card grid (filtered by selected property OR all if none; capped by `cardsMaxShown` when unfiltered) → bottom CTA.

### `/our-homes/[slug]` property detail page
Sections (in order per spec):
1. Hero (heroImage + title + booking widget placeholder)
2. Intro (description + propertyType + maxGuests/bedrooms/bathrooms + amenity icon strip + pullQuote + gallery)
3. Location (locationHeadline + locationDescription + Google Maps link)
4. Highlights (array items with title + body + optional image)
5. Experiences (section label + experience cards, capped by `experiencesMaxShown`)
6. Amenities (full amenity list + houseRulesTeaser + houseRules accordion)
7. Causes (causeHeadline + causeBody + 2 cause images)
8. Reviews (published reviews for this property, capped by `reviewsMaxShown`)
9. Bottom CTA (ctaHeadline + "FIND AVAILABILITY" button → scrolls to widget)

### `/blog` page
Replace raw `<img>` with `next/image` via `Img` component. No other changes.

---

## Phase 4 — Forms

### Tech
- `react-hook-form` + `zod` + `@hookform/resolvers`
- Server actions in `src/actions/` (stub: log + return `{ success: true }`)
- Honeypot field `_hp` on contact + partner forms (server silently ignores if non-empty)
- All forms are Client Components (`'use client'`)

### File layout
```
src/
  actions/
    contact.ts          # stub server action
    partner-enquiry.ts  # stub server action
    availability.ts     # stub server action
  ui/
    forms/
      contact-form.tsx
      partner-form.tsx
      availability-form.tsx
    availability-search/
      index.tsx         # wraps form + passes results to property grid
```

### Contact form fields
| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| email | email | Yes |
| phone | text | Yes |
| message | textarea | Yes |
| privacyConsent | checkbox | Yes (links to `/privacy-policy`) |
| _hp | hidden | — (honeypot) |

### Partner enquiry form fields
| Field | Label | Required |
|---|---|---|
| name | NAME | Yes |
| email | EMAIL | Yes |
| phone | PHONE NUMBER | Yes |
| location | LOCATION | Yes |
| propertyType | TYPE OF PROPERTY | Yes |
| status | STATUS | Yes |
| operational | OPERATIONAL | Yes |
| photosLink | PHOTOS / WEBSITE LINK | Yes (url) |
| privacyConsent | Privacy Policy consent | Yes (checkbox) |
| _hp | hidden | — (honeypot) |

### Availability search fields
| Field | Type | Required |
|---|---|---|
| checkIn | date input | Yes |
| checkOut | date input | Yes (must be > checkIn) |
| guests | number input | Yes (min 1) |

Server action stub returns `null` (no filtering). Availability filter wired in RentalWise integration phase. The `/our-homes` page renders all properties when stub returns null.

---

## Phase 5 — Test Assertions

Replace all `test.todo()` markers with real assertions. Tests should pass after Phases 2–4 complete.

### E2E test approach
- Use `page.goto('http://localhost:3001/<path>')` (or configured base URL)
- Assert visible text for CMS headlines (use real data from production Sanity dataset)
- Assert form fields present by label text
- Assert form validation: submit empty → error messages appear
- Assert form success state: submit valid → success message appears
- Assert next/image usage: no raw `<img>` tags in rendered HTML

### Unit test approach
- Test each Zod schema with valid data → `schema.safeParse()` returns `success: true`
- Test with each required field missing → `success: false` with correct error path
- Test availability: checkOut before checkIn → `success: false`
- Test honeypot: `_hp` populated → server action returns early (test the action directly)

---

## Verification

End-to-end verification:
1. `npm run typecheck` — zero errors
2. `npm run typegen` — clean output, all new fields typed
3. `npx playwright test` — all E2E tests pass
4. `npx vitest run` — all unit tests pass
5. Manual: open `/studio`, verify all 4 fixed schemas render correct fields
6. Manual: open Sanity Presentation view, click each singleton page → correct URL resolves, live edits reflect
7. Manual: fill + submit each form → success state renders, no console errors

---

## What this spec does NOT cover

- Resend wiring (forms send emails) — deferred, wired in testing phase
- RentalWise availability search API wiring — deferred to RentalWise phase
- RentalWise booking widget (`rw-widget`) — deferred
- Blog post page modules — existing, not regressed
- Site colours injection — existing `site.colours` logic not changed
- Deploy to Hetzner — separate phase
