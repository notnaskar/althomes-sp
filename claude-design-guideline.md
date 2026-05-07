# AltHomes — UI Code Generation Guidelines

For any agent generating frontend code for this project. Read fully before writing a single line.

---

## Stack Constraints (Hard Rules)

- **Framework:** Next.js 16 App Router. All components are Server Components by default. Add `'use client'` only when you need browser APIs, event handlers, or state.
- **Styling:** Tailwind v4 (CSS-first). No separate config file — tokens live in `src/app.css` via `@theme`. Use Tailwind utility classes for everything. No inline `style={}` except for runtime-computed CSS custom properties (see CSS section).
- **Images:** `next/image` always. Never `<img>`. Always pass `sizes` on fill-mode images. Guard all Sanity image slots — render `null` if asset is missing, never a placeholder.
- **TypeScript:** Strict. No `as any`. Every component must have explicit prop types.
- **Path aliases:** `@/*` → `src/*`. Use this everywhere.

---

## Design Tokens

These are the only colors and fonts you may use. No improvising.

### Colors

| Name | Hex | Tailwind class |
|---|---|---|
| Background (cream) | `#FCF6EA` | `bg-background` / `text-background` |
| Foreground (charcoal) | `#3A3A3A` | `text-foreground` |
| Primary (deep green) | `#2F5D50` | `bg-primary` / `text-primary` |
| Primary foreground | `#FCF6EA` | `text-primary-foreground` |
| Accent (yellow) | `#F2C94C` | `bg-accent` / `text-accent` |
| Accent foreground | `#3A3A3A` | `text-accent-foreground` |
| Muted | `#D0D0D0` | `text-muted` |
| WhatsApp | `#4CAF50` | inline style only |
| Orange (decorative) | `#F1893F` | inline style only |

### Typography

| Role | Font | Usage |
|---|---|---|
| Body | Poppins | `font-sans` (default — no class needed) |
| Display / headings | Playfair Display | `font-heading italic` |
| Mono | JetBrains Mono | `font-mono` |

**Display text is always italic Playfair Display.** This applies to: hero headlines, footer brand name, overlay nav links, section heading wordmarks.

Letter-spacing rules:
- Labels, nav items, section titles: `tracking-[0.1em]`
- CTA button text (uppercase): `tracking-[0.3em]`
- Body copy: default tracking

### Spacing Reference

| Context | Value |
|---|---|
| Page horizontal padding (desktop) | `px-[90px]` |
| Page horizontal padding (mobile) | `px-[18px]` |
| Footer padding (desktop) | `px-[90px] py-[37px]` |
| Footer padding (mobile) | `px-[24px] py-[30px]` |
| Overlay panel padding (desktop) | `p-[48px_40px_40px]` |
| Overlay panel padding (mobile) | `p-[36px_24px_28px]` |

## Responsive Breakpoints

We use standard Tailwind CSS v4 default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Guidance:**
- Design mobile-first by default.
- Use `md:` (768px) or `lg:` (1024px) for your primary tablet/desktop layout shifts.
- Do not use arbitrary breakpoint values like `min-[821px]:` or `max-[820px]:` unless there is a very specific, unavoidable design edge case.
- For overrides targeting *only* mobile beneath a breakpoint, you may use Tailwind's max-width modifiers (e.g., `max-lg:`).

---

## CSS Strategy

Tailwind utilities for everything. The one exception: when a CSS value is computed at runtime from data (e.g., badge position percentages from CMS), use a CSS Module with custom properties:

```tsx
// component.tsx
style={{ '--x': `${x}%`, '--y': `${y}%` } as React.CSSProperties}
```

```css
/* component.module.css */
.badge { left: var(--x); top: var(--y); }
```

Do not create CSS Modules for any other reason.

---

## Content Mapping Contract

### Core Principle

Every piece of text, image, or URL in the UI must originate from an explicit named prop. No hardcoded strings inside JSX. All content goes through a typed props interface.

### Prop Naming Convention

Use clear, descriptive camelCase names that communicate the content's role and section.

Good: `heroHeadline`, `missionStatement`, `valuePropHeadline`, `decorBasket`
Bad: `text1`, `img`, `content`, `data`

