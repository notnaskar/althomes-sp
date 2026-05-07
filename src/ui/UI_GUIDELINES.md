# AltHomes UI Agent Guidelines

Complete context for any agent performing UI work on this project. Read this before touching any UI file.

---

## Project Identity

AltHomes is a luxury property rental platform (Goa, India). Design language: warm, editorial, premium. Think boutique hospitality — not generic SaaS.

**Stack:** Next.js 16 App Router · TypeScript · Tailwind v4 (CSS-first) · Sanity v3 · next/image

---

## Absolute Rules (Never Break)

- **`next/image` always** — never raw `<img>` tags. Always pass `sizes` on `fill` images.
- **No inline SVG as content placeholder** — if a Sanity image asset is missing, render `null`. Use `HeroDecorImage` molecule for all decorative image slots.
- **No `getSite()` in atoms or molecules** — only organisms fetch Sanity data.
- **`output: 'standalone'`** in `next.config.ts` — never remove (Hetzner/Coolify deployment).
- **No Vercel-specific APIs** — `@vercel/kv`, `@vercel/blob`, `vercelWidget` are forbidden.
- **No Sanity writes from forms** — Resend email only.
- **No comments in code** unless the WHY is non-obvious.
- **No raw `<img>`, no placeholder SVGs, no lorem ipsum** — all content slots either render real data or `null`.

---

## Design Tokens

Defined in `src/app.css` via Tailwind v4 `@theme`. Use these class names:

### Colors

| Token | Hex | Tailwind class |
|-------|-----|----------------|
| Background (cream) | `#FCF6EA` | `bg-background` / `text-background` |
| Foreground (charcoal) | `#3A3A3A` | `text-foreground` |
| Primary (green) | `#2F5D50` | `bg-primary` / `text-primary` |
| Primary foreground | `#FCF6EA` | `text-primary-foreground` |
| Accent (yellow) | `#F2C94C` | `bg-accent` / `text-accent` |
| Accent foreground | `#3A3A3A` | `text-accent-foreground` |
| Muted | `#D0D0D0` | `text-muted` |
| WhatsApp green | `#4CAF50` | inline style only |
| Orange (decorative) | `#F1893F` | inline style only |

When using inline styles for colors, always use the hex above — never guess.

### Typography

| Role | Font | Tailwind class |
|------|------|----------------|
| Body | Poppins | `font-sans` (default) |
| Display / headings | Playfair Display (italic) | `font-heading` |
| Mono | JetBrains Mono | `font-mono` |

Display text is **always italic Playfair Display**. Use `font-['Playfair_Display'] italic` or `font-heading italic` for brand wordmarks, hero headlines, footer brand, overlay nav links.

Body text: Poppins. Letter-spacing is prominent in this brand — `tracking-[0.1em]` for most labels, `tracking-[0.3em]` for uppercase CTA buttons.

### Spacing / Layout

- Page horizontal padding: `px-[90px]` desktop, `px-[18px]` mobile (≤820px)
- Footer padding: `px-[90px] py-[37px]` desktop, `px-[24px] py-[30px]` mobile
- Overlay panel padding: `p-[48px_40px_40px]` desktop, `p-[36px_24px_28px]` mobile

---

## Responsive Breakpoints

Use standard Tailwind v4 default breakpoints:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

**Guidance:**
- Design mobile-first by default.
- Use `md:` or `lg:` for primary tablet/desktop layout shifts.
- Do not use arbitrary values like `min-[821px]:` or `max-[820px]:` in new code.
- Existing code using `max-[820px]:` / `min-[821px]:` is legacy — leave as-is unless refactoring that component.

---

## CSS Strategy

**Default: Tailwind utilities for everything.**

CSS Modules (`*.module.css`) only when you need a **CSS custom property set from JavaScript at runtime** — e.g., badge positions driven by Sanity data:

```tsx
style={{ '--xm': `${xM}%`, '--ym': `${yM}%` } as React.CSSProperties}
```

```css
/* in .module.css */
left: var(--xm); top: var(--ym);
```

That's the only legitimate use case. Complex `calc()`, arbitrary values, pixel-precise geometry — all fine in Tailwind with `[value]` syntax. Don't create a CSS Module to avoid writing a long Tailwind class.

---

## Component Architecture (3-Tier Atomic)

Full reference: `src/ui/COMPONENT_DESIGN.md`

### Tier 1 — Atoms (`src/ui/atoms/`)
No Sanity data. Props only. Always sync.

| File | What it is |
|------|-----------|
| `badge.tsx` | Yellow nav badge link |
| `pill.tsx` | Floating action pill (Book Direct / WhatsApp) |
| `nav-cta.tsx` | CTA button — `variant: 'dark'|'light'`, `compact?: boolean` |
| `icon.tsx` | SVG passthrough wrapper |

### Tier 2 — Molecules (`src/ui/molecules/`)
Composed atoms. No Sanity fetches. `'use client'` only when interactive.

