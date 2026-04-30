# UI Audit & Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit all public-facing UI for token violations, spacing inconsistencies, responsiveness gaps, image quality/performance issues, and layout problems — then execute a designer-approved remediation plan with atomic commits.

**Architecture:** Four parallel auditor agents cover page clusters and write raw findings to `AUDIT.md`. A designer agent synthesises findings into a prioritised `REMEDIATION.md` + `CMS-DEPS.md`. The user approves each remediation group before a frontend executor implements fixes atomically.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first, single 820px breakpoint) · Sanity v3 · next/image

---

## Reference: Design Tokens (from `src/ui/UI_GUIDELINES.md`)

```
bg-background / text-background   → #FCF6EA (cream)
text-foreground                    → #3A3A3A (charcoal)
bg-primary / text-primary          → #2F5D50 (green)
text-primary-foreground            → #FCF6EA
bg-accent / text-accent            → #F2C94C (yellow)
text-accent-foreground             → #3A3A3A
text-muted                         → #D0D0D0
font-heading italic                → Playfair Display italic
font-sans                          → Poppins (default)
Page padding desktop               → px-[90px]
Page padding mobile                → px-[18px] (max-[820px]:px-[18px])
Single breakpoint                  → max-[820px]: for mobile overrides
```

Hardcoded hex, `text-black`, `text-white` (except on guaranteed-dark overlays), `bg-[#XXX]`, raw `font-['Playfair_Display']` — all violations.

---

## Output Files

```
docs/superpowers/ui-audit/
  AUDIT.md        ← auditor agents write here
  REMEDIATION.md  ← designer agent writes here (user review gate)
  CMS-DEPS.md     ← designer agent writes here (flag-only)
```

---

## Finding Format (used by all auditor agents)

```
---
FILE: src/ui/pages/our-homes/property-showcase.tsx
LINE: 47
ISSUE: Hardcoded `text-black` — should be `text-foreground`
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---
```

---

## Task 1: Create Output Directory

**Files:**
- Create: `docs/superpowers/ui-audit/AUDIT.md`
- Create: `docs/superpowers/ui-audit/REMEDIATION.md`
- Create: `docs/superpowers/ui-audit/CMS-DEPS.md`

- [ ] **Step 1: Create the directory and stub files**

```bash
mkdir -p docs/superpowers/ui-audit
```

Create `docs/superpowers/ui-audit/AUDIT.md`:
```markdown
# UI Audit Findings

<!-- Auditor agents append their findings below, one cluster per section -->

## A1 — Shared Shell

## A2 — Property Pages

## A3 — Content Pages

## A4 — Blog
```

Create `docs/superpowers/ui-audit/REMEDIATION.md`:
```markdown
# UI Remediation Plan

<!-- Designer agent fills this in after audit is complete -->
```

Create `docs/superpowers/ui-audit/CMS-DEPS.md`:
```markdown
# CMS Dependencies

<!-- Designer agent flags CMS-side changes needed — no execution plan -->
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/ui-audit/
git commit -m "chore: scaffold ui-audit output directory"
```

---

## Tasks 2–5: Parallel Audit (dispatch all four simultaneously)

> **Dispatch Tasks 2, 3, 4, and 5 in parallel.** All four auditors write to `AUDIT.md` under their own section header. After all four complete, proceed to Task 6.

---

## Task 2: Audit A1 — Shared Shell

**Files to read (all of them):**
- `src/ui/atoms/badge.tsx`
- `src/ui/atoms/icon-map.ts`
- `src/ui/atoms/icon.tsx`
- `src/ui/atoms/nav-cta.tsx`
- `src/ui/atoms/pill.tsx`
- `src/ui/atoms/react-icon.tsx`
- `src/ui/molecules/footer-col.tsx`
- `src/ui/molecules/hero-decor-image.tsx`
- `src/ui/molecules/menu-toggle.tsx`
- `src/ui/molecules/social-links.tsx`
- `src/ui/header/index.tsx`
- `src/ui/header/dropdown.tsx`
- `src/ui/header/megamenu.tsx`
- `src/ui/header/mobile-only-details.tsx`
- `src/ui/header/mobile-toggle.tsx`
- `src/ui/header/navigation.tsx`
- `src/ui/header/wrapper.tsx`
- `src/ui/header/header.module.css`
- `src/ui/footer/index.tsx`
- `src/ui/footer/link.list.tsx`
- `src/ui/footer/navigation.tsx`
- `src/ui/home-hero.tsx`
- `src/ui/home-hero.module.css`
- `src/ui/menu-overlay.tsx`