Prefix with section for page-level fields: `heroHeadline`, `heroSubtext`, `heroBackground`. No prefix for global/layout fields: `navCtaLabel`, `bookDirectLink`.

### Content Field Map

After generating each component, produce a **Content Field Map** — every dynamic content slot in the UI, named and typed. This is the required output format:

```
## Content Field Map — [ComponentName]

| Field name          | Type                        | Required | UI location                        | Fallback              |
|---------------------|-----------------------------|----------|------------------------------------|-----------------------|
| heroHeadline        | string                      | yes      | Hero → <h1>                        | 'Travel Beyond...'    |
| heroSubtext         | string                      | no       | Hero → subtitle <p>                | —                     |
| heroBackground      | image { src, alt }          | no       | Hero → full-bleed background       | null (hidden)         |
| missionStatement    | text (multiline)            | yes      | Mission section → body copy        | —                     |
| valueProps          | { title, body }[]           | yes      | Value grid → 2×2 cards             | —                     |
| navCtaLabel         | string                      | yes      | Header → CTA button label          | 'STAY WITH US'        |
```

Rules:
- Every prop in the component's type interface must appear in this map. No exceptions.
- `Type` must be one of: `string`, `text (multiline)`, `number`, `boolean`, `url`, `image { src, alt }`, `{ key, value }[]`, or a described object shape.
- `Required` = would the layout break or a section disappear without it?
- `Fallback` = the exact string used, or `—` if none, or `null (hidden)` if the element is conditionally not rendered.

### Static vs Dynamic Slots

Annotate every content slot in JSX:

| Tag | Meaning |
|---|---|
| `{/* CONTENT: field_name */}` | Dynamic — appears in the Content Field Map |
| `{/* STATIC */}` | Never changes — hardcoded is correct |
| `{/* COMPUTED */}` | Derived from other props (e.g. formatted phone, constructed URL) |

### Fallbacks

Document at the top of every component file:

```tsx
// FALLBACKS:
// heroHeadline → 'Travel Beyond, Discover Within'
// navCtaLabel  → 'STAY WITH US'
```

---

## Component Structure Rules

### File layout

```
src/ui/
  atoms/        ← no data fetching, props only
  molecules/    ← composed atoms, no Sanity fetches
  pages/        ← page-specific sections (organisms)
  header/       ← Header organism
  footer/       ← Footer organism
```

When generating UI for a specific page, place it in `src/ui/pages/[page-name]/`.

### Component file structure

```tsx
'use client' // only if needed

import type { FC } from 'react'

// Types first
type Props = {
  heroHeadline: string | null
  // ...
}

// FALLBACKS:
// heroHeadline → 'Travel Beyond, Discover Within'

export default function ComponentName({ heroHeadline }: Props) {
  return (
    // JSX
  )
}
```

---

## Image Handling

```tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

// Fill mode (background/cover):
<div className="relative">
  <Image
    src={urlFor(image).url()}
    alt={image?.alt ?? ''}
    fill
    sizes="100vw"
    className="object-cover"
  />
</div>

// Fixed size:
<Image
  src={urlFor(image).width(800).url()}
  alt={image?.alt ?? ''}
  width={800}
  height={600}
/>

// Hero/LCP images:
<Image ... loading="eager" priority />

// Guard missing asset:
{image?.asset && <Image ... />}
```

---

## Brand Personality Reference

Design language: warm, editorial, premium. Boutique hospitality — not SaaS.

- Generous whitespace
- Cream backgrounds, deep green accents, yellow highlights
- Display type always italic Playfair — never upright for headings
- Uppercase labels with wide tracking
- Circular crop motifs on hero photos
- Decorative botanical/geometric assets from Sanity (flowers, stars, stripes) — never synthesized in code

---

## What to Deliver

For each page/section:

1. **Component file** — typed props, Tailwind-only styles, all content via props
2. **Prop interface** — every field named to match its future Sanity field
3. **Fallback comment block** — listed at top of file
4. **CMS annotation pass** — `{/* CMS: field_name */}` on every dynamic slot
5. **Static HTML reference** (optional) — if generating from a Figma/screenshot, include the raw structure as a comment block before the JSX so mapping is traceable

Do not wire Sanity data. Do not call `getSite()` or `sanityFetch`. Generate pure presentational components with typed props. Wiring happens in a separate pass.
