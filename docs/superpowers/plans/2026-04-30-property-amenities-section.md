# Property Amenities Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the off-brand amenities section on the property detail page with a two-column layout — full-height image left, amenity grid + house rules modal right — using brand design tokens.

**Architecture:** Extract to a new `PropertyAmenitiesSection` client component (matching the `PropertyGallerySection` / `PropertyExperiencesSection` pattern). A pure `splitAmenityColumns` utility handles the 3-column slice logic and is tested independently. The modal is managed with `useState` inside the client component. Page.tsx passes pre-resolved image URLs and raw Sanity data as props.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind v4 · Sanity v3 · next/image · next-sanity PortableText · Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/sanity/schemaTypes/documents/property.ts` | Modify | Add `amenitiesSectionImage` field to specs group |
| `src/sanity/lib/queries.ts` | Modify | Add `amenitiesSectionImage { asset->, alt }` to PROPERTY_QUERY |
| `src/sanity/types.ts` | Auto-generated | Re-run typegen after query change |
| `src/ui/pages/our-homes/amenity-columns.ts` | **Create** | Pure `splitAmenityColumns` utility — no imports, no side effects |
| `tests/unit/amenity-columns.test.ts` | **Create** | Unit tests for `splitAmenityColumns` |
| `src/ui/pages/our-homes/property-amenities-section.tsx` | **Create** | Client component — full section layout + house rules modal |
| `src/app/(site)/our-homes/[slug]/page.tsx` | Modify | Replace section 6 JSX, add image URL resolution, import new component |

---

## Task 1: Add amenitiesSectionImage to Sanity schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/property.ts` — after line 301 (closing `}),` of `houseRules` field, before `// Location` comment)

- [ ] **Step 1: Insert the new field**

In `property.ts`, find the `houseRules` defineField block and insert immediately after its closing `}),`:

```ts
		defineField({
			name: 'amenitiesSectionImage',
			title: 'Amenities Section Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
			group: 'specs',
		}),
```

The result should read (houseRules → amenitiesSectionImage → `// Location`):

```ts
		defineField({
			name: 'houseRules',
			title: 'House Rules',
			type: 'blockContent',
			group: 'specs',
		}),
		defineField({
			name: 'amenitiesSectionImage',
			title: 'Amenities Section Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
			group: 'specs',
		}),

		// Location
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/property.ts
git commit -m "feat(schema): add amenitiesSectionImage field to property"
```

---

## Task 2: Add amenitiesSectionImage to GROQ query + regenerate types

**Files:**
- Modify: `src/sanity/lib/queries.ts` — line 104, after `amenities[]->{ name, icon },`

- [ ] **Step 1: Add field to PROPERTY_QUERY**

In `queries.ts`, find `amenities[]->{ name, icon },` and add the new line immediately after:

```groq
	amenities[]->{ name, icon },
	amenitiesSectionImage { asset->, alt },
```

- [ ] **Step 2: Regenerate types**

```bash
npm run typegen
```

Expected: `src/sanity/types.ts` updates — no errors printed.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/lib/queries.ts src/sanity/types.ts
git commit -m "feat(query): add amenitiesSectionImage to PROPERTY_QUERY"
```

---

## Task 3: Write failing test for splitAmenityColumns

**Files:**
- Create: `tests/unit/amenity-columns.test.ts`

- [ ] **Step 1: Create the test file**

```ts
import { describe, it, expect } from 'vitest'
import { splitAmenityColumns } from '@/ui/pages/our-homes/amenity-columns'

type Amenity = { name: string | null; icon: string | null }