**Checklist for every file:**

- [ ] **token-violation**: Any `text-black`, `text-white` (unless on `bg-primary` or guaranteed dark bg), `bg-[#XXX]`, hardcoded hex in className, `font-['Playfair_Display']` without using `font-heading`

- [ ] **spacing-inconsistency**: Page horizontal padding must be `px-[90px]` desktop / `px-[18px]` mobile. Footer padding must be `px-[90px] py-[37px]` desktop / `px-[24px] py-[30px]` mobile. Flag deviations.

- [ ] **responsiveness**: Every component must handle `max-[820px]:` correctly. Check for fixed pixel widths (`w-[Xpx]`) that would overflow on mobile or intermediate widths (400–819px). Touch targets on interactive elements (hamburger, pills, CTAs) must be ≥44px.

- [ ] **layout**: Header fixed positioning, z-index, logo hidden on mobile (`max-[820px]:hidden`). Footer four-column layout. Menu overlay left panel hidden on mobile.

- [ ] **typography-consistency**: Display/heading text — all must use `font-heading italic` not raw `font-['Playfair_Display'] italic`. Tracking on labels should be `tracking-[0.1em]`, CTA buttons `tracking-[0.3em]`.

- [ ] **interactive-states**: Nav links, CTA buttons, pill buttons, hamburger — do they have hover/focus states? Are transitions consistent (`transition-*`, `duration-*`)? Luxury standard: subtle opacity or color shift on hover.

- [ ] **image-quality-and-performance**: `fill` images → must have `sizes`. Hero images → must have `priority`. No raw `<img>`. Sanity assets → must go through `urlFor()`. CSS-hidden images that are still fetched.

- [ ] **file-hygiene**: Unused imports, dead code. CSS module (`header.module.css`, `home-hero.module.css`) — verify it's only used for JS-driven custom properties, not avoidance of long Tailwind classes. Tier violations: atoms/molecules must not fetch Sanity data.

- [ ] **Step: Write findings to `docs/superpowers/ui-audit/AUDIT.md` under `## A1 — Shared Shell`**

  Use the finding format:
  ```
  ---
  FILE: src/ui/header/index.tsx
  LINE: 23
  ISSUE: `text-white` used on element that is not guaranteed dark background
  CATEGORY: token-violation
  SEVERITY: medium
  CMS-DEP: no
  ---
  ```

  If no issues found in a category, write: `<!-- A1: no [category] issues found -->`

- [ ] **Step: Commit**

```bash
git add docs/superpowers/ui-audit/AUDIT.md
git commit -m "chore(audit): A1 shared shell findings"
```

---

## Task 3: Audit A2 — Property Pages

**Files to read (all of them):**
- `src/app/(site)/our-homes/page.tsx`
- `src/app/(site)/our-homes/[slug]/page.tsx`
- `src/ui/pages/our-homes/amenity-columns.ts`
- `src/ui/pages/our-homes/our-homes-cta.tsx`
- `src/ui/pages/our-homes/our-homes-hero.tsx`
- `src/ui/pages/our-homes/property-amenities-section.tsx`
- `src/ui/pages/our-homes/property-experiences-section.tsx`
- `src/ui/pages/our-homes/property-gallery-section.tsx`
- `src/ui/pages/our-homes/property-search.tsx`
- `src/ui/pages/our-homes/property-showcase.tsx`
- `src/ui/pages/our-homes/property-showcase.module.css`

**Checklist for every file:**

- [ ] **token-violation**: `text-black`, `text-white` (not on dark bg), `bg-[#XXX]`, hardcoded hex in className, raw `font-['Playfair_Display']`

