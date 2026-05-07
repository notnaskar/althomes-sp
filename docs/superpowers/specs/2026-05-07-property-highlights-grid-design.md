# Property Highlights Grid Section — Design Spec

**Date**: 2026-05-07
**Scope**: Refactor the "What's Waiting For You?" section on the property detail page into a fixed 3x3 grid layout with named Sanity slots and a configurable cell-sizing system.
**Affected route**: `/our-homes/[slug]` (currently only Bagaan has content).

## Background

The current implementation in `src/app/(site)/our-homes/[slug]/page.tsx` (lines 246-374) renders the `highlights[]` array as four alternating-direction rows. Every property reuses the same loose row layout. The new design fixes the layout to a Bagaan-specific 3x3 grid with intentional cell positioning, adds a fourth content block ("Hosted With Heart"), and exposes cell width/height for easy in-code adjustment.

## Requirements

### Layout (desktop, `lg+`)

A 3-column × 3-row CSS Grid with these cells:

| Row | Col 1                       | Col 2                       | Col 3                  |
|-----|-----------------------------|-----------------------------|------------------------|
| 1   | "What You'll Wind Down With" text | Dining table image + decor (wrap + leaf), spans col 2-3   |                        |
| 2   | Tea-leaves hand image       | "What You'll Wake Up To" text | "Hosted With Heart" text |
| 3   | "A Symphony of Flavours" text + menu CTA | Food plate image, spans col 2-3                |                        |

Heading "WHAT'S WAITING FOR YOU?" sits centered above the grid.

### Layout (mobile, `< lg`)

Vertical stack in this order:

1. Dining table image (full-width, **above heading**)
2. Heading "WHAT'S WAITING FOR YOU?"
3. "Wind Down" title + body
4. Collage: wrap decor + tea-leaves image + leaf decor (decors absolute-positioned around tea-leaves)
5. "Wake Up" title + body
6. "Hosted With Heart" title + body
7. "Symphony" title + body + menu CTA
8. Food plate image (full-width)

### Sanity schema changes

Replace the existing `highlights[]` array (deprecated, kept temporarily) with four explicit named-slot fields on the `property` document, all in the `highlights` field group:

```ts
windDownHighlight: {
  title: string (required),
  body: text (required),
  image: image (dining table photo, optional),
  decorImage: image (wrap with tassels, optional),
  secondaryDecorImage: image (leaf, optional),
}

wakeUpHighlight: {
  title: string (required),
  body: text (required),
  image: image (tea-leaves hand photo, optional),
}

hostedWithHeartHighlight: {
  title: string (required),
  body: text (required),
  // text-only — no image fields
}

symphonyHighlight: {
  title: string (required),
  body: text (required),
  image: image (food plate photo, optional),
}
```

The existing top-level `menuCta` field stays as-is and is consumed by the symphony cell.

### Migration

The existing `highlights[]` array stays in the schema during this phase but is no longer rendered. Editor manually copies content from `highlights[0..3]` into the four new named slots in Sanity Studio (Bagaan only). Once verified live, a follow-up commit removes `highlights[]` from the schema. Claude does not have a Sanity write token, so the migration must be performed by the editor in Studio.

### Cell-sizing flexibility

A single `GRID_CONFIG` object at the top of the new component file controls all magic numbers:

```ts
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
    wrap:        { left: '-30px',  top: '60px',   width: '180px', rotate: '0deg' },
    leaf:        { right: '-20px', top: '20px',   width: '160px', rotate: '15deg' },
    wrapMobile:  { left: '-20px',  top: '40px',   width: '140px', rotate: '0deg' },
    leafMobile:  { right: '-10px', top: '120px',  width: '110px', rotate: '15deg' },
  },
}
```

Numbers are placeholder/representative starting values. Final pixel values will be tuned visually after wiring CMS content.

The grid uses `gridTemplateAreas` so cell positions are declarative and span behavior (col 2-3) is expressed in the template literal, not in span utilities.

## Component design

### New file

`src/ui/pages/our-homes/property-highlights-section.tsx`

Server component. Receives the four highlight slots and `menuCta` as props. Reads no Sanity data itself; the parent page passes pre-fetched data.

**Props shape:**

```ts
type Props = {
  windDown: PropertyHighlightSlot | null
  wakeUp: PropertyHighlightSlot | null
  hostedWithHeart: PropertyHighlightSlot | null
  symphony: PropertyHighlightSlot | null
  menuCta: { label?: string; url?: string } | null
}
```

`PropertyHighlightSlot` is the type emitted by `npm run typegen` from the new schema fields.

### Render structure

