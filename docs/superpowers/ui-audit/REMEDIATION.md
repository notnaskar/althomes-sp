# UI Remediation Plan

> **Review gate:** Mark each group ✅ APPROVED / ❌ REJECTED / ✏️ MODIFIED (add notes inline).
> Execution only proceeds on approved groups.

---

## Group 1: Token Violations

**Cross-cutting decisions stated once here — executors apply everywhere listed below.**

**Decision A — Hardcoded hex → Tailwind token (all inline `style` color overrides):**
Replace every `style={{ color: '#FCF6EA' }}`, `style={{ background: '#2F5D50' }}`, `style={{ background: '#FCF6EA' }}`, `style={{ color: '#3A3A3A' }}` with the corresponding Tailwind class. Inline style bypasses Tailwind's design-token system and makes theming impossible.

**Decision B — `bg-white` / `bg-gray-*` / `bg-black` → token:**
`bg-white` → `bg-background` (cream `#FCF6EA`). `bg-gray-900` / `bg-black` → `bg-primary` (green `#2F5D50`). `bg-gray-50` → `bg-background`. Tokens: `bg-background`, `bg-primary`.

**Decision C — `text-black` / `text-white` / `text-gray-*` → token:**
On dark (`bg-primary`) backgrounds: `text-white` → `text-primary-foreground`. On light backgrounds: `text-black` → `text-foreground`. `text-gray-700` / `text-gray-600` → `text-foreground`. `text-gray-500` / `text-gray-400` → `text-muted`. Tokens: `text-foreground`, `text-primary-foreground`, `text-muted`.

**Decision D — `font-['Playfair_Display']` → `font-heading`:**
Every direct `font-['Playfair_Display']` class must become `font-heading`. The `font-heading` token resolves to Playfair Display. Token: `font-heading`.

**Decision E — All form submit CTAs (cross-file):**
Replace `bg-black text-white rounded-full hover:bg-gray-800` with `bg-accent text-accent-foreground tracking-[0.3em] uppercase rounded-[5px] hover:bg-accent/90`.
Affects: `contact-form.tsx:141`, `availability-form.tsx:88`, `the-alt-way/page.tsx:115`, `the-alt-way/page.tsx:207`, `our-homes/[slug]/page.tsx:475`.
Tokens: `bg-accent`, `text-accent-foreground`, `rounded-[5px]`.

**Decision F — Property card + CTA buttons:**
`bg-black text-white hover:bg-yellow-600 rounded-full` → `bg-accent text-accent-foreground hover:bg-accent/90 rounded-[5px]`. Affects `property-search.tsx:71`.

**Decision G — Star ratings:**
`text-yellow-400` → `text-accent`. Affects: `our-homes/[slug]/page.tsx:444`, `the-alt-way/page.tsx:171`.

**Decision H — `text-yellow-600` hover → token:**
`hover:text-yellow-600`, `group-hover:text-yellow-600` → `hover:text-accent`, `group-hover:text-accent`. Affects: `contact/page.tsx:55`, `blog/page.tsx:32`.

---

### 1.1 Atoms

- **`src/ui/atoms/badge.tsx:16`** — `bg-[#F2C94C]` → `bg-accent`; `text-[#3A3A3A]` → `text-accent-foreground` (token: `bg-accent`, `text-accent-foreground`) [HIGH]

- **`src/ui/atoms/nav-cta.tsx:14-15`** — Remove all inline `style` hex colors. Replace with `bg-primary text-primary-foreground` (dark variant) and `bg-background text-foreground` (light variant). (token: `bg-primary`, `text-primary-foreground`) [HIGH]

- **`src/ui/atoms/nav-cta.tsx:22-26`** — Replace inline `style` dimension values (`height`, `padding`, `minWidth`, `fontSize`) with Tailwind utilities: `h-12 px-6 min-w-[192px] text-[14px]`. (guideline: CSS-first, no inline style for layout values) [MEDIUM]

- **`src/ui/atoms/pill.tsx:11`** — `bg-white` → `bg-background`; `text-[#3A3A3A]` → `text-foreground`. (token: `bg-background`, `text-foreground`) [HIGH]

---

### 1.2 Header & Menu

