# Atomic Component System + Sanity CMS Wiring — Design Spec
Date: 2026-04-26

## Problem

1. Decorative image assets missing → SVG fallbacks drawn inline (unacceptable)
2. No atomic design structure — `src/ui/` is flat, no reuse hierarchy
3. Footer and navbar content hardcoded — not CMS-driven
4. No `COMPONENT_DESIGN.md` for agents/skills to reference
5. Sanity `site` schema missing: overlay nav links, footer link columns, decorative asset fields, menu photo

## Solution: Parallel sub-agent execution (Approach B)

Schema Agent runs in isolation → commits typegen output → Frontend Agent unblocks and wires everything.

---

## Schema Agent Scope

File: `src/sanity/schemaTypes/documents/site.ts`

### New group: `navbar`
Move existing `navCtaLabel`, `navCtaLink` from `navigation` group into `navbar`. Add:
- `overlayNavLinks` — `array` of objects `{label: string, url: string}` — menu overlay nav items
- `menuPhoto` — `image` — left-panel photo in menu overlay
- `contactEmail` — `string` — displayed in overlay contact panel
- `contactPhone` — `string` — displayed in overlay contact panel

### New group: `footer`
- `footerBrandName` — `string` — display name in footer (italic brand text)
- `footerAboutLinks` — `array` of `{label: string, url: string}` — "ABOUT" column
- `footerPolicyLinks` — `array` of `{label: string, url: string}` — "POLICIES" column

### New group: `assets`
Decorative images referenced by the homepage hero. All fields are `image` type with `alt` sub-field:
- `heroDecorStars` — stars cluster (top-left of hero)
- `heroDecorFlowers` — flowers cluster (bottom-left of hero)
- `heroDecorStripes` — diagonal stripes (bottom-right of hero)
- `heroBgCircle` — large decorative background circle
- `heroFgCircle` — foreground circle (crops the hero photo)

### After schema edits
1. Run `npm run typegen` — regenerates `src/sanity/types.ts`
2. Run `npm run typecheck` — must pass clean
3. Commit: `feat(schema): add navbar/footer/assets groups to site`
4. Report completion to orchestrator

---

## Frontend Agent Scope

### Rule: No SVG fallbacks
`hero-decor-image.tsx` molecule wraps every decorative slot:
- If Sanity URL present → render `<Image>` (next/image, always)
- If missing → render `null` (empty, no SVG, no broken img)
- Never draw inline SVG as content placeholder

### src/ui/ restructure — 3-tier atomic

```
src/ui/
  atoms/
    badge.tsx           # Yellow nav badge link (homepage hero overlay)
    pill.tsx            # Floating action pill (Book Direct / WhatsApp)
    logo.tsx            # Moved from src/ui/logo.tsx
    nav-cta.tsx         # "STAY WITH US" CTA button
    icon.tsx            # SVG icon passthrough wrapper
  molecules/
    menu-toggle.tsx     # Hamburger open/close button
    social-links.tsx    # Row of social icon links (Instagram/Facebook etc.)
    footer-col.tsx      # One footer column: heading + list of links
    hero-decor-image.tsx # Sanity image slot, renders null if no asset
  organisms/
    header/             # Refactored from existing src/ui/header/
    footer/             # Refactored from existing src/ui/footer/
    home-hero/          # Refactored from src/ui/home-hero.tsx
    menu-overlay/       # Refactored from src/ui/menu-overlay.tsx
  COMPONENT_DESIGN.md   # Atomic design doc (see below)
```

Existing files outside this hierarchy (modules/, forms/, pages/, etc.) are **not moved** — out of scope for this task.

### Organism: header/
- Wire `site.overlayNavLinks` → MenuOverlay nav items
- Wire `site.menuPhoto` → MenuOverlay left panel image
- Wire `site.navCtaLabel` / `site.navCtaLink` → NavCta atom
- MenuState client component stays isolated

### Organism: footer/
- Wire `site.footerBrandName` → brand display text (fallback: `site.logoText ?? site.title`)
- Wire `site.footerAboutLinks` → FooterCol molecule
- Wire `site.footerPolicyLinks` → FooterCol molecule
- Dynamic property column stays (from `getAllProperties()`)
- Social links wire to `site.instagramUrl`, `site.facebookUrl`, etc. via SocialLinks molecule

### Organism: home-hero/
- Remove `FlowersDecor`, `StarsDecor`, `StripesDecor` inline SVG functions
- Replace each with `<HeroDecorImage field={page.heroDecorStars} ... />`
- Wire `site.heroBgCircle`, `site.heroFgCircle` as `<Image>` from Sanity
- Badge atoms remain, driven by `page.navLabels[]`

### Organism: menu-overlay/
- Wire `site.overlayNavLinks[]` → nav list (replaces any hardcoded links)
- Wire `site.menuPhoto` → left panel `<Image>`
- Wire `site.navCtaLabel` / `site.navCtaLink` → overlay CTA

### COMPONENT_DESIGN.md content
Covers:
1. Atomic tier definitions (atoms / molecules / organisms) with examples
2. Naming convention: kebab-case files, PascalCase exports
3. Sanity data contract per organism (which fields each organism consumes)
4. No-SVG rule (see above)
5. `next/image` always — never raw `<img>`
6. CSS Modules for layout/positioning, Tailwind for utilities
7. No `getSite()` calls inside atoms or molecules — data flows down from organism
8. How agents/skills should add new components (which tier, contract format)

### After component work
1. Run `npm run typecheck` — must pass clean
2. Run `npm run lint` — must pass
3. Commit: `feat(ui): atomic component restructure + Sanity CMS wiring`

---

## Execution Order

1. Schema Agent starts → edits `site.ts`, runs typegen, commits
2. Frontend Agent starts after schema commit → reads `sanity/types.ts`, refactors components
3. Both commits land on `staging` branch
4. Orchestrator verifies typecheck passes on final state

---

## Out of Scope

- Modules (`src/ui/modules/`) — not restructured this task
- Forms (`src/ui/forms/`) — not restructured
- Other page organisms (our-homes, experiences, etc.)
- Actual asset uploads to Sanity — placeholder wiring only; content team uploads images
- Any new page routes

---

## Success Criteria

- `npm run typecheck` passes clean after both commits
- No inline SVG functions in `home-hero/`
- Footer columns (About, Policies) driven by Sanity — zero hardcoded link arrays
- Menu overlay nav driven by `site.overlayNavLinks`
- `src/ui/COMPONENT_DESIGN.md` exists and covers all 8 documented areas
- All decorative image slots render `null` (not SVG) when Sanity field is empty
