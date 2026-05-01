# FAQ + Cause Section + Reviews UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-property FAQ with Studio copy-paste UX, redesign the cause section as a 2-column image+text layout, create a reusable reviews slider component, and add the `a-day-without-sun` font as the `font-stories` design token.

**Architecture:** Phase 1A (schema + queries + typegen) and Phase 1B (font token + cause section) run in parallel via git worktrees since they touch different files. Phase 2 (reviews component + FAQ section UI) runs after Phase 1A completes because it depends on the generated types. All UI components receive data as props — no Sanity fetches inside components.

**Tech Stack:** Next.js 16 App Router, Sanity v3, Tailwind CSS v4, `next/font/local`, TypeScript, GROQ with `defineQuery()`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/sanity/schemaTypes/documents/review.ts` | Add `guestPhoto` image field |
| Modify | `src/sanity/schemaTypes/documents/property.ts` | Add `faqs` group + `faqs` array field |
| Modify | `src/sanity/lib/queries.ts` | Add `faqs` to PROPERTY_QUERY; extend reviews projections in PROPERTY_QUERY + ALT_WAY_PAGE_QUERY |
| Auto-generated | `src/sanity/types.ts` | Re-run typegen — do not hand-edit |
| Move | `public/fonts/a-day-without-sun.otf` → `src/app/fonts/a-day-without-sun.otf` | Font in src tree for next/font/local |
| Modify | `src/app/(site)/layout.tsx` | Add `localFont` for stories font + add to `ALL_FONT_CLASSES` |
| Modify | `src/app.css` | Add `--font-stories` token to `@theme` block |
| Modify | `src/app/(site)/our-homes/[slug]/page.tsx` | Replace cause section block; add FAQ section; replace reviews section |
| Modify | `src/app/(site)/the-alt-way/page.tsx` | Add `<ReviewsSection>` |
| Create | `src/ui/molecules/reviews-section.tsx` | Client component — slider state, renders quote + thumbnails + review card |
| Create | `src/ui/pages/our-homes/property-faq-section.tsx` | Server component — renders FAQ accordion using `<details>/<summary>` |

---

## ⚡ Parallel Execution Note

**Run Tasks 1–3 and Tasks 4–5 in separate git worktrees simultaneously.**

```bash
# Worktree A — schema + queries (Tasks 1-3)
git worktree add ../althomes-sp-schema-work staging
# Worktree B — font + cause section (Tasks 4-5)
git worktree add ../althomes-sp-ui-work staging
```

Merge both worktrees back to `staging` before starting Task 6.

---

## PHASE 1A — Schema + Queries + Typegen

### Task 1: Add `guestPhoto` to review schema + `faqs` to property schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/review.ts`
- Modify: `src/sanity/schemaTypes/documents/property.ts`

- [ ] **Step 1: Add `guestPhoto` field to `review.ts`**

Open `src/sanity/schemaTypes/documents/review.ts`. After the `featured` field (before the closing of `fields: [`), add:

```ts
defineField({
  name: 'guestPhoto',
  title: 'Guest Photo',
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alt text',
      validation: (Rule) => Rule.required(),
    },
  ],
}),
```

- [ ] **Step 2: Add `faqs` group to property schema**

Open `src/sanity/schemaTypes/documents/property.ts`. In the `groups` array, after the `experiences` group entry and before `causes`, add:

```ts
{ name: 'faqs', title: 'FAQs' },
```

So the groups order becomes: `identity`, `rentalwise`, `listingCard`, `intro`, `specs`, `location`, `highlights`, `experiences`, **`faqs`**, `causes`, `reviews`, `seo`.

- [ ] **Step 3: Add `faqs` field to property schema**

In `property.ts`, after the experiences-related fields and before the `// Causes` comment block, add:

```ts
// FAQs
defineField({
  name: 'faqs',
  title: 'FAQs',
  type: 'array',
  group: 'faqs',
  of: [
    {
      name: 'faq',
      type: 'object',
      fields: [
        defineField({
          name: 'question',
          title: 'Question',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'answer',
          title: 'Answer',
          type: 'blockContent',
        }),
      ],
      preview: {
        select: { title: 'question' },
      },
    },
  ],
}),
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npm run typecheck
```

