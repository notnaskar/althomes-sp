# FAQ + Cause Section + Reviews UI Design

Date: 2026-05-01
Status: Approved

---

## Overview

Four coordinated changes to the property detail page and shared UI:
1. `a-day-without-sun` font token
2. FAQ CRUD per property with Studio copy UX
3. Cause section two-column redesign
4. Reviews section — reusable slider component

---

## 1. Font Token: `a-day-without-sun`

### Requirement
Selectively used on brand headings across pages. Must not hurt LCP / PageSpeed.

### Approach
`next/font/local` — zero external requests, Next.js handles preload + swap automatically.

### Implementation
- **Font file:** `/public/fonts/a-day-without-sun.woff2` (woff2 preferred; add woff as fallback)
  - ⚠️ File must be supplied by developer from Adobe Fonts license download
- **Load in:** `src/app/(site)/layout.tsx` via `localFont()`
- **CSS variable:** `--font-stories`
- **Tailwind token:** `font-stories` → `var(--font-stories)`
- **Usage class:** `font-stories font-normal not-italic` (weight 400, style normal per spec)

### CSS spec
```css
font-family: 'a-day-without-sun', sans-serif;
font-style: normal;
font-weight: 400;
```

---

## 2. FAQ Per Property

### Schema: `src/sanity/schemaTypes/documents/property.ts`
- New group: `{ name: 'faqs', title: 'FAQs' }`
- New field:
  ```ts
  faqs: array of {
    name: 'faq'
    type: 'object'
    fields: [
      { name: 'question', type: 'string', validation: required }
      { name: 'answer', type: 'blockContent' }
    ]
    preview: { select: { title: 'question' } }
  }
  ```

### Query: `src/sanity/lib/queries.ts`
Add to `PROPERTY_QUERY`:
```groq
faqs[]{ question, answer }
```

### Studio UX: Import FAQs Document Action
**File:** `src/sanity/actions/importFaqsAction.tsx`
**Register in:** `sanity.config.ts` → `document.actions` for type `property`

**Behaviour:**
1. Button label: "Import FAQs" — appears in document action bar
2. Opens a dialog with two steps:
   - Step 1: Searchable list of all other property documents, showing title + FAQ count. Select one.
   - Step 2: Checklist of that property's FAQ items (question as label). Two actions:
     - "Import All" — appends all items
     - "Import Selected" — appends only checked items
3. Import is **additive** (appends to existing array, never replaces)
4. Uses `client.fetch` to load source property, then `onChange` / `patch` to update current document

### UI Component: `src/ui/pages/our-homes/property-faq-section.tsx`
- Server component (no interactivity at section level)
- Props: `faqs: Array<{ question: string; answer: BlockContent }>`
- Renders heading "Frequently Asked Questions" + accordion list
- Accordion: use native `<details>/<summary>` HTML elements with CSS `transition` on content height — avoids refactoring the module-scoped `accordion-list.tsx`
- Guard: renders nothing if `faqs` is empty or undefined

### Placement in Property Detail Page
Add after the Amenities section, before the Experiences section. Guard: `{property.faqs?.length > 0 && <PropertyFaqSection faqs={property.faqs} />}`

---

## 3. Cause Section Redesign

### Current state
Single-column: headline → body → 2 images side-by-side grid. `bg-primary` section.

### New layout
Two-column grid, `min-h-[50vh]`, `bg-primary`.

```
┌─────────────────────┬─────────────────┐
│  LEFT (~55%)        │  RIGHT (~45%)   │
│  ┌───────────────┐  │                 │
│  │  causeImages  │  │  causeHeadline  │
│  │  [0] — big    │  │                 │
│  │  image, fill  │  │  causeBody      │
│  │           ┌──┐│  │  (PortableText) │
│  │           │[1]│  │                 │
│  │           └──┘│  │                 │
│  └───────────────┘  │                 │
└─────────────────────┴─────────────────┘
```

- Left column: `relative` container, `overflow-hidden`, rounded on desktop
  - `causeImages[0]`: `fill` + `object-cover` (full column)
  - `causeImages[1]`: `absolute bottom-4 right-4`, `w-[20%]`, `aspect-square` or `aspect-[3/4]`, `object-cover`, `rounded-xl`