- [ ] **spacing-inconsistency**: Property detail page uses same `px-[90px]` / `px-[18px]` horizontal padding rules. Sections stacked vertically — check vertical rhythm consistency.

- [ ] **responsiveness**: Property detail page has multiple sections (gallery, amenities, experiences). Each section must work at all widths. Fixed-width columns (e.g. `w-[576px]`) that overflow mobile. The `property-showcase.module.css` — is it using fluid or fixed geometry? Images hidden on mobile via CSS but still network-fetched.

- [ ] **layout**: Property search on our-homes listing — grid at all widths. Property detail — section ordering, proportion of image vs text columns.

- [ ] **typography-consistency**: Property title, section headings — using `font-heading italic` or drifting? Tracking on labels.

- [ ] **interactive-states**: Property cards (hover state), gallery images (hover), amenity items, experience cards. Consistent transitions?

- [ ] **image-quality-and-performance**:
  - Gallery images: `quality` should be ≥85
  - Property hero: must have `priority` prop
  - Amenities section image: check `sizes` and `priority`
  - Any `fill` image missing `sizes`
  - Images hidden on mobile but still loaded — flag for server-side conditional render or `display: none` → should not fetch at all

- [ ] **file-hygiene**: `property-showcase.module.css` — verify JS-driven custom property usage only. Unused imports.

- [ ] **Step: Write findings to `docs/superpowers/ui-audit/AUDIT.md` under `## A2 — Property Pages`**

- [ ] **Step: Commit**

```bash
git add docs/superpowers/ui-audit/AUDIT.md
git commit -m "chore(audit): A2 property pages findings"
```

---

## Task 4: Audit A3 — Content Pages

**Files to read (all of them):**
- `src/app/(site)/experiences/page.tsx`
- `src/app/(site)/the-alt-way/page.tsx`
- `src/app/(site)/contact/page.tsx`
- `src/app/(site)/join-us/page.tsx`
- `src/app/(site)/[slug]/page.tsx`
- `src/ui/pages/experiences/experience-grid.tsx`
- `src/ui/pages/experiences/experiences-updated/experience-card.tsx`
- `src/ui/pages/experiences/experiences-updated/experience-grid.tsx`
- `src/ui/pages/experiences/experiences-updated/experiences-hero.tsx`
- `src/ui/forms/availability-form.tsx`
- `src/ui/forms/contact-form.tsx`
- `src/ui/forms/partner-form.tsx`
- `src/ui/modules/hero.split.tsx`
- `src/ui/modules/prose/index.tsx`
- `src/ui/modules/prose/anchored-heading.tsx`
- `src/ui/modules/prose/code.tsx`
- `src/ui/modules/prose/image.tsx`

**Checklist for every file:**

- [ ] **token-violation**: `text-black`, `text-white`, hardcoded hex, raw Playfair

- [ ] **spacing-inconsistency**: Page padding rules. Form input padding — consistent across all 3 forms?

- [ ] **responsiveness**: Experiences grid — does it reflow gracefully at intermediate widths? Forms — input width, label alignment on mobile. Hero split — does left/right split break correctly at 820px?

- [ ] **layout**: Experiences page — card grid proportions. Contact/join-us — form layout. The-alt-way — module rendering.

- [ ] **typography-consistency**: Experience card headings, hero headings, form labels — all using correct tokens?

- [ ] **interactive-states**: Form inputs — focus ring style. Experience cards — hover. Submit buttons — hover state.

- [ ] **image-quality-and-performance**: Experience card images — `sizes`, `quality` (≥85 for hero-size, default 75 for card thumbs). Prose images — `sizes`. Any raw `<img>`.

- [ ] **file-hygiene**: Two experience grid files exist (`experience-grid.tsx` at top level AND `experiences-updated/experience-grid.tsx`) — flag if one is dead code. Unused imports.

- [ ] **Step: Write findings to `docs/superpowers/ui-audit/AUDIT.md` under `## A3 — Content Pages`**

- [ ] **Step: Commit**

