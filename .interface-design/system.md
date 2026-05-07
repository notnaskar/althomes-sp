# Althomes Design System
Extracted from src/ui — althomes-sp (Next.js + Tailwind 4 + Sanity)

---

## Color Tokens
All tokens live in `src/app.css` under `@theme`. Use Tailwind utilities, not hex.

| Token | Hex | Usage |
|---|---|---|
| `background` | `#FCF6EA` | Page background, light button bg |
| `foreground` | `#3A3A3A` | Body text, icons, borders |
| `primary` | `#2F5D50` | Primary CTA bg, accent text |
| `primary-foreground` | `#FCF6EA` | Text on primary bg |
| `accent` | `#F2C94C` | Badges, accent buttons |
| `accent-foreground` | `#3A3A3A` | Text on accent bg |
| `stroke` | `#E5E5E5` | Dividers, input borders |
| `muted` | `#D0D0D0` | Placeholder backgrounds, skeletons |

**Rules:**
- Never `text-black` or `text-white` for body — use `text-foreground`
- `text-white` only on guaranteed-dark photo overlays (gradient-to-t from black)
- Hardcoded hex only in atoms (NavCta, Pill) where inline style is intentional

---

## Typography

**Fonts:**
- Heading: `font-heading` → Playfair Display (serif), italic for pull quotes
- Body: `font-sans` → Poppins
- Mono: `font-mono` → JetBrains Mono (technical labels only)

**Scale utilities** (defined in `app.css`):
```
h0  → font-bold text-4xl
h1  → font-bold text-3xl
h2  → font-bold text-2xl
h3  → font-bold text-xl
h4  → font-bold text-lg
h5/h6 → font-bold text-base
technical → font-mono font-bold tracking-widest uppercase
```

**Tracking conventions:**
- Large headings / hero titles: `tracking-[0.07em]`
- Body paragraphs, meta text: `tracking-[0.1em]`
- Buttons, labels, badges: `tracking-[0.3em] uppercase`

**Weights:** `font-bold` dominant (24x), `font-semibold` secondary (10x)

---

## Spacing

Base unit: Tailwind default (4px = 1 unit)

**Most-used gaps:**
```
gap-1   (4px)   — tight icon/label pairs
gap-2   (8px)   — inline element groups
gap-4   (16px)  — card internals
gap-6   (24px)  — section sub-blocks
gap-8   (32px)  — section-level gaps
```

**Section padding** (via `.section` utility):
```css
@apply mx-auto max-w-7xl px-4 py-12 md:px-8;
```

**Component-level custom values** (used in pages, not atoms):
- Property showcase right panel: `pt-[44px] pb-[44px] pl-[90px]`
- Property overlay: `pb-[40px] px-[140px]`
- These are layout-specific, not system tokens

---

## Border Radius

| Class | Value | Usage |
|---|---|---|
| `rounded-[5px]` | 5px | Buttons, badges, cards, image corners |
| `rounded-[10px_5px_5px_10px]` | asymmetric | Full-bleed photo panels (left-heavy) |
| `rounded-[5px_10px_10px_5px]` | asymmetric | Secondary image panels (right-heavy) |
| `rounded-full` | 50% | Icon circles, pill avatar slots |
| `rounded-lg` | 8px | Dropdown menus, modals |
| `rounded` | 4px | Utility fallback |

**Rule:** Prefer `rounded-[5px]` for interactive elements. Asymmetric radii for editorial image panels only.

---

## Depth Strategy

Primary: **borders** (`border-stroke`, `border-foreground/10`)
Secondary: **shadows** (hover states and booking bar only)

Shadow scale:
```
Resting:  box-shadow: 0 1px 4px rgba(0,0,0,0.05)   — pills at rest
Elevated: box-shadow: 0 4px 10px rgba(0,0,0,0.08)  — pills on hover
```

Tailwind shadow utilities (`shadow-md`, `shadow-lg`) appear 5x total — avoid adding more, use the explicit values above for consistency.

---

## Button Patterns

### Primary CTA (`NavCta` atom — `variant="dark"`)
```tsx
<a
  className="inline-flex items-center justify-center rounded-[5px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90"
  style={{ background: '#2F5D50', color: '#FCF6EA', height: 48, padding: '0 24px', minWidth: 192, fontSize: 14 }}
/>
```

### Compact CTA (`NavCta` — `compact`)
Same styles, `height: 30, padding: '0 12px', minWidth: 70`

### Accent CTA (inline, used in PropertyShowcase)
```tsx
className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold text-[12px] tracking-[0.3em] uppercase rounded-[5px] w-[144px] h-[33px]"
```

### Outline (via `action-outline` utility)
```tsx
className="action-outline"
// → action-base bg-background border-stroke text-foreground border hover:border-current
```

### Ghost (via `ghost` utility)
```tsx
className="ghost"
// → action-base bg-background text-foreground hover:bg-foreground/5
```

---

## Card Patterns

### Experience Card
- Outer shell: `rounded-[5px] p-[16px] pb-[20px]` on `rgb(227,213,193)` beige
- Image: `rounded-[5px] aspect-[327/340]` with `group-hover:scale-105`
- Tilt effect: `rotate-[1.5deg]` / `-rotate-[1.5deg]` alternating, `hover:rotate-0 hover:scale-[1.02]`
- No border, depth via tilt + scale

### Property Showcase
- Two-column grid: `grid-cols-[768fr_625fr] min-h-[912px]`
- Left: full-bleed photo with gradient overlay
- Right: content panel, no border
- Asymmetric radii on both panels
- Responsive: stacks at `max-[820px]`

### Badge
```tsx
className="rounded-[5px] bg-accent px-[14px] h-[26px] font-bold text-[13px] tracking-[0.3em] text-accent-foreground hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
```

### Pill (home hero CTAs)
```tsx
className="flex items-center w-[142px] h-[32px] bg-white rounded-[20px] text-[9px] tracking-[0.1em] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
```

---

## Layout Utilities

```css
.section   → mx-auto max-w-7xl px-4 py-12 md:px-8
.prose     → space-y-4 leading-relaxed (+ heading/list/link resets)
.full-bleed → width: 100vw; margin-inline: calc(50% - 50vw)
.carousel  → grid auto-flow column, scroll-snap-x, 80vw max per item
```

---

## Interaction Patterns

- Buttons: `hover:opacity-90` (primary), `hover:border-current` (outline)
- Cards: `hover:scale-[1.02] hover:rotate-0` (experience), `hover:-translate-y-px` (badges/pills)
- Links: `hover:decoration-2` (prose links)
- Images in cards: `group-hover:scale-105 transition-transform duration-500`
- Transitions: `transition-opacity`, `transition-transform duration-300`

---

## Do / Don't

| Do | Don't |
|---|---|
| `text-foreground` | `text-black` |
| `bg-accent text-accent-foreground` | `bg-yellow-400 text-black` |
| `text-white` on dark photo overlays | `text-white` on light backgrounds |
| `rounded-[5px]` for interactive | `rounded-md` / `rounded-sm` ad-hoc |
| Theme tokens via Tailwind utilities | Inline hex except in atoms |
| `tracking-[0.3em] uppercase` on labels | Mixed case button labels |