- **`src/ui/header/index.tsx:18-29`** — Desktop CTA: remove inline `style` hex values; use `NavCta` atom (already exists for this exact purpose). (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/header/index.tsx:32-45`** — Mobile mini CTA: remove inline `style` hex values; use `NavCta compact` prop. (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/footer/index.tsx:9`** — `style={{ background: '#2F5D50', color: '#FCF6EA' }}` → `bg-primary text-primary-foreground`. (Decision A) [HIGH]

- **`src/ui/footer/index.tsx:15`** — `font-['Playfair_Display']` → `font-heading`; `text-white` → `text-primary-foreground`. (Decision D, Decision C) [HIGH]

- **`src/ui/footer/index.tsx:27-29`** — Column `<h4>` heading: move `fontSize` and `letterSpacing` from inline `style` to Tailwind utilities: `text-[12px] tracking-[0.1em]`. (guideline: CSS-first) [LOW]

- **`src/ui/footer/index.tsx:33-44`** — Property link `color: '#FCF6EA'` inline style → remove entirely; `color: inherit` suffices since the footer root already sets `text-primary-foreground`. (Decision A) [LOW]

- **`src/ui/menu-overlay.tsx:37`** — `style={{ background: '#FCF6EA' }}` → `bg-background`. (Decision A) [HIGH]

- **`src/ui/menu-overlay.tsx:55-59`** — `style={{ background: '#2F5D50', color: '#FCF6EA' }}` → `bg-primary text-primary-foreground`. Aside padding: `style={{ padding: '48px 40px 40px' }}` → `pt-[48px] px-[40px] pb-[40px]`. (Decision A; guideline: CSS-first) [HIGH]

- **`src/ui/menu-overlay.tsx:104`** — `font-['Playfair_Display']` → `font-heading`; `text-[#FCF6EA]` → `text-primary-foreground`. (Decision D, Decision C) [HIGH]

- **`src/ui/molecules/footer-col.tsx:21-26`** — `color: '#FCF6EA'` inline style on link → remove; inherit from footer root. `fontSize`, `letterSpacing`, `lineHeight` inline style → `text-[11px] tracking-[0.1em] leading-[1.4]`. (Decision A; guideline: CSS-first) [MEDIUM/LOW]

---

### 1.3 Home Hero CSS Module

- **`src/ui/home-hero.module.css:77`** — `.headlineH1 color: #000` → `color: var(--color-foreground)`. (token: `--color-foreground` = `#3A3A3A`) [HIGH]

- **`src/ui/home-hero.module.css:81`** — Remove `font-family: var(--font-playfair-display...)` from CSS module; apply `font-heading italic` as a Tailwind class on the JSX `<h1>` element instead. (Decision D; guideline: CSS modules only for JS-driven custom properties) [MEDIUM]

- **`src/ui/home-hero.module.css:98`** — `.badge background: #F2C94C` → `var(--color-accent)`; `color: #3A3A3A` → `var(--color-accent-foreground)`. (token: `--color-accent`, `--color-accent-foreground`) [HIGH]

- **`src/ui/home-hero.module.css:138`** — `.pill background: #fff` → `var(--color-background)`; `color: #3A3A3A` → `var(--color-foreground)`. (token: `--color-background`, `--color-foreground`) [HIGH]

- **`src/ui/home-hero.module.css:175-180`** — `.pillIconBook color: #3A3A3A` → `var(--color-foreground)`. `.pillIconWa color: #fff` is acceptable (on WhatsApp green, no token exists — per guidelines WhatsApp green uses inline style only). [LOW]

---

### 1.4 Property Detail Page

- **`src/app/(site)/our-homes/[slug]/page.tsx:78`** — Booking bar `bg-white` → `bg-background`. (Decision B) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:83`** — Divider `bg-[#5F5D5D]` → `bg-muted`. (token: `text-muted` = `#D0D0D0`, closest neutral token) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:91`** — "TAXES INCLUDED" `text-black` → `text-foreground`. (Decision C) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:95`** — Price display `text-black` → `text-foreground`. (Decision C) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:404`** — Causes section `bg-gray-900` → `bg-primary`; `text-white` → `text-primary-foreground`. (Decision B, Decision C) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:412`** — Remove `prose prose-invert` — Tailwind Typography overrides the design system type scale. Replace with explicit token classes for each text element. (guideline: design system type scale takes precedence) [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:436-437`** — Reviews section: remove `container` utility (not a design system primitive); replace with `px-[90px] max-[820px]:px-[18px]`. Heading `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (guideline: page padding token; typography token) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:444`** — Star `text-yellow-400` → `text-accent`. (Decision G) [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:451`** — Review body `text-gray-700` → `text-foreground`. (Decision C) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:455`** — Review meta `text-gray-500` → `text-muted`. (Decision C) [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:469`** — Bottom CTA `bg-black` → `bg-primary`. (Decision B) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:471`** — CTA heading `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em] text-primary-foreground`. (Decision D, Decision C; guideline: typography scale) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:475-480`** — "FIND AVAILABILITY" button: apply Decision E. [HIGH]

---

### 1.5 Our Homes Shell

- **`src/ui/pages/our-homes/our-homes-hero.tsx:49`** — Divider `bg-[#5F5D5D]` → `bg-muted`. (token: `text-muted`) [HIGH]

- **`src/ui/pages/our-homes/property-search.tsx:58`** — Short description `text-gray-600` → `text-foreground`. (Decision C) [MEDIUM]

- **`src/ui/pages/our-homes/property-search.tsx:34`** — Empty state `text-gray-500` → `text-muted`. (Decision C) [MEDIUM]

- **`src/ui/pages/our-homes/property-search.tsx:71`** — Property card CTA button: apply Decision F. [HIGH]

---

### 1.6 Experiences Page

- **`src/ui/pages/experiences/experience-grid.tsx:38-55`** — (dead file — see Group 7; fixes here are moot, file is flagged for deletion) [N/A]

- **`src/ui/pages/experiences/experience-grid.tsx:68`** — (dead file) Empty state `text-gray-500` → `text-muted`. Moot. [N/A]

- **`src/ui/pages/experiences/experience-grid.tsx:96`** — (dead file) Card description `text-gray-600` → moot. [N/A]

- **`src/ui/pages/experiences/experiences-updated/experience-card.tsx:48-49`** — `style={{ backgroundColor: 'rgb(227,213,193)' }}` → the beige card shell must be mapped to a CSS custom property: add `--color-card-shell: #E3D5C1` to `app.css` and use `bg-[var(--color-card-shell)]`. (guideline: all colours must have a token name) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experience-card.tsx:55-57`** — Image placeholder `style={{ backgroundColor: 'rgb(217,217,217)' }}` → `bg-muted`. (token: `text-muted` = `#D0D0D0`) [MEDIUM]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:58`** — `font-['Playfair_Display']` on `<h1>` → `font-heading`. (Decision D) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:67`** — `font-['Playfair_Display']` on tagline → `font-heading`. (Decision D) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:74`** — `font-['Playfair_Display']` on leading tagline → `font-heading`. (Decision D) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:90-92`** — Decorative circle `style={{ backgroundColor: 'rgb(203,69,43)' }}` → map to `--color-terracotta: #CB452B` in `app.css`, use `bg-[var(--color-terracotta)]` or inline hex `#CB452B` (per guideline: inline style only for undocumented brand colours; list it in the token table). [MEDIUM]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:116-128`** — SVG arrow `stroke="white"` → `stroke="currentColor"` with `text-primary-foreground` on parent element. [LOW]

- **`src/ui/pages/experiences/experiences-updated/experience-grid.tsx:136`** — Filter chevron SVG `stroke="rgb(58,58,58)"` → `stroke="currentColor"`, add `text-foreground` on the SVG parent. (token: `text-foreground`) [MEDIUM]

- **`src/ui/pages/experiences/experiences-updated/experience-grid.tsx:147`** — Filter dropdown `bg-white` → `bg-background`. (Decision B) [HIGH]

---

### 1.7 The Alt Way (full-page sweep)

This page uses zero design tokens and `md:` breakpoints throughout. The following is a section-by-section replacement sweep. All fixes apply Decision A–H simultaneously.

- **`page.tsx:16`** — Hero `bg-gray-900` → `bg-primary`. [HIGH]
- **`page.tsx:28-33`** — Hero `<h1>/<p>`: `text-white` → `text-primary-foreground`; `font-bold` → `font-heading italic`; type scale `text-5xl` → `text-[48px]`. (Decision C, D; guideline: typography scale) [HIGH]
- **`page.tsx:54`** — Mission `text-gray-700` → `text-foreground`. (Decision C) [HIGH]
- **`page.tsx:63`** — Value props `bg-gray-50` → `bg-background`. (Decision B) [HIGH]
- **`page.tsx:66`** — Value prop headline `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (Decision D; guideline: typography scale) [HIGH]
- **`page.tsx:72`** — Value prop card `bg-white rounded-2xl` → `bg-background rounded-[5px]`. (Decision B; token: `rounded-[5px]`) [HIGH]
- **`page.tsx:77`** — Card body `text-gray-600` → `text-foreground`. (Decision C) [MEDIUM]
- **`page.tsx:108`** — Promise text `font-semibold` → `font-heading italic`. (Decision D) [HIGH]
- **`page.tsx:115`** — Promise CTA: apply Decision E. [HIGH]
- **`page.tsx:125`** — Stats bar `bg-black` → `bg-primary`. (Decision B) [HIGH]
- **`page.tsx:158`** — Reviews heading `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (Decision D) [HIGH]
- **`page.tsx:171`** — Star `text-yellow-400` → `text-accent`. (Decision G) [MEDIUM]
- **`page.tsx:178`** — Review body `text-gray-700` → `text-foreground`. (Decision C) [MEDIUM]
- **`page.tsx:182`** — Review meta `text-gray-500` → `text-muted`. (Decision C) [MEDIUM]
- **`page.tsx:198`** — Bottom CTA `bg-gray-50` → `bg-background`. (Decision B) [MEDIUM]
- **`page.tsx:200`** — Bottom CTA heading `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (Decision D) [HIGH]
- **`page.tsx:207`** — Bottom CTA button: apply Decision E. [HIGH]

---

### 1.8 Contact Page

- **`src/app/(site)/contact/page.tsx:14`** — Hero `bg-gray-900` → `bg-primary`. [HIGH]
- **`src/app/(site)/contact/page.tsx:24`** — Hero `<h1>` `text-white font-bold` → `text-primary-foreground font-heading italic`; type scale → `text-[48px]`. [HIGH]
- **`src/app/(site)/contact/page.tsx:50-52`** — Labels `text-gray-500` → `text-muted`; `tracking-wide` → `tracking-[0.1em]`. [MEDIUM]
- **`src/app/(site)/contact/page.tsx:55`** — Link hover `hover:text-yellow-600` → `hover:text-accent`. (Decision H) [MEDIUM]
- **`src/app/(site)/contact/page.tsx:83`** — Office `text-gray-600` → `text-foreground`. (Decision C) [MEDIUM]

---

### 1.9 Forms

- **`src/ui/forms/contact-form.tsx:34-39`** — Success state `bg-green-50 border-green-200 text-green-800` → `bg-background border-primary text-primary`. [MEDIUM]
- **`src/ui/forms/contact-form.tsx:55`** — Form labels: add `text-foreground tracking-[0.1em]` to existing `font-semibold text-sm`. [MEDIUM]
- **`src/ui/forms/contact-form.tsx:122`** — Checkbox `border-gray-300` → `border-muted`. [MEDIUM]
- **`src/ui/forms/contact-form.tsx:124`** — Consent label `text-gray-700` → `text-foreground`. [MEDIUM]
- **`src/ui/forms/contact-form.tsx:126`** — Privacy link `hover:text-black` → `hover:text-primary`. [MEDIUM]
- **`src/ui/forms/contact-form.tsx:141`** — Submit button: apply Decision E. [HIGH]
- **`src/ui/forms/availability-form.tsx:29-30`** — `bg-white` → `bg-background`; `focus:ring-black` → `focus:ring-primary` (all inputs). [HIGH]
- **`src/ui/forms/availability-form.tsx:31-32`** — `text-gray-600` → `text-muted`; `tracking-wide` → `tracking-[0.1em]`. [MEDIUM]
- **`src/ui/forms/availability-form.tsx:88`** — Submit button: apply Decision E. [HIGH]
- **`src/ui/forms/partner-form.tsx:45`** — `border-[#5F5D5D]` → `border-muted`; `placeholder:text-[#5F5D5D]/50` → `placeholder:text-muted/50`. [MEDIUM]
- **`src/ui/forms/partner-form.tsx:113`** — Checkbox `border border-[#5F5D5D]` → `border border-muted`. [MEDIUM]

---

### 1.10 Blog Cards

- **`src/app/(site)/blog/page.tsx`** — (dead file — see Group 7; token fixes here are moot) [N/A]
- **`src/ui/modules/blog/blog-post-content.tsx`** — No token violations (breakpoint violations addressed in Group 4). [N/A]
- **`src/ui/modules/blog/post-preview.tsx`** — No specific token violations beyond image `sizes` (Group 6). [N/A]

---

### 1.11 Join Us Page

- **`src/app/(site)/join-us/page.tsx:117`** — Form wrapper `bg-white` → `bg-background`. (Decision B) [HIGH]

---

## Group 2: Typography Consistency

**Cross-cutting decision:** All display headings use `font-heading italic`. Section headings use the scale `text-[30px] tracking-[0.3em] uppercase` (unless the design spec explicitly shows a different size). Labels use `tracking-[0.1em]`. Date text uses `text-muted tracking-[0.1em]`. No `font-bold` on display text.

- **`src/ui/pages/our-homes/property-gallery-section.tsx:56`** — Pull quote uses `font-heading` without `italic`. Add `italic`. (guideline: "Display text is always italic Playfair Display") [MEDIUM]

- **`src/ui/pages/our-homes/property-search.tsx:56`** — Property title `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (guideline: typography scale) [HIGH]

- **`src/app/(site)/the-alt-way/page.tsx:158`** — Reviews heading `text-3xl font-bold` → `font-heading italic text-[30px] tracking-[0.3em]`. (already listed in 1.7; duplicate removed here) [HIGH]

- **`src/app/(site)/blog/page.tsx:12`** — (dead file, see Group 7) Blog `<h1>` `text-4xl font-bold` → moot. [N/A]

- **`src/ui/modules/blog/blog-index/index.tsx`** — Heading typography: `text-4xl font-bold` wherever used → `font-heading italic text-[30px] tracking-[0.3em]`. [HIGH]

- **`src/app/(site)/[slug]/page.tsx:18`** — Legal page `<h1>` `text-4xl font-bold` → `font-heading italic text-[36px] tracking-[0.2em]`. (guideline: display text is always font-heading italic) [MEDIUM]

- **`src/ui/pages/experiences/experience-grid.tsx:91`** — (dead file) Card title `font-bold` → moot. [N/A]

- **`src/ui/pages/experiences/experiences-updated/experience-card.tsx`** — Card title: confirm it uses `font-heading italic`; add if missing. [MEDIUM]

- **`src/ui/modules/blog/post-preview-large.tsx:49`** — Post title styled with `h1` utility class — replace with `font-heading italic text-[24px] tracking-[0.2em]` on an `<h2>` or `<h3>` element. Semantic heading hierarchy must not have multiple `h1` in a list context. [MEDIUM]

- **`src/ui/modules/blog/date.tsx:8`** — `<time>` has no typography class. Add `text-muted tracking-[0.1em] text-[11px]` as the default class on the `<time>` element. Callers may still override via `className`. [MEDIUM]

---

## Group 3: Spacing & Layout

**Cross-cutting decision — `container` utility is forbidden.** Replace every `container` usage with `px-[90px] max-[820px]:px-[18px]` (or `px-[24px]` for mobile-only footer). The `@utility section` from `app.css` uses a non-standard `md:px-8` which violates the token spec — any component using `section` utility inherits wrong padding.

- **`src/ui/footer/index.tsx:13`** — Footer padding: `style={{ padding: '37px 90px 30px' }}` → `pt-[37px] pb-[30px] px-[90px] max-[820px]:pt-[30px] max-[820px]:px-[24px]`. (guideline: "Footer padding: `px-[90px] py-[37px]` desktop, `px-[24px] py-[30px]` mobile") [HIGH]

- **`src/ui/footer/index.tsx:11`** — Flex-wrap four-column layout: add `max-[820px]:flex-col` to prevent awkward 2+2 wrapping at intermediate widths. Already present per the audit note — verify this exists and is `max-[820px]:` not `max-md:`. [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:112`** — Intro section `pl-[191px] pr-[188px]` → `px-[90px] max-[820px]:px-[18px]`. The asymmetric value is undocumented and non-standard. (guideline: page horizontal padding token) [HIGH]

- **`src/app/(site)/our-homes/[slug]/page.tsx:78`** — Booking bar `mx-[96px]` → `mx-[90px] max-[820px]:mx-[18px]` (aligned to page padding token). [HIGH]

- **`src/ui/pages/our-homes/property-search.tsx:27`** — `container` → `px-[90px] max-[820px]:px-[18px]`. (guideline: `container` not a design system primitive) [MEDIUM]

- **`src/app/(site)/the-alt-way/page.tsx:42`** — Mission `container` → `px-[90px] max-[820px]:px-[18px]`. [HIGH]

- **`src/app/(site)/contact/page.tsx:42`** — Body `container` → `px-[90px] max-[820px]:px-[18px]`. [HIGH]

- **`src/app/(site)/contact/page.tsx:34`** — Fallback hero `container` → `px-[90px] max-[820px]:px-[18px]`. [MEDIUM]

- **`src/app/(site)/[slug]/page.tsx:17`** — Legal page `container py-20` → `px-[90px] max-[820px]:px-[18px] py-20`. [MEDIUM]

- **`src/ui/modules/blog/blog-index/index.tsx:20`** — `section` utility → `px-[90px] max-[820px]:px-[18px]`. [HIGH]

- **`src/ui/modules/blog/blog-post-list.tsx:20`** — `section` utility → `px-[90px] max-[820px]:px-[18px]`. [HIGH]

- **`src/app/(site)/join-us/page.tsx:53`** — Hero content `pl-[194px] pr-[90px]` → `px-[90px] max-[820px]:px-[18px]`. Asymmetry not documented in Figma spec as intentional. [MEDIUM]

- **`src/app/(site)/join-us/page.tsx:68`** — Content section: add `max-[820px]:px-[18px]` alongside existing `px-[90px]`. [HIGH]

- **`src/ui/forms/contact-form.tsx:62`** — Input `rounded-lg` → `rounded-[5px]` (align with partner form and button shape). (guideline: all interactive elements use `rounded-[5px]`) [MEDIUM]

- **`src/ui/forms/contact-form.tsx:43-144`** — Contact form is boxed-input style; partner form is underline style. Decision: align contact form to underline style (`border-0 border-b border-muted bg-transparent`) for visual consistency. Both forms will use the underline/editorial pattern appropriate to the luxury brand. [HIGH]

- **`src/ui/menu-overlay.tsx:55-59`** — Aside padding `padding: '48px 40px 40px'` → `pt-[48px] px-[40px] pb-[40px]` (already matches guideline spec `p-[48px_40px_40px]` — just move to Tailwind). [LOW]

---

## Group 4: Responsiveness

**Cross-cutting decision — single breakpoint rule.** Every `md:`, `max-md:`, `sm:`, `lg:`, `max-sm:` Tailwind breakpoint must become `max-[820px]:` (mobile-first override) or be removed. Responsive layouts at intermediate widths (400–819px) must use `w-full`, `max-w-*`, percentage widths, or fluid grid units — never fixed pixel widths without a `max-[820px]:` escape.

### 4.1 Header & Shell

- **`src/ui/header/dropdown.tsx:25-26,34`** — `max-md:` / `md:` → `max-[820px]:` / no mobile counterpart (above 820px is desktop). [HIGH]
- **`src/ui/header/megamenu.tsx:29-30,46`** — All `md:` / `max-md:` / `sm:` → `max-[820px]:` equivalents. Restructure columns as `max-[820px]:grid-cols-1`. [HIGH]
- **`src/ui/header/mobile-toggle.tsx:5`** — `md:hidden` → `min-[821px]:hidden` (show only on mobile). [HIGH]
- **`src/ui/header/navigation.tsx:17`** — `max-md:` / `md:` classes → `max-[820px]:` equivalents. [HIGH]
- **`src/ui/header/index.tsx:44`** — `min-[821px]:hidden` — this is correct; the offending `min-[821px]:hidden` (previously listed as line 44) is the mobile CTA visibility toggle. Verify both desktop and mobile CTAs toggle cleanly at exactly 820px with no gap. Replace `min-[821px]:hidden` with `max-[820px]:block` + `min-[821px]:hidden` pair. [MEDIUM]
- **`src/ui/footer/navigation.tsx:15`** — `max-md:flex-col` → `max-[820px]:flex-col`. [HIGH]
- **`src/ui/menu-overlay.tsx:36`** — `md:grid-cols-[1fr_415px]` → `min-[821px]:grid-cols-[1fr_415px]`. [MEDIUM]
- **`src/ui/menu-overlay.tsx:42`** — `md:block` → `min-[821px]:block` (left panel visible only above 820px). [MEDIUM]
- **`src/ui/atoms/pill.tsx:11`** — `w-[142px]` fixed width: add `max-[820px]:w-auto max-[820px]:px-4` so pills shrink gracefully on mobile. [MEDIUM]

### 4.2 Property Pages

- **`src/ui/pages/our-homes/property-gallery-section.tsx:25`** — `h-[625px]` fixed → add `max-[820px]:h-auto max-[820px]:flex-col` to allow the gallery to stack vertically on mobile. [HIGH]
- **`src/ui/pages/our-homes/property-gallery-section.tsx:27`** — Main image `w-[720px]` → `max-[820px]:w-full`. [HIGH]
- **`src/app/(site)/our-homes/[slug]/page.tsx:78`** — Booking bar `mx-[96px]` with no mobile override → `mx-[90px] max-[820px]:mx-[18px] max-[820px]:flex-col`. [HIGH]
- **`src/app/(site)/our-homes/[slug]/page.tsx:417`** — Causes image grid `md:grid-cols-2` → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/app/(site)/our-homes/[slug]/page.tsx:438`** — Reviews grid `md:grid-cols-2 lg:grid-cols-3` → `max-[820px]:grid-cols-1` on mobile; desktop uses `grid-cols-3` without any breakpoint prefix (already desktop-default). [HIGH]
- **`src/app/(site)/our-homes/[slug]/page.tsx:471`** — CTA heading `md:text-4xl` → remove; use single size `text-[30px]` or `max-[820px]:text-[24px]` if mobile needs to be smaller. [HIGH]
- **`src/ui/pages/our-homes/property-search.tsx:43`** — Property grid `md:grid-cols-2` → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/ui/pages/our-homes/property-experiences-section.tsx:44`** — Mobile padding `max-[820px]:px-[24px]` → `max-[820px]:px-[18px]`. (guideline: mobile padding is 18px, not 24px) [MEDIUM]

### 4.3 Content Pages

- **`src/app/(site)/the-alt-way/page.tsx:28`** — `md:text-7xl` → `max-[820px]:text-[36px]` (use smaller mobile size). [HIGH]
- **`src/app/(site)/the-alt-way/page.tsx:42`** — `md:grid-cols-2` → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/app/(site)/the-alt-way/page.tsx:70`** — `md:grid-cols-2` value props → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/app/(site)/the-alt-way/page.tsx:132`** — Stats `grid-cols-2 md:grid-cols-4` → `grid-cols-2 min-[821px]:grid-cols-4`. [HIGH]
- **`src/app/(site)/contact/page.tsx:24`** — `md:text-5xl` → `max-[820px]:text-[32px]`. [HIGH]
- **`src/app/(site)/contact/page.tsx:42`** — `md:grid-cols-2` → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/ui/modules/hero.split.tsx:18`** — `md:grid-cols-2` → `max-[820px]:grid-cols-1`. [HIGH]
- **`src/ui/modules/hero.split.tsx:22-25`** — `md:order-last` / `max-md:order-last` → `min-[821px]:order-last` / `max-[820px]:order-last`. [HIGH]
- **`src/ui/modules/hero.split.tsx:38`** — `max-md:*:w-full` → `max-[820px]:*:w-full`. [HIGH]
- **`src/ui/modules/prose/index.tsx:22-23`** — `max-md:flex-col md:items-start` → `max-[820px]:flex-col min-[821px]:items-start`. [HIGH]
- **`src/ui/modules/prose/index.tsx:29-32`** — `md:sticky-below-header`, `md:w-[20ch]`, `md:order-last` → `min-[821px]:` equivalents. [HIGH]
- **`src/ui/modules/prose/image.tsx:8`** — `max-md:full-bleed md:col-[bleed]!` → `max-[820px]:full-bleed min-[821px]:col-[bleed]!`. [HIGH]

### 4.4 Join Us (critically broken on mobile)

- **`src/app/(site)/join-us/page.tsx:35`** — Hero `h-[470px]` → add `max-[820px]:h-auto max-[820px]:py-[60px]`. [HIGH]
- **`src/app/(site)/join-us/page.tsx:53`** — Hero content `gap-[90px] pl-[194px]` → `max-[820px]:gap-[24px] max-[820px]:pl-0 max-[820px]:px-[18px]`. [HIGH]
- **`src/app/(site)/join-us/page.tsx:69`** — Flex row `w-[384px]` + `w-[624px]` fixed widths: add `max-[820px]:flex-col max-[820px]:w-full` to both children. [HIGH]
- **`src/app/(site)/join-us/page.tsx:117`** — Form wrapper `mx-[192px]` → `mx-[90px] max-[820px]:mx-[18px]`. [HIGH]
- **`src/ui/forms/partner-form.tsx:58`** — `grid-cols-2 gap-x-[93px]` → add `max-[820px]:grid-cols-1`. [HIGH]

### 4.5 Blog ❌ REJECTED — skip  

- **`src/app/(site)/blog/page.tsx`** — (dead file — see Group 7) Breakpoint violations are moot. [N/A]
- **`src/ui/modules/blog/blog-index/paginated-posts.tsx:50`** — `md:order-first` → `min-[821px]:order-first`. [HIGH]
- **`src/ui/modules/blog/blog-index/paginated-posts.tsx:51`** — `max-md:full-bleed` → `max-[820px]:full-bleed`. [HIGH]
- **`src/ui/modules/blog/blog-index/paginated-posts.tsx:54`** — `sm:grid-cols-[...]` → `min-[821px]:grid-cols-[...]`. [HIGH]
- **`src/ui/modules/blog/blog-index/skeleton.tsx:5`** — `md:order-first md:grid-cols-2` → `min-[821px]:order-first min-[821px]:grid-cols-2`. [HIGH]
- **`src/ui/modules/blog/blog-index/skeleton.tsx:27`** — `sm:grid-cols-[...]` → `min-[821px]:grid-cols-[...]`. Container variable `--container-sm` → align with live grid (`--container-xs`). [MEDIUM]
- **`src/ui/modules/blog/blog-post-content.tsx:59`** — `max-md:flex-col md:items-start` → `max-[820px]:flex-col min-[821px]:items-start`. [HIGH]
- **`src/ui/modules/blog/blog-post-content.module.css:3`** — `@media (width >= 48rem)` → `@media (width >= 820px)`. [HIGH]
- **`src/ui/modules/blog/blog-post-list.tsx:28`** — `max-md:full-bleed max-md:px-4 md:mask-r-...` → `max-[820px]:full-bleed max-[820px]:px-4 min-[821px]:mask-r-...`. [HIGH]
- **`src/ui/modules/blog/post-preview-large.tsx:26`** — `md:grid-cols-2` → `min-[821px]:grid-cols-2`. [HIGH]
- **`src/ui/modules/blog/post-preview-large.tsx:28`** — `max-md:full-bleed` → `max-[820px]:full-bleed`. [HIGH]

### 4.6 Hero & Home

- **`src/ui/home-hero.module.css:4`** — Hero height `1290px` fixed desktop with `870px` mobile only activating below 820px. At intermediate widths (400–819px) the 1290px height persists before the breakpoint fires. Fix: change desktop height to `min-h-[870px]` with `height: auto` and let content drive the height. At 820px+ restore `height: 1290px`. This is the highest-risk layout fix — flag for design review before execution. [HIGH]
- **`src/ui/home-hero.module.css:51-53`** — `.stripes left: 1189px` invisible at 820–1335px: change to `right: 0` or use `clamp()` to keep it visible at intermediate widths. Alternatively: `left: min(1189px, calc(100vw - 150px))`. [MEDIUM]

---

## Group 5: Interactive States

**Cross-cutting decision:** All focusable elements use `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`. Touch targets minimum `h-11 w-11` (44px). No `focus:ring-black`.

- **`src/ui/molecules/menu-toggle.tsx:13`** — Hamburger `h-8 w-8` (32px) → `h-11 w-11` (44px). Use `flex items-center justify-center` to keep the icon centred. (guideline: 44px touch target minimum) [HIGH]

- **`src/ui/molecules/social-links.tsx:64-65`** — Social link area is `width: size` (14px–26px). Wrap each link in a `<span>` sized `min-h-11 min-w-11 flex items-center justify-center` to meet the 44px tap target without changing the visual icon size. (guideline: 44px touch target) [HIGH]

- **`src/ui/menu-overlay.tsx:72`** — Close button `h-8 w-8` (32px) → `h-11 w-11`. (guideline: 44px touch target) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experience-card.tsx:43`** — `focus-visible:outline-primary` (invalid Tailwind utility — silently produces nothing) → `focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`. (guideline: focus ring standard) [HIGH]

- **`src/ui/forms/contact-form.tsx:62,77,92,110`** — `focus:ring-black` → `focus:ring-2 focus:ring-primary focus:ring-offset-0` on all inputs and textarea. (Decision; token: `ring-primary`) [HIGH]

- **`src/ui/forms/contact-form.tsx:122`** — Checkbox `focus:ring-black` → `focus:ring-primary`. [HIGH]

- **`src/ui/forms/availability-form.tsx:29-30`** — `focus:ring-black` → `focus:ring-primary`. [HIGH]

- **`src/ui/forms/partner-form.tsx`** — Verify all interactive elements have `focus-visible:ring-2 focus-visible:ring-primary` states. [MEDIUM]

---

## Group 6: Image Quality & Performance

**Cross-cutting decision — Sanity image URL builder:**
- All hero/background images: `.width(1440).quality(85)` minimum.
- Section background images (full-bleed): `.width(1440).quality(85)`.
- Card/thumbnail images: `.width(800).quality(80)` or `.width(600).quality(80)`.
- Decorative images: `.width(300)` (no quality constraint needed).
- All `fill` images must have a `sizes` prop.
- Above-the-fold images use `priority` prop (not `loading="eager"`).

- **`src/ui/pages/our-homes/our-homes-hero.tsx:24-31`** — `urlFor(...).url()` with no width/quality → `.width(1440).quality(85).url()`. [HIGH]

- **`src/ui/pages/our-homes/our-homes-cta.tsx:27`** — `urlFor(...).url()` with no width/quality → `.width(1440).quality(85).url()`. [HIGH]

- **`src/ui/pages/our-homes/property-showcase.tsx:85`** — Hero image `urlFor(...).url()` → `.width(1200).quality(85).url()`. [HIGH]

- **`src/ui/pages/our-homes/property-showcase.tsx:133`** — Secondary image `urlFor(...).url()` → `.width(625).quality(85).url()`. [MEDIUM]

- **`src/ui/pages/our-homes/property-showcase.tsx:72`** — Decor image `urlFor(...).url()` → `.width(300).url()`. [LOW]

- **`src/app/(site)/our-homes/[slug]/page.tsx:28-30`** — Hero `urlFor(...).width(1440)` with no `.quality()` → add `.quality(85)`. [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:32-34`** — Amenities image `urlFor(...).width(800)` with no `.quality()` → add `.quality(80)`. [MEDIUM]

- **`src/app/(site)/our-homes/[slug]/page.tsx:59-65`** — Hero `<Image>` `sizes="1440px"` → `sizes="100vw"`. [MEDIUM]

- **`src/ui/pages/our-homes/property-gallery-section.tsx:27-35`** — Main gallery `<Img>` has no `sizes` prop → add `sizes="(max-width: 820px) 100vw, 720px"`. [MEDIUM]

- **`src/ui/pages/our-homes/property-experiences-section.tsx:48-53`** — Background `<Image>` no `priority`, no `quality` → add `quality={85}`; add `priority` if above the fold. [MEDIUM]

- **`src/ui/home-hero.tsx:19`** — `urlFor(...).width(900).height(900)` forced 900×900 crop — remove `.height(900)` to avoid wrong aspect ratio crop. `sizes="856px"` → `sizes="(max-width: 820px) 0px, 856px"`. (CMS-DEP — see CMS-DEPS.md) [MEDIUM]

- **`src/ui/home-hero.tsx:31-40`** — Hero image has `priority` but `.heroImg` is `display: none` on mobile — the browser still preloads it. Conditionally suppress the `<Image>` on mobile or remove `priority` and use a responsive `sizes="(max-width: 820px) 0px, 856px"` which tells the browser to not download on mobile. (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experiences-hero.tsx:27-28`** — `urlFor(...).url()` no width/quality → `.width(1440).quality(85).url()`. (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/pages/experiences/experiences-updated/experience-card.tsx:59-66`** — Card `<Img>` no `sizes` → add `sizes="(max-width: 820px) 100vw, 360px"`. [MEDIUM]

- **`src/ui/pages/experiences/experience-grid.tsx:81-86`** — (dead file, Group 7) [N/A]

- **`src/app/(site)/the-alt-way/page.tsx:17-22`** — Hero `<Img>` no `quality` prop, `loading="eager"` → add `quality={85}`, change to `priority`. (CMS-DEP — see CMS-DEPS.md) [MEDIUM]

- **`src/app/(site)/join-us/page.tsx:43`** — Hero `urlFor(...).width(1440)` no `.quality()` → add `.quality(85)`. `sizes="1440px"` → `sizes="100vw"`. (CMS-DEP — see CMS-DEPS.md) [MEDIUM]

- **`src/ui/modules/hero.split.tsx:28`** — `<Img>` no `sizes` → add `sizes="(max-width: 820px) 100vw, 50vw"`. [MEDIUM]

- **`src/ui/modules/prose/image.tsx:9`** — `<Img>` `width={900}` no `sizes` → add `sizes="(max-width: 820px) 100vw, 768px"`. [MEDIUM]

- **`src/ui/modules/blog/blog-post-content.tsx:32-41`** — Blog post hero `loading="eager"` → `priority`. `width={1000}` no `sizes` → add `sizes="100vw"`, `quality={85}`. (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/modules/blog/post-preview-large.tsx:29-33`** — `<Img>` no `sizes`, no `quality` → `sizes="(max-width: 820px) 100vw, 50vw"`, `quality={85}`. [MEDIUM]

- **`src/ui/modules/blog/post-preview.tsx:26`** — `<Img>` no `sizes`, no `quality` → `sizes="(max-width: 820px) 100vw, 360px"`, `quality={75}`. [MEDIUM]

- **`src/ui/modules/blog/byline.tsx:16`** — Author avatar `width={48}` no `sizes` → add `sizes="48px"`. [LOW]

---

## Group 7: File Hygiene

### 7.1 Dead files — DELETE

- **`src/ui/pages/experiences/experience-grid.tsx`** — Dead code. `src/app/(site)/experiences/page.tsx` imports exclusively from `experiences-updated/experience-grid.tsx`. Delete this file. [MEDIUM]

- **`src/app/(site)/blog/page.tsx`** — Standalone reimplementation that duplicates the `BlogIndex` module. Uses zero design tokens. Should be deleted — the CMS-driven module route (`BlogIndex`) is the canonical implementation. Before deletion: verify the route `/blog` is served by the module system and not this page. [HIGH]

### 7.2 Atoms — `<a>` → `<Link>`

- **`src/ui/atoms/nav-cta.tsx:17`** — Raw `<a>` → Next.js `<Link>` for internal routes. (guideline: Next.js routing for internal navigation) [MEDIUM]

- **`src/ui/atoms/pill.tsx:9`** — Raw `<a>` → Next.js `<Link>` if href is an internal route (WhatsApp / bookDirectLink are external — these should remain `<a target="_blank" rel="noopener noreferrer">`). Check each pill's href origin before changing. [LOW]

### 7.3 Anonymous default exports — name them

- **`src/ui/header/wrapper.tsx:39`** → `export default function HeaderWrapper(...)` [LOW]
- **`src/ui/header/dropdown.tsx:6`** → `export default function DropdownMenu(...)` [LOW]
- **`src/ui/header/megamenu.tsx:7`** → `export default function MegamenuNav(...)` [LOW]
- **`src/ui/header/mobile-toggle.tsx:3`** → `export default function MobileToggle(...)` [LOW]
- **`src/ui/header/navigation.tsx:15`** → `export default function Navigation(...)` [LOW]
- **`src/ui/modules/hero.split.tsx:9`** → `export default function HeroSplit(...)` [LOW]
- **`src/ui/modules/prose/index.tsx:11`** → `export default function ProseModule(...)` [LOW]
- **`src/ui/modules/prose/anchored-heading.tsx:4`** → `export default function AnchoredHeading(...)` [LOW]
- **`src/ui/modules/prose/code.tsx:9`** → `export default function CodeBlock(...)` [LOW]
- **`src/ui/modules/prose/image.tsx:4`** → `export default function ProseImage(...)` [LOW]
- **`src/ui/modules/blog/blog-index/paginated-posts.tsx:9`** → `export default function PaginatedPosts(...)` [LOW]
- **`src/ui/modules/blog/blog-index/sort-by.tsx:5`** → `export default function SortBy(...)` [LOW]

### 7.4 GROQ queries — wrap in `defineQuery()` (TypeGen breakage)

**Non-negotiable per CLAUDE.md:** "Every GROQ query must use `defineQuery()`. Plain `groq` tag breaks TypeGen silently."

- **`src/ui/modules/blog/blog-index/index.tsx:49`** — `BLOG_INDEX_QUERY = groq\`...\`` → `BLOG_INDEX_QUERY = defineQuery(\`...\`)`. After change: run `npm run typegen`. [HIGH]

- **`src/ui/modules/blog/blog-post-list.tsx:45`** — `BLOG_POST_LIST_QUERY = groq\`...\`` → `BLOG_POST_LIST_QUERY = defineQuery(\`...\`)`. After change: run `npm run typegen`. [HIGH]

  Note: Once both queries are wrapped in `defineQuery()` and typegen is run, the downstream `as any` casts in `paginated-posts.tsx:23` and `blog-post-list.tsx:31` should be removed as the types will be inferred correctly.

### 7.5 Blog category filter — incomplete implementation

- **`src/ui/modules/blog/filter-list.tsx:1-9`** — `FilterList` only renders an `<Filter>All</Filter>` with no CMS categories fetched. This is an incomplete implementation. The component should fetch blog categories from Sanity and pass them to `<Filter>` buttons. (CMS-DEP — see CMS-DEPS.md) [HIGH]

- **`src/ui/modules/blog/filter.tsx:4`** — `FilterList` is a server component rendering a `'use client'` `Filter`. The architecture is valid (server→client composition) but the missing category fetch from CMS means filtering is non-functional. Blocked on CMS-DEP. [MEDIUM]

### 7.6 Blog sort state inconsistency

- **`src/ui/modules/blog/blog-index/sort-by.tsx:3`** — `SortBy` reads from `useBlogIndexStore`; sibling `paginated-posts.tsx` reads `sortBy` directly from `useQueryState('sortBy')`. Unify: both should read from `useQueryState('sortBy')` directly, or both should read from the store. Remove the store access in `sort-by.tsx` in favour of `useQueryState`. [MEDIUM]

### 7.7 Blog post preview — dead commented code

- **`src/ui/modules/blog/post-preview.tsx:50-52`** — `post.metadata?.description` is commented out. Remove the commented lines or restore the description render. [LOW]

### 7.8 Blog drop-cap — design confirmation needed

- **`src/ui/modules/blog/blog-post-content.module.css:1-15`** — Drop-cap on first paragraph (`p:first-of-type::first-letter`) uses `var(--text-7xl)` and `var(--font-serif)`. Drop caps are not documented in `UI_GUIDELINES.md`. Flag for design review: confirm intentional, and if so ensure `var(--font-serif)` maps to `font-heading` (Playfair Display). [LOW]

### 7.9 Prose code block — conditional `text-white`

- **`src/ui/modules/blog/prose/code.tsx:57`** — `!theme.includes('light') && 'text-white'` → `!theme.includes('light') && 'text-primary-foreground'`. [LOW]

### 7.10 CMS-driven nav (flagged, not executed)

- **`src/ui/header/navigation.tsx:4-9`** — `NAV_ITEMS` hardcoded; cannot be managed from Sanity. (CMS-DEP — see CMS-DEPS.md) [MEDIUM]
- **`src/ui/footer/navigation.tsx:3-10`** — `FOOTER_NAV` hardcoded; cannot be managed from Sanity. (CMS-DEP — see CMS-DEPS.md) [MEDIUM]

---

## CMS Dependencies

See CMS-DEPS.md
