# LodgingBusiness JSON-LD Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Inject a `LodgingBusiness` JSON-LD script tag into every property detail page (`/our-homes/[slug]`) so search engines and AI platforms can read property metadata.

**Architecture:** Two Sanity schema files get new fields (location object + site singleton). A pure builder function `buildLodgingSchema` in `src/lib/schema-org.ts` assembles the JSON-LD object from typed Sanity data. The property detail page fetches site data alongside property data and injects the script tag at the top of its JSX.

**Tech Stack:** Next.js 15 App Router, Sanity v3, TypeScript, Vitest (unit tests)

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/sanity/schemaTypes/objects/location.ts` | Add 5 structured address fields |
| Modify | `src/sanity/schemaTypes/documents/site.ts` | Add checkinTime + checkoutTime to navbar group |
| Regenerate | `src/sanity/types.ts` | Auto-generated — run typegen, never hand-edit |
| Create | `src/lib/schema-org.ts` | Pure `buildLodgingSchema` builder function |
| Create | `tests/unit/schema-org.test.ts` | Vitest unit tests for the builder |
| Modify | `src/app/(site)/our-homes/[slug]/page.tsx` | Fetch site + inject JSON-LD script tag |

---

## Task 1: Add Structured Address Fields to Location Schema

**Files:**
- Modify: `src/sanity/schemaTypes/objects/location.ts`

- [ ] **Step 1: Add 5 new fields after `lng`**

The file currently ends the fields array with the `lng` field. Insert these 5 fields after `lng` and before the closing `]`:

```ts
import { defineType, defineField } from 'sanity'

export default defineType({
	title: 'Location',
	name: 'location',
	type: 'object',
	fields: [
		defineField({
			name: 'displayLocation',
			title: 'Display Location',
			type: 'string',
		}),
		defineField({
			name: 'distanceFromLandmark',
			title: 'Distance from Landmark',
			type: 'string',
		}),
		defineField({
			name: 'googleMapsUrl',
			title: 'Google Maps URL',
			type: 'url',
		}),
		defineField({
			name: 'lat',
			title: 'Latitude',
			type: 'number',
		}),
		defineField({
			name: 'lng',
			title: 'Longitude',
			type: 'number',
		}),
		defineField({
			name: 'streetAddress',
			title: 'Street Address',
			type: 'string',
		}),
		defineField({
			name: 'addressLocality',
			title: 'City',
			type: 'string',
		}),
		defineField({
			name: 'addressRegion',
			title: 'State / Region',
			type: 'string',
		}),
		defineField({
			name: 'postalCode',
			title: 'Postal Code',
			type: 'string',
		}),
		defineField({
			name: 'addressCountry',
			title: 'Country Code',
			type: 'string',
			description: 'ISO 3166-1 alpha-2, e.g. IN',
		}),
	],
})
```

- [ ] **Step 2: Verify no type errors**

```bash
npm run typecheck
```

Expected: zero errors.

---

## Task 2: Add Check-in/Out Fields to Site Schema and Regenerate Types

**Files:**
- Modify: `src/sanity/schemaTypes/documents/site.ts`
- Regenerate: `src/sanity/types.ts`

- [ ] **Step 1: Add two fields after the `contactPhone` block in site.ts**

Find the `contactPhone` field (around line 100). Insert these two fields immediately after it, still in the `navbar` group:

```ts
		defineField({
			name: 'checkinTime',
			title: 'Check-in Time',
			type: 'string',
			description: '24-hour format, e.g. 14:00',
			group: 'navbar',
		}),
		defineField({
			name: 'checkoutTime',
			title: 'Check-out Time',
			type: 'string',
			description: '24-hour format, e.g. 11:00',
			group: 'navbar',
		}),
```

- [ ] **Step 2: Regenerate Sanity types**

```bash
npm run typegen
```

Expected: `src/sanity/types.ts` updated. `SITE_QUERY_RESULT` now includes `checkinTime?: string` and `checkoutTime?: string`. The `location` shape inside `PROPERTY_QUERY_RESULT` now includes all 5 new address fields.

- [ ] **Step 3: Confirm zero type errors**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 4: Commit schema changes**

```bash
git add src/sanity/schemaTypes/objects/location.ts src/sanity/schemaTypes/documents/site.ts src/sanity/types.ts
git commit -m "feat(schema): add structured address fields to location, add checkinTime/checkoutTime to site"
```

---

## Task 3: Write Failing Unit Tests for buildLodgingSchema

**Files:**
- Create: `tests/unit/schema-org.test.ts`

- [ ] **Step 1: Create the test file**

```ts
import { describe, it, expect } from 'vitest'
import { buildLodgingSchema } from '@/lib/schema-org'