```
<section>
  {/* mobile-only: dining table above heading */}
  <div class="lg:hidden">
    <Img diningTable />
  </div>

  <h2>WHAT'S WAITING FOR YOU?</h2>

  {/* desktop grid */}
  <div class="hidden lg:grid" style={{ gridTemplateAreas, gridTemplateColumns, gridTemplateRows, gap }}>
    <div style={{ gridArea: 'windText' }}>...wind down text</div>
    <div style={{ gridArea: 'diningImg' }} class="relative">
      <Img diningTable />
      <Img decorWrap class="absolute" style={{...wrap}} />
      <Img decorLeaf class="absolute" style={{...leaf}} />
    </div>
    <div style={{ gridArea: 'teaImg' }}><Img teaLeaves /></div>
    <div style={{ gridArea: 'wakeText' }}>...wake up text</div>
    <div style={{ gridArea: 'hostedText' }}>...hosted text</div>
    <div style={{ gridArea: 'symText' }}>...symphony text + menuCta</div>
    <div style={{ gridArea: 'foodImg' }}><Img foodPlate /></div>
  </div>

  {/* mobile stack */}
  <div class="flex flex-col lg:hidden gap-y-...">
    <wind-down text />
    <div class="relative">  {/* collage */}
      <Img teaLeaves />
      <Img decorWrap class="absolute" style={{...wrapMobile}} />
      <Img decorLeaf class="absolute" style={{...leafMobile}} />
    </div>
    <wake-up text />
    <hosted text />
    <symphony text + menuCta />
    <Img foodPlate />
  </div>
</section>
```

Notes:
- The dining table image renders twice in the DOM (once mobile-above-heading, once desktop-grid-cell). Same Sanity URL — browser cache deduplicates the network fetch. Acceptable cost; avoids brittle CSS `order` reordering across breakpoints.
- All text blocks reuse the existing typography tokens already used in the current section (font-heading 20px tracking-[0.2em] for titles, font-sans 15px tracking-[0.1em] for body).
- The food plate cell (row 3 col 2-3) keeps its current rounded-left treatment from the existing implementation if desired; otherwise full bleed inside the cell.

### Page integration

`src/app/(site)/our-homes/[slug]/page.tsx`:
- Remove the inline highlights section (lines 246-374).
- Replace with:
  ```tsx
  {(property.windDownHighlight || property.wakeUpHighlight || property.hostedWithHeartHighlight || property.symphonyHighlight) && (
    <PropertyHighlightsSection
      windDown={property.windDownHighlight ?? null}
      wakeUp={property.wakeUpHighlight ?? null}
      hostedWithHeart={property.hostedWithHeartHighlight ?? null}
      symphony={property.symphonyHighlight ?? null}
      menuCta={property.menuCta ?? null}
    />
  )}
  ```

### GROQ query update

`src/sanity/lib/queries.ts` — extend the property query to project the four new slot objects (with their nested image asset/alt fields) and remove projection of `highlights[]` once migration is complete. For this phase, both old and new fields are projected to avoid breaking the deprecated array's references elsewhere (none currently outside this section).

## Non-goals

- No animation/scroll-triggered effects.
- No editor-controllable decor offsets — positioning lives in code config.
- No support for additional or fewer highlights — layout is fixed 4-block.
- No changes to other property page sections.
- No removal of `highlights[]` from the schema in this phase (handled in a follow-up after migration).

## Files touched

| File | Change |
|------|--------|
| `src/sanity/schemaTypes/documents/property.ts` | Add 4 named slot fields under `highlights` group; mark old `highlights[]` deprecated (description + `hidden` or `readOnly`) |
| `src/sanity/lib/queries.ts` | Project new fields in property query |
| `src/sanity/types.ts` | Auto-regenerated via `npm run typegen` |
| `src/ui/pages/our-homes/property-highlights-section.tsx` | New component file |
| `src/app/(site)/our-homes/[slug]/page.tsx` | Replace inline section with new component |

## Acceptance criteria

1. Sanity Studio shows four named highlight tabs/fields under the Highlights group: Wind Down, Wake Up, Hosted With Heart, Symphony of Flavours.
2. Old `highlights[]` array remains visible (or hidden) in Studio for migration safety; not rendered on the live page.
3. Bagaan detail page renders the new 3x3 grid layout on desktop matching the provided desktop mockup.
4. Bagaan detail page on mobile renders the dining-table image above the heading, then the heading, then the stacked text + collage + food plate per the mobile mockup.
5. `npm run typecheck` passes.
6. `npm run lint` passes.
7. Editing a value in `GRID_CONFIG` (e.g. `rows[1] = '420px'`) is reflected on the live page after rebuild without changes elsewhere.
8. Decor positioning differs between mobile and desktop per `decor.*Mobile` and `decor.*` config.

## Open questions

None at spec lock time. All design choices confirmed in brainstorming session 2026-05-07.
