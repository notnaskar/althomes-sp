# Requirements: AltHomes

**Defined:** 2026-04-24
**Core Value:** Guests can discover AltHomes properties, check real-time availability, and be sent directly to the booking checkout — with zero friction between browsing and booking.

---

## v1 Requirements

### Project Setup

- [ ] **SETUP-01**: Standalone output (`output: 'standalone'`) configured in `next.config.ts` before any other code change
- [ ] **SETUP-02**: Sanity Studio renamed from `/admin` to `/studio` (directory + config)
- [ ] **SETUP-03**: Demo content and marketing-specific schema fields stripped; core template preserved
- [ ] **SETUP-04**: All environment variables configured (Sanity, RentalWise staging, Resend, app URL, revalidate secret)
- [ ] **SETUP-05**: Vercel deployment pipeline connected with all env vars; build passes clean
- [ ] **SETUP-06**: Sanity CORS origins configured (localhost, Vercel preview URL)

### Sanity Schema

- [ ] **SCHEMA-01**: `siteSettings` (reshaped `site` doc) — logo, nav CTA, WhatsApp, Book Direct, socials, form emails, colour tokens, default SEO, announcement bar
- [ ] **SCHEMA-02**: `property` document — all fields per spec (identity, RentalWise IDs, card fields, detail sections, SEO)
- [ ] **SCHEMA-03**: `experience` document — title, slug, description, image, property refs, displayOrder, SEO
- [ ] **SCHEMA-04**: `review` document — guestName, property ref, guestLocation, rating, stayDate, body, published, featured
- [ ] **SCHEMA-05**: `amenity` document — name, icon
- [ ] **SCHEMA-06**: `homePage` singleton — hero headline, collage navLabel array (6 items with x/y positions)
- [ ] **SCHEMA-07**: `ourHomesPage` singleton — headline, hero image, experiences CTA fields
- [ ] **SCHEMA-08**: `altWayPage` singleton — all sections, reviewsMaxShown
- [ ] **SCHEMA-09**: `experiencesPage` singleton — hero, intro, badge, cardsMaxShown
- [ ] **SCHEMA-10**: `joinUsPage` singleton — all content sections, formHeadline
- [ ] **SCHEMA-11**: `contactPage` singleton — contact details, office, socials, formHeadline
- [ ] **SCHEMA-12**: `legalPage` multi-instance — displayTitle, seoTitle, slug, body (blockContent), backgroundImage
- [ ] **SCHEMA-13**: All singleton types protected from duplication in `sanity.config.ts`
- [ ] **SCHEMA-14**: All schemas registered in `schemaTypes/index.ts`
- [ ] **SCHEMA-15**: Alt text field on every image field across all schemas
- [ ] **SCHEMA-16**: TypeGen scripts wired as `predev` and `prebuild` hooks; `types.ts` committed
- [ ] **SCHEMA-17**: Test data seeded — amenities, 1 property, 3 reviews, all singletons published

### Route Architecture & Data Layer

- [ ] **ROUTE-01**: `(site)/` route group with layout (Navbar, Footer, SanityLive, FABs) — SanityLive NOT in root layout
- [ ] **ROUTE-02**: All page routes scaffolded: `/`, `/our-homes`, `/our-homes/[slug]`, `/the-alt-way`, `/experiences`, `/join-us`, `/contact`, `/[slug]` (legal), `/blog`, `/blog/[slug]`
- [ ] **ROUTE-03**: `studio/[[...tool]]/page.tsx` — no SanityLive here
- [ ] **ROUTE-04**: All GROQ queries wrapped in `defineQuery()` — no plain `groq` tagged templates
- [ ] **ROUTE-05**: `src/sanity/lib/data.ts` — one typed fetch function per query
- [ ] **ROUTE-06**: `generateMetadata` exported on every page with unique title + description from Sanity
- [ ] **ROUTE-07**: Legal page `[slug]` route validates against known legal slugs, returns 404 for unknown
- [ ] **ROUTE-08**: Custom `not-found.tsx` at app root
- [ ] **ROUTE-09**: Build passes clean with zero TypeScript errors after TypeGen

### Frontend

- [ ] **FE-01**: Global layout — Navbar (logo, CTA from siteSettings), Footer (auto Our Homes column, static columns, socials), floating Book Direct + WhatsApp buttons, announcement bar stub
- [ ] **FE-02**: Homepage — hero collage (static asset), 6 navLabel buttons with percentage-based positioning (desktop + mobile)
- [ ] **FE-03**: Our Homes page — hero, search bar UI (wired in integration phase), property cards (alternating full-width), experiences CTA
- [ ] **FE-04**: Property detail page — hero, booking widget placeholder, intro (PortableText, specs, amenity icons, pull quote, gallery), location, highlights, experiences section, amenities checklist, house rules accordion, causes, reviews carousel, bottom CTA
- [ ] **FE-05**: The Alt Way page — hero, mission split, value props 2×2 with images, promise + CTA, stats bar, featured reviews carousel, bottom CTA
- [ ] **FE-06**: Experiences page — hero with badge, intro, property filter bar (client-side), experience cards 3-column, bottom CTA
- [ ] **FE-07**: Join Us page — hero + pull quote, body content + bullet list + property image, partner form UI (server action wired in forms phase)
- [ ] **FE-08**: Contact page — hero, split layout (contact details left, form right), contact form UI (server action wired in forms phase)
- [ ] **FE-09**: Legal page template — background image, styled display title, PortableText body
- [ ] **FE-10**: Blog listing + blog post (SanityPress module renderer — keep as-is, scoped to blog post only)
- [ ] **FE-11**: PortableText renderer with custom components (`@portabletext/react`)
- [ ] **FE-12**: `urlFor` image builder with hotspot/crop; `next/image` on every image; `priority` on all hero images

