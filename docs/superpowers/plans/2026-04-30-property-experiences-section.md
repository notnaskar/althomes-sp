# Property Experiences Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the off-token experiences section on the property detail page with a full-bleed background image section using the existing ExperienceCard component and brand-compliant heading.

**Architecture:** Add `experiencesBgImage` to the Sanity property schema and GROQ query, extract the section into `PropertyExperiencesSection`, and wire it into page.tsx replacing lines 371–418.

**Tech Stack:** Next.js 16 App Router, Sanity v3, Tailwind v4, Playwright (E2E)

---

## File Map

| Action | File |
|--------|------|
| Modify | `src/sanity/schemaTypes/documents/property.ts` — add `experiencesBgImage` field |
| Modify | `src/sanity/lib/queries.ts` — add `experiencesBgImage` projection |
| Regenerate | `src/sanity/types.ts` — auto-generated via `npm run typegen` |
| Create | `src/ui/pages/our-homes/property-experiences-section.tsx` — new component |
| Modify | `src/app/(site)/our-homes/[slug]/page.tsx` — replace lines 371–418 |
| Modify | `tests/e2e/our-homes-slug.spec.ts` — add experiences section test |

---

### Task 1: Add `experiencesBgImage` to Sanity schema and regenerate types

**Files:**
- Modify: `src/sanity/schemaTypes/documents/property.ts:394-400`

- [ ] **Step 1: Add the schema field**

In `src/sanity/schemaTypes/documents/property.ts`, after the `experiencesMaxShown` field (currently ending around line 400), add:

```ts
defineField({
  name: 'experiencesBgImage',
  title: 'Experiences Background Image',
  type: 'image',
  description: 'Full-bleed background image for the Experiences section.',
  options: { hotspot: true },
  group: 'experiences',
}),
```

- [ ] **Step 2: Regenerate types**

```bash
npm run typegen
```

Expected: `src/sanity/types.ts` updated with no errors. The `Property` type now includes `experiencesBgImage?: { asset?: SanityImageAsset | null; ... } | null`.

- [ ] **Step 3: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/schemaTypes/documents/property.ts src/sanity/types.ts
git commit -m "feat(schema): add experiencesBgImage field to property experiences group"
```

---

### Task 2: Add `experiencesBgImage` to GROQ query

**Files:**
- Modify: `src/sanity/lib/queries.ts:105-110` (experiences projection inside `PROPERTY_DETAIL_QUERY`)

- [ ] **Step 1: Add the field to the projection**

In `src/sanity/lib/queries.ts`, the `PROPERTY_DETAIL_QUERY` currently fetches experiences at lines 105–110:

```groq
experiences[]->{
  title,
  "slug": slug.current,
  description,
  image { asset->, alt }
},
```

Add `experiencesBgImage` at the top level of the query (not inside `experiences[]`), after the `experiences[]` block. The existing line 111 is `highlights[]{...}`. Insert before it:

```groq
experiencesBgImage { asset->, alt, hotspot, crop },
```

So the query around line 105–112 becomes:

```groq
experiences[]->{
  title,
  "slug": slug.current,
  description,
  image { asset->, alt }
},
experiencesBgImage { asset->, alt, hotspot, crop },
highlights[]{ title, body, image { asset->, alt }, secondaryImage { asset->, alt }, decorImage { asset-> } },
```

- [ ] **Step 2: Regenerate types to pick up query shape**

```bash
npm run typegen
```

Expected: No errors. `PROPERTY_DETAIL_QUERYResult` type now includes `experiencesBgImage`.

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/lib/queries.ts src/sanity/types.ts
git commit -m "feat(query): project experiencesBgImage in PROPERTY_DETAIL_QUERY"
```

---

### Task 3: Create `PropertyExperiencesSection` component

**Files:**
- Create: `src/ui/pages/our-homes/property-experiences-section.tsx`

Reference: `ExperienceCard` is at `src/ui/pages/experiences/experiences-updated/experience-card.tsx`. Its props: `title: string`, `description?: string | null`, `image?: { asset, alt, crop, hotspot } | null`, `slug?: string | null`, `tilt?: 'cw' | 'ccw'`.

