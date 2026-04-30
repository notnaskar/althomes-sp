# Property Experiences Section — Design Spec

**Date:** 2026-04-30
**Scope:** Rebuild the experiences section on the property detail page with a background image, brand-compliant heading, and reused ExperienceCard components.

---

## Problem

Current experiences section (`src/app/(site)/our-homes/[slug]/page.tsx` lines 371–418) uses:
- `bg-gray-50` (off-token background)
- `sm:/lg:` responsive breakpoints (violates single `max-[820px]:` rule)
- `text-3xl font-bold` heading (violates `font-heading italic` mandate)
- Generic card markup instead of the existing `ExperienceCard` component

## Goal

Replace with a full-bleed background image section using brand tokens, extracted as a reusable component.

---

## Schema Change

**File:** `src/sanity/schemaTypes/documents/property.ts`

Add one field to the `experiences` group:

```ts
defineField({
  name: 'experiencesBgImage',
  title: 'Experiences Background Image',
  type: 'image',
  options: { hotspot: true },
  group: 'experiences',
})
```

Run `npm run typegen` after adding.

---

## Component

**File:** `src/ui/pages/our-homes/property-experiences-section.tsx`

### Props

```ts
interface PropertyExperiencesSectionProps {
  bgImage?: SanityImageType | null
  experiences: ExperienceItem[]   // max 3, capped by caller
  propertyTitle: string
}
```

### Layout

```
<section relative overflow-hidden py-[80px] px-[90px]>
  <Image fill object-cover absolute inset-0 />   ← next/image background
  <div relative z-10>
    <h2 font-heading italic text-white text-center drop-shadow-md>
      EXPERIENCES NEAR {PROPERTY TITLE}
    </h2>
    <div flex row gap-[24px] justify-center mt-[48px] max-[820px]:flex-col>
      <ExperienceCard tilt=cw />    ← index 0
      <ExperienceCard tilt=ccw />   ← index 1
      <ExperienceCard tilt=cw />    ← index 2
    </div>
  </div>
</section>
```

### Rules

- No overlay on background image
- Heading: `font-heading italic` (Playfair Display), white, `drop-shadow-md` for photo readability
- Cards: existing `ExperienceCard` from `src/ui/pages/experiences/experiences-updated/experience-card.tsx`
- Alternating tilt: even index → `cw`, odd index → `ccw`
- Single breakpoint only: `max-[820px]:flex-col`
- No CTA link

### Fallback

If `bgImage` is null/undefined, render section with `bg-background` (cream) and `text-foreground` heading instead of white.

---

## Wiring into page.tsx

**File:** `src/app/(site)/our-homes/[slug]/page.tsx`

Replace lines 371–418 with:

```tsx
{cappedExperiences.length > 0 && (
  <PropertyExperiencesSection
    bgImage={property.experiencesBgImage}
    experiences={cappedExperiences}
    propertyTitle={property.title ?? ''}
  />
)}
```

Import the new component at the top of the file.

---

## Query Update

**File:** `src/sanity/lib/queries.ts`

Add `experiencesBgImage { asset->, alt, hotspot, crop }` to the property detail GROQ query so the new field is fetched.

---

## Self-Review

- No placeholder sections ✓
- No contradictions (fallback handles missing image) ✓
- Scope is focused: one component, one schema field, one query addition ✓
- All breakpoints use `max-[820px]:` only ✓
- All tokens from design system (`bg-background`, `text-foreground`, `font-heading`) ✓