describe('splitAmenityColumns', () => {
  it('returns three empty arrays for empty input', () => {
    expect(splitAmenityColumns([])).toEqual([[], [], []])
  })

  it('puts first 9 in col 1, next 9 in col 2, next 9 in col 3', () => {
    const amenities: Amenity[] = Array.from({ length: 27 }, (_, i) => ({
      name: `A${i}`,
      icon: null,
    }))
    const [col1, col2, col3] = splitAmenityColumns(amenities)
    expect(col1).toHaveLength(9)
    expect(col2).toHaveLength(9)
    expect(col3).toHaveLength(9)
    expect(col1[0].name).toBe('A0')
    expect(col2[0].name).toBe('A9')
    expect(col3[0].name).toBe('A18')
  })

  it('handles fewer than 9 amenities — all in col 1', () => {
    const amenities: Amenity[] = [
      { name: 'WiFi', icon: 'FaWifi' },
      { name: 'Pool', icon: 'FaSwimmingPool' },
    ]
    const [col1, col2, col3] = splitAmenityColumns(amenities)
    expect(col1).toHaveLength(2)
    expect(col2).toHaveLength(0)
    expect(col3).toHaveLength(0)
  })

  it('handles 10 amenities — 9 in col 1, 1 in col 2', () => {
    const amenities: Amenity[] = Array.from({ length: 10 }, (_, i) => ({
      name: `A${i}`,
      icon: null,
    }))
    const [col1, col2, col3] = splitAmenityColumns(amenities)
    expect(col1).toHaveLength(9)
    expect(col2).toHaveLength(1)
    expect(col3).toHaveLength(0)
  })

  it('caps at 27 — ignores extras beyond index 26', () => {
    const amenities: Amenity[] = Array.from({ length: 30 }, (_, i) => ({
      name: `A${i}`,
      icon: null,
    }))
    const [col1, col2, col3] = splitAmenityColumns(amenities)
    expect(col1).toHaveLength(9)
    expect(col2).toHaveLength(9)
    expect(col3).toHaveLength(9)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:unit -- amenity-columns
```

Expected: FAIL — "Cannot find module '@/ui/pages/our-homes/amenity-columns'"

---

## Task 4: Implement splitAmenityColumns utility

**Files:**
- Create: `src/ui/pages/our-homes/amenity-columns.ts`

- [ ] **Step 1: Create the utility file**

```ts
type Amenity = { name: string | null; icon: string | null }

export function splitAmenityColumns(
  amenities: Amenity[],
): [Amenity[], Amenity[], Amenity[]] {
  const capped = amenities.slice(0, 27)
  return [capped.slice(0, 9), capped.slice(9, 18), capped.slice(18, 27)]
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm run test:unit -- amenity-columns
```

Expected: 5 tests pass.

- [ ] **Step 3: Run full test suite to verify no regressions**

```bash
npm run test:unit
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/ui/pages/our-homes/amenity-columns.ts tests/unit/amenity-columns.test.ts
git commit -m "feat: add splitAmenityColumns utility with unit tests"
```

---

## Task 5: Build PropertyAmenitiesSection component

**Files:**
- Create: `src/ui/pages/our-homes/property-amenities-section.tsx`

- [ ] **Step 1: Create the component file**

```tsx
'use client'

import Image from 'next/image'
import { useState } from 'react'
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'next-sanity'
import ReactIcon from '@/ui/atoms/react-icon'
import { splitAmenityColumns } from './amenity-columns'

type Amenity = { name: string | null; icon: string | null }

type Props = {
  imageUrl: string | null
  amenities: Amenity[]
  houseRulesTeaser: string | null | undefined
  houseRules: PortableTextBlock[] | null | undefined
}

export default function PropertyAmenitiesSection({
  imageUrl,
  amenities,
  houseRulesTeaser,
  houseRules,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [col1, col2, col3] = splitAmenityColumns(amenities)

  return (
    <section className="flex bg-background max-[820px]:flex-col">
      {/* Left: full-height image */}
      <div className="relative w-1/5 self-stretch max-[820px]:h-[300px] max-[820px]:w-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 820px) 100vw, 20vw"
          />
        )}
      </div>

      {/* Right: content */}
      <div className="w-4/5 py-[72px] pl-[64px] pr-[90px] max-[820px]:w-full max-[820px]:px-[18px] max-[820px]:py-[48px]">
        <h2 className="mb-[48px] font-heading italic text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground">
          FOR US, IT&rsquo;S COMFORT FIRST
        </h2>

        {amenities.length > 0 && (
          <div className="mb-[48px] flex gap-[32px] max-[820px]:flex-col">
            {([col1, col2, col3] as Amenity[][]).map((col, ci) =>
              col.length > 0 ? (
                <div key={ci} className="flex flex-col gap-[16px]">
                  {col.map((amenity, ai) => (
                    <div key={ai} className="flex items-center gap-[12px]">
                      <ReactIcon name={amenity.icon} size={24} />
                      <span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
                        {amenity.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null,
            )}
          </div>
        )}

        {(houseRulesTeaser || houseRules) && (
          <p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
            {houseRulesTeaser && <span>{houseRulesTeaser} </span>}
            {houseRules && (
              <button
                onClick={() => setModalOpen(true)}
                className="underline underline-offset-2 hover:opacity-70"
              >
                House Rules
              </button>
            )}
          </p>
        )}
      </div>

      {/* House rules modal */}
      {modalOpen && houseRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-h-[80vh] w-full max-w-[640px] overflow-y-auto bg-background px-[48px] py-[40px]"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-[16px] top-[16px] font-sans text-[20px] leading-none text-foreground hover:opacity-70"
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="mb-[24px] font-heading italic text-[24px] leading-[32px] tracking-[0.1em] text-foreground">
              House Rules
            </h3>
            <div className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground [&_p]:mb-[8px] [&_p:last-child]:mb-0">
              <PortableText value={houseRules} />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: no errors. If `PortableTextBlock` type conflicts with the TypeGen-generated type for `houseRules`, open `src/sanity/types.ts`, find `PROPERTY_QUERY_RESULT['houseRules']`, and use that type instead.

- [ ] **Step 3: Commit**

```bash
git add src/ui/pages/our-homes/property-amenities-section.tsx
git commit -m "feat(ui): add PropertyAmenitiesSection component with house rules modal"
```

---

## Task 6: Wire PropertyAmenitiesSection into page.tsx

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`

The current section 6 (amenities + house rules) spans lines ~383–423. Replace it entirely.

- [ ] **Step 1: Add import at top of file**

After the existing `PropertyExperiencesSection` import (line 10), add:

```ts
import PropertyAmenitiesSection from '@/ui/pages/our-homes/property-amenities-section'
```

- [ ] **Step 2: Add image URL resolution**

After the existing `heroUrl` constant (around line 29), add:

```ts
const amenitiesImageUrl = property.amenitiesSectionImage?.asset
  ? urlFor(property.amenitiesSectionImage.asset).width(800).url()
  : null
```

- [ ] **Step 3: Replace section 6 JSX**

Find the old section 6 block (starts with `{/* 6. Amenities + House Rules */}`, ends with closing `}` of the outer conditional around line 423). Replace the entire block with:

```tsx
{/* 6. Amenities + House Rules */}
{((property.amenities && property.amenities.length > 0) ||
  property.houseRulesTeaser ||
  property.houseRules) && (
  <PropertyAmenitiesSection
    imageUrl={amenitiesImageUrl}
    amenities={property.amenities ?? []}
    houseRulesTeaser={property.houseRulesTeaser}
    houseRules={property.houseRules}
  />
)}
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: no errors. If `property.houseRules` type doesn't match `PortableTextBlock[]`, cast it:
```ts
houseRules={property.houseRules as PortableTextBlock[] | null | undefined}
```

- [ ] **Step 5: Run full test suite**

```bash
npm run test:unit
```

Expected: all tests pass (no regressions).

- [ ] **Step 6: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx
git commit -m "feat(ui): wire PropertyAmenitiesSection into property detail page"
```

---

## Task 7: Smoke test

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open a property detail page**

Navigate to `http://localhost:3000/our-homes/<any-slug>`.

- [ ] **Step 3: Verify layout**

Check:
- Left column is 20% width with image (or empty bg-background if no image uploaded yet)
- Right column shows heading "FOR US, IT'S COMFORT FIRST" in italic Playfair
- Amenities render in up to 3 columns with icons + names
- `houseRulesTeaser` text appears before "House Rules" link

- [ ] **Step 4: Test modal**

Click "House Rules" link:
- Modal overlay appears (`bg-black/60`)
- House rules content renders in `bg-background` panel
- Clicking × closes modal
- Clicking backdrop closes modal

- [ ] **Step 5: Upload test image in Studio**

Go to `http://localhost:3000/studio`, open a property, find "Amenities Section Image" in the Specs group, upload an image. Verify it renders in the left column on the frontend.

- [ ] **Step 6: Check mobile**

Resize browser to <820px:
- Image stacks on top at `h-[300px]`
- Content below, full width
- Amenities collapse to single column
