# Property Highlights 3x3 Grid — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the "What's Waiting For You?" section on `/our-homes/[slug]` into a fixed 3x3 CSS Grid driven by four named Sanity slot fields, with all cell sizing/decor positioning controlled by a single in-component config object.

**Architecture:** Add four new named-slot object fields to the `property` Sanity document (replacing reliance on the existing `highlights[]` array, which is left in place for migration safety). Project the new fields in `PROPERTY_QUERY`. Extract the section into a new `PropertyHighlightsSection` component that uses CSS `grid-template-areas` for desktop and a flex column for mobile. A top-of-file `GRID_CONFIG` object centralises columns, row heights, gap, padding, and decor offsets per breakpoint.

**Tech Stack:** Next.js 16 App Router (server components), Sanity v3 schema + GROQ + TypeGen, Tailwind 4, TypeScript. No new dependencies.

**Project conventions:**
- Every GROQ query uses `defineQuery()`. Run `npm run typegen` after any change to schemas or queries; output regenerates `src/sanity/types.ts`.
- Always use `Img` (`@/ui/img`) or `next/image` — never raw `<img>`.
- Tests live under `tests/unit/` (Vitest). UI rendering is verified visually + via `npm run typecheck`; pure-logic units get unit tests. This refactor has no logic to unit-test, so verification is typecheck + lint + dev-server visual check.
- Reference: `CLAUDE.md` at repo root and `src/ui/UI_GUIDELINES.md`.

---

### Task 1: Add four named highlight slot fields to the Sanity property schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/property.ts` (highlights group, near current `highlights` array definition around line 453)

**Context for the engineer:** The schema groups are configured at the top of the file. The current `highlights` field is an array of objects with `title`, `body`, `image`, `secondaryImage`, `decorImage`. We are adding four new top-level object fields under the same `highlights` group. The existing `highlights` array stays in the schema (deprecated via a description) so editors can copy content over before we remove it in a later commit.

- [ ] **Step 1: Locate the highlights group field**

Open `src/sanity/schemaTypes/documents/property.ts` and confirm the existing block:

```ts
defineField({
  name: 'highlights',
  title: 'Highlights',
  type: 'array',
  of: [ /* … */ ],
  validation: (Rule) => Rule.min(2),
  group: 'highlights',
}),
```

- [ ] **Step 2: Mark the existing `highlights` array as deprecated**

Add a `description` and remove the `Rule.min(2)` validation so it doesn't block saving when editors leave it empty after migration. Replace the existing `highlights` field block with:

```ts
defineField({
  name: 'highlights',
  title: 'Highlights (DEPRECATED — use named slots below)',
  type: 'array',
  description:
    'DEPRECATED. Migrate content to the four named slots: Wind Down, Wake Up, Hosted With Heart, Symphony. This array is no longer rendered on the live page.',
  of: [
    {
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'Title' },
        { name: 'body', type: 'text', title: 'Body' },
        {
          name: 'image',
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
        {
          name: 'secondaryImage',
          type: 'image',
          title: 'Secondary Image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
        {
          name: 'decorImage',
          type: 'image',
          title: 'Decor Image',
          options: { hotspot: true },
        },
      ],
    },
  ],
  group: 'highlights',
}),
```

(Notes: removed `validation: (Rule) => Rule.min(2)` and removed the inner `validation` requirements so a partially-empty deprecated array does not block saving.)

- [ ] **Step 3: Add the four new named slot fields directly after the deprecated array**

Insert these `defineField(...)` blocks immediately after the deprecated `highlights` array, all in the same `highlights` group. Each is a plain object with required title + body and optional image fields:

