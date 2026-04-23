# Roadmap: AltHomes

**Milestone:** M1 — Launch-Ready Site
**Phases:** 8
**Requirements:** 54 v1 requirements
**Coverage:** 100% ✓

---

## Milestone 1 — Launch-Ready Site

### Phase 1 — Project Setup & Baseline
**Goal:** Clean dev environment with verified build pipeline before writing any domain code.
**Requirements:** SETUP-01, SETUP-02, SETUP-03, SETUP-04, SETUP-05, SETUP-06
**Day estimate:** Day 1 (~3 hours)
**Depends on:** nothing

**Plans:**
1. Configure `output: 'standalone'`, rename studio `/admin` → `/studio`, strip demo content
2. Wire all env vars (Sanity, RentalWise staging, Resend, app URL, revalidate secret)
3. Connect Vercel pipeline, verify build passes, configure Sanity CORS

**Success criteria:**
1. `npm run dev` loads site at `localhost:3000` and Studio at `localhost:3000/studio` with no errors
2. `npm run build` passes clean with zero TypeScript errors
3. Vercel preview URL accessible with all env vars populated
4. `output: 'standalone'` confirmed in `next.config.ts`
5. No references to `/admin` remain in codebase

---

### Phase 2 — Sanity Schema
**Goal:** All document types defined, registered, and usable in Studio. TypeGen generates clean types. Test data seeded.
**Requirements:** SCHEMA-01 through SCHEMA-17
**Day estimate:** Day 1–2 (~4–5 hours)
**Depends on:** Phase 1

**Plans:**
1. Reshape `siteSettings` (existing `site` doc) — logo, nav CTA, WhatsApp, socials, form emails, colour tokens, SEO fallback, announcement bar
2. Create `property`, `experience`, `review`, `amenity` documents — all fields per spec with alt text on every image
3. Create all singleton page schemas (`homePage`, `ourHomesPage`, `altWayPage`, `experiencesPage`, `joinUsPage`, `contactPage`) + `legalPage` multi-instance
4. Register all types in schema index, protect singletons from duplication, wire TypeGen as predev/prebuild hooks
5. Seed test data — amenities, 1 property (all fields), 3 reviews, all singletons

**Success criteria:**
1. Studio loads all document types without errors
2. `npm run typegen` generates `types.ts` with no errors
3. Singleton documents cannot be duplicated from Studio
4. `legalPage` can have multiple instances
5. Test property document has all required fields populated and is accessible in Studio
6. All image fields have `alt` text fields

---

### Phase 3 — Route Architecture & Data Layer
**Goal:** All routes defined. Data fetching wired to Sanity. Build passes clean with typed queries.
**Requirements:** ROUTE-01 through ROUTE-09
**Day estimate:** Day 2 (~2–3 hours)
**Depends on:** Phase 2

**Plans:**
1. Create `(site)/` route group with layout (Navbar, Footer, SanityLive, FABs stubs) — NOT in root layout
2. Scaffold all page routes with placeholder components: `/`, `/our-homes`, `/our-homes/[slug]`, `/the-alt-way`, `/experiences`, `/join-us`, `/contact`, `/[slug]` (legal), `/blog`, `/blog/[slug]`
3. Write all GROQ queries in `defineQuery()`, create `data.ts` fetch functions, add `generateMetadata` to every page
4. Custom `not-found.tsx`, legal slug validation, `studio/` route cleanup, build verification

**Success criteria:**
1. All routes return 200 (or correct 404 for unknown legal slugs) — no build errors
2. Every GROQ query uses `defineQuery()` — grep confirms zero plain `groq` tagged strings in queries.ts
3. `generateMetadata` exported on every page file
4. `<SanityLive />` is only in `(site)/layout.tsx` — grep confirms not in root layout or studio layout
5. `npm run build` passes clean

---

### Phase 4 — Frontend Build
**Goal:** All 10 pages pixel-perfect from Figma. Sanity-data-driven from day one. Lighthouse-ready structure.
**Requirements:** FE-01 through FE-12
**Day estimate:** Day 3–7
**Depends on:** Phase 3
**UI hint:** yes

**Plans:**
1. Global layout — Navbar, Footer (auto Our Homes column, static columns, socials), floating FABs (Book Direct + WhatsApp), announcement bar stub
2. Homepage — static collage asset, 6 navLabel buttons with percentage positioning (desktop + mobile)
3. Our Homes page — hero, search bar UI (placeholder, wired Phase 5), property cards alternating full-width, experiences CTA
4. Property detail page — hero, booking widget placeholder, intro (PortableText, specs strip, amenity icons, pull quote, gallery), location, highlights, experiences, amenities + house rules accordion, causes, reviews carousel, bottom CTA
5. The Alt Way — hero, mission split, value props 2×2, promise + CTA, stats bar, featured reviews carousel, bottom CTA
6. Experiences page — hero + badge, intro, property filter bar (client-side), cards 3-column, bottom CTA
7. Join Us + Contact pages — forms UI only (server actions wired Phase 6)
8. Legal page template + Blog listing + Blog post (module renderer)
9. PortableText renderer, `urlFor` image builder, `next/image` on every image, `priority` on hero images

**Success criteria:**
1. All 10 pages render with live Sanity data — no hardcoded placeholder content
2. Every image uses `next/image` — grep confirms no raw `<img>` tags in `src/ui/`
3. PortableText renders correctly on property description, house rules, legal body
4. Homepage collage buttons position correctly on desktop and mobile viewports
5. Property card grid renders all seeded active properties ordered by `displayOrder`
6. Reviews carousel renders on property detail and The Alt Way from correct queries

