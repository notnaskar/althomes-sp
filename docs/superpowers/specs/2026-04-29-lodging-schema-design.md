# LodgingBusiness JSON-LD Structured Data

**Date:** 2026-04-29
**Scope:** Every property detail page (`/our-homes/[slug]`)
**Reference:** https://schema.org/LodgingBusiness

## Goal

Inject a `LodgingBusiness` JSON-LD block into the `<head>` of every property listing page. Tells search engines and AI platforms the property's type, location, amenities, pricing, and ratings without changing any visible UI.

---

## Schema Fields & Data Sources

| JSON-LD Field | Source | Notes |
|---|---|---|
| `@type` | Hardcoded `"LodgingBusiness"` | All properties same type |
| `name` | `property.title` | Required |
| `url` | `${NEXT_PUBLIC_BASE_URL}/our-homes/${slug}#booking` | Booking anchor |
| `telephone` | `site.contactPhone` | Site singleton |
| `priceRange` | `property.priceFrom` | Free-form string e.g. "₹12,000" |
| `numberOfRooms` | `property.bedrooms` | |
| `petsAllowed` | Hardcoded `true` | All properties pet-friendly |
| `checkinTime` | `site.checkinTime` | New field on site singleton |
| `checkoutTime` | `site.checkoutTime` | New field on site singleton |
| `amenityFeature[]` | `property.amenities[]->{ name }` | Mapped to `LocationFeatureSpecification` |
| `address` | `property.location.*` | New structured fields on location object |
| `geo` | `property.location.lat` / `property.location.lng` | Existing fields |
| `aggregateRating` | Computed from `property.reviews[].rating` | Omitted if no reviews |

---

## Schema Changes

### 1. `src/sanity/schemaTypes/objects/location.ts`

Add 5 new fields (existing `displayLocation` stays — frontend display unchanged):

```ts
{ name: 'streetAddress', title: 'Street Address', type: 'string' }
{ name: 'addressLocality', title: 'City', type: 'string' }
{ name: 'addressRegion', title: 'State / Region', type: 'string' }
{ name: 'postalCode', title: 'Postal Code', type: 'string' }
{ name: 'addressCountry', title: 'Country Code', type: 'string', description: 'ISO 3166-1 alpha-2, e.g. IN' }
```

### 2. `src/sanity/schemaTypes/documents/site.ts`

Add 2 new fields in the `navbar` group alongside `contactPhone`:

```ts
{ name: 'checkinTime', title: 'Check-in Time', type: 'string', description: '24h format, e.g. 14:00' }
{ name: 'checkoutTime', title: 'Check-out Time', type: 'string', description: '24h format, e.g. 11:00' }
```

---

## GROQ Query Changes

**None required.**

- `PROPERTY_QUERY` uses `...` spread + explicit `location` — new location fields auto-included.
- `SITE_QUERY` uses full spread — new `checkinTime`/`checkoutTime` auto-included.
- `amenities[]->{ name }` already fetched.
- `reviews[]{ rating }` already fetched.

---

## New Files

### `src/lib/schema-org.ts`

Pure builder function — no React, no side effects. Takes typed Sanity query results and returns a plain JSON-LD object.

Fields computed:
- `aggregateRating` — average of `reviews[].rating`, omitted if zero reviews
- `amenityFeature` — each amenity mapped to `LocationFeatureSpecification`
- `address` — falls back to `displayLocation` for `streetAddress` if structured fields not yet filled
- `geo` — only included when both `lat` and `lng` are present

---

## Modified Files

### `src/app/(site)/our-homes/[slug]/page.tsx`

**Change 1** — `PropertyDetailPage` fetches site alongside property:
```ts
const [property, site] = await Promise.all([getProperty(slug), getSite()])
```
`getSite` is wrapped with React `cache()` — already called in `generateMetadata`, so no duplicate Sanity fetch.

**Change 2** — JSON-LD script tag at top of returned JSX:
```tsx
// JSON-LD injection — content is JSON.stringify output (no user HTML, XSS-safe)
<script type="application/ld+json" {...{ dangerouslySetInnerHTML: { __html: JSON.stringify(schema) } }} />
```

> **Security note:** `JSON.stringify` escapes all HTML special characters (`<`, `>`, `&`). The data source is Sanity CMS (server-side, editor-controlled). This is the standard Next.js App Router pattern for JSON-LD — not a user-input injection point.

---

## Execution Order

1. Add structured address fields to `src/sanity/schemaTypes/objects/location.ts`
2. Add `checkinTime` / `checkoutTime` to `src/sanity/schemaTypes/documents/site.ts`
3. Run `npm run typegen`
4. Create `src/lib/schema-org.ts` with `buildLodgingSchema`
5. Update `src/app/(site)/our-homes/[slug]/page.tsx` — add `getSite()` + inject script tag
6. Run `npm run typecheck` — confirm zero errors
7. Test locally: view-source on any property page, confirm JSON-LD block in HTML
8. Fill in Studio: open Site doc, add `checkinTime`/`checkoutTime`; open each property, fill structured address fields
9. Validate: Google Rich Results Test on each live property URL

---

## Constraints

- `output: 'standalone'` in `next.config.ts` — do not touch
- No Vercel APIs
- No Sanity writes — read-only data flow
- `getSite()` already uses React `cache()` — safe to call in both `generateMetadata` and page component
