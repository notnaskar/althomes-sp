# UI Audit Findings

<!-- Auditor agents append their findings below, one cluster per section -->

## A1 — Shared Shell

---
FILE: src/ui/atoms/badge.tsx
LINE: 16
ISSUE: `bg-[#F2C94C]` hardcoded hex instead of `bg-accent`. `text-[#3A3A3A]` instead of `text-accent-foreground`. Both are direct token values that have Tailwind aliases.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/atoms/badge.tsx
LINE: 16
ISSUE: Default className string is used as a fallback only when no `className` prop is passed. This means callers who pass `className` bypass the token violation, but the default path remains broken. The entire default string should be refactored to use token classes.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/atoms/nav-cta.tsx
LINE: 14-15
ISSUE: Colors applied via inline `style` using hardcoded hex strings (`#2F5D50`, `#FCF6EA`, `#3A3A3A`) instead of Tailwind token classes (`bg-primary`, `text-primary-foreground`, `bg-background`, `text-foreground`). Inline style bypasses the design token system entirely.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/atoms/nav-cta.tsx
LINE: 17
ISSUE: Uses a raw `<a>` tag instead of Next.js `<Link>`. Internal navigation should use `<Link>` for prefetching and SPA routing.
CATEGORY: file-hygiene
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/atoms/nav-cta.tsx
LINE: 22-26
ISSUE: `height`, `padding`, `minWidth`, and `fontSize` are set via inline `style` with raw pixel numbers. These values should be expressed as Tailwind utility classes so they participate in the design system (e.g., `h-12`, `px-6`, `min-w-[192px]`, `text-[14px]`).
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/atoms/pill.tsx
LINE: 11
ISSUE: `bg-white` used instead of `bg-background` (cream `#FCF6EA`). White (`#FFFFFF`) is not the same as the background token (`#FCF6EA`). Also `text-[#3A3A3A]` hardcoded instead of `text-foreground`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/atoms/pill.tsx
LINE: 11
ISSUE: `w-[142px]` is a fixed pixel width. On narrow mobile viewports (e.g. 375px), two pills side-by-side (`2 × 142px + gap`) will be 296px+, consuming nearly the full viewport width with no responsive adjustment.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/atoms/pill.tsx
LINE: 9
ISSUE: Uses a raw `<a>` tag instead of Next.js `<Link>`. If href is an internal route, should use `<Link>`.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/molecules/footer-col.tsx
LINE: 21-26
ISSUE: `color: '#FCF6EA'` hardcoded as inline style instead of using the inherited text color (`text-primary-foreground` / `text-background`) or `text-current`. The footer already sets `color: '#FCF6EA'` on the root element, so `color: inherit` or no color override at all would suffice.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/molecules/footer-col.tsx
LINE: 21-26
ISSUE: `fontSize`, `letterSpacing`, and `lineHeight` on the link are set via inline `style` with raw values instead of Tailwind utilities (`text-[11px]`, `tracking-[0.1em]`, `leading-[1.4]`). Mixes inline styles and Tailwind inconsistently.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/molecules/menu-toggle.tsx
LINE: 13
ISSUE: Button hit target is `h-8 w-8` = 32×32px. Touch target spec requires ≥44×44px. On mobile this hamburger is too small to reliably tap.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/molecules/social-links.tsx
LINE: 64-65
ISSUE: Social link `<a>` elements have `width: size` and `height: size` (default 14px at smallest usage). The clickable/tappable area is 14px, far below the 44px touch target minimum. Even at the larger `size={26}` used in the menu overlay, 26px is still under spec.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/index.tsx
LINE: 9
ISSUE: `[padding:44px_90px_0]` and `max-[820px]:[padding:36px_18px_0]` are arbitrary property syntax. Top padding is 44px desktop / 36px mobile — this is header-specific and intentional, but the horizontal padding (90px desktop / 18px mobile) matches the page standard and should use the shared `px-[90px] max-[820px]:px-[18px]` pattern for consistency.
CATEGORY: spacing-inconsistency
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/index.tsx
LINE: 18-29
ISSUE: Desktop CTA `<a>` uses inline `style` with hardcoded hex colors (`#2F5D50`, `#FCF6EA`) and raw dimension values instead of token classes or the existing `NavCta` atom. The `NavCta` atom exists precisely for this button; using it here would eliminate duplication and the token violation.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: yes — `site.navCtaLabel` and `site.navCtaLink` from Sanity `site` document
---

