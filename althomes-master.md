# AltHomes — Master Implementation Document
### Execution Plan + Content Configuration

**Client:** Alt Homes (Ref: AH-2026-001)  
**Consultant:** Akash Naskar  
**Delivery:** 12 business days  
**Stack:** `sanitypress-with-typegen` · Next.js 15 · Sanity v3 · Tailwind 4 · Vercel (preview) → Hetzner + Coolify + Cloudflare (production)  
**Performance target:** 95+ Lighthouse on Performance, Accessibility, Best Practices · 90+ SEO  

---

## Table of Contents

1. [Pre-Start Checklist](#pre-start-checklist)
2. [Decisions & Constraints](#decisions--constraints)
3. [RentalWise Integration Architecture](#rentalwise-integration-architecture)
4. [Content & Schema Configuration](#content--schema-configuration)
5. [Phase 0 — Fork & Project Setup](#phase-0--fork--project-setup)
6. [Phase 1 — Sanity Schema](#phase-1--sanity-schema)
7. [Phase 2 — Route Architecture & Data Layer](#phase-2--route-architecture--data-layer)
8. [Phase 3 — Frontend Build](#phase-3--frontend-build)
9. [Phase 4 — RentalWise Integration](#phase-4--rentalwise-integration)
10. [Phase 5 — Forms](#phase-5--forms)
11. [Phase 6 — Polish & Quality Gates](#phase-6--polish--quality-gates)
12. [Phase 7 — Client Review](#phase-7--client-review)
13. [Phase 8 — Production Migration](#phase-8--production-migration)
14. [May — Testing Period](#may--testing-period)
15. [Post-Launch Maintenance](#post-launch-maintenance)
16. [Cost Summary](#cost-summary)
17. [Env Vars — Complete List](#env-vars--complete-list)

---

## Pre-Start Checklist

Confirm every item before writing a single line of code. These are hard blockers.

- [ ] Figma file access confirmed — latest version shared as view link
- [ ] RentalWise staging credentials obtained — Bearer token from User Settings → API Access
- [ ] RentalWise `rentalwisePropertyId` and `rentalwiseIdentifier` confirmed for at least one test property (from PMS → Property → Website Tab)
- [ ] RentalWise `instance` URL confirmed — e.g. `https://althomes.rentalwise.io` — needed for widget `instance` attribute
- [ ] RentalWise widget script URL confirmed — the exact `<script src="...">` URL to load the `<rw-widget>` web component. Get this from RentalWise support or from the widget code in PMS → Property → Website Tab.
- [ ] Resend sender domain confirmed and DNS verification started immediately — DNS propagation takes up to 48 hours. Start this in week 1 or forms cannot be tested end-to-end.
- [ ] Number of Sanity Studio users confirmed — free tier: 20 seats max, Administrator + Viewer roles only
- [ ] Client email address(es) for form destinations confirmed — `contactFormEmail` and `partnerEnquiryEmail`
- [ ] Production domain confirmed — needed for Cloudflare, Sanity CORS, and `NEXT_PUBLIC_BASE_URL` in Phase 8

---

## Decisions & Constraints

These are non-negotiable rules that apply throughout the entire build. Violating any of these creates rework.

| Rule | Why |
|---|---|
| Fork `nuotsu/sanitypress-with-typegen` — not the main SanityPress repo | TypeGen + Live Content API + Visual Editing scaffolding already done. Saves 1–2 days of setup. |
| `output: 'standalone'` in `next.config.ts` — set on Day 1, never remove | Required for Coolify deployment on Hetzner. Set before writing any code. |
| No Vercel-specific APIs | `@vercel/kv`, `@vercel/blob`, `@vercel/postgres`, Edge Runtime — all forbidden. Production target is Hetzner + Coolify. |
| Vercel is preview-only | Free tier is non-commercial per Vercel ToS. Client must not share the Vercel URL as the live site. |
| `<SanityLive />` in `(site)/layout.tsx` only | Placing it in the root layout that wraps `/studio` causes a reload loop inside Studio. |
| All GROQ queries wrapped in `defineQuery()` | Plain `groq` tagged template strings are invisible to TypeGen. TypeGen breaks silently. |
| Viewer token for `SANITY_API_READ_TOKEN` | The `browserToken` in `defineLive` is exposed client-side in Draft Mode. Editor-level token must never reach the browser. |
| `next/image` always — never raw `<img>` | Required for Lighthouse performance score. Every image on every page. |
| No Sanity writes from forms | Free tier dataset is public. Personal data (name, email, phone) from contact/partner forms must never be stored in Sanity. Resend email is the only destination. |
| RentalWise API calls server-side only | Bearer token must never be exposed to the browser. All calls go through Next.js server actions. |
| `cache: 'no-store'` on availability fetch | Availability is real-time. A cached "available" response when a property is actually booked is a critical UX failure. |
| RentalWise staging only during dev | `https://app.onemineralstaging.com/` for all development. Never use production (`https://app.rentalwise.io/`) for testing — changes cannot be rolled back. Switch at Phase 8 only. |
| Page builder (`modules[]`) scoped to `post` only | All other pages are fixed-layout Next.js templates driven by singleton/document schemas. |
| No iCal integration | Removed entirely. The `<rw-widget>` web component handles availability natively. `icalUrl` is not in the property schema and should not be added. |
| `<rw-widget>` is client-side only | It is a third-party web component — it cannot be server-rendered. Load via `<Script strategy="afterInteractive">`. Never attempt to SSR it. |
| Bun vs npm — pick one | `sanitypress-with-typegen` ships with `bun.lock`. If using npm: delete `bun.lock`, commit `package-lock.json`. Coolify supports both. Be consistent. |
| Route paths from Figma — not the original plan | Original plan used `/properties/[slug]` — Figma and final config use `/our-homes/[slug]`. Use the Figma-derived paths throughout. |

### Rich Text Decision Framework

| Use | Sanity type | When |
|---|---|---|
| Rich text editor | `blockContent` | Multi-paragraph, needs headings/lists/links. Property descriptions, house rules, legal pages, cause bodies. |
| Plain textarea | `text` | Short prose, no formatting needed. Value prop bodies, mission statement, form intro text. |
| Single line input | `string` | One-liners. Headlines, button labels, stat values, names, URLs. |
| Hardcoded | `static` | Structural brand copy. Never changes. Editing = design decision, not content decision. |

**Rule:** If changing it requires a design decision → hardcode it. If it's a content decision the client makes independently → put it in Studio.

---

## RentalWise Integration Architecture

Reference this section before building any availability or booking feature. Both integrations use the same Bearer token but are architecturally separate.

### Environments

| Environment | Base URL | When to use |
|---|---|---|
| Staging | `https://app.onemineralstaging.com/` | All development and testing |
| Production | `https://app.rentalwise.io/` | Live site only — switch at Hetzner deploy |

### Authentication

```
Authorization: Bearer {RENTALWISE_API_TOKEN}
```

Token found in RentalWise → User Settings → API Access. Per-user, revocable. Never expose to browser — all calls go through server actions.

---

### Integration 1 — Booking Widget (Property Detail Page)

The `<rw-widget>` web component handles the complete per-property booking flow. Retrieved from RentalWise PMS → Property → Website Tab per property.

**Flow:** Guest selects dates → widget generates inline quote → "Book Now" redirects to RentalWise checkout. No payment on AltHomes site.

**Implementation pattern:**
```html
<rw-widget
  instance="https://althomes.rentalwise.io"
  identifier="{property.rentalwiseIdentifier}"
  property-id="{property.rentalwisePropertyId}"
>
  <rw-quote-daterange-input
    label="Select Dates"
    placeholder="Add dates"
    calendar-placement="bottom"
  ></rw-quote-daterange-input>

  <rw-quote-guests-input
    adults-label="Guests"
    children-label="Kids"
  ></rw-quote-guests-input>

  <rw-quote-coupon-input
    label="Promo Code"
    placeholder="Enter promo code"
  ></rw-quote-coupon-input>

  <rw-quote-result>
    <rw-quote-products></rw-quote-products>
    <rw-quote-total></rw-quote-total>
    <rw-quote-book-button label="Book Now"></rw-quote-book-button>
  </rw-quote-result>

  <rw-quote-error></rw-quote-error>
  <rw-quote-no-results>
    <div>Please select your dates to see availability</div>
  </rw-quote-no-results>
  <rw-quote-is-loading>
    <div>Checking availability...</div>
  </rw-quote-is-loading>
</rw-widget>
```

**Sanity stores per property:** `rentalwisePropertyId` (string) + `rentalwiseIdentifier` (string)  
**Hardcoded in code:** `instance` URL, all label text, `calendar-placement`

> ⚠️ Client stores only the two ID values in Sanity — never the full widget snippet. Widget is assembled in code. This prevents accidental breakage.

> ⚠️ The `<rw-widget>` is a third-party web component loaded via a script tag. It must be loaded as a client-side script — it cannot be server-rendered. Use Next.js `<Script>` with `strategy="afterInteractive"` or load it in a Client Component.

---

### Integration 2 — Property Availability Search (Our Homes Page)

Single API call returns all available properties for a date range. No per-property parallel requests.

**Endpoint:** `POST /rest/property/query`

**Request:**
```json
{
  "daterange": { "start": "YYYY-MM-DD", "end": "YYYY-MM-DD" },
  "guests": 4,
  "website_visible": true
}
```

**Response:** Paginated list of `PropertyBase` objects containing RentalWise property IDs.

**Flow:**
1. Guest enters check-in, check-out, guests → "Find Availability"
2. Server action calls `POST /rest/property/query` with inputs + `website_visible: true`
3. Returned RentalWise IDs matched against `property.rentalwisePropertyId` in Sanity
4. Matched property cards render — unmatched are hidden
5. No dates entered → show all active properties from Sanity ordered by `displayOrder`
6. No results → show message + link to `/contact`

**Server action:**
```ts
// src/app/actions/search.ts
'use server'

export async function searchAvailability(checkIn: string, checkOut: string, guests: number) {
  const res = await fetch(`${process.env.RENTALWISE_API_HOST}/rest/property/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RENTALWISE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      daterange: { start: checkIn, end: checkOut },
      guests,
      website_visible: true,
    }),
    cache: 'no-store', // never cache — availability is real-time
  })
  if (!res.ok) throw new Error('RentalWise availability search failed')
  const json = await res.json()
  return json.data.map((p: { id: number }) => p.id)
}
```

> ⚠️ Do NOT send promo code to this endpoint. Promo codes apply at the widget/checkout stage only.

> ⚠️ `website_visible: true` must always be sent — this is the flag that limits results to publicly listed properties.

---

## Content & Schema Configuration

### Global Colour Tokens (`siteSettings.colours`)

CSS custom properties on `:root`. Changing one value updates every element referencing that token.

```
primary           #2D5C4A   — navbar, footer, primary buttons
primaryForeground #FFFFFF   — text on primary backgrounds  
accent            #D4A853   — CTA buttons, highlights, badge backgrounds
accentForeground  #1A1A1A   — text on accent backgrounds
background        #FAF6F0   — page background (warm cream)
foreground        #1A1A1A   — body text
muted             #6B6B6B   — secondary/subdued text
border            #E0D9D0   — dividers, input borders
```

> Exposed as plain hex string fields in Studio. No colour picker plugin — hex is transparent and has no dependency.

---

### Global — Navbar & Footer (`siteSettings`)

**Navbar:**

| Field | Type | Notes |
|---|---|---|
| Logo image | image | Transparent background |
| Logo text | string | "AltHomes" |
| CTA button label | string | "STAY WITH US" |
| CTA button link | string | Internal path or external URL |

Nav drawer links are **static** — hardcoded routes. Adding/removing nav items requires a code change.

```
Our Homes                → /our-homes
The Alt Way              → /the-alt-way
Experiences              → /experiences
Join Us                  → /join-us
Contact Us               → /contact
Privacy Policy           → /privacy-policy
Terms of Use             → /terms-of-use
Bookings & Cancellations → /bookings-and-cancellations
```

**Floating action buttons:**

| Field | Type | Notes |
|---|---|---|
| Book Direct link | string | cms — URL |
| WhatsApp number | string | cms — digits only, e.g. "919899917180". `wa.me/` prefix added in code. |
| Both button labels | static | Hardcoded brand copy |

**Footer:**

| Field | Type | Notes |
|---|---|---|
| Logo text | string | cms |
| Our Homes column | auto | Auto-populated from active `property` docs ordered by `displayOrder`. Never manually edited. |
| About + Policies columns | static | Hardcoded link lists |
| Instagram / Facebook / LinkedIn / YouTube URLs | string | cms |

**Form destinations (`siteSettings`):**
```
contactFormEmail       string  — destination for /contact submissions
partnerEnquiryEmail    string  — destination for /join-us submissions
                                 Falls back to contactFormEmail if empty
```

---

### Shared Object Types

**`seo` object:**
```
metaTitle         string   — browser tab title
metaDescription   text     — max 160 chars
ogImage           image    — social share image
```

**`location` object:**
```
displayLocation         string  — e.g. "Ooty, Tamil Nadu"
distanceFromLandmark    string  — e.g. "12.5 kms from Ooty Main Bazaar"
googleMapsUrl           string  — full Google Maps link
lat                     number
lng                     number
```

**`navLabel` object (Homepage collage buttons):**
```
label       string  — button text, e.g. "OUR HOMES"
link        string  — destination path
xDesktop    number  — horizontal % from left, desktop
yDesktop    number  — vertical % from top, desktop
xMobile     number  — horizontal % from left, mobile
yMobile     number  — vertical % from top, mobile
```

Positions stored as percentages, applied as inline styles on the collage container. Client sets these as number fields in Studio and tests on staging before publishing.

---

### Page-by-Page Schema Map

#### 1. Homepage — `homePage` (singleton) · `/`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Headline | string | cms |
| Hero | Collage nav buttons | array of `navLabel` (6 items) | cms |

> The collage background (mountains, flowers, stars, sun orb) is a **static design asset** — a single composed image baked into the codebase. Client cannot edit individual collage elements.

---

#### 2. Our Homes — `ourHomesPage` (singleton) · `/our-homes`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Headline | string | cms |
| Hero | Background image | image | cms |
| Search bar | All inputs | — | static — wired to RentalWise search API |
| Experiences CTA | Body text | text | cms |
| Experiences CTA | Button label | string | cms |
| Experiences CTA | Button destination | — | static → `/experiences` |

Property cards are driven entirely by `property` documents. No manual ordering in `ourHomesPage` — ordered by `property.displayOrder`.

---

#### 3. Property Detail — `property` · `/our-homes/[slug]`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Hero image | image | cms |
| Hero | Property name overlay | string (title) | cms |
| Hero | Booking widget | — | auto — assembled from `rentalwisePropertyId` + `rentalwiseIdentifier` |
| Intro | Description | blockContent | cms |
| Intro | Property type badge | string | cms |
| Intro | Guests / Bedrooms / Bathrooms | number | cms |
| Intro | Amenity icon strip | reference[] → amenity | cms |
| Intro | Pull quote | string | cms |
| Intro | Interior gallery | image[] | cms |
| Location | Section headline | string | cms |
| Location | Description | blockContent | cms |
| Location | Google Maps URL | string | cms |
| Highlights | Section label | — | static — "WHAT'S WAITING FOR YOU?" |
| Highlights | Highlight items | array of {title, body, image?} | cms |
| Experiences | Section label | — | auto — "EXPERIENCES NEAR [name]" |
| Experiences | Experience references | reference[] → experience | cms |
| Experiences | Max shown | number | cms — default: 3 |
| Amenities | Section label | — | static — "FOR US, IT'S COMFORT FIRST" |
| Amenities | Full amenity list | reference[] → amenity | cms — same field as icon strip |
| Amenities | House rules teaser | string | cms |
| House Rules | Rules content | blockContent | cms |
| Causes | Section headline | string | cms |
| Causes | Cause body | blockContent | cms |
| Causes | Cause images | image[] (exactly 2) | cms |
| Reviews | Section headline | — | static — hardcoded, identical on all properties |
| Reviews | Reviews source | — | auto — `review.property === this AND published === true` |
| Reviews | Max shown | number | cms — default: 5 |
| Bottom CTA | Headline | string | cms |
| Bottom CTA | Button | — | static — "FIND AVAILABILITY", scrolls to widget |

---

#### 4. The Alt Way — `altWayPage` (singleton) · `/the-alt-way`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Headline line 1 | string | cms |
| Hero | Headline line 2 | string | cms |
| Hero | Background image | image | cms |
| Mission | Interior room image | image | cms |
| Mission | Mission statement | text | cms — plain text, no formatting |
| Value Props | Section headline | string | cms |
| Value Props | Items (fixed 4) | array of {title: string, body: text} | cms |
| Value Props | Editorial images | image[] | cms |
| Promise | Statement text | string | cms |
| Promise | CTA button label | string | cms |
| Promise | CTA destination | — | static → `/our-homes` |
| Stats | Section headline | string | cms |
| Stats | Items (fixed 4) | array of {value, label, subtext} | cms |
| Reviews | Section headline | — | static — hardcoded |
| Reviews | Source | — | auto — `featured === true AND published === true` |
| Reviews | Max shown | number | cms — default: 5 |
| Bottom CTA | Headline | string | cms |
| Bottom CTA | Button label | string | cms |
| Bottom CTA | Destination | — | static → `/experiences` |

---

#### 5. Experiences — `experiencesPage` (singleton) · `/experiences`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Page title | string | cms |
| Hero | Subtext | text | cms |
| Hero | Background image | image | cms |
| Hero | Discount badge text | string | cms |
| Intro | Intro text | text | cms |
| Filter | Options | — | auto — from active `property` docs |
| Cards | Max shown (unfiltered) | number | cms — default: 9 |

**`experience` document:**
```
title           string      required
slug            slug        required — auto-generated
description     text        required — 2–3 sentences, plain text
image           image       required — card thumbnail, hotspot
properties      reference[] required → property documents (used for filter)
displayOrder    number      optional
seo             seo object  optional
```

---

#### 6. Join Us — `joinUsPage` (singleton) · `/join-us`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Page title | string | cms |
| Hero | Pull quote | text | cms — plain text |
| Hero | Background image | image | cms |
| Body | Body paragraph | text | cms |
| Body | Bullet points | string[] | cms — client can add/remove |
| Body | Form CTA text | string | cms |
| Body | Property image | image | cms |
| Form | Form headline | string | cms |
| Form | All inputs | — | static fields — see form spec below |

**Partner form fields:**

| Field | Label | Required |
|---|---|---|
| name | NAME | Yes |
| email | EMAIL | Yes |
| phone | PHONE NUMBER | Yes |
| location | LOCATION | Yes |
| propertyType | TYPE OF PROPERTY | Yes |
| status | STATUS | Yes |
| operational | OPERATIONAL | Yes |
| photosLink | PHOTOS / WEBSITE LINK | Yes |
| privacyConsent | I have read the Privacy Policy | Yes (checkbox) |

**On submit:** Server action → Resend → `siteSettings.partnerEnquiryEmail` (falls back to `contactFormEmail`). No Sanity write.

---

#### 7. Contact Us — `contactPage` (singleton) · `/contact`

| Section | Field | Type | CMS/Static |
|---|---|---|---|
| Hero | Background image | image | cms |
| Left | Section title | string | cms |
| Left | Phone number | string | cms — rendered as `tel:` |
| Left | Email | string | cms — rendered as `mailto:` |
| Left | Office city | string | cms |
| Left | Office address | text | cms |
| Left | Facebook URL | string | cms |
| Left | Instagram URL | string | cms |
| Form | Form headline | string | cms |
| Form | name / email / phone / message | — | static fields |
| Form | privacyConsent | — | checkbox, links to `/privacy-policy` |

**On submit:** Server action → Resend → `siteSettings.contactFormEmail`. No Sanity write.

---

#### 8. Legal Pages — `legalPage` (multi-instance) · `/[slug]`

Reusable template. One document per legal page.

| Field | Type | Notes |
|---|---|---|
| Display title | string | Styled on-page title, e.g. "Privacy & Policy" |
| SEO title | string | Plain text for `<title>` |
| Slug | slug | `privacy-policy`, `terms-of-use`, `bookings-and-cancellations` |
| Body | blockContent | Full rich text — H2, H3, paragraphs, lists |
| Background image | image | Decorative illustrated image |

Three documents to create at launch: Privacy Policy, Terms of Use, Bookings and Cancellations.

---

### Review Document — Centralized Management

```
_type: 'review'

guestName       string      required
property        reference   required → property document
guestLocation   string      optional — e.g. "Uttarakhand"
rating          number      required — 1 to 5
stayDate        date        required
body            text        required — plain text
published       boolean     default: false
featured        boolean     default: false
```

**How reviews flow automatically:**

| Surface | Query |
|---|---|
| Property detail | `review.property === this property AND published === true` |
| The Alt Way carousel | `featured === true AND published === true` across all properties |

Client manages all reviews centrally. `property` reference + `published`/`featured` toggles control where each review appears. No duplication, no manual page assignment.

---

### `property` Document — Complete Field Reference

```
// Identity
title                   string      required
slug                    slug        required — auto-generated from title
status                  string      required — 'active' | 'hidden' | 'coming-soon'
displayOrder            number      required — lower = appears first on /our-homes

// RentalWise (both required — used by widget and search)
rentalwisePropertyId    string      required — property-id widget attribute + search join key
rentalwiseIdentifier    string      required — identifier widget attribute

// Listing card (Our Homes page)
tagline                 string      optional — e.g. "WHERE THE TEA TALKS TO THE TREES"
shortDescription        text        required
cardThumbnail           image       required — interior thumbnail
cardAmenities           string[]    optional — short highlights on card only
propertyType            string      required — e.g. "Entire Villa"
priceFrom               number      required — INR

// Property detail — hero
heroImage               image       required — hotspot

// Property detail — intro
description             blockContent required
pullQuote               string      optional
gallery                 image[]     required — min 2, hotspot each

// Property detail — specs
maxGuests               number      required
bedrooms                number      required
bathrooms               number      required
amenities               reference[] required → amenity documents

// Property detail — location
location                location    required
locationHeadline        string      optional
locationDescription     blockContent optional

// Property detail — highlights
highlights              array of {title: string, body: text, image?: image} — min 2

// Property detail — experiences
experiences             reference[] optional → experience documents
experiencesMaxShown     number      optional — default: 3

// Property detail — amenities section
houseRulesTeaser        string      optional
houseRules              blockContent optional — rendered as accordion

// Property detail — causes
causeHeadline           string      optional
causeBody               blockContent optional
causeImages             image[]     optional — exactly 2

// Property detail — reviews
reviewsMaxShown         number      optional — default: 5

// Property detail — bottom CTA
ctaHeadline             string      optional

// SEO
seo                     seo object  optional
```

---

### Document Type Registry

| Document | Type | Route | Client access |
|---|---|---|---|
| `siteSettings` | Singleton | — | Colours, logo, nav CTA, WhatsApp, socials, form email destinations |
| `homePage` | Singleton | `/` | Hero headline, collage nav buttons + positions |
| `ourHomesPage` | Singleton | `/our-homes` | Headline, hero image, experiences CTA |
| `property` | CRUD | `/our-homes/[slug]` | Full create, edit, delete |
| `experience` | CRUD | `/experiences` + property pages | Title, description, image, property refs |
| `review` | CRUD | Referenced site-wide | Name, property ref, location, rating, date, body, published, featured |
| `altWayPage` | Singleton | `/the-alt-way` | All sections + reviewsMaxShown |
| `experiencesPage` | Singleton | `/experiences` | Hero, intro, badge, cardsMaxShown |
| `joinUsPage` | Singleton | `/join-us` | All content + formHeadline |
| `contactPage` | Singleton | `/contact` | Contact details, office, socials, formHeadline |
| `legalPage` | Multi-instance | `/[slug]` | Display title, body, background image |
| `amenity` | CRUD | Referenced | Name, icon |

---

### Carousel / Card Count Summary

| Surface | Field | Document | Default |
|---|---|---|---|
| The Alt Way — reviews carousel | `reviewsMaxShown` | `altWayPage` | 5 |
| Property detail — reviews carousel | `reviewsMaxShown` | `property` | 5 |
| Property detail — experiences section | `experiencesMaxShown` | `property` | 3 |
| Experiences page — cards (unfiltered) | `cardsMaxShown` | `experiencesPage` | 9 |

> When a property filter is active on `/experiences`, all matching cards show regardless of `cardsMaxShown`.

---

## Phase 0 — Fork & Project Setup
### Day 1 · ~3 hours

**Goal:** Clean local dev environment. Template bloat removed. Build pipeline verified before writing any domain code.

### 0.1 — Fork

Fork [`nuotsu/sanitypress-with-typegen`](https://github.com/nuotsu/sanitypress-with-typegen). Rename to `alt-homes`. Clone locally.

```bash
git clone https://github.com/YOUR_ORG/alt-homes.git
cd alt-homes
npm install   # or bun install — pick one and stay consistent
```

### 0.2 — Sanity project

Go to [sanity.io/manage](https://sanity.io/manage) → New Project:
- Dataset: `production`
- Plan: Free tier

Create a **Viewer** API token:  
Manage → API → Tokens → Add → Name: `Live Content Reader` → Permission: **Viewer** → Copy immediately (shown once).

### 0.3 — Environment variables

```env
# .env.local
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_READ_TOKEN="your_viewer_token"

RENTALWISE_API_HOST="https://app.onemineralstaging.com"
RENTALWISE_API_TOKEN="your_bearer_token"

RESEND_API_KEY="your_resend_key"
RESEND_FROM_EMAIL="enquiries@yourdomain.com"
RESEND_TO_EMAIL="client@althomes.in"

REVALIDATE_SECRET="generate_a_random_string"
```

> ⚠️ Verify `.env.local` is in `.gitignore` before the first commit.

### 0.4 — Verify baseline

```bash
npm run dev
```

- Site: `http://localhost:3000`  
- Studio: `http://localhost:3000/admin` (to be renamed in 0.6)

Confirm both load without errors before touching anything.

### 0.5 — Add `output: 'standalone'`

**Do this before any other code change.**

```ts
// next.config.ts
const nextConfig = {
  output: 'standalone',
  // rest of existing config
}
```

### 0.6 — Rename Studio `/admin` → `/studio`

1. Rename `src/app/admin/` → `src/app/studio/`
2. Update `sanity.config.ts`: `basePath: '/studio'`
3. Search codebase for any remaining `/admin` references and update them

### 0.7 — Strip demo content

**Keep:**
- `site` document (reshape fields to match spec)
- `post` document + `modules[]` array (blog page builder — keep untouched)
- Module renderer component (scoped to blog post only)
- All TypeGen, `defineLive`, `SanityLive` wiring — already done, do not touch

**Remove/gut:**
- Marketing-specific demo schema fields irrelevant to property rental
- Demo dataset import reference in README

> ⚠️ Do NOT import `demo.tar.gz`. Seed your own test data in Phase 1.

### 0.8 — Vercel deployment (pipeline first)

```bash
git add .
git commit -m "chore: standalone output, studio rename, demo strip"
git push origin main
```

In Vercel dashboard: connect repo, add all env vars from 0.3, verify build passes.

> ⚠️ TypeGen and `defineLive` are pre-wired in this template. Do NOT follow the migration steps in `next-sanity-upgrade-guide.md` — that guide was written for a greenfield setup. This template has it done.

### 0.9 — Sanity CORS

Sanity Manage → API → CORS Origins → Add:
- `http://localhost:3000`
- Your Vercel preview URL

---

## Phase 1 — Sanity Schema
### Day 1–2 · ~4–5 hours

**Goal:** All document types defined and registered. Studio fully usable by client. Test data seeded.

### 1.1 — Reshape `site` document (from SanityPress template)

Update the existing `site` schema to match `siteSettings` fields:
- Logo image + logo text
- Nav CTA label + link
- WhatsApp number
- Book Direct link
- Instagram, Facebook, LinkedIn, YouTube URLs
- `contactFormEmail`, `partnerEnquiryEmail`
- `colours` object (8 hex string fields)
- Default SEO fallback (`seo` object)
- Announcement bar: `{enabled: boolean, message: string, link?: string}` — toggle on/off from Studio

> ⚠️ Add an `alt` text field to every image field across all schemas (`heroImage`, `gallery[]`, `cardThumbnail`, `causeImages[]`, etc.). This is required for accessibility (WCAG) and for the Lighthouse accessibility score. Without it, the client has no way to add alt text through Studio.

### 1.2 — Create domain schemas

Create in `src/sanity/schemaTypes/`:

**`property.ts`** — See complete field list in Content Configuration section above.  
Studio preview: `● active · ○ hidden · ◌ coming-soon` status indicator next to title.

**`experience.ts`**
```
title, slug, description (text), image, properties (reference[]), displayOrder, seo
```

**`review.ts`**
```
guestName, property (reference), guestLocation, rating (1–5), stayDate, body (text), published, featured
```

**`amenity.ts`**
```
name (string), icon (string — emoji or icon key)
```

**Singleton pages** (one document each — cannot be duplicated):
```
homePage.ts         → hero headline, collage navLabel array
ourHomesPage.ts     → headline, hero image, experiences CTA fields
altWayPage.ts       → all Alt Way sections + reviewsMaxShown
experiencesPage.ts  → hero, intro, badge, cardsMaxShown
joinUsPage.ts       → all content sections + formHeadline
contactPage.ts      → contact details, office, socials, formHeadline
```

**`legalPage.ts`** — Multi-instance (not singleton):
```
displayTitle, seoTitle, slug, body (blockContent), backgroundImage
```

### 1.3 — Prevent singleton duplication

In `sanity.config.ts`:
```ts
document: {
  newDocumentOptions: (prev, { creationContext }) => {
    const singletons = [
      'homePage', 'ourHomesPage', 'altWayPage', 'experiencesPage',
      'joinUsPage', 'contactPage', 'site'
    ]
    if (creationContext.type === 'global') {
      return prev.filter(t => !singletons.includes(t.templateId))
    }
    return prev
  },
}
```

> ⚠️ `legalPage` is intentionally NOT in this list — it is a multi-instance document type. Multiple legal pages (Privacy Policy, Terms of Use, Bookings and Cancellations) are separate documents of the same type.

### 1.4 — Register all types

In `src/sanity/schemaTypes/index.ts` — register every new document and object type.

### 1.5 — Run TypeGen

After every schema change during this phase:
```bash
npx sanity schema extract --path=schema.json
npx sanity typegen generate
```

Commit `src/sanity/types.ts`. Add `schema.json` to `.gitignore`.

Also verify `package.json` has the TypeGen scripts wired (template should have these — confirm):
```json
{
  "scripts": {
    "predev": "sanity schema extract --path=schema.json && sanity typegen generate",
    "prebuild": "sanity schema extract --path=schema.json && sanity typegen generate"
  }
}
```

This ensures types are always up to date before a dev server starts or a build runs. If the template does not have these scripts, add them.

### 1.6 — Seed test data

In Studio, create:
- 4–5 amenity documents (Wi-Fi, Pool, Parking, Kitchen, AC)
- 1 test property — all fields filled, status: Active, real RentalWise IDs
- 2–3 reviews (one featured + published, one published only, one neither)
- All singleton pages published — even placeholder content, so `sanityFetch` returns data rather than null
- `site` singleton — logo, nav CTA, socials, colours

---

## Phase 2 — Route Architecture & Data Layer
### Day 2 · ~2–3 hours

**Goal:** All routes defined. Data fetching wired to Sanity. `SanityLive` correctly placed. Build passes clean.

### 2.1 — Route structure

```
src/app/
├── (site)/
│   ├── layout.tsx              ← SanityLive, Navbar, Footer — NOT in root layout
│   ├── page.tsx                ← Homepage
│   ├── our-homes/
│   │   ├── page.tsx            ← Property listing
│   │   └── [slug]/
│   │       └── page.tsx        ← Property detail
│   ├── the-alt-way/
│   │   └── page.tsx
│   ├── experiences/
│   │   └── page.tsx
│   ├── join-us/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── [slug]/
│   │   └── page.tsx            ← Legal pages (privacy-policy, terms-of-use, bookings-and-cancellations)
│   └── blog/
│       ├── page.tsx            ← Blog listing
│       └── [slug]/
│           └── page.tsx        ← Blog post — module renderer only here
├── not-found.tsx               ← Custom 404 page
└── studio/
    └── [[...tool]]/
        └── page.tsx            ← Sanity Studio — NO SanityLive here
```

> ⚠️ `<SanityLive />` goes in `(site)/layout.tsx` only. Never in the root layout.

> ⚠️ The `[slug]` route for legal pages sits inside `(site)/` at the top level. It must NOT catch `/our-homes/[slug]` or `/blog/[slug]` — those are in their own subdirectories, so no conflict. But ensure the legal page `[slug]` route validates the slug against known legal page slugs and returns 404 for anything unknown.

> ⚠️ Build a `not-found.tsx` at the app root. A missing 404 page causes a poor fallback experience and will hurt the Lighthouse Best Practices score.

### 2.2 — GROQ queries

`src/sanity/lib/queries.ts` — wrap every query in `defineQuery()`:

```ts
import { defineQuery } from 'next-sanity'

export const siteSettingsQuery = defineQuery(`*[_type == "site"][0]{ ... }`)
export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{ ... }`)
export const ourHomesPageQuery = defineQuery(`*[_type == "ourHomesPage"][0]{ ... }`)
export const allPropertiesQuery = defineQuery(`*[_type == "property" && status == "active"] | order(displayOrder asc){ ... }`)
export const propertyBySlugQuery = defineQuery(`*[_type == "property" && slug.current == $slug][0]{ ..., amenities[]->{name,icon}, experiences[]->{title,description,image}, "reviews": *[_type=="review" && references(^._id) && published==true]|order(stayDate desc) }`)
export const allExperiencesQuery = defineQuery(`*[_type == "experience"] | order(displayOrder asc){ ..., properties[]->{_id,title,slug} }`)
export const altWayPageQuery = defineQuery(`*[_type == "altWayPage"][0]{ ... }`)
export const featuredReviewsQuery = defineQuery(`*[_type == "review" && featured == true && published == true] | order(stayDate desc)`)
export const experiencesPageQuery = defineQuery(`*[_type == "experiencesPage"][0]{ ... }`)
export const joinUsPageQuery = defineQuery(`*[_type == "joinUsPage"][0]{ ... }`)
export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{ ... }`)
export const legalPageBySlugQuery = defineQuery(`*[_type == "legalPage" && slug.current == $slug][0]{ ... }`)
export const allPostsQuery = defineQuery(`*[_type == "post"] | order(publishedAt desc){ ... }`)
export const postBySlugQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{ ..., modules }`)
```

### 2.3 — Data fetching functions

`src/sanity/lib/data.ts` — use `sanityFetch` (exported from template's `live.ts`). Returns `{ data }`.

```ts
import { sanityFetch } from '@/sanity/lib/live'

export async function fetchSiteSettings() {
  const { data } = await sanityFetch({ query: siteSettingsQuery })
  return data
}
// ... one function per query
```

### 2.4 — `generateMetadata` on every page

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  const property = await fetchPropertyBySlug(params.slug)
  return {
    title: property?.seo?.metaTitle ?? property?.title,
    description: property?.seo?.metaDescription,
    openGraph: { images: property?.seo?.ogImage ? [urlFor(property.seo.ogImage).url()] : [] },
  }
}
```

Every page and property detail route exports this. No page has a default/missing title.

### 2.5 — Verify build

```bash
npm run build
```

Must pass clean. TypeGen runs via `prebuild`. Fix all type errors before Phase 3.

---

## Phase 3 — Frontend Build
### Day 3–7

**Goal:** All pages pixel-perfect from Figma. Sanity-data-driven from day one. Lighthouse-ready structure.

> ⚠️ Build against live Sanity data from the start — not mocks. The seeded test data from Phase 1 is your dev data.

> ⚠️ Every image: use `next/image`. Use `@sanity/image-url` builder with hotspot/crop. Set `priority` on above-the-fold hero images.

### Build order within this phase:

**3.1 — Global layout** (`(site)/layout.tsx`)
- Navbar: logo, nav CTA — from `siteSettings`
- Footer: auto-populated Our Homes column, static About/Policies columns, social links
- Floating action buttons: Book Direct + WhatsApp
- Announcement bar (if client decides to add later — stub the component now, hidden by default)
- `<SanityLive />` — last element before closing tag

**3.2 — Homepage** (`/`)
- Hero collage — static composed image asset as `<img>` background or CSS background
- 6 yellow nav label buttons — positioned via `navLabel.xDesktop/yDesktop` percentage styles
- Mobile positions from `navLabel.xMobile/yMobile`

**3.3 — Our Homes** (`/our-homes`)
- Hero section
- Search bar UI — inputs only, wired to server action in Phase 4
- Property cards — alternating full-width layout, all fields from `property` document
- Default state: all active properties ordered by `displayOrder`
- Experiences CTA at bottom

**3.4 — Property Detail** (`/our-homes/[slug]`)
- Hero image + property name overlay
- Booking widget placeholder — `<div id="rw-widget-placeholder" />` — wired in Phase 4
- Introduction: description (PortableText), specs strip, amenity icons, pull quote, gallery
- Location section
- Highlights grid — "WHAT'S WAITING FOR YOU?"
- Experiences near property — filtered cards
- Amenities checklist + house rules teaser
- House rules — PortableText rendered as accordion
- Causes section
- Reviews carousel
- Bottom CTA

**3.5 — The Alt Way** (`/the-alt-way`)
- Hero
- Mission statement split layout
- Value props 2×2 grid with interleaved images
- Promise statement + CTA
- Stats bar (dark section)
- Featured reviews carousel
- Bottom CTA

**3.6 — Experiences** (`/experiences`)
- Hero with discount badge
- Intro + filter bar (property filter — client-side filtering, no API call)
- Experience cards 3-column grid
- Bottom CTA

**3.7 — Join Us** (`/join-us`)
- Hero + pull quote
- Body content + bullet list + property image
- Partner form — UI only, server action wired in Phase 5

**3.8 — Contact** (`/contact`)
- Hero image
- Split layout: contact details left, form right
- Contact form — UI only, server action wired in Phase 5

**3.9 — Legal pages** (`/[slug]`)
- Single reusable template component
- Decorative background image
- Styled display title
- PortableText body

**3.10 — Blog listing + Blog post** (`/blog`, `/blog/[slug]`)
- Blog listing: standard card grid from `post` documents
- Blog post: SanityPress module renderer — keep as-is, scoped here only

**3.11 — Portable Text renderer**

```bash
npm install @portabletext/react
```

Configure custom components for any custom block types (images within rich text, etc.).

**3.12 — Image URL builder**

```ts
// src/sanity/lib/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'
const builder = imageUrlBuilder(client)
export const urlFor = (source: SanityImageSource) => builder.image(source)
```

Usage: `urlFor(image).width(1200).fit('crop').auto('format').url()`

---

## Phase 4 — RentalWise Integration
### Day 7–8 · ~4–6 hours

**Goal:** Booking widget live on property detail. Availability search live on Our Homes. Both tested against staging.

> ⚠️ Use staging environment throughout this phase: `https://app.onemineralstaging.com/`

### 4.1 — Booking widget

Load the RentalWise widget script. It is a third-party web component — it must be loaded client-side:

```tsx
// In the property detail layout or a Client Component wrapper
import Script from 'next/script'
<Script
  src="https://althomes.rentalwise.io/widget.js"  // confirm exact URL with RentalWise
  strategy="afterInteractive"
/>
```

Replace the `<div id="rw-widget-placeholder" />` from Phase 3 with the assembled `<rw-widget>` markup, injecting `property.rentalwisePropertyId` and `property.rentalwiseIdentifier` from Sanity.

Test: confirm widget loads, dates can be selected, a quote is generated, "Book Now" redirects to RentalWise checkout.

### 4.2 — Availability search

Wire the Our Homes search bar to `searchAvailability` server action (see Integration Architecture section for full implementation).

States to handle:
- **Default (no dates):** All active properties shown, ordered by `displayOrder`
- **Searching:** Loading indicator
- **Results:** Only available properties shown
- **No results:** Message + link to `/contact`
- **API error:** Graceful fallback — show all properties, log error server-side

### 4.3 — End-to-end test

- Enter dates that include a known booked period on the staging account
- Verify the booked property is excluded from results
- Verify available properties show correctly
- Switch to a date range where all properties are available — verify all show
- Test booking widget: select dates, generate quote, proceed to RentalWise checkout

---

## Phase 5 — Forms
### Day 8 · ~3 hours

**Goal:** Both forms submit, Resend delivers email, zero Sanity writes.

### 5.1 — Install

```bash
npm install react-hook-form zod @hookform/resolvers resend
```

### 5.2 — Contact form server action

```ts
// src/app/actions/contact.ts
'use server'
import { Resend } from 'resend'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(6),
  message: z.string().optional(),
  _hp: z.literal('').optional(),           // honeypot
  privacyConsent: z.literal('true'),
})

export async function submitContactForm(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: 'Invalid form data' }
  if (parsed.data._hp) return { success: true }  // bot — silent ignore

  const siteSettings = await fetchSiteSettings()
  const toEmail = siteSettings?.contactFormEmail ?? process.env.RESEND_TO_EMAIL!

  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: toEmail,
    subject: 'New contact form submission — AltHomes',
    // structured email body
  })
  return { success: true }
}
```

### 5.3 — Partner enquiry server action

Same pattern. `to:` email reads from `siteSettings.partnerEnquiryEmail ?? siteSettings.contactFormEmail ?? process.env.RESEND_TO_EMAIL`.

Subject: `New partner enquiry — AltHomes`

Email body includes: name, email, phone, location, property type, status, operational status, photos link.

### 5.4 — Honeypot on both forms

Add a visually hidden field named `_hp` to every form. Validate server-side: if `_hp` has any value, return `{ success: true }` silently — do not process or email.

```tsx
<input name="_hp" type="text" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
```

### 5.5 — Resend setup

- Create account at [resend.com](https://resend.com)
- Add and verify sender domain (DNS records — do this in Phase 0 week, propagation takes time)
- Create API key → add to `.env.local` and Vercel env vars
- Test both forms with real email delivery before marking done

---

## Phase 6 — Polish & Quality Gates
### Day 9–10

**Goal:** 95+ Lighthouse on Performance, Accessibility, Best Practices. 90+ SEO. Studio smoke tested.

### 6.1 — Lighthouse audit

```bash
npx lighthouse https://your-preview.vercel.app --output html --output-path ./lighthouse.html
```

Run against every page type: homepage, property listing, property detail, The Alt Way, Experiences, Join Us, Contact, a legal page, a blog post.

Common fixes:
- `priority` prop on every above-the-fold hero image
- `width` and `height` on every `next/image`
- Font loading via `next/font` — no FOUT, no layout shift
- No render-blocking third-party scripts (RentalWise widget uses `afterInteractive`)
- `rel="noopener noreferrer"` on all external links
- Ensure the RentalWise `<Script>` does not block LCP

### 6.2 — SEO checklist

- [ ] Every page exports `generateMetadata` with unique title + description
- [ ] All properties have SEO fields filled in test data
- [ ] OG images set on homepage, all properties, The Alt Way
- [ ] `robots.txt` present — SanityPress generates this. Verify `/studio` is excluded from crawling (`Disallow: /studio`)
- [ ] `sitemap.xml` includes all routes: `/our-homes/[slug]`, `/the-alt-way`, `/experiences`, `/join-us`, `/contact`, `/blog/[slug]`, `/privacy-policy`, `/terms-of-use`, `/bookings-and-cancellations` — extend SanityPress sitemap config to include all these. Legal pages and experiences are not auto-included.
- [ ] Canonical URLs on all pages
- [ ] `hreflang` not needed — English only per spec

### 6.3 — Accessibility checklist

- [ ] Every image has meaningful `alt` text — add `alt` field to all image schema types in Sanity
- [ ] All interactive elements keyboard-reachable
- [ ] Form inputs have associated `<label>` elements
- [ ] Colour contrast passes WCAG AA — particularly body text on warm cream background
- [ ] Focus indicators visible on all interactive elements
- [ ] ARIA labels on icon-only buttons (WhatsApp, social icons)

### 6.4 — Studio smoke test

Walk through every client workflow:
- [ ] Create new property — all fields work, RentalWise IDs save correctly
- [ ] Toggle property status: active → hidden → coming-soon
- [ ] Add a review → toggle `published` → verify appears on property page
- [ ] Toggle `featured` → verify appears in The Alt Way carousel
- [ ] Edit homepage headline → verify change appears on site within seconds (Live Content API)
- [ ] Update a singleton page field → verify propagation
- [ ] Add an experience → assign to a property → verify appears on property detail + experiences filter
- [ ] Publish a blog post → verify module builder works
- [ ] Update colour token → verify change cascades across site

### 6.5 — Update smoke test checklist for RentalWise

- [ ] Booking widget loads on property detail page
- [ ] Widget generates a quote for valid dates
- [ ] "Book Now" redirects to correct RentalWise checkout page
- [ ] Search bar on Our Homes filters properties correctly
- [ ] No results state renders correctly
- [ ] API error state degrades gracefully (show all properties, no broken UI)

---

## Phase 7 — Client Review
### Day 10–11

- Share Vercel preview URL
- Walk client through Studio — cover these specifically:
  - How to create and publish a new property listing
  - How to fill in `rentalwisePropertyId` and `rentalwiseIdentifier` — stress this is the booking integration touchpoint
  - How to add reviews and use `published`/`featured` toggles
  - How to update page content on any singleton page
  - How to add an experience and assign it to properties
  - How to update colour tokens (and warn that this affects the whole site)
  - **What NOT to touch:** API tokens, dataset settings, webhook configuration in Sanity Manage
- Collect feedback — fix functional issues only, no scope creep
- Record a Loom walkthrough of Studio for the client's ongoing reference

---

## Phase 8 — Production Migration
### Day 12 · ~2 hours

**Goal:** Zero code changes. Pure config migration. Live on production domain.

### 8.1 — Provision Hetzner

- Create account at [hetzner.com](https://hetzner.com)
- New server: **CX22** (2vCPU, 4GB RAM), Ubuntu 24.04, Nuremberg — €4.15/month
- Enable VPS snapshots immediately from Hetzner dashboard — €0.01/GB/month

### 8.2 — Install Coolify

```bash
ssh root@YOUR_HETZNER_IP
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Access Coolify at `http://YOUR_IP:8000` — complete setup wizard.

### 8.3 — DNS via Cloudflare

- Add domain to Cloudflare (free tier)
- A record → Hetzner IP
- Enable Cloudflare proxy (orange cloud) — CDN in front of Hetzner
- SSL/TLS mode → **Full (Strict)**

> ⚠️ With Cloudflare proxy enabled, real visitor IPs arrive via `CF-Connecting-IP` header, not `x-forwarded-for`. Read from `CF-Connecting-IP` server-side if rate limiting is ever needed on form routes.

### 8.4 — Deploy via Coolify

- Coolify → New Resource → GitHub repo
- Build command: `npm run build`
- Start command: `node .next/standalone/server.js`
- Add all env vars — same as Vercel, but:
  - `NEXT_PUBLIC_BASE_URL` → production domain
  - `RENTALWISE_API_HOST` → `https://app.rentalwise.io` (switch from staging to production here)
- Set domain → SSL auto-configures via Let's Encrypt

### 8.5 — Update Sanity for production

- Sanity Manage → API → CORS Origins → add production domain
- Remove staging/Vercel URLs from CORS if preferred

### 8.6 — Smoke test on production domain

- [ ] Homepage loads correctly
- [ ] All active property cards render on `/our-homes`
- [ ] Availability search filters properties correctly (now hitting production RentalWise)
- [ ] Booking widget loads and generates a quote on a property detail page (`/our-homes/[slug]`)
- [ ] Contact form submits → email arrives in client inbox
- [ ] Partner form on `/join-us` submits → email arrives
- [ ] Blog listing and a blog post load
- [ ] Studio at `/studio` loads and Live Content API updates propagate within seconds (publish a test document, verify it appears without a page refresh)
- [ ] All three legal pages load (`/privacy-policy`, `/terms-of-use`, `/bookings-and-cancellations`)
- [ ] The Alt Way page loads with featured reviews carousel
- [ ] Experiences page loads with filter working
- [ ] 404 page renders for an unknown route

### 8.7 — Post-migration cleanup

- Set up **UptimeRobot** free tier — monitor production URL, email alerts
- Configure GitHub push → Coolify auto-deploy webhook
- Delete Vercel project

---

## May — Testing Period

Per service agreement (Ref: AH-2026-001), May 2026 is the official testing window.

### Visual Editing (wire during first client Studio walkthrough)

Follow [Sanity Visual Editing with Next.js App Router](https://www.sanity.io/docs/visual-editing/visual-editing-with-next-js-app-router).

1. Create `/api/draft-mode/enable` route using `defineEnableDraftMode` from `next-sanity`
2. Add `<VisualEditing />` from `next-sanity` to `(site)/layout.tsx` — conditionally when `draftMode().isEnabled`
3. Configure Presentation Tool in `sanity.config.ts` pointing at the production preview URL
4. Add production domain to Presentation Tool allowed origins in Sanity Manage

> No need to annotate components with `data-sanity` attributes — stega encoding handles field mapping automatically since `sanityFetch` is used everywhere.

### Ongoing during testing

- Bug fixes from client feedback at no additional cost (per agreement)
- SEO content review — meta descriptions, property descriptions, alt text
- Retainer onboarding — brief client on the monthly retainer scope and what's included vs. what's a new project
- Handoff documentation finalized

---

## Post-Launch Maintenance

Monthly (5 minutes):
```bash
ssh root@YOUR_HETZNER_IP
apt update && apt upgrade -y
```

Everything else automated:
- SSL auto-renews via Let's Encrypt through Coolify
- GitHub push → Coolify auto-deploys
- Coolify self-updates via one-click dashboard
- Hetzner snapshots run automatically

**Retainer scope** (₹3,500/month, up to 4 hours):
- RentalWise API monitoring
- Security patches, SSL compliance
- Minor CSS/copy tweaks
- CMS troubleshooting
- Emergency outage resolution (4–8 hours SLA)

**Out of scope (new project billing):**
- New integrations
- New pages or sections not in original Figma
- New custom features
- Blog templates, SEO campaigns

---

## Cost Summary

| Service | Plan | Monthly cost |
|---|---|---|
| Hetzner CX22 | Pay as you go | €4.15 |
| Sanity | Free tier (20 seats, 10k docs, 100GB) | €0 |
| Cloudflare | Free tier | €0 |
| Resend | Free tier (3k emails/month) | €0 |
| Coolify | Self-hosted, open source | €0 |
| **Total** | | **~€4–5/month** |

**Upgrade paths:**
- Sanity Growth ($15/month) — private datasets (store form submissions in Studio), scoped Editor roles
- Resend Paid ($20/month) — 50k emails/month

---

## Env Vars — Complete List

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=             # Viewer-scoped token — Live Content API

# RentalWise
RENTALWISE_API_HOST=https://app.onemineralstaging.com  # staging during dev
# RENTALWISE_API_HOST=https://app.rentalwise.io        # swap at Phase 8 Hetzner deploy
RENTALWISE_API_TOKEN=              # Bearer token — RentalWise → User Settings → API Access

# Email (Resend)
RESEND_API_KEY=
RESEND_FROM_EMAIL=                 # verified sender domain address
RESEND_TO_EMAIL=                   # fallback — overridden by siteSettings.contactFormEmail

# App
NEXT_PUBLIC_BASE_URL=              # http://localhost:3000 → https://althomes.in at production
REVALIDATE_SECRET=                 # random string for webhook security
```