```ts
defineField({
  name: 'windDownHighlight',
  title: 'Wind Down Highlight',
  type: 'object',
  description:
    'Top-left text block + dining-table image cell (desktop row 1, cols 2-3). On mobile the image renders above the section heading.',
  group: 'highlights',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image (dining table)',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
    defineField({
      name: 'decorImage',
      title: 'Decor Image (wrap with tassels)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'secondaryDecorImage',
      title: 'Secondary Decor Image (leaf)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
}),

defineField({
  name: 'wakeUpHighlight',
  title: 'Wake Up Highlight',
  type: 'object',
  description: 'Tea-leaves image cell + text (desktop row 2, cols 1 and 2).',
  group: 'highlights',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image (tea-leaves hand)',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
}),

defineField({
  name: 'hostedWithHeartHighlight',
  title: 'Hosted With Heart Highlight',
  type: 'object',
  description: 'Text-only block (desktop row 2, col 3). No image.',
  group: 'highlights',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
  ],
}),

defineField({
  name: 'symphonyHighlight',
  title: 'Symphony of Flavours Highlight',
  type: 'object',
  description:
    'Text + menu CTA + food plate image (desktop row 3). Menu CTA is the existing top-level menuCta field on the property document.',
  group: 'highlights',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image (food plate)',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
    }),
  ],
}),
```

- [ ] **Step 4: Verify schema parses by regenerating types**

Run:

```bash
npm run typegen
```

Expected: command exits 0. `src/sanity/types.ts` is regenerated. Open it and confirm the `Property` type now contains:

- `windDownHighlight?: { title?: string; body?: string; image?: …; decorImage?: …; secondaryDecorImage?: … }`
- `wakeUpHighlight?: { title?: string; body?: string; image?: … }`
- `hostedWithHeartHighlight?: { title?: string; body?: string }`
- `symphonyHighlight?: { title?: string; body?: string; image?: … }`

If TypeGen errors out, re-read the changes — likely a syntax mistake.

- [ ] **Step 5: Run typecheck to catch downstream type errors from the regenerated types**

Run:

```bash
npm run typecheck
```

Expected: PASS. (Page code still references old `property.highlights[]` which still exists — typecheck should not fail at this point.)

- [ ] **Step 6: Commit**

```bash
git add src/sanity/schemaTypes/documents/property.ts src/sanity/types.ts
git commit -m "feat(property): add named highlight slots for grid layout

Add windDownHighlight, wakeUpHighlight, hostedWithHeartHighlight,
and symphonyHighlight fields to the property schema. Existing
highlights[] array marked deprecated; kept in schema for content
migration."
```

---

### Task 2: Project new highlight fields in `PROPERTY_QUERY`

**Files:**
- Modify: `src/sanity/lib/queries.ts:122-148` (PROPERTY_QUERY block)

**Context for the engineer:** GROQ projections must explicitly list nested fields with `asset->` dereferencing. The existing query line 138 projects `highlights[]`. We add the four new slot projections; we keep the deprecated `highlights[]` projection in for now (it costs nothing and lets us roll back without re-running typegen).

- [ ] **Step 1: Add new field projections to PROPERTY_QUERY**

Find the existing projection (line 138):

```groq
highlights[]{ title, body, image { asset->, alt }, secondaryImage { asset->, alt }, decorImage { asset-> } },
```

Add the following lines immediately after it (before `causeImages[]{ asset->, alt },`):

```groq
windDownHighlight{
  title,
  body,
  image { asset->, alt },
  decorImage { asset-> },
  secondaryDecorImage { asset-> }
},
wakeUpHighlight{
  title,
  body,
  image { asset->, alt }
},
hostedWithHeartHighlight{
  title,
  body
},
symphonyHighlight{
  title,
  body,
  image { asset->, alt }
},
```

The full PROPERTY_QUERY block should now contain both the deprecated `highlights[]` projection and the four new slot projections.

- [ ] **Step 2: Regenerate types**

Run:

```bash
npm run typegen
```

Expected: exits 0. Verify the regenerated query result types now include the four new slot shapes (search `src/sanity/types.ts` for `windDownHighlight`).