```bash
git add docs/superpowers/ui-audit/AUDIT.md
git commit -m "chore(audit): A3 content pages findings"
```

---

## Task 5: Audit A4 — Blog

**Files to read (all of them):**
- `src/app/(site)/blog/page.tsx`
- `src/app/(site)/blog/[slug]/page.tsx`
- `src/ui/modules/blog/blog-index/index.tsx`
- `src/ui/modules/blog/blog-index/paginated-posts.tsx`
- `src/ui/modules/blog/blog-index/skeleton.tsx`
- `src/ui/modules/blog/blog-index/sort-by.tsx`
- `src/ui/modules/blog/blog-post-content.tsx`
- `src/ui/modules/blog/blog-post-content.module.css`
- `src/ui/modules/blog/blog-post-list.tsx`
- `src/ui/modules/blog/byline.tsx`
- `src/ui/modules/blog/categories.tsx`
- `src/ui/modules/blog/date.tsx`
- `src/ui/modules/blog/filter-list.tsx`
- `src/ui/modules/blog/filter.tsx`
- `src/ui/modules/blog/post-preview-large.tsx`
- `src/ui/modules/blog/post-preview.tsx`

**Checklist for every file:**

- [ ] **token-violation**: `text-black`, `text-white`, hardcoded hex, raw Playfair

- [ ] **spacing-inconsistency**: Blog index and post page horizontal padding. Post content prose width.

- [ ] **responsiveness**: Blog card grid on mobile. Post content readability at narrow widths. Filter/sort controls on mobile.

- [ ] **layout**: Blog index grid — post-preview-large vs post-preview proportion. Category/filter bar positioning.

- [ ] **typography-consistency**: Post titles, headings in post content. Tracking on labels, dates, bylines.

- [ ] **interactive-states**: Post preview cards (hover). Category filter buttons (active/hover state). Sort-by control.

- [ ] **image-quality-and-performance**: Post preview images — `sizes`, `quality` (85 for large previews, 75 for thumbnails). Post hero image — `priority`. Any raw `<img>`. `blog-post-content.module.css` — verify JS-driven use only.

- [ ] **file-hygiene**: Unused imports in blog modules. `blog-post-content.module.css` — verify it's not just avoiding long Tailwind classes.

- [ ] **Step: Write findings to `docs/superpowers/ui-audit/AUDIT.md` under `## A4 — Blog`**

- [ ] **Step: Commit**

```bash
git add docs/superpowers/ui-audit/AUDIT.md
git commit -m "chore(audit): A4 blog findings"
```

---

## Task 6: Designer Synthesis

> Run after Tasks 2–5 all complete.

**Files:**
- Read: `docs/superpowers/ui-audit/AUDIT.md`
- Read: `src/ui/UI_GUIDELINES.md`
- Read: `src/ui/COMPONENT_DESIGN.md`
- Modify: `docs/superpowers/ui-audit/REMEDIATION.md`
- Modify: `docs/superpowers/ui-audit/CMS-DEPS.md`

- [ ] **Step 1: Read all audit findings and both guideline files**

- [ ] **Step 2: Write `REMEDIATION.md` with this exact structure**

```markdown
# UI Remediation Plan

> User approves/rejects/modifies each group before execution begins.
> Mark groups: ✅ APPROVED / ❌ REJECTED / ✏️ MODIFIED (add notes below)

## Group 1: Token Violations

<!-- List each finding. Format:
- **FILE:LINE** — current value → corrected value (token: `text-foreground`)
-->

## Group 2: Typography Consistency

<!-- font-heading drift, tracking deviations, heading hierarchy -->

## Group 3: Spacing & Layout

<!-- Spacing deviations, layout improvements, proportion fixes -->

## Group 4: Responsiveness

<!-- Mobile breakpoint gaps, fixed-width overflow, intermediate-width fluid issues, touch targets -->

## Group 5: Interactive States

<!-- Hover/focus/active — proposed consistent treatment per component type -->

## Group 6: Image Quality & Performance

<!-- sizes, priority, quality props, hidden-but-loaded images, security -->

## Group 7: File Hygiene

<!-- Unused imports, dead code, tier violations, CSS module misuse -->

## CMS Dependencies

<!-- See CMS-DEPS.md -->
```