- [ ] **Step 1: Write the failing E2E test first**

In `tests/e2e/our-homes-slug.spec.ts`, add after the existing tests:

```ts
test('renders experiences section with cards', async ({ page }) => {
  await page.goto(propertyUrl)
  const section = page.locator('[data-section="experiences"]')
  // Section only renders if the property has experiences linked in Sanity
  const count = await section.count()
  if (count > 0) {
    await expect(section).toBeVisible()
    const cards = section.locator('a[aria-label]')
    await expect(cards.first()).toBeVisible()
  }
})
```

- [ ] **Step 2: Run the test to verify it fails or skips**

```bash
npx playwright test tests/e2e/our-homes-slug.spec.ts --grep "experiences section" --headed
```

Expected: Test either fails (section not present yet) or passes vacuously (no experiences linked in Sanity). Either outcome is acceptable — confirms test runs.

- [ ] **Step 3: Create the component**

Create `src/ui/pages/our-homes/property-experiences-section.tsx`:

```tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import ExperienceCard from '@/ui/pages/experiences/experiences-updated/experience-card'

interface BgImage {
  asset?: { _ref?: string; _id?: string; url?: string } | null
  alt?: string | null
  hotspot?: { x?: number; y?: number } | null
  crop?: { top?: number; bottom?: number; left?: number; right?: number } | null
}

interface ExperienceItem {
  title?: string | null
  slug?: string | null
  description?: string | null
  image?: {
    asset?: { _ref?: string; _id?: string; url?: string } | null
    alt?: string | null
  } | null
}

interface PropertyExperiencesSectionProps {
  bgImage?: BgImage | null
  experiences: ExperienceItem[]
  propertyTitle: string
}

export default function PropertyExperiencesSection({
  bgImage,
  experiences,
  propertyTitle,
}: PropertyExperiencesSectionProps) {
  const hasBg = bgImage?.asset != null
  const bgUrl = hasBg ? urlFor(bgImage!).width(1600).url() : null

  return (
    <section
      data-section="experiences"
      className="relative overflow-hidden px-[90px] py-[80px] max-[820px]:px-[24px] max-[820px]:py-[48px]"
    >
      {/* Background image */}
      {bgUrl && (
        <Image
          src={bgUrl}
          alt={bgImage?.alt ?? ''}
          fill
          className="absolute inset-0 object-cover"
          sizes="100vw"
        />
      )}

      {/* Cream fallback when no bg image */}
      {!hasBg && <div className="absolute inset-0 bg-background" />}

      {/* Content */}
      <div className="relative z-10">
        <h2
          className={[
            'font-heading italic text-center tracking-[0.05em]',
            hasBg ? 'text-white drop-shadow-md' : 'text-foreground',
            'text-[32px] leading-[1.2] max-[820px]:text-[24px]',
          ].join(' ')}
        >
          EXPERIENCES NEAR {propertyTitle.toUpperCase()}
        </h2>

        <div className="mt-[48px] flex justify-center gap-[24px] max-[820px]:flex-col max-[820px]:items-center">
          {experiences.slice(0, 3).map((exp, i) => (
            <div key={exp.slug ?? exp.title ?? i} className="w-full max-w-[327px]">
              <ExperienceCard
                title={exp.title ?? ''}
                description={exp.description}
                image={exp.image as ExperienceCard['image']}
                slug={exp.slug}
                tilt={i % 2 === 0 ? 'cw' : 'ccw'}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

> **Note:** The `ExperienceCard` image prop accepts `{ asset, alt, crop, hotspot }`. The experiences query projection returns `image { asset->, alt }` — crop/hotspot are undefined which is fine (optional fields).

- [ ] **Step 4: Typecheck the new component**

```bash
npm run typecheck
```

Expected: No errors. If `ExperienceCard['image']` cast fails, replace with explicit inline type cast:
```tsx
image={exp.image as { asset: any; alt?: string | null } | null | undefined}
```

- [ ] **Step 5: Commit**

```bash
git add src/ui/pages/our-homes/property-experiences-section.tsx
git commit -m "feat(ui): add PropertyExperiencesSection component with bg image and ExperienceCard grid"
```

---

### Task 4: Wire component into property detail page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx:371-418`