---
FILE: src/ui/header/index.tsx
LINE: 32-45
ISSUE: Mobile mini CTA `<a>` also uses inline `style` with hardcoded hex values. Same issue as above — should use `NavCta` with `compact` prop. Additionally uses `min-[821px]:hidden` (821px breakpoint) while the design system mandates `max-[820px]:` only — this introduces an inconsistent second breakpoint.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: yes — `site.navCtaLink` from Sanity `site` document
---

---
FILE: src/ui/header/index.tsx
LINE: 44
ISSUE: `min-[821px]:hidden` breakpoint is not the single allowed breakpoint (`max-[820px]:`). This off-by-one creates a gap at exactly 820px where both elements could be hidden or shown incorrectly.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/header/index.tsx
LINE: 10
ISSUE: Header z-index is `z-10`. The menu overlay (`menu-overlay.tsx`) uses `z-50`. While this ordering is correct, the header sits below the overlay at z-10 — if any other page content uses z-values between 10 and 50, stacking issues can occur. Consider `z-40` for header so it's clearly just below the overlay.
CATEGORY: layout
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/dropdown.tsx
LINE: 25-26
ISSUE: Uses `max-md:` and `md:` Tailwind breakpoints (768px). The project mandates `max-[820px]:` as the single breakpoint. These are inconsistent with the design system.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/dropdown.tsx
LINE: 34
ISSUE: Uses `md:` breakpoint (768px) again on the `<ul>` dropdown panel (`md:bg-background`, `md:border`, etc.). Same breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/megamenu.tsx
LINE: 29-30
ISSUE: Uses `md:` and `max-md:` breakpoints (`768px`) throughout: `md:bg-background`, `md:overflow-y-auto`, `md:border-b`, `max-md:grid`, `max-md:border-l`, `sm:columns-3xs`. Violates the single `max-[820px]:` breakpoint rule. `sm:` (640px) is also present.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/megamenu.tsx
LINE: 46
ISSUE: `max-md:pl-ch`, `max-md:border-l`, `max-md:anim-fade-to-b` — further `max-md:` breakpoint usage. Same violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/mobile-toggle.tsx
LINE: 5
ISSUE: Uses `md:hidden` (768px breakpoint) instead of `max-[820px]:` pattern. Violates single-breakpoint rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/navigation.tsx
LINE: 17
ISSUE: Uses `max-md:` and `md:` breakpoints (`768px`) — `max-md:header-not-open:hidden`, `max-md:anim-fade-to-b`, `md:py-ch`, `md:place-content-center`, `md:text-center`, `md:text-balance`. Violates single `max-[820px]:` breakpoint rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/header/navigation.tsx
LINE: 4-9
ISSUE: `NAV_ITEMS` is hardcoded in the component rather than driven from CMS data. Nav items (Our Homes, Experiences, The Alt Way, Blog) cannot be managed from Sanity Studio. Should be CMS-driven via `site.headerNav` or equivalent.
CATEGORY: file-hygiene
SEVERITY: medium
CMS-DEP: yes — Nav labels should come from the Sanity `site` document
---