**Designer constraints:**
- No new colors or fonts introduced
- Every fix cites which token or rule from `UI_GUIDELINES.md` it satisfies
- Cross-cutting decisions stated once at the top of the group (e.g., "All cards: `transition-opacity duration-200` on hover")
- Fixes at intermediate widths use `w-full`, `max-w-*`, percentage — not additional breakpoints
- No group proposes a full page layout redesign

- [ ] **Step 3: Write `CMS-DEPS.md`**

```markdown
# CMS Dependencies

These changes require Sanity schema or content updates. Not executed by the frontend executor.

<!-- Format per item:
## [Short title]
**Page/Component:** ...
**What's needed:** ...
**Why:** ...
-->
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/ui-audit/REMEDIATION.md docs/superpowers/ui-audit/CMS-DEPS.md
git commit -m "docs(ui-audit): designer remediation plan and CMS deps"
```

---

## Task 7: USER REVIEW GATE — pause here

> **DO NOT proceed to Task 8 without explicit user approval.**

Present the user with:

```
REMEDIATION.md is ready at docs/superpowers/ui-audit/REMEDIATION.md

Please review each group and mark:
  ✅ APPROVED — execute as written
  ❌ REJECTED — skip this group
  ✏️ MODIFIED — add notes below the group heading

When ready, say "proceed with approved groups" to start execution.
```

Wait for user response. Note which groups are approved.

---

## Task 8: Execute Approved Groups

> For each approved group in order (1 → 7), work through every finding in the group. Skip any finding that requires a CMS change — add it to `CMS-DEPS.md` instead.

**Execution protocol per finding:**

- [ ] Read the file at the specified line to verify the issue still exists
- [ ] Implement the fix using only design tokens from `UI_GUIDELINES.md`
- [ ] Run `npm run typecheck` — must pass before committing
- [ ] If typecheck fails: investigate, fix the type error, re-run
- [ ] Commit with descriptive message

**Commit message format:**

```bash
git commit -m "fix(ui): [category] [what changed] in [component]"
# examples:
git commit -m "fix(ui): token-violation text-black → text-foreground in property-showcase"
git commit -m "fix(ui): responsiveness add fluid width to amenities image column"
git commit -m "fix(ui): image-perf add priority and sizes to property hero"
```

**Fix patterns by category:**

### Group 1: Token Violations

```tsx
// BEFORE
<p className="text-black font-bold">

// AFTER
<p className="text-foreground font-bold">

// BEFORE
<div className="bg-[#3A3A3A]">

// AFTER
<div className="bg-foreground">

// BEFORE
<h2 className="font-['Playfair_Display'] italic">

// AFTER
<h2 className="font-heading italic">

// BEFORE — white only acceptable on guaranteed-dark bg
<span className="text-white">  // on bg-primary overlay: OK
<span className="text-white">  // on unknown bg: VIOLATION → text-foreground or text-primary-foreground
```

### Group 2: Typography Consistency

```tsx
// Tracking on uppercase labels
<span className="tracking-[0.1em] uppercase">  // labels, nav items
<span className="tracking-[0.3em] uppercase">  // CTA buttons only

// Heading hierarchy — semantic, not visual
<h1>Page title</h1>
<h2>Section title</h2>
<h3>Card title</h3>
// Never skip levels. Visual size is set by Tailwind class, not by heading level.
```

### Group 3: Spacing & Layout

```tsx
// Page horizontal padding — always both desktop and mobile together
<section className="px-[90px] max-[820px]:px-[18px]">

// Footer padding
<footer className="px-[90px] py-[37px] max-[820px]:px-[24px] max-[820px]:py-[30px]">

// Minor grid fix example
// BEFORE: fixed 3-col that breaks at intermediate widths
<div className="grid grid-cols-3 gap-6">
// AFTER: fluid that adapts
<div className="grid grid-cols-3 max-[820px]:grid-cols-1 gap-6">
```

### Group 4: Responsiveness