Expected: zero errors. (Types in `types.ts` not updated yet — that comes in Task 2.)

- [ ] **Step 5: Commit**

```bash
git add src/sanity/schemaTypes/documents/review.ts src/sanity/schemaTypes/documents/property.ts
git commit -m "feat(schema): add guestPhoto to review, add faqs field to property"
```

---

### Task 2: Update GROQ queries

**Files:**
- Modify: `src/sanity/lib/queries.ts`

- [ ] **Step 1: Update `PROPERTY_QUERY` — add `faqs` and extend reviews projection**

In `src/sanity/lib/queries.ts`, find `PROPERTY_QUERY`. Replace the current `causeImages` and `reviews` lines with the following (keeping all other projections unchanged):

```groq
causeImages[]{ asset->, alt },
faqs[]{ question, answer },
"reviews": *[_type=='review' && references(^._id) && published==true] | order(stayDate desc) [0..20]{
  guestName, rating, body, guestLocation, stayDate,
  guestPhoto { asset->, alt },
  "propertyTitle": property->title
}
```

The full updated projection block (for context):

```ts
export const PROPERTY_QUERY =
	defineQuery(`*[_type == 'property' && slug.current == $slug][0]{
	...,
	heroImage { asset->, alt },
	gallery[]{ asset->, alt },
	cardThumbnail { asset->, alt },
	amenities[]->{ name, icon },
	amenitiesSectionImage { asset->, alt },
	experiences[]->{
		title,
		"slug": slug.current,
		description,
		image { asset->, alt }
	},
	experiencesBgImage { asset->, alt, hotspot, crop },
	highlights[]{ title, body, image { asset->, alt }, secondaryImage { asset->, alt }, decorImage { asset-> } },
	causeImages[]{ asset->, alt },
	faqs[]{ question, answer },
	location,
	"reviews": *[_type=='review' && references(^._id) && published==true] | order(stayDate desc) [0..20]{
		guestName, rating, body, guestLocation, stayDate,
		guestPhoto { asset->, alt },
		"propertyTitle": property->title
	}
}`)
```

- [ ] **Step 2: Update `ALT_WAY_PAGE_QUERY` — extend reviews projection**

Find `ALT_WAY_PAGE_QUERY` and replace the `reviews[]->` projection:

```ts
export const ALT_WAY_PAGE_QUERY =
	defineQuery(`*[_type == 'altWayPage' && _id == 'altWayPage'][0]{
	...,
	heroBackground { asset->, alt },
	missionImage { asset->, alt },
	editorialImages[]{ asset->, alt },
	reviews[]->{
		guestName, rating, body, guestLocation, stayDate,
		guestPhoto { asset->, alt },
		"propertyTitle": property->title
	}
}`)
```

- [ ] **Step 3: Commit**

```bash
git add src/sanity/lib/queries.ts
git commit -m "feat(queries): add faqs projection; extend reviews with guestPhoto + propertyTitle"
```

---

### Task 3: Run typegen + verify

**Files:**
- Auto-generated: `src/sanity/types.ts`

- [ ] **Step 1: Run typegen**

```bash
npm run typegen
```

Expected output: `✓ Generated X types` with no errors. `src/sanity/types.ts` is updated.

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: zero errors. The existing review usage (`property.reviews?.slice(...)`) still compiles — typegen only adds fields to the type, it doesn't remove them.

- [ ] **Step 3: Note the generated review type**

Open `src/sanity/types.ts` and find the reviews array type from `PROPERTY_QUERY`. It will look like:

```ts
reviews: Array<{
  guestName: string | null
  rating: number | null
  body: string | null
  guestLocation: string | null
  stayDate: string | null
  guestPhoto: { asset?: ...; alt?: string } | null
  propertyTitle: string | null
}> | null
```

