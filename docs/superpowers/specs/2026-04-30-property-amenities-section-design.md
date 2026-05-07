# Property Amenities Section — Design Spec

**Date:** 2026-04-30  
**Page:** `/our-homes/[slug]` — property detail page  
**Replaces:** Current section 6 (lines 383–423 in `page.tsx`) — generic `container` + `<details>` accordion, off-brand

---

## Goal

Redesign the amenities + house rules section using brand design tokens. Two-column layout with a full-height image on the left, amenity grid + house rules CTA on the right.

---

## Layout

### Desktop (>820px)

```
┌─────────────────────────────────────────────────────────────┐
│  [20% image]  │  [80% content]                              │
│               │                                             │
│  full-height  │  FOR US, IT'S COMFORT FIRST                 │
│  cover image  │                                             │
│               │  [col 1: 9]  [col 2: 9]  [col 3: 9]        │
│               │                                             │
│               │  <teaser text> <House Rules link>           │
└─────────────────────────────────────────────────────────────┘
```

- Left column: `w-1/5 relative self-stretch` — `<Image fill className="object-cover">`
- Right column: `w-4/5 py-[72px] pl-[64px] pr-[90px] bg-background`

### Mobile (≤820px)

Stack vertically:
- Image: `h-[300px] w-full relative` — fixed height, full width, `object-cover`
- Content: full-width, same padding reduced to `px-[18px] py-[48px]`
- Amenities: single column (all items in one list, not 3 cols)

---

## Components

### Right Column — Content (top to bottom)

**1. Heading**

```
font-heading italic text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground
```

Fixed label: `FOR US, IT'S COMFORT FIRST`  
Bottom margin: `mb-[48px]`

**2. Amenity Grid**

Three `<div>` flex columns side-by-side (`flex gap-[32px]`), each column a `flex flex-col gap-[16px]`.

Slices:
- Col 1: `amenities.slice(0, 9)`
- Col 2: `amenities.slice(9, 18)`
- Col 3: `amenities.slice(18, 27)`

Empty columns (fewer than 9/18 amenities total) are not rendered.

Each amenity row:
```tsx
<div className="flex items-center gap-[12px]">
  <ReactIcon name={amenity.icon} size={24} />
  <span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
    {amenity.name}
  </span>
</div>
```

Bottom margin after grid: `mb-[48px]`

**3. House Rules Footer**

```tsx
<p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
  {houseRulesTeaser}{' '}
  <button className="underline underline-offset-2 hover:opacity-70">
    House Rules
  </button>
</p>
```

- `houseRulesTeaser` renders as inline text before the link
- Button is only rendered if `houseRules` PortableText exists
- Button click opens the House Rules modal

---

## House Rules Modal

Managed with `useState` inside `PropertyAmenitiesSection` (`'use client'`).

**Overlay:** `fixed inset-0 z-50 flex items-center justify-center bg-black/60`

**Panel:** `bg-background px-[48px] py-[40px] max-w-[640px] w-full max-h-[80vh] overflow-y-auto relative`

**Contents:**
- "House Rules" heading: `font-heading italic text-[24px] tracking-[0.1em] text-foreground mb-[24px]`
- `<PortableText value={houseRules} />` — styled: `font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground [&_p]:mb-[8px] [&_p:last-child]:mb-0`
- Close button (X): `absolute top-[16px] right-[16px]` — `text-foreground hover:opacity-70`

Clicking overlay backdrop also closes modal.

---

## Data

### New Schema Field

Add to `src/sanity/schemaTypes/documents/property.ts` — amenities group:

```ts
defineField({
  name: 'amenitiesSectionImage',
  title: 'Amenities Section Image',
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
})
```

### GROQ Query Addition

Add to `PROPERTY_QUERY` in `src/sanity/lib/queries.ts`:

```groq
amenitiesSectionImage { asset->, alt },
```

### Existing Fields Used

| Field | Type | Usage |
|-------|------|-------|
| `amenities[]->{ name, icon }` | reference array | Icon + name grid |
| `houseRulesTeaser` | string | Inline subtext before link |
| `houseRules` | PortableText | Modal body content |

---

## File Changes

| File | Action |
|------|--------|
| `src/sanity/schemaTypes/documents/property.ts` | Add `amenitiesSectionImage` field |
| `src/sanity/lib/queries.ts` | Add `amenitiesSectionImage` to `PROPERTY_QUERY` |
| `src/ui/pages/our-homes/property-amenities-section.tsx` | **New** — full section + modal, `'use client'` |
| `src/app/(site)/our-homes/[slug]/page.tsx` | Replace section 6 JSX with `<PropertyAmenitiesSection />` |

Run `npm run typegen` after query change.

---

## Constraints

- `next/image` with `fill` on left column — must pass `sizes` prop
- No `<img>` tags
- No hardcoded colors — use token classes only
- Single 820px breakpoint — `max-[820px]:` prefix only
- Modal backdrop click closes; Escape key not required (not specified)
- Amenity count is not capped — schema can hold any number, but grid only shows first 27