---
FILE: src/ui/header/wrapper.tsx
LINE: 39
ISSUE: Component is an anonymous default export (`export default function (props…)`). Anonymous exports make React DevTools debugging, error stack traces, and fast refresh identification harder. Should be named: `export default function HeaderWrapper(…)`.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/dropdown.tsx
LINE: 6
ISSUE: Anonymous default export — same naming issue as wrapper.tsx. Should be named `DropdownMenu` or similar.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/megamenu.tsx
LINE: 7
ISSUE: Anonymous default export. Should be named `MegamenuNav` or similar.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/mobile-toggle.tsx
LINE: 3
ISSUE: Anonymous default export. Should be named `MobileToggle` or similar.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/header/navigation.tsx
LINE: 15
ISSUE: Anonymous default export. Should be named `Navigation` or similar.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 9
ISSUE: `background: '#2F5D50'` and `color: '#FCF6EA'` set via inline `style` with raw hex instead of Tailwind token classes `bg-primary text-primary-foreground`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 13
ISSUE: Footer padding set as inline `style={{ padding: '37px 90px 30px' }}` — asymmetric top/bottom (37px top, 30px bottom) on a single shorthand. Design tokens specify footer padding as `px-[90px] py-[37px]` desktop, `px-[24px] py-[30px]` mobile. The current value has top=37 and bottom=30, which does not match either the desktop (`py-[37px]` = equal top/bottom) or mobile spec. Mobile responsive padding override is also missing — no `max-[820px]:` adjustment on the outer padding `div`.
CATEGORY: spacing-inconsistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 15
ISSUE: `font-['Playfair_Display']` used on the brand name element instead of `font-heading`. This is an explicit token violation listed in the audit rules.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 15
ISSUE: `text-white` on the brand name. The footer background is `bg-primary` (green), so white is technically on a dark bg — however the design token `text-primary-foreground` (`#FCF6EA`, cream) is the correct token for this context, not `text-white` (`#FFFFFF`).
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 11
ISSUE: Footer uses `flex-wrap` with four logical columns. On intermediate widths (400–819px) `flex-wrap` can produce awkward 2+2 or 3+1 column breaks rather than the intended single-column mobile layout. The mobile `max-[820px]:flex-col` is correct for <820px, but at exactly 820px the flex-wrap layout may produce unintended column wrapping before the breakpoint kicks in.
CATEGORY: layout
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 27-29
ISSUE: Column heading `<h4>` for "OUR HOMES" has `font-bold` as a className but `fontSize` and `letterSpacing` via inline style. Inconsistent mixing of Tailwind and inline style. Should use `text-[12px] tracking-[0.1em]` utility classes.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/footer/index.tsx
LINE: 33-44
ISSUE: Property links use `color: '#FCF6EA'` as inline style. Footer root already sets `color: '#FCF6EA'` via inline style, so `color: inherit` or omitting the override entirely is sufficient. Redundant and bypasses token system.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/footer/navigation.tsx
LINE: 15
ISSUE: Uses `max-md:flex-col` (768px breakpoint) instead of `max-[820px]:flex-col`. Violates single-breakpoint rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/footer/navigation.tsx
LINE: 3-10
ISSUE: `FOOTER_NAV` is hardcoded in the component. Footer nav items cannot be managed from CMS. Should be driven by `site.footerNav` or similar Sanity field.
CATEGORY: file-hygiene
SEVERITY: medium
CMS-DEP: yes — Should come from Sanity `site` document
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 37
ISSUE: Overlay background `style={{ background: '#FCF6EA' }}` uses hardcoded hex instead of `bg-background` Tailwind class.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 55-59
ISSUE: Aside background and color set via inline `style` with hardcoded hex: `background: '#2F5D50'`, `color: '#FCF6EA'`. Should use `bg-primary text-primary-foreground` Tailwind classes.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 72
ISSUE: Close button is `h-8 w-8` = 32×32px touch target. Below the 44px minimum.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 104
ISSUE: `font-['Playfair_Display']` on nav link text instead of `font-heading`. Explicit token violation.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 104
ISSUE: `text-[#FCF6EA]` hardcoded hex on overlay nav links. These are on the `bg-primary` aside, so should use `text-primary-foreground` token class.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 36
ISSUE: `md:grid-cols-[1fr_415px]` uses `md:` breakpoint (768px) instead of `max-[820px]:` pattern. Left panel should be hidden below 820px, not 768px.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 42
ISSUE: Left panel uses `md:block` (768px) to control visibility instead of `max-[820px]:hidden`. At widths 769–820px the panel will show when per the single-breakpoint rule it should still be hidden.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/menu-overlay.tsx
LINE: 55-59
ISSUE: Aside padding set via inline style as `padding: '48px 40px 40px'`. Asymmetric and not matching any documented padding token. Should be expressed as Tailwind utilities for consistency.
CATEGORY: spacing-inconsistency
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 77
ISSUE: `color: #000` on `.headlineH1`. Should be `color: var(--color-foreground)` or the element should use `text-foreground` Tailwind class. Black (`#000`) is not the foreground token (`#3A3A3A`).
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 81
ISSUE: `font-family: var(--font-playfair-display, 'Playfair Display', serif)` in CSS module instead of using the `font-heading` Tailwind utility class on the element in JSX. The CSS module approach bypasses the token system for font management.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 98
ISSUE: `.badge` uses `background: #F2C94C` and `color: #3A3A3A` hardcoded hex in CSS module. Should use CSS custom properties (`var(--color-accent)`, `var(--color-accent-foreground)`) to remain connected to the token system.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 138
ISSUE: `.pill` uses `background: #fff` (white, `#FFFFFF`) instead of `var(--color-background)` (cream, `#FCF6EA`). Also `color: #3A3A3A` hardcoded instead of `var(--color-foreground)`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 175-180
ISSUE: `.pillIconBook` uses `color: #3A3A3A` and `.pillIconWa` uses `background: rgb(76, 175, 80)` and `color: #fff`. The WhatsApp green is a brand-external color (acceptable), but `color: #fff` on it instead of the foreground token, and `#3A3A3A` instead of `var(--color-foreground)`, are inconsistencies.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 4
ISSUE: Hero height is fixed at `height: 1290px` desktop and `height: 870px` mobile. At intermediate widths (400–819px) the fixed 1290px height will remain until the 820px breakpoint fires, causing massive whitespace below content on medium-small screens. No fluid/responsive height strategy.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/home-hero.module.css
LINE: 51-53
ISSUE: `.stripes` has `left: 1189px` — this element is positioned beyond a 1189px left offset. On any viewport narrower than ~1335px, the stripes decorative element will be clipped by `overflow: hidden` on `.hero`. No responsive left position is applied until the 820px breakpoint (where it moves to `left: 280px`). Between 820px and ~1335px it is invisible.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/home-hero.tsx
LINE: 19
ISSUE: `urlFor(page.heroImage.asset).width(900).height(900)` hard-transforms the image to 900×900. The `<Image>` component then applies `fill` + `sizes="856px"`. The forced 900×900 crop may not match the rendered display size on all screens, and `sizes="856px"` is a fixed pixel hint that doesn't adapt on mobile (where the image is hidden via CSS but still fetched via `priority`).
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: yes — heroImage comes from Sanity `homePage` document
---

---
FILE: src/ui/home-hero.tsx
LINE: 31-40
ISSUE: Hero image `<Image>` has `priority` and `fill`, which is correct. However on mobile (≤820px) the `.heroImg` container has `display: none` in the CSS module, yet `priority` causes the browser to still preload this large image over the network. Should conditionally not render the `<Image>` on mobile, or remove `priority` with a media-aware sizes value.
CATEGORY: image-quality-and-performance
SEVERITY: high
CMS-DEP: yes — heroImage from Sanity `homePage`
---

<!-- A1 complete: 50 findings across 18 files -->

## A2 — Property Pages

## A3 — Content Pages

## A4 — Blog