| File | What it is |
|------|-----------|
| `hero-decor-image.tsx` | Decorative image slot — `null` if no asset, never SVG |
| `footer-col.tsx` | Footer nav column: `heading` + `links: {label, url}[]` |
| `social-links.tsx` | Social icon row — `instagram?`, `facebook?`, `linkedin?`, `youtube?`, `size?` |
| `menu-toggle.tsx` | Hamburger button — client component |

### Tier 3 — Organisms (`src/ui/header/`, `src/ui/footer/`, `src/ui/home-hero.tsx`, `src/ui/menu-overlay.tsx`)
Fetch Sanity data. Pass down to molecules/atoms.

When creating a new organism, always call `getSite()` from `@/sanity/lib/data` — never from molecules or atoms.

---

## Sanity Data Wiring

### `getSite()` returns `SITE_QUERY_RESULT` — key fields:

**Navbar group:**
- `navCtaLabel`, `navCtaLink` — header + overlay CTA button
- `whatsappNumber` — WhatsApp pill href (`https://wa.me/${number.replace(/\D/g,'')}`)
- `bookDirectLink` — Book Direct pill href
- `overlayNavLinks[]` — `{label, url}` — overlay nav items
- `menuPhoto` — overlay left panel image
- `contactEmail`, `contactPhone` — overlay contact panel

**Footer group:**
- `footerBrandName` — italic brand text (fallback: `site.title ?? 'AltHomes'`)
- `footerAboutLinks[]` — `{label, url}` — About column
- `footerPolicyLinks[]` — `{label, url}` — Policies column

**Socials group:**
- `instagramUrl`, `facebookUrl`, `linkedinUrl`, `youtubeUrl`

**Assets group (decorative images for hero):**
- `heroBgCircle`, `heroFgCircle`, `heroDecorStars`, `heroDecorFlowers`, `heroDecorStripes`
- All are Sanity image fields. Pass directly to `<HeroDecorImage asset={site?.field} />`

**Branding group:**
- `logoImage`, `logoText` — used in `src/ui/logo.tsx`

### GROQ queries live in `src/sanity/lib/queries.ts`
Always use `defineQuery()` — never raw `groq` tag (silently breaks TypeGen).
After any query change: run `npm run typegen`.

### `sanityFetch` from `src/sanity/lib/live.ts`
Use for page data in server components. `getSite()` uses it internally.
**Never** add `<SanityLive />` outside `src/app/(site)/layout.tsx`.

---

## Page Data Pattern

```tsx
// Server component (organism / page)
import { getSite } from '@/sanity/lib/data'

export default async function MyOrganism() {
  const site = await getSite()
  return <SomeMolecule label={site?.navCtaLabel ?? 'STAY WITH US'} />
}
```

For page-specific data, fetch in `src/app/(site)/[page]/page.tsx` and pass as props to the organism.

---

## Existing Organisms — Key Details

### `src/ui/header/index.tsx`
- Fixed position (`fixed top-0 left-0 right-0 z-10`)
- Desktop: logo left, CTA + hamburger right. Mobile: hamburger left, mobile CTA right, logo hidden.
- Hamburger triggers `MenuState` client component → opens `MenuOverlay`
- Logo hidden on mobile (`max-[820px]:hidden`)

### `src/ui/footer/index.tsx`
- Background: `#2F5D50` (primary green), text: `#FCF6EA` (cream)
- Four columns: OUR HOMES (dynamic from properties), ABOUT, POLICIES, CONNECT (socials)
- Brand text: Playfair Display italic, 49px

### `src/ui/home-hero.tsx`
- Full-viewport hero section, 1290px tall desktop / 870px mobile
- Large background circle + foreground circle clipping the hero photo
- Decorative images (stars, flowers, stripes) via `HeroDecorImage` — render `null` when no Sanity asset
- Badge nav buttons (yellow, absolute-positioned) from `page.navLabels[]`
- Floating action pills (Book Direct + WhatsApp) bottom-right

### `src/ui/menu-overlay.tsx`
- Client component (`'use client'`)
- Full-screen overlay: left = photo panel (hidden mobile), right = green panel
- Right panel: CTA top, nav links (Playfair Display italic 30px), socials + contact bottom
- Escape key closes, body scroll locked when open

---

## Module System

Reusable page sections live in `src/ui/modules/`. Dispatcher: `src/ui/modules/index.tsx` (MODULES_MAP).

When building a new page module:
1. Create `src/ui/modules/my-module.tsx`
2. Add schema in `src/sanity/schemaTypes/modules/`
3. Register in `MODULES_MAP` in `src/ui/modules/index.tsx`
4. Add to `SchemaPluginOptions` in `src/sanity/schemaTypes/index.ts`
5. Run `npm run typegen`

---

## Forms