---

### Phase 5 — RentalWise Integration
**Goal:** Booking widget live on property detail. Availability search live on Our Homes. Both tested against staging.
**Requirements:** RW-01 through RW-05
**Day estimate:** Day 7–8 (~4–6 hours)
**Depends on:** Phase 4

**Plans:**
1. Booking widget — load `<rw-widget>` script via `<Script strategy="afterInteractive">`, assemble from property IDs, replace placeholder
2. Availability search — implement `searchAvailability` server action (`POST /rest/property/query`, `cache: 'no-store'`, server-side bearer token), wire to Our Homes search bar with all 5 states
3. End-to-end test — widget quote generation, booking redirect, availability filtering with known booked/available periods on staging

**Success criteria:**
1. `<rw-widget>` loads on property detail — no SSR attempt, no console errors
2. Selecting valid dates generates a quote inline; "Book Now" redirects to RentalWise checkout
3. Searching dates with a known booked period excludes that property from Our Homes results
4. No dates entered → all active properties shown ordered by `displayOrder`
5. API error triggers graceful fallback — all properties shown, no broken UI
6. `RENTALWISE_API_TOKEN` not visible in any browser network request

---

### Phase 6 — Forms
**Goal:** Both forms submit, Resend delivers email, zero Sanity writes.
**Requirements:** FORM-01 through FORM-05
**Day estimate:** Day 8 (~3 hours)
**Depends on:** Phase 4

**Plans:**
1. Install `react-hook-form`, `zod`, `@hookform/resolvers`, `resend`; wire both forms with validation + honeypot
2. Contact form server action — Zod schema, `_hp` honeypot, Resend to `contactFormEmail`, no Sanity write
3. Partner enquiry server action — Zod schema, `_hp` honeypot, Resend to `partnerEnquiryEmail ?? contactFormEmail`, no Sanity write
4. Resend setup + domain verification; test real email delivery on both forms

**Success criteria:**
1. Contact form submission delivers email to `siteSettings.contactFormEmail`
2. Partner form submission delivers email to `siteSettings.partnerEnquiryEmail` (falls back to contactFormEmail)
3. Honeypot field present on both forms — bot submission silently ignored, no email sent
4. Invalid form data returns validation errors — no email sent
5. No form data written to Sanity dataset (verify via Sanity content browser)
6. Privacy consent checkbox is required and links to `/privacy-policy`

---

### Phase 7 — Polish & Quality Gates
**Goal:** 95+ Lighthouse on Performance, Accessibility, Best Practices. 90+ SEO. Studio fully smoke-tested.
**Requirements:** QA-01 through QA-07
**Day estimate:** Day 9–10
**Depends on:** Phase 5, Phase 6

**Plans:**
1. Lighthouse audit on all page types; fix performance issues (priority props, font loading, no render-blocking scripts)
2. SEO audit — unique metadata on all pages, sitemap covering all routes, robots.txt excluding `/studio`, canonical URLs, OG images
3. Accessibility audit — alt text audit, colour contrast, keyboard navigation, ARIA labels, form labels, focus indicators
4. Studio smoke test — walk all client workflows (create property, toggle reviews, update singletons, colour tokens, blog post)
5. RentalWise smoke test — widget, search, error states

**Success criteria:**
1. Lighthouse scores on Vercel preview: 95+ Performance, 95+ Accessibility, 95+ Best Practices, 90+ SEO on homepage and property detail
2. `sitemap.xml` includes all routes including `/our-homes/[slug]`, `/experiences`, all legal page slugs
3. `/studio` excluded from `robots.txt`
4. Every image across all pages has meaningful `alt` text
5. All client Studio workflows complete without errors

---

### Phase 8 — Production Deploy
**Goal:** Zero code changes. Pure config migration. Live on production domain.
**Requirements:** PROD-01 through PROD-06
**Day estimate:** Day 12 (~2 hours)
**Depends on:** Phase 7

**Plans:**
1. Provision Hetzner CX22, install Coolify, configure Cloudflare DNS (A record, orange cloud, Full Strict SSL)
2. Coolify deployment — standalone build, switch `RENTALWISE_API_HOST` to production, set production `NEXT_PUBLIC_BASE_URL`, configure domain + SSL
3. Update Sanity CORS for production domain; production smoke test; UptimeRobot + auto-deploy webhook + Vercel cleanup

**Success criteria:**
1. Site loads on production domain with valid SSL (Cloudflare + Let's Encrypt)
2. All active properties render; availability search hits production RentalWise
3. Booking widget generates quote and redirects on production domain
4. Contact and partner forms deliver email on production
5. Studio + Live Content API work on production domain (publish test doc, verify propagation in <10s)
6. UptimeRobot monitoring active; Coolify auto-deploy confirmed; Vercel project deleted

---

## Summary

| Phase | Name | Requirements | Est. Days |
|---|---|---|---|
| 1 | Project Setup & Baseline | SETUP-01–06 | 1 |
| 2 | Sanity Schema | SCHEMA-01–17 | 1–2 |
| 3 | Route Architecture & Data Layer | ROUTE-01–09 | 1 |
| 4 | Frontend Build | FE-01–12 | 5 |
| 5 | RentalWise Integration | RW-01–05 | 1–2 |
| 6 | Forms | FORM-01–05 | 1 |
| 7 | Polish & Quality Gates | QA-01–07 | 2 |
| 8 | Production Deploy | PROD-01–06 | 1 |

**Total:** 12 business days · 54 requirements · 8 phases