```tsx
// Fixed width that overflows → fluid
// BEFORE
<div className="w-[576px]">
// AFTER
<div className="w-full max-w-[576px]">

// Touch target minimum 44px
// BEFORE
<button className="p-2">  // 8px padding = 16+icon total, may be <44px
// AFTER
<button className="min-h-[44px] min-w-[44px] p-2">

// Image hidden on mobile but still loaded → conditional render
// BEFORE
<Image src={url} className="max-[820px]:hidden" fill ... />
// AFTER — server component
{!isMobile && <Image src={url} fill ... />}
// Or use Next.js responsive image with sizes="0px" — but conditional render is cleaner
// Note: if this is a client component, use conditional based on a CSS-only approach
// that doesn't fetch the image. Simplest correct fix: wrap in a div with max-[820px]:hidden
// BUT ensure the Image itself has sizes="0vw" at mobile so browser skips the fetch:
<Image
  src={url}
  fill
  sizes="(max-width: 820px) 0vw, 50vw"
  className="max-[820px]:hidden"
/>
```

### Group 5: Interactive States

```tsx
// Cards — consistent hover
<div className="transition-opacity duration-200 hover:opacity-80">

// Buttons — consistent hover (dark variant)
<button className="bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90">

// Links — consistent hover
<a className="transition-colors duration-200 hover:text-primary">

// Focus ring — visible for keyboard nav
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
```

### Group 6: Image Quality & Performance

```tsx
// Hero / above-fold images
<Image
  src={heroUrl}
  fill
  priority              // ← LCP image always gets priority
  quality={85}          // ← hero quality
  sizes="100vw"
  alt={property.title ?? ''}
/>

// Gallery images
<Image
  src={galleryUrl}
  fill
  quality={85}
  sizes="(max-width: 820px) 100vw, 50vw"
  alt={caption ?? ''}
/>

// Thumbnail / card images
<Image
  src={thumbUrl}
  fill
  quality={75}          // ← default, explicit is fine
  sizes="(max-width: 820px) 100vw, 33vw"
  alt={title ?? ''}
/>

// Large images — add blur placeholder
<Image
  src={url}
  fill
  placeholder="blur"
  blurDataURL={sanityImageBlurUrl}  // use Sanity's lqip field if available
  sizes="..."
  alt=""
/>

// Security — verify all Image src values come from urlFor() or static strings
// NEVER: <Image src={userInput} ...>
// ALWAYS: <Image src={urlFor(image).width(800).url()} ...>
```

### Group 7: File Hygiene

```tsx
// Remove unused import
// BEFORE
import { useState } from 'react'  // if useState isn't used in the file
// AFTER — remove the line

// CSS module misuse — migrate to Tailwind
// If a .module.css class has no CSS custom property (var(--something)), it should be Tailwind
// Move the styles inline, delete the CSS class, remove the import

// Tier violation — atom/molecule fetching Sanity data
// Move the getSite() call up to the organism caller and pass down as prop
```

- [ ] **After all approved groups complete, run final typecheck:**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Final commit if any loose changes:**

```bash
git add -p  # review any unstaged changes
git commit -m "fix(ui): final typecheck pass after remediation"
```

---

## Self-Review Against Spec

- **Parallel audit (4 clusters):** Tasks 2–5 cover A1–A4 ✅
- **All 8 audit categories:** All present in each task's checklist ✅
- **Finding format:** Specified and consistent ✅
- **Designer synthesis:** Task 6 produces REMEDIATION.md + CMS-DEPS.md ✅
- **User review gate:** Task 7 explicit pause ✅
- **Staged execution:** Task 8 per approved group ✅
- **Atomic commits:** One commit per fix ✅
- **TypeCheck before each commit:** Explicit in execution protocol ✅
- **CMS deps flag-only:** Findings added to CMS-DEPS.md, not executed ✅
- **No new tokens introduced:** Stated in designer constraints + execution protocol ✅
- **Fluid width at intermediate sizes:** Covered in responsiveness fix patterns ✅
- **Image security:** Covered in image-quality-and-performance checklist + fix patterns ✅