### RentalWise Integration

- [ ] **RW-01**: Booking widget (`<rw-widget>`) loaded via `<Script strategy="afterInteractive">` on property detail — never SSR
- [ ] **RW-02**: Widget assembled in code from `property.rentalwisePropertyId` + `property.rentalwiseIdentifier` — client never edits raw snippet
- [ ] **RW-03**: `searchAvailability` server action — `POST /rest/property/query` with bearer token server-side only, `cache: 'no-store'`
- [ ] **RW-04**: Our Homes search bar wired to `searchAvailability` — default (no dates): all active, searching: loading, results: filtered, no results: message + `/contact` link, error: graceful fallback (show all)
- [ ] **RW-05**: End-to-end test: booking widget generates quote + redirects to checkout; availability search correctly filters booked properties

### Forms

- [ ] **FORM-01**: Contact form server action — Zod validation, honeypot (`_hp`), Resend delivery to `siteSettings.contactFormEmail`, no Sanity write
- [ ] **FORM-02**: Partner enquiry server action — Zod validation, honeypot, Resend delivery to `partnerEnquiryEmail ?? contactFormEmail`, no Sanity write
- [ ] **FORM-03**: `react-hook-form` + `zod` + `@hookform/resolvers` wired on both forms
- [ ] **FORM-04**: Resend sender domain verified; both forms tested with real email delivery
- [ ] **FORM-05**: Privacy consent checkbox on both forms, links to `/privacy-policy`

### Quality & Performance

- [ ] **QA-01**: 95+ Lighthouse on Performance, Accessibility, Best Practices on all page types
- [ ] **QA-02**: 90+ Lighthouse SEO on all page types
- [ ] **QA-03**: All pages have unique `generateMetadata` (title, description, OG image)
- [ ] **QA-04**: `sitemap.xml` includes all routes including `/our-homes/[slug]`, experiences, legal pages
- [ ] **QA-05**: `robots.txt` excludes `/studio` from crawling
- [ ] **QA-06**: Colour contrast passes WCAG AA; all images have alt text; all form inputs have labels; focus indicators visible
- [ ] **QA-07**: Studio smoke test — all client workflows exercised end-to-end

### Production Deploy

- [ ] **PROD-01**: Hetzner CX22 server provisioned with Coolify installed
- [ ] **PROD-02**: Cloudflare DNS configured (A record → Hetzner, orange cloud proxy, Full Strict SSL)
- [ ] **PROD-03**: Coolify deployment with standalone build; `RENTALWISE_API_HOST` switched to production
- [ ] **PROD-04**: Sanity CORS updated for production domain
- [ ] **PROD-05**: Production smoke test — all critical paths verified
- [ ] **PROD-06**: UptimeRobot monitoring + Coolify auto-deploy webhook + Vercel project deleted

---

## v2 Requirements

### Visual Editing

- **VE-01**: Sanity Presentation Tool configured with production preview URL
- **VE-02**: Draft mode enable/disable API routes (`/api/draft-mode/enable`, `/api/draft-mode/disable`)
- **VE-03**: `<VisualEditing />` conditionally rendered when `draftMode().isEnabled`

### Testing Period (May 2026)

- **TEST-01**: Bug fixes from client feedback (per service agreement)
- **TEST-02**: SEO content review — meta descriptions, property descriptions, alt text audit
- **TEST-03**: Retainer onboarding and handoff documentation

---

## Out of Scope

| Feature | Reason |
|---|---|
| iCal integration | Removed entirely — `<rw-widget>` handles availability natively |
| Payment on AltHomes | RentalWise checkout handles payments; no custom checkout needed |
| Form data in Sanity | Free tier dataset is public; personal data goes to Resend only |
| Vercel production hosting | Non-commercial ToS; preview-only |
| OAuth/social login | No user accounts on this site |
| Mobile app | Web-first only |
| Vercel-specific APIs | Production target is Hetzner + Coolify |
| iFrame / third-party booking embeds | RentalWise widget is the booking solution |
| Blog CMS redesign | Keep SanityPress module renderer as-is |
| Multi-language | English only per spec |

---

## Traceability

| Requirement | Phase | Status |
|---|---|---|
| SETUP-01 to SETUP-06 | Phase 1 | Pending |
| SCHEMA-01 to SCHEMA-17 | Phase 2 | Pending |
| ROUTE-01 to ROUTE-09 | Phase 3 | Pending |
| FE-01 to FE-12 | Phase 4 | Pending |
| RW-01 to RW-05 | Phase 5 | Pending |
| FORM-01 to FORM-05 | Phase 6 | Pending |
| QA-01 to QA-07 | Phase 7 | Pending |
| PROD-01 to PROD-06 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 54 total
- Mapped to phases: 54
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-24*
*Last updated: 2026-04-24 after initial definition*