- [ ] **Step 3: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/sanity/lib/queries.ts src/sanity/types.ts
git commit -m "feat(property): project named highlight slots in PROPERTY_QUERY"
```

---

### Task 3: Create `PropertyHighlightsSection` component

**Files:**
- Create: `src/ui/pages/our-homes/property-highlights-section.tsx`

**Context for the engineer:** This is a server component (no `'use client'`). It receives the four highlight slot props plus `menuCta` and renders both desktop grid and mobile stack. All numeric layout values come from the `GRID_CONFIG` object at the top of the file. Decor images are absolute-positioned over their owning image cell with offsets defined per-breakpoint in the config.

The desktop layout uses `gridTemplateAreas` so cell positions are declarative. The dining-table image is rendered twice (once mobile-only above the heading, once desktop-only inside the grid). Browser caches the asset so the second render does not refetch.

- [ ] **Step 1: Create the file with the full component**

Create `src/ui/pages/our-homes/property-highlights-section.tsx` with this exact content:

```tsx
import Img from '@/ui/img'

type ImageWithAlt = {
  asset?: unknown
  alt?: string | null
} | null | undefined

type WindDownSlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
  decorImage?: ImageWithAlt
  secondaryDecorImage?: ImageWithAlt
} | null | undefined

type WakeUpSlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
} | null | undefined

type HostedSlot = {
  title?: string | null
  body?: string | null
} | null | undefined

type SymphonySlot = {
  title?: string | null
  body?: string | null
  image?: ImageWithAlt
} | null | undefined

type MenuCta = {
  label?: string | null
  url?: string | null
} | null | undefined

type Props = {
  windDown: WindDownSlot
  wakeUp: WakeUpSlot
  hostedWithHeart: HostedSlot
  symphony: SymphonySlot
  menuCta: MenuCta
}

const GRID_CONFIG = {
  desktop: {
    columns: '1fr 1fr 1fr',
    rows: '420px 380px 360px',
    gap: '48px',
    areas: `
      "windText  diningImg  diningImg"
      "teaImg    wakeText   hostedText"
      "symText   foodImg    foodImg"
    `,
  },
  maxWidth: '1260px',
  paddingX: { mobile: '18px', desktop: '90px' },
  decor: {
    wrap: { left: '-30px', top: '60px', width: '180px', rotate: '0deg' },
    leaf: { right: '-20px', top: '20px', width: '160px', rotate: '15deg' },
    wrapMobile: { left: '-20px', top: '40px', width: '140px', rotate: '0deg' },
    leafMobile: { right: '-10px', top: '120px', width: '110px', rotate: '15deg' },
  },
} as const

const TITLE_CLASS =
  'font-heading text-[20px] leading-[28px] tracking-[0.2em] text-foreground mb-3'
const BODY_CLASS =
  'font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground'

function decorStyle(d: { left?: string; right?: string; top?: string; width: string; rotate: string }) {
  return {
    left: d.left,
    right: d.right,
    top: d.top,
    width: d.width,
    transform: `rotate(${d.rotate})`,
  } as React.CSSProperties
}