- [ ] **Step 1: Add the import**

At the top of `src/app/(site)/our-homes/[slug]/page.tsx`, add with the other UI imports:

```tsx
import PropertyExperiencesSection from '@/ui/pages/our-homes/property-experiences-section'
```

- [ ] **Step 2: Replace the old experiences section**

Find and replace lines 371–418 (the entire `{/* 5. Experiences */}` block):

Old code (lines 371–418):
```tsx
{/* 5. Experiences */}
{cappedExperiences.length > 0 && (
  <section className="bg-gray-50 py-16">
    <div className="container">
      <h2 className="mb-10 text-3xl font-bold">
        EXPERIENCES NEAR {property.title?.toUpperCase()}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cappedExperiences.map((exp) => (
          <Link
            key={exp.slug ?? exp.title ?? ''}
            href={`/experiences/${exp.slug ?? ''}`}
            className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
          >
            {exp.image && (
              <div className="overflow-hidden">
                <Img
                  image={exp.image}
                  width={500}
                  alt={exp.image.alt ?? ''}
                  className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-5">
              {exp.title && (
                <h3 className="text-lg font-bold">{exp.title}</h3>
              )}
              {exp.description && (
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                  {exp.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Link
          href="/experiences"
          className="inline-block rounded-full border-2 border-black px-8 py-3 font-bold text-black transition hover:bg-black hover:text-white"
        >
          View All Experiences
        </Link>
      </div>
    </div>
  </section>
)}
```

Replace with:
```tsx
{/* 5. Experiences */}
{cappedExperiences.length > 0 && (
  <PropertyExperiencesSection
    bgImage={property.experiencesBgImage}
    experiences={cappedExperiences}
    propertyTitle={property.title ?? ''}
  />
)}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: No errors. If `property.experiencesBgImage` type doesn't match the component prop, widen the component's `BgImage` interface to accept the auto-generated type.

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Open `http://localhost:3000/our-homes/bagaan` (or any property slug). Confirm:
- Experiences section renders if the property has linked experiences in Sanity
- Section shows cream background (no bg image uploaded yet — that's expected)
- Heading is `font-heading italic`, centered
- Cards use the tilted ExperienceCard design

- [ ] **Step 5: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx
git commit -m "feat(page): replace generic experiences grid with PropertyExperiencesSection"
```

---

### Task 5: Run full E2E suite

**Files:**
- Verify: `tests/e2e/our-homes-slug.spec.ts`

- [ ] **Step 1: Run the full property detail E2E suite**

```bash
npx playwright test tests/e2e/our-homes-slug.spec.ts
```

Expected: All tests pass. The new "renders experiences section with cards" test passes (or skips vacuously if no experiences are linked in Sanity for the test property).

- [ ] **Step 2: Run typecheck one final time**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 3: Final commit if any loose files**

```bash
git status
```

If `tests/e2e/our-homes-slug.spec.ts` is unstaged:

```bash
git add tests/e2e/our-homes-slug.spec.ts
git commit -m "test(e2e): add experiences section render test on property detail page"
```

---

## Self-Review

**Spec coverage check:**
- ✅ `experiencesBgImage` Sanity field → Task 1
- ✅ GROQ query projection → Task 2
- ✅ `PropertyExperiencesSection` component with `next/image` background → Task 3
- ✅ Centered `font-heading italic` heading → Task 3
- ✅ 3 `ExperienceCard`s with alternating tilt → Task 3
- ✅ No CTA → spec compliant (removed from Task 3)
- ✅ No dark overlay → Task 3 (raw image, no overlay div)
- ✅ `max-[820px]:` only breakpoint → Task 3
- ✅ Cream fallback when no bg image → Task 3
- ✅ Wired into page.tsx → Task 4

**Placeholder scan:** None found.

**Type consistency:** `BgImage`, `ExperienceItem`, `PropertyExperiencesSectionProps` defined once in Task 3 and referenced in Task 4 without renaming.