const baseProperty = {
  title: 'The Hilltop',
  slug: { _type: 'slug', current: 'the-hilltop' },
  priceFrom: '₹12,000',
  bedrooms: 3,
  location: {
    displayLocation: 'Ooty, Tamil Nadu',
    streetAddress: '12 Hillside Road',
    addressLocality: 'Ooty',
    addressRegion: 'Tamil Nadu',
    postalCode: '643001',
    addressCountry: 'IN',
    lat: 11.4102,
    lng: 76.695,
    distanceFromLandmark: null,
    googleMapsUrl: null,
  },
  amenities: [
    { name: 'Pool', icon: '🏊' },
    { name: 'WiFi', icon: '📶' },
  ],
  reviews: [
    { guestName: 'Alice', rating: 5, body: 'Great!', guestLocation: 'Mumbai', stayDate: '2024-01-01' },
    { guestName: 'Bob', rating: 3, body: 'OK', guestLocation: 'Delhi', stayDate: '2024-02-01' },
  ],
} as any

const baseSite = {
  contactPhone: '+91 9876543210',
  checkinTime: '14:00',
  checkoutTime: '11:00',
} as any

describe('buildLodgingSchema', () => {
  it('returns correct @context and @type', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result['@context']).toBe('https://schema.org')
    expect(result['@type']).toBe('LodgingBusiness')
  })

  it('includes property name and url', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.name).toBe('The Hilltop')
    expect(result.url).toBe('https://althomes.in/our-homes/the-hilltop#booking')
  })

  it('petsAllowed is always true', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.petsAllowed).toBe(true)
  })

  it('includes site contact, checkin, checkout', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.telephone).toBe('+91 9876543210')
    expect(result.checkinTime).toBe('14:00')
    expect(result.checkoutTime).toBe('11:00')
  })

  it('computes aggregateRating from reviews', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.aggregateRating).toEqual({
      '@type': 'AggregateRating',
      ratingValue: '4.0',
      reviewCount: 2,
      bestRating: 5,
      worstRating: 1,
    })
  })

  it('omits aggregateRating when no reviews', () => {
    const property = { ...baseProperty, reviews: [] }
    const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
    expect(result.aggregateRating).toBeUndefined()
  })

  it('maps amenities to LocationFeatureSpecification', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.amenityFeature).toEqual([
      { '@type': 'LocationFeatureSpecification', name: 'Pool', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
    ])
  })

  it('includes structured address', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.address).toEqual({
      '@type': 'PostalAddress',
      streetAddress: '12 Hillside Road',
      addressLocality: 'Ooty',
      addressRegion: 'Tamil Nadu',
      postalCode: '643001',
      addressCountry: 'IN',
    })
  })

  it('falls back to displayLocation when streetAddress missing', () => {
    const property = {
      ...baseProperty,
      location: { ...baseProperty.location, streetAddress: null },
    }
    const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
    expect((result.address as any).streetAddress).toBe('Ooty, Tamil Nadu')
  })

  it('includes geo coordinates', () => {
    const result = buildLodgingSchema(baseProperty, baseSite, 'https://althomes.in')
    expect(result.geo).toEqual({
      '@type': 'GeoCoordinates',
      latitude: 11.4102,
      longitude: 76.695,
    })
  })

  it('omits geo when lat/lng missing', () => {
    const property = {
      ...baseProperty,
      location: { ...baseProperty.location, lat: null, lng: null },
    }
    const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
    expect(result.geo).toBeUndefined()
  })

  it('omits address when location is null', () => {
    const property = { ...baseProperty, location: null }
    const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
    expect(result.address).toBeUndefined()
    expect(result.geo).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run tests — confirm they fail**

```bash
npm run test:unit
```

Expected: FAIL — `Cannot find module '@/lib/schema-org'`

---

## Task 4: Implement buildLodgingSchema

**Files:**
- Create: `src/lib/schema-org.ts`

- [ ] **Step 1: Create the builder**

```ts
import type { PROPERTY_QUERY_RESULT, SITE_QUERY_RESULT } from '@/sanity/types'

export function buildLodgingSchema(
  property: NonNullable<PROPERTY_QUERY_RESULT>,
  site: NonNullable<SITE_QUERY_RESULT>,
  baseUrl: string,
) {
  const reviews = property.reviews ?? []
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.title,
    url: `${baseUrl}/our-homes/${property.slug?.current}#booking`,
    telephone: site.contactPhone ?? undefined,
    priceRange: property.priceFrom ?? undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    petsAllowed: true,
    checkinTime: site.checkinTime ?? undefined,
    checkoutTime: site.checkoutTime ?? undefined,
    amenityFeature: (property.amenities ?? []).map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a.name,
      value: true,
    })),
  }

  if (property.location) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: property.location.streetAddress ?? property.location.displayLocation,
      addressLocality: property.location.addressLocality ?? undefined,
      addressRegion: property.location.addressRegion ?? undefined,
      postalCode: property.location.postalCode ?? undefined,
      addressCountry: property.location.addressCountry ?? 'IN',
    }

    if (property.location.lat && property.location.lng) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: property.location.lat,
        longitude: property.location.lng,
      }
    }
  }

  if (avgRating !== null && reviews.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}