export default function PropertyHighlightsSection({
  windDown,
  wakeUp,
  hostedWithHeart,
  symphony,
  menuCta,
}: Props) {
  const hasAny =
    windDown?.title ||
    wakeUp?.title ||
    hostedWithHeart?.title ||
    symphony?.title
  if (!hasAny) return null

  return (
    <section className="w-full overflow-hidden bg-background py-[72px]">
      {/* Mobile-only: dining table image above heading */}
      {windDown?.image?.asset && (
        <div className="lg:hidden mb-8">
          <Img
            image={windDown.image}
            width={800}
            alt={windDown.image.alt ?? ''}
            className="h-auto w-full object-cover"
          />
        </div>
      )}

      <h2
        className="mb-16 text-center font-heading text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground"
        style={{
          paddingLeft: GRID_CONFIG.paddingX.mobile,
          paddingRight: GRID_CONFIG.paddingX.mobile,
        }}
      >
        WHAT&rsquo;S WAITING FOR YOU?
      </h2>

      <div
        className="mx-auto"
        style={{
          maxWidth: GRID_CONFIG.maxWidth,
          paddingLeft: GRID_CONFIG.paddingX.mobile,
          paddingRight: GRID_CONFIG.paddingX.mobile,
        }}
      >
        {/* Desktop grid */}
        <div
          className="hidden lg:grid"
          style={{
            gridTemplateColumns: GRID_CONFIG.desktop.columns,
            gridTemplateRows: GRID_CONFIG.desktop.rows,
            gridTemplateAreas: GRID_CONFIG.desktop.areas,
            gap: GRID_CONFIG.desktop.gap,
            paddingLeft: `calc(${GRID_CONFIG.paddingX.desktop} - ${GRID_CONFIG.paddingX.mobile})`,
            paddingRight: `calc(${GRID_CONFIG.paddingX.desktop} - ${GRID_CONFIG.paddingX.mobile})`,
          }}
        >
          <div style={{ gridArea: 'windText' }} className="flex flex-col justify-center text-right">
            {windDown?.title && <h3 className={TITLE_CLASS}>{windDown.title}</h3>}
            {windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
          </div>

          <div style={{ gridArea: 'diningImg' }} className="relative h-full w-full overflow-visible">
            {windDown?.image?.asset && (
              <div className="absolute inset-0 overflow-hidden rounded-[5px]">
                <Img
                  image={windDown.image}
                  width={900}
                  alt={windDown.image.alt ?? ''}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            {windDown?.decorImage?.asset && (
              <div
                className="pointer-events-none absolute"
                style={decorStyle(GRID_CONFIG.decor.wrap)}
              >
                <Img
                  image={windDown.decorImage}
                  width={300}
                  alt=""
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
            {windDown?.secondaryDecorImage?.asset && (
              <div
                className="pointer-events-none absolute"
                style={decorStyle(GRID_CONFIG.decor.leaf)}
              >
                <Img
                  image={windDown.secondaryDecorImage}
                  width={300}
                  alt=""
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
          </div>

          <div style={{ gridArea: 'teaImg' }} className="relative h-full w-full overflow-hidden rounded-[5px]">
            {wakeUp?.image?.asset && (
              <Img
                image={wakeUp.image}
                width={500}
                alt={wakeUp.image.alt ?? ''}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div style={{ gridArea: 'wakeText' }} className="flex flex-col justify-center">
            {wakeUp?.title && <h3 className={TITLE_CLASS}>{wakeUp.title}</h3>}
            {wakeUp?.body && <p className={BODY_CLASS}>{wakeUp.body}</p>}
          </div>

          <div style={{ gridArea: 'hostedText' }} className="flex flex-col justify-center">
            {hostedWithHeart?.title && <h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>}
            {hostedWithHeart?.body && <p className={BODY_CLASS}>{hostedWithHeart.body}</p>}
          </div>

          <div style={{ gridArea: 'symText' }} className="flex flex-col justify-center gap-12">
            <div>
              {symphony?.title && <h3 className={TITLE_CLASS}>{symphony.title}</h3>}
              {symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
            </div>
            {menuCta?.url && (
              <a
                href={menuCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
              >
                {menuCta.label || "WHAT'S ON THE MENU?"}
              </a>
            )}
          </div>

          <div style={{ gridArea: 'foodImg' }} className="relative h-full w-full overflow-hidden rounded-[5px]">
            {symphony?.image?.asset && (
              <Img
                image={symphony.image}
                width={900}
                alt={symphony.image.alt ?? ''}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Mobile stack */}
        <div className="flex flex-col gap-12 lg:hidden">
          {/* Wind down text */}
          <div>
            {windDown?.title && <h3 className={TITLE_CLASS}>{windDown.title}</h3>}
            {windDown?.body && <p className={BODY_CLASS}>{windDown.body}</p>}
          </div>

          {/* Tea-leaves collage with mobile decor */}
          {wakeUp?.image?.asset && (
            <div className="relative h-[360px] w-full">
              <div className="absolute inset-0 overflow-hidden rounded-[5px]">
                <Img
                  image={wakeUp.image}
                  width={600}
                  alt={wakeUp.image.alt ?? ''}
                  className="h-full w-full object-cover"
                />
              </div>
              {windDown?.decorImage?.asset && (
                <div
                  className="pointer-events-none absolute"
                  style={decorStyle(GRID_CONFIG.decor.wrapMobile)}
                >
                  <Img
                    image={windDown.decorImage}
                    width={250}
                    alt=""
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}
              {windDown?.secondaryDecorImage?.asset && (
                <div
                  className="pointer-events-none absolute"
                  style={decorStyle(GRID_CONFIG.decor.leafMobile)}
                >
                  <Img
                    image={windDown.secondaryDecorImage}
                    width={250}
                    alt=""
                    className="h-auto w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* Wake up text */}
          <div>
            {wakeUp?.title && <h3 className={TITLE_CLASS}>{wakeUp.title}</h3>}
            {wakeUp?.body && <p className={BODY_CLASS}>{wakeUp.body}</p>}
          </div>

          {/* Hosted with heart text */}
          <div>
            {hostedWithHeart?.title && <h3 className={TITLE_CLASS}>{hostedWithHeart.title}</h3>}
            {hostedWithHeart?.body && <p className={BODY_CLASS}>{hostedWithHeart.body}</p>}
          </div>

          {/* Symphony text + CTA */}
          <div className="flex flex-col gap-8">
            <div>
              {symphony?.title && <h3 className={TITLE_CLASS}>{symphony.title}</h3>}
              {symphony?.body && <p className={BODY_CLASS}>{symphony.body}</p>}
            </div>
            {menuCta?.url && (
              <a
                href={menuCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
              >
                {menuCta.label || "WHAT'S ON THE MENU?"}
              </a>
            )}
          </div>

          {/* Food plate image */}
          {symphony?.image?.asset && (
            <div className="relative h-[360px] w-full overflow-hidden rounded-[5px]">
              <Img
                image={symphony.image}
                width={800}
                alt={symphony.image.alt ?? ''}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS. The component imports only `Img` from `@/ui/img` (existing module). All slot prop types are inline; no Sanity-generated types are referenced directly so the component compiles regardless of TypeGen state.

- [ ] **Step 3: Lint**

Run:

```bash
npm run lint
```

Expected: PASS, no warnings.

- [ ] **Step 4: Commit**

```bash
git add src/ui/pages/our-homes/property-highlights-section.tsx
git commit -m "feat(our-homes): add PropertyHighlightsSection grid component

3x3 CSS Grid using grid-template-areas, configurable cell sizes
and decor offsets via top-of-file GRID_CONFIG, mobile stack with
dining-table image above heading."
```

---

### Task 4: Wire `PropertyHighlightsSection` into the property detail page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx` (replace lines 246-374 — the inline highlights section — and add import)

**Context for the engineer:** The current inline section starts with `{property.highlights && property.highlights.length > 0 && (` and ends 128 lines later with `)}`. We replace that whole block with a single `<PropertyHighlightsSection … />` call. The new component handles its own null-render guard.

- [ ] **Step 1: Add the import**

At the top of `src/app/(site)/our-homes/[slug]/page.tsx`, add to the existing import block:

```ts
import PropertyHighlightsSection from '@/ui/pages/our-homes/property-highlights-section'
```

(Place it alphabetically near the other `@/ui/pages/our-homes/...` imports around lines 9-16.)

- [ ] **Step 2: Replace the inline highlights section**

Locate lines 246-374, the block beginning with:

```tsx
{/* 4. Highlights — What's Waiting For You? */}
{property.highlights && property.highlights.length > 0 && (
  <section className="w-full overflow-hidden bg-background">
```

…and ending with:

```tsx
        </div>
      </section>
    )}
```

Replace that entire block with:

```tsx
{/* 4. Highlights — What's Waiting For You? */}
<PropertyHighlightsSection
  windDown={property.windDownHighlight ?? null}
  wakeUp={property.wakeUpHighlight ?? null}
  hostedWithHeart={property.hostedWithHeartHighlight ?? null}
  symphony={property.symphonyHighlight ?? null}
  menuCta={property.menuCta ?? null}
/>
```

- [ ] **Step 3: Typecheck**

Run:

```bash
npm run typecheck
```

Expected: PASS. If TypeScript complains that one of the named-slot fields does not exist on `Property`, re-run `npm run typegen` first — Tasks 1-2 must have produced the fields in `src/sanity/types.ts`.

- [ ] **Step 4: Lint**

Run:

```bash
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/(site)/our-homes/[slug]/page.tsx
git commit -m "feat(our-homes): wire PropertyHighlightsSection into detail page

Replace inline highlights[]-based row layout with the named-slot
3x3 grid component."
```

---

### Task 5: Visual verification on dev server

**Files:** none (read-only verification)

**Context for the engineer:** Until the editor migrates Bagaan content into the four new named slots, `property.windDownHighlight` etc. will be undefined and the section will render nothing. We need to (a) confirm the page does not crash, and (b) confirm the new fields are visible and editable in Sanity Studio.

- [ ] **Step 1: Start the dev server**

Run:

```bash
npm run dev
```

Expected: server starts on port 3000 (or 3001 if 3000 is busy). If the port is already in use but nothing is serving, kill the stale process: `lsof -ti :3000 :3001 | xargs kill -9`.

- [ ] **Step 2: Visit the Bagaan property detail page**

Open `http://localhost:3000/our-homes/bagaan` (or the actual Bagaan slug — confirm via Studio if unsure).

Expected: page renders without runtime errors. The "What's Waiting For You?" section is **absent** because the new named-slot fields are empty in the CMS. All other sections (hero, intro, gallery, location, experiences, amenities, FAQs, causes, reviews, CTA) render normally. Check the browser console for errors — none expected.

- [ ] **Step 3: Verify Studio shows the new fields**

Open `http://localhost:3000/studio`. Navigate to the Bagaan property document → Highlights tab.

Expected: four new field groups labelled "Wind Down Highlight", "Wake Up Highlight", "Hosted With Heart Highlight", "Symphony of Flavours Highlight". The deprecated "Highlights (DEPRECATED — use named slots below)" array still shows above them with its content intact. Each new slot expands to show title/body/image fields per its schema definition.

- [ ] **Step 4: Editor performs content migration (manual)**

The editor (user) opens Bagaan in Studio and copies content from each `highlights[i]` into the corresponding new slot:

- `highlights[0]` → `windDownHighlight` (title, body, image; map `decorImage` → `windDownHighlight.decorImage`; map `secondaryImage` → `windDownHighlight.secondaryDecorImage` if it represents the leaf decor)
- `highlights[1]` → `wakeUpHighlight` (title, body, image)
- `highlights[2]` → `symphonyHighlight` (title, body, image)
- `hostedWithHeartHighlight` — fresh content (title + body) provided by the editor
- The fourth `highlights[3]` (food plate image) likely belongs to `symphonyHighlight.image` instead — the editor decides which assets land where based on the design intent.

After publishing, refresh the property page and confirm the new 3x3 grid renders on desktop and the mobile stack renders on narrow viewports.

- [ ] **Step 5: Tune `GRID_CONFIG` values if needed**

If desktop row heights, gap, or decor offsets feel off after content lands, edit only `GRID_CONFIG` in `src/ui/pages/our-homes/property-highlights-section.tsx`. No other code changes should be needed for visual tuning.

- [ ] **Step 6: Final typecheck + lint sweep**

Run:

```bash
npm run typecheck && npm run lint
```

Expected: both PASS.

- [ ] **Step 7: No commit needed for Step 5 unless `GRID_CONFIG` was tuned**

If `GRID_CONFIG` was tuned, commit:

```bash
git add src/ui/pages/our-homes/property-highlights-section.tsx
git commit -m "fix(our-homes): tune highlights grid sizing and decor offsets"
```

---

## Out of scope for this plan

- Removing the deprecated `highlights[]` field from the schema. This is a follow-up commit to be made only after the editor confirms migration is complete on all properties (currently only Bagaan).
- Migrating any property other than Bagaan (no other property currently has `highlights[]` content).
- Adding new properties or any other section changes.
- Editor-driven decor positioning. Decor offsets remain in `GRID_CONFIG` in code.