Copy the element type — you will use it to type `ReviewsSection` props in Task 6.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/types.ts src/sanity/schema.json
git commit -m "chore: regenerate sanity types after schema + query changes"
```

---

## PHASE 1B — Font Token + Cause Section (parallel with 1A)

### Task 4: Add `a-day-without-sun` font token

**Files:**
- Move: `public/fonts/a-day-without-sun.otf` → `src/app/fonts/a-day-without-sun.otf`
- Modify: `src/app/(site)/layout.tsx`
- Modify: `src/app.css`

- [ ] **Step 1: Move font file into src tree**

`next/font/local` works most reliably when the font file is inside the Next.js source tree:

```bash
mkdir -p src/app/fonts
mv public/fonts/a-day-without-sun.otf src/app/fonts/a-day-without-sun.otf
# Remove empty public/fonts if nothing else is in it
rmdir public/fonts 2>/dev/null || true
```

- [ ] **Step 2: Add `localFont` import + declaration to `layout.tsx`**

At the top of `src/app/(site)/layout.tsx`, add `localFont` to the imports and declare the font. Add after the `'next/font/google'` import:

```ts
import localFont from 'next/font/local'
```

After the last Google font declaration (`const poppins = Poppins({ ... })`), add:

```ts
const aDayWithoutSun = localFont({
	src: '../fonts/a-day-without-sun.otf',
	variable: '--font-a-day-without-sun',
	weight: '400',
	style: 'normal',
	display: 'swap',
})
```

- [ ] **Step 3: Add `aDayWithoutSun.variable` to `ALL_FONT_CLASSES`**

Find the `ALL_FONT_CLASSES` array in `layout.tsx` and add the new variable:

```ts
const ALL_FONT_CLASSES = [
	geist.variable,
	inter.variable,
	dmSans.variable,
	plusJakartaSans.variable,
	playfairDisplay.variable,
	lora.variable,
	libreBaskerville.variable,
	cormorantGaramond.variable,
	jetbrainsMono.variable,
	spaceMono.variable,
	poppins.variable,
	aDayWithoutSun.variable,  // ← add this
].join(' ')
```

- [ ] **Step 4: Add `--font-stories` to `@theme` block in `app.css`**

Open `src/app.css`. Find the `@theme {` block (starts at line 2). After the existing `--font-mono` line, add:

```css
--font-stories: var(--font-a-day-without-sun, 'a-day-without-sun', sans-serif);
```

So the font section of `@theme` becomes:

```css
@theme {
	--font-sans: var(--font-poppins, 'Poppins', system-ui, sans-serif);
	--font-heading: var(--font-playfair-display, 'Playfair Display', serif);
	--font-mono: 'JetBrains Mono', monospace;
	--font-stories: var(--font-a-day-without-sun, 'a-day-without-sun', sans-serif);
  /* ... rest of @theme ... */
```

- [ ] **Step 5: Verify font loads**

```bash
npm run typecheck
```

Expected: zero errors.

Start dev server (`npm run dev`), open any page, open DevTools → Elements, inspect `<html>` — you should see `--font-a-day-without-sun` CSS variable available. Check Network tab: no external font requests.

- [ ] **Step 6: Commit**

```bash
git add src/app/fonts/a-day-without-sun.otf src/app/(site)/layout.tsx src/app.css
git commit -m "feat(font): add a-day-without-sun as font-stories token via next/font/local"
```

---

### Task 5: Redesign cause section — 2-column layout

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`

The cause section is currently a single-column block (lines ~400–431). Replace the entire block.

- [ ] **Step 1: Replace the cause section JSX**

Find this comment in `src/app/(site)/our-homes/[slug]/page.tsx`:

```tsx
{/* 7. Causes */}
{(property.causeHeadline ||
  property.causeBody ||
  (property.causeImages && property.causeImages.length > 0)) && (
  <section className="bg-primary py-16 text-primary-foreground">
```

Replace the entire cause section block (from `{/* 7. Causes */}` through its closing `)}`) with:

```tsx
{/* 7. Causes */}
{(property.causeHeadline ||
  property.causeBody ||
  (property.causeImages && property.causeImages.length >= 1)) && (
  <section className="bg-primary text-primary-foreground min-h-[50vh]">
    <div className="grid min-[821px]:grid-cols-[55fr_45fr] max-[820px]:grid-cols-1 min-h-[50vh]">
      {/* Left: images */}
      <div className="relative overflow-hidden min-h-[40vh]">
        {property.causeImages?.[0] && (
          <Img
            image={property.causeImages[0]}
            width={900}
            height={600}
            alt={property.causeImages[0].alt ?? ''}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {property.causeImages?.[1] && (
          <div className="absolute bottom-4 right-4 w-[20%] overflow-hidden rounded-xl">
            <Img
              image={property.causeImages[1]}
              width={200}
              height={280}
              alt={property.causeImages[1].alt ?? ''}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      {/* Right: text */}
      <div className="flex flex-col justify-center px-[60px] py-[48px] max-[820px]:px-[18px] max-[820px]:py-[32px]">
        {property.causeHeadline && (
          <h2 className="mb-6 font-heading italic text-[30px] tracking-[0.3em] text-primary-foreground">
            {property.causeHeadline}
          </h2>
        )}
        {property.causeBody && (
          <div className="text-primary-foreground text-[15px] leading-[23px] tracking-[0.1em]">
            <PortableText value={property.causeBody} />
          </div>
        )}
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: zero errors on this file (cause images type unchanged from schema).

- [ ] **Step 3: Visual check**

Start dev server, navigate to any property page that has cause content. Verify:
- 2-column layout on desktop (>820px): large image fills left, small decorator image at bottom-right, text on right
- Single column on mobile (≤820px): image stacks above text
- Section is ~50% viewport height

- [ ] **Step 4: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx
git commit -m "feat(ui): redesign cause section as 2-column image+text layout"
```

---

## PHASE 2 — Component Build (after Phase 1A merge)

> Before starting Task 6, ensure `src/sanity/types.ts` is up to date (Task 3 complete and merged).

### Task 6: Create `ReviewsSection` component

**Files:**
- Create: `src/ui/molecules/reviews-section.tsx`

- [ ] **Step 1: Create the file**

Create `src/ui/molecules/reviews-section.tsx` with the full component:

```tsx
'use client'

import { useState } from 'react'
import Img from '@/ui/img'

type Review = {
  guestName: string | null
  rating: number | null
  body: string | null
  guestLocation: string | null
  stayDate: string | null
  guestPhoto: {
    asset?: { _ref: string; _type: string } | null
    alt?: string | null
    [key: string]: unknown
  } | null
  propertyTitle: string | null
}

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const [active, setActive] = useState(0)

  if (!reviews.length) return null

  const review = reviews[active]

  return (
    <section className="grid min-[821px]:grid-cols-2 max-[820px]:grid-cols-1 min-h-[60vh]">
      {/* Left: quote + thumbnail slider */}
      <div className="flex flex-col justify-between bg-primary px-[60px] py-[64px] max-[820px]:px-[18px] max-[820px]:py-[40px]">
        <p
          className="font-stories text-[28px] leading-[1.4] text-primary-foreground max-w-[420px]"
          style={{ fontFamily: 'var(--font-stories)', fontWeight: 400, fontStyle: 'normal' }}
        >
          Hearts full, stories shared<br />
          by guests who took back more than just memories.<br />
          These are the Alt Stories.
        </p>

        {/* Thumbnail row */}
        <div className="mt-10 flex items-center gap-3">
          <button
            onClick={() => setActive((active - 1 + reviews.length) % reviews.length)}
            aria-label="Previous review"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition hover:bg-primary-foreground/10"
          >
            ←
          </button>

          <div className="flex gap-2 overflow-x-auto">
            {reviews.map((r, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`View review by ${r.guestName ?? 'guest'}`}
                className={`shrink-0 overflow-hidden rounded-full transition-all ${
                  i === active
                    ? 'ring-2 ring-accent ring-offset-2 ring-offset-primary'
                    : 'opacity-60 hover:opacity-80'
                }`}
              >
                {r.guestPhoto ? (
                  <Img
                    image={r.guestPhoto as Parameters<typeof Img>[0]['image']}
                    width={56}
                    height={56}
                    alt={r.guestPhoto.alt ?? r.guestName ?? ''}
                    className="h-14 w-14 object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs">
                    {(r.guestName ?? '?')[0]}
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActive((active + 1) % reviews.length)}
            aria-label="Next review"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition hover:bg-primary-foreground/10"
          >
            →
          </button>
        </div>
      </div>

      {/* Right: review card */}
      <div className="flex items-center justify-center bg-background px-[40px] py-[64px] max-[820px]:px-[18px] max-[820px]:py-[40px]">
        <div
          key={active}
          className="w-full max-w-[360px] rotate-[2deg] overflow-hidden rounded-2xl border border-stroke bg-card-shell shadow-lg"
        >
          {/* Image — 60% of card height */}
          <div className="h-[260px] w-full overflow-hidden">
            {review.guestPhoto ? (
              <Img
                image={review.guestPhoto as Parameters<typeof Img>[0]['image']}
                width={360}
                height={260}
                alt={review.guestPhoto.alt ?? review.guestName ?? ''}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-muted/30" />
            )}
          </div>

          {/* Text — center aligned */}
          <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
            {review.body && (
              <p className="font-sans text-[14px] leading-[22px] tracking-[0.05em] text-foreground italic">
                &ldquo;{review.body}&rdquo;
              </p>
            )}
            {review.guestName && (
              <p className="font-sans text-[13px] font-bold tracking-[0.1em] text-foreground">
                {review.guestName}
              </p>
            )}
            {review.propertyTitle && (
              <p className="font-sans text-[12px] tracking-[0.08em] text-muted">
                {review.propertyTitle}
              </p>
            )}
            {review.guestLocation && (
              <p className="font-sans text-[12px] tracking-[0.08em] text-muted">
                {review.guestLocation}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck the new file**

```bash
npm run typecheck
```

Expected: no errors in the new file.

- [ ] **Step 3: Commit**

```bash
git add src/ui/molecules/reviews-section.tsx
git commit -m "feat(ui): add ReviewsSection molecule — slider with tilted review card"
```

---

### Task 7: Wire `ReviewsSection` into property detail page + alt-way page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`
- Modify: `src/app/(site)/the-alt-way/page.tsx`

- [ ] **Step 1: Import `ReviewsSection` in property detail page**

In `src/app/(site)/our-homes/[slug]/page.tsx`, add to imports:

```tsx
import ReviewsSection from '@/ui/molecules/reviews-section'
```

- [ ] **Step 2: Replace section 8 (reviews) in property detail page**

Find the current `{/* 8. Reviews */}` block and replace it entirely:

```tsx
{/* 8. Reviews */}
{cappedReviews.length > 0 && (
  <ReviewsSection reviews={cappedReviews} />
)}
```

The `cappedReviews` variable is already defined at the top of the component:
```ts
const cappedReviews = property.reviews?.slice(0, property.reviewsMaxShown ?? 20) ?? []
```

- [ ] **Step 3: Import and add `ReviewsSection` in alt-way page**

In `src/app/(site)/the-alt-way/page.tsx`, add to imports:

```tsx
import ReviewsSection from '@/ui/molecules/reviews-section'
```

Find where the reviews data is used (or where the page content ends before the bottom CTA). Add:

```tsx
{(page.reviews ?? []).length > 0 && (
  <ReviewsSection reviews={page.reviews ?? []} />
)}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: zero errors. The `cappedReviews` and `page.reviews` types from typegen must match the `Review` type in `ReviewsSection`. If there are type mismatches, open `src/sanity/types.ts`, find the exact shape of the reviews element type in both `PROPERTY_QUERY_RESULT` and `ALT_WAY_PAGE_QUERY_RESULT`, and update the `Review` type in `reviews-section.tsx` to match exactly (may need to import from `@/sanity/types`).

- [ ] **Step 5: Visual check**

Start dev server:
- Navigate to a property page with reviews → verify 2-col layout, clicking thumbnails cycles the card
- Navigate to `/the-alt-way` → verify reviews section appears

- [ ] **Step 6: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx src/app/(site)/the-alt-way/page.tsx
git commit -m "feat(ui): wire ReviewsSection into property detail and alt-way pages"
```

---

### Task 8: Create `PropertyFaqSection` component

**Files:**
- Create: `src/ui/pages/our-homes/property-faq-section.tsx`

- [ ] **Step 1: Create the component**

Create `src/ui/pages/our-homes/property-faq-section.tsx`:

```tsx
import { PortableText } from 'next-sanity'
import type { BlockContent } from '@/sanity/types'

type Faq = {
  question: string | null
  answer: BlockContent | null
}

export default function PropertyFaqSection({ faqs }: { faqs: Faq[] }) {
  if (!faqs.length) return null

  return (
    <section className="bg-background py-16 px-[90px] max-[820px]:px-[18px]">
      <h2 className="mb-10 font-heading italic text-[30px] tracking-[0.3em] text-foreground">
        Frequently Asked Questions
      </h2>

      <div className="max-w-3xl divide-y divide-stroke">
        {faqs.map((faq, i) => (
          <details key={i} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
              <span className="font-sans text-[15px] font-semibold leading-[23px] tracking-[0.1em] text-foreground">
                {faq.question}
              </span>
              <span
                className="shrink-0 text-foreground transition-transform duration-300 group-open:rotate-45"
                aria-hidden
              >
                +
              </span>
            </summary>

            <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-open:grid-rows-[1fr]">
              <div className="overflow-hidden">
                {faq.answer && (
                  <div className="pt-4 font-sans text-[14px] leading-[22px] tracking-[0.05em] text-foreground/80 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold">
                    <PortableText value={faq.answer} />
                  </div>
                )}
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: zero errors. If `BlockContent` import path is wrong, check `src/sanity/types.ts` for the exact exported type name.

- [ ] **Step 3: Commit**

```bash
git add src/ui/pages/our-homes/property-faq-section.tsx
git commit -m "feat(ui): add PropertyFaqSection with details/summary accordion"
```

---

### Task 9: Wire `PropertyFaqSection` into property detail page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`

- [ ] **Step 1: Import `PropertyFaqSection`**

In `src/app/(site)/our-homes/[slug]/page.tsx`, add:

```tsx
import PropertyFaqSection from '@/ui/pages/our-homes/property-faq-section'
```

- [ ] **Step 2: Add FAQ section between Amenities and Causes**

Find the comment `{/* 7. Causes */}` in the file. Insert the FAQ section immediately before it:

```tsx
{/* 6b. FAQs */}
{property.faqs && property.faqs.length > 0 && (
  <PropertyFaqSection faqs={property.faqs} />
)}

{/* 7. Causes */}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: zero errors.

- [ ] **Step 4: Visual check**

Start dev server, navigate to a property page. Since no FAQ content exists yet in Sanity, the section will be hidden (guard prevents empty render). To test:
1. Open Sanity Studio at `/studio`
2. Navigate to the property document → FAQs tab
3. Add 2–3 FAQs with questions and answers
4. Save and hard-refresh the property page
5. Verify FAQ section appears between amenities and the cause section
6. Verify accordion open/close works with `+` rotating to `×`

- [ ] **Step 5: Final typecheck + lint**

```bash
npm run typecheck && npm run lint
```

Expected: zero errors, zero lint warnings.

- [ ] **Step 6: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx
git commit -m "feat(ui): wire PropertyFaqSection into property detail page"
```

---

## Post-Implementation Checklist

- [ ] `npm run typecheck` — zero errors
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — build succeeds with `output: 'standalone'`
- [ ] Font `a-day-without-sun.otf` committed in `src/app/fonts/`
- [ ] No font requests visible in Network tab (font is self-hosted)
- [ ] FAQ copy/paste UX: verified with Sanity Studio three-dot menu on the `faqs` field
- [ ] Cause section 2-col verified on desktop + mobile
- [ ] Reviews slider thumbnail click cycles card on property page
- [ ] Reviews slider works on `/the-alt-way`
- [ ] FAQ accordion animated open/close verified

---

## Studio Content Notes (for editor)

**Reviews:** Each review document now has a **Guest Photo** field. Add a photo per review for the slider thumbnails and review card image to appear.

**FAQs:** Property documents now have a **FAQs** tab. Use the three-dot menu on the FAQs field to **Copy value** / **Paste value** across properties (full array). Use the three-dot on individual FAQ items for per-item copy.