```

- [ ] **Step 2: Run tests — confirm all pass**

```bash
npm run test:unit
```

Expected: 12 tests PASS.

- [ ] **Step 3: Confirm zero type errors**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 4: Commit**

```bash
git add src/lib/schema-org.ts tests/unit/schema-org.test.ts
git commit -m "feat(seo): add buildLodgingSchema utility with full unit test coverage"
```

---

## Task 5: Wire JSON-LD Into Property Detail Page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`

- [ ] **Step 1: Update the import line at the top of the file**

The file currently imports only `getProperty`:

```ts
import { getProperty, getSite } from '@/sanity/lib/data'
```

Add the schema builder import on the next line:

```ts
import { buildLodgingSchema } from '@/lib/schema-org'
```

- [ ] **Step 2: Fetch site alongside property in `PropertyDetailPage`**

Find (around line 13):

```ts
	const property = await getProperty(slug)
	if (!property) notFound()
```

Replace with:

```ts
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	if (!property) notFound()
```

`getSite` is wrapped with React `cache()` — no duplicate Sanity fetch occurs (it was already called in `generateMetadata`).

- [ ] **Step 3: Build schema and inject script tag**

Immediately before the `return` statement, add:

```ts
	const schema = site ? buildLodgingSchema(property, site, process.env.NEXT_PUBLIC_BASE_URL ?? '') : null
```

Then wrap the returned JSX in a fragment and prepend the script tag. The current return opens with `<main className="flex-1">`. Change it to:

```tsx
	return (
		<>
			{schema && (
				<script
					type="application/ld+json"
					{...{ dangerouslySetInnerHTML: { __html: JSON.stringify(schema) } }}
				/>
			)}
			<main className="flex-1">
				{/* existing JSX unchanged below this line */}
```

Close the new fragment at the end of the return (after the existing closing `</main>`):

```tsx
		</main>
		</>
	)
```

Note: `JSON.stringify` escapes `<`, `>`, and `&`. Data is sourced from Sanity CMS (server-side editor-controlled). This is the standard Next.js App Router JSON-LD injection pattern.

- [ ] **Step 4: Confirm zero type errors**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 5: Run unit tests — confirm no regressions**

```bash
npm run test:unit
```

Expected: all tests pass.

- [ ] **Step 6: Verify locally**

```bash
npm run dev
```

Open any property page (`http://localhost:3000/our-homes/<slug>`). Right-click → View Page Source. Search for `application/ld+json`. Confirm the JSON-LD block is present and contains correct property name, address, amenities, and rating.

- [ ] **Step 7: Commit**

```bash
git add "src/app/(site)/our-homes/[slug]/page.tsx"
git commit -m "feat(seo): inject LodgingBusiness JSON-LD on property detail pages"
```

---

## Task 6: Fill CMS Data and Validate

> Done in Sanity Studio — no code changes.

- [ ] **Step 1: Open Studio** at `/studio`. Navigate to **Site** → **Navbar** tab. Fill in:
  - `Check-in Time`: your actual check-in time in 24h format (e.g. `14:00`)
  - `Check-out Time`: your actual check-out time (e.g. `11:00`)

- [ ] **Step 2: For each property**, open the property document → **Location** tab. Fill in:
  - Street Address
  - City
  - State / Region
  - Postal Code
  - Country Code (`IN` for India)

- [ ] **Step 3: Validate** each live property URL using Google Rich Results Test (`https://search.google.com/test/rich-results`). Confirm `LodgingBusiness` structured data block appears. Share results with stakeholder.

---

## Spec Coverage Check

| Spec requirement | Covered by |
|---|---|
| Property name | Task 4 — `name: property.title` |
| Address + geo | Tasks 1 + 4 |
| Property type LodgingBusiness | Task 4 — hardcoded `@type` |
| Check-in / check-out times | Tasks 2 + 4 |
| Price range | Task 4 — `priceRange: property.priceFrom` |
| Number of rooms | Task 4 — `numberOfRooms: property.bedrooms` |
| Amenities list | Task 4 — `amenityFeature` array |
| Pet policy | Task 4 — `petsAllowed: true` |
| Phone / contact | Task 4 — `telephone: site.contactPhone` |
| Booking page link | Task 4 — `url` with `#booking` anchor |
| Aggregate rating | Task 4 — computed from `reviews[].rating` |
| Inject on every property page | Task 5 |
| Google Rich Results validation | Task 6 |