- Contact form: `src/ui/forms/contact-form.tsx` → Resend API
- Partner form: `src/ui/forms/partner-form.tsx` → Resend API
- **No Sanity writes** — ever.

---

## Path Aliases

```
@/*  → src/*        e.g. @/ui/atoms/badge
@@/* → ./           project root
```

---

## Verification Checklist (run before every commit)

```bash
npm run typecheck   # must exit 0
npm run typegen     # run if any GROQ query or schema changed
```

No test suite. TypeScript is the quality gate.

---

## Organism Config Reference

Exact data each organism consumes. Use as the config input when invoking the Page Config Contract workflow.

---

### `src/ui/header/index.tsx`

```ts
{
  // from getSite()
  navCtaLabel: string       // CTA button text — fallback 'STAY WITH US'
  navCtaLink: string        // CTA button href — button hidden if absent
  logoImage: SanityImage    // passed to <Logo />
  logoText: string          // passed to <Logo />
}
```

---

### `src/ui/home-hero.tsx`

Receives `{ page, site }` as props. `page` = `homePage` document, `site` = `getSite()`.

```ts
{
  // from page (homePage document)
  page: {
    heroImage: { asset: SanityImageAsset, alt: string }  // foreground circle photo
    heroHeadline: string        // <h1> text — fallback 'Travel Beyond, Discover Within'
    navLabels: Array<{
      _key: string
      label: string             // badge button text
      link: string              // badge button href
      xDesktop: number          // % position desktop
      yDesktop: number
      xMobile: number           // % position mobile
      yMobile: number
    }>
  }

  // from site (getSite())
  site: {
    heroBgCircle: SanityImage   // background circle decor
    heroDecorStars: SanityImage
    heroDecorFlowers: SanityImage
    heroDecorStripes: SanityImage
    bookDirectLink: string      // Book Direct pill href
    whatsappNumber: string      // used to build wa.me href
  }
}
```

---

### `src/ui/menu-overlay.tsx`

Receives `{ isOpen, onCloseAction, site }` as props. `site` = `getSite()` passed from parent.

```ts
{
  isOpen: boolean
  onCloseAction: () => void

  site: {
    menuPhoto: { asset: SanityImageAsset, alt: string }  // left photo panel — hidden mobile
    navCtaLabel: string         // CTA button label — fallback 'STAY WITH US'
    navCtaLink: string          // CTA button href — button hidden if absent
    overlayNavLinks: Array<{
      label: string
      url: string
    }>
    instagramUrl: string
    facebookUrl: string
    linkedinUrl: string
    youtubeUrl: string
    contactPhone: string
    contactEmail: string
  }
}
```

---

### `src/ui/footer/index.tsx`

```ts
{
  // from getSite()
  site: {
    footerBrandName: string     // italic brand text — fallback site.title ?? 'AltHomes'
    footerAboutLinks: Array<{ label: string, url: string }>    // ABOUT column
    footerPolicyLinks: Array<{ label: string, url: string }>   // POLICIES column
    instagramUrl: string
    facebookUrl: string
    linkedinUrl: string
    youtubeUrl: string
  }

  // from getAllProperties()
  properties: Array<{
    _id: string                 // React key
    slug: string                // href: /our-homes/${slug}
    title: string               // uppercased link label
  }>
}
```

---

## Adding a New UI Component

1. Pick tier: no data → atom/molecule, fetches data → organism
2. Create file in correct directory
3. Default export, PascalCase name matching filename
4. Tailwind-first. CSS Module only if you need runtime CSS custom props.
5. All images via `next/image` with `sizes` prop
6. Decorative image slots → `HeroDecorImage`, never inline SVG
7. Add to table in `src/ui/COMPONENT_DESIGN.md`
8. `npm run typecheck`

---

## Page Config Contract

When building a page, you will be provided a **config structure** — an object or list describing the expected sections, fields, and slots for that page.

### Workflow

1. Receive config before writing any code.
2. Build the page using the config as the source of truth.
3. After implementation, produce a **Config → UI Map** at the end of your response.

### Config → UI Map Format

List every config key and its mapped component/prop. Flag mismatches explicitly.

```
Config key              → UI location
────────────────────────────────────────────────────
heroHeadline            → HomeHero → <h1> text
heroSubtext             → HomeHero → <p> subtitle
navCtaLabel             → Header → NavCta label prop
...

MISSING IN CONFIG (present in UI):
  - HomeHero: decorBadges[]   ← rendered from page.navLabels[], no config key provided

MISSING IN UI (present in config):
  - promoBanner.text          ← config key exists, no component renders it
```

### Rules

- Every config key must map to exactly one component + prop. No orphaned config.
- Every rendered slot that consumes Sanity data must trace back to a config key.
- If a UI slot renders with a hardcoded fallback (e.g. `?? 'STAY WITH US'`), note it as `[fallback only — no config key]`.
- If config is partially provided (some keys missing), flag all gaps before building — do not invent data.
