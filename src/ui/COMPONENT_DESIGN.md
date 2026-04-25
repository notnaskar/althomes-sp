# AltHomes Component Design System

Authoritative reference for agents, skills, and engineers adding or modifying UI components.

## Atomic Design Tiers

### Tier 1 — Atoms (`src/ui/atoms/`)

Single-purpose, stateless, no Sanity data dependencies. Receive all data via props.

| File | Purpose |
|------|---------|
| `badge.tsx` | Yellow nav badge link (homepage hero overlay) |
| `pill.tsx` | Floating action pill (Book Direct / WhatsApp) |
| `nav-cta.tsx` | "STAY WITH US" CTA button — supports `dark`/`light` variant and `compact` flag |
| `icon.tsx` | SVG icon passthrough wrapper |

**Rules for atoms:**
- No `getSite()` or any Sanity fetch
- Always sync — never async default export
- Props define the full data contract

### Tier 2 — Molecules (`src/ui/molecules/`)

Composed from atoms or small primitives. Simple local state permitted. No Sanity fetches.

| File | Purpose |
|------|---------|
| `hero-decor-image.tsx` | Sanity image slot — renders `null` if asset missing, never SVG |
| `footer-col.tsx` | One footer nav column: heading + list of `{label, url}` links |
| `social-links.tsx` | Row of social icon links (Instagram, Facebook, LinkedIn, YouTube) |
| `menu-toggle.tsx` | Hamburger open button — client component |

**Rules for molecules:**
- Data flows down from parent organism — no Sanity fetches
- `'use client'` only when interaction is required

### Tier 3 — Organisms

Full sections. Fetch Sanity data via `getSite()` or page queries. Pass data down to molecules/atoms.

| Path | Sanity fields consumed |
|------|----------------------|
| `src/ui/header/index.tsx` | `navCtaLabel`, `navCtaLink`, `whatsappNumber`, `bookDirectLink` |
| `src/ui/footer/index.tsx` | `footerBrandName`, `footerAboutLinks`, `footerPolicyLinks`, `instagramUrl`, `facebookUrl`, `linkedinUrl`, `youtubeUrl` |
| `src/ui/home-hero.tsx` | `heroBgCircle`, `heroDecorStars`, `heroDecorFlowers`, `heroDecorStripes` (all from `site`) |
| `src/ui/menu-overlay.tsx` | `overlayNavLinks`, `menuPhoto`, `contactEmail`, `contactPhone`, `navCtaLabel`, `navCtaLink`, `instagramUrl`, `facebookUrl`, `linkedinUrl`, `youtubeUrl` |

## Naming Convention

- Files: `kebab-case.tsx`
- Exports: single `default` PascalCase function matching the filename
- CSS Modules: `kebab-case.module.css` co-located with the component

## No-SVG Rule

**Never draw SVG as a content placeholder for a missing asset.**

`HeroDecorImage` enforces this:
- `asset?.asset` present → `<Image>` via `urlFor()`
- `asset?.asset` null/undefined → `null` (renders nothing)

Apply `HeroDecorImage` to every decorative image slot. Do not write inline SVG functions as fallbacks.

## Image Rules

- Always `next/image` (`<Image>`) — never raw `<img>`
- Always provide `sizes` prop on `<Image fill>` components
- Decorative: `alt=""`, no `priority`. LCP images: `priority` only.

## CSS Strategy

- **CSS Modules** (`*.module.css`): layout, positioning, pixel-precise geometry, complex animations
- **Tailwind v4 utilities**: spacing, color, typography, flex/grid, hover states
- Do not use both for the same property on the same element

## Data Flow

```
Sanity CMS → getSite() → Organism → molecules (props) → atoms (props)
```

Only organisms call `getSite()` or `sanityFetch`. Molecules and atoms are purely presentational.

## Adding a New Component

1. Decide tier: renders with props only? → atom or molecule. Fetches data? → organism.
2. Create file in correct tier directory.
3. Export single default PascalCase function.
4. Add a row to the table in this document.
5. Run `npm run typecheck` before committing.