- Right column: `flex flex-col justify-center`, padded, `text-primary-foreground`
  - `causeHeadline` — `font-heading italic` heading
  - `causeBody` — PortableText, `text-[15px] leading-[23px] tracking-[0.1em]`
- Mobile (`max-[820px]`): stack vertically, images stacked (decorator hidden or shown below)
- Schema: **unchanged** — `causeImages` already validates `length(2)`

---

## 4. Reviews Section Component

### Schema: `src/sanity/schemaTypes/documents/review.ts`
Add field:
```ts
{ name: 'guestPhoto', title: 'Guest Photo', type: 'image', options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: required }] }
```

### Query updates: `src/sanity/lib/queries.ts`

**`PROPERTY_QUERY`** reviews sub-query — extend projection:
```groq
"reviews": *[_type=='review' && references(^._id) && published==true] | order(stayDate desc) [0..20]{
  guestName, rating, body, guestLocation, stayDate,
  guestPhoto { asset->, alt },
  "propertyTitle": property->title
}
```

**`ALT_WAY_PAGE_QUERY`** reviews projection — same additions:
```groq
reviews[]->{ guestName, rating, body, guestLocation, stayDate, guestPhoto { asset->, alt }, "propertyTitle": property->title }
```

Run `npm run typegen` after both query changes.

### Component: `src/ui/molecules/reviews-section.tsx`
`'use client'` — slider state. Receives `reviews[]` as props (no Sanity fetch).

**Props interface:**
```ts
type Review = {
  guestName: string | null
  rating: number | null
  body: string | null
  guestLocation: string | null
  stayDate: string | null
  guestPhoto: SanityImageField | null
  propertyTitle: string | null
}
type Props = { reviews: Review[] }
```

**Layout:**
```
<section class="grid grid-cols-2 gap-0 max-[820px]:grid-cols-1">

  LEFT col (bg-primary or neutral, padded):
    <p class="font-stories font-normal ...">
      "Hearts full, stories shared
       by guests who took back more than just memories.
       These are the Alt Stories."
    </p>

    Thumbnail slider row (horizontal scroll, or flex with prev/next):
      {reviews.map((r, i) =>
        <button onClick={() => setActive(i)}
                class={active===i ? 'ring-2 ring-accent' : ''}>
          <Img guestPhoto w-[72px] h-[72px] rounded-full object-cover />
        </button>
      )}
      Prev / Next arrow buttons

  RIGHT col (bg-background, flex center):
    <ReviewCard review={reviews[activeIndex]} />
```

**ReviewCard:**
- `rotate-[2deg]` (slight tilt right)
- `rounded-2xl border shadow-md p-6`
- `<Img guestPhoto className="w-full object-cover rounded-xl" style={{ height: '60%' }} />`
- Below image (all `text-center`):
  - `body` — italic, font-size medium
  - `guestName` — bold
  - `propertyTitle` — muted, small
  - `guestLocation` — muted, small
- CSS `transition-opacity duration-300` on card for index changes

**Guard:** renders nothing if `reviews` is empty.

### Integration
- **Property detail page** `src/app/(site)/our-homes/[slug]/page.tsx`: Replace existing reviews section (section 8) with `<ReviewsSection reviews={cappedReviews} />`
- **Alt-way page** `src/app/(site)/the-alt-way/page.tsx`: Add `<ReviewsSection reviews={page.reviews ?? []} />` in appropriate position

---

## Implementation Plan (Parallel Workstreams)

### Phase 1 — Parallel
| Worktree | Work | Files |
|----------|------|-------|
| **A** | Schema + query + typegen | `review.ts`, `property.ts`, `queries.ts`, `types.ts` |
| **B** | Font token + cause section UI | `layout.tsx`, `app.css`, `tailwind.config.ts`, `[slug]/page.tsx` (cause block only) |

### Phase 2 — After A (typegen output available)
| Worktree | Work | Files |
|----------|------|-------|
| **C** | Reviews section component + integration | `reviews-section.tsx`, `[slug]/page.tsx`, `the-alt-way/page.tsx` |
| **D** | FAQ section + Studio document action | `property-faq-section.tsx`, `importFaqsAction.tsx`, `sanity.config.ts`, `[slug]/page.tsx` |

---

## Out of Scope
- Review image on alt-way page if altWayPage reviews are fetched differently (verify at implementation time)
- Pagination of reviews beyond 20
- FAQ reorder drag-and-drop (Sanity array handles this natively)
