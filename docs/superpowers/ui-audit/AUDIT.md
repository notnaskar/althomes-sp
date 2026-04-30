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

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 78
ISSUE: Booking bar wrapper uses `bg-white` instead of `bg-background` (cream `#FCF6EA`). `#FFFFFF` is not the background token.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 78
ISSUE: Booking bar has `mx-[96px]` horizontal margin — not a documented spacing token. It also has no `max-[820px]:` responsive variant, so on mobile the bar is clipped/overflows with fixed internal widths (`w-[289px]`, `w-[208px]`).
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 83
ISSUE: `bg-[#5F5D5D]` hardcoded hex on the booking bar divider lines. Should be a token class (e.g. `bg-muted` or a semantic border token).
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 91
ISSUE: `text-black` on "TAXES INCLUDED" label. Should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 95
ISSUE: `text-black` on the price display (`INR {property.priceFrom}`). Should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 112
ISSUE: Intro section uses `pl-[191px] pr-[188px]` — asymmetric, non-standard padding that does not match the `px-[90px]` desktop token. No `max-[820px]:` responsive override, so these wide paddings persist at all viewport sizes.
CATEGORY: spacing-inconsistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 59-65
ISSUE: Hero `<Image>` uses `sizes="1440px"` — a fixed pixel hint. Should use `sizes="100vw"` for a full-bleed fill image. At non-1440px viewports Next.js will still download the 1440px-wide image variant unnecessarily.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 28-30
ISSUE: `urlFor(property.heroImage.asset).width(1440).url()` — no `quality()` call. Defaults to Sanity's internal quality (typically 75). Above-the-fold hero images should specify `quality(85)` or higher for a luxury property site.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 32-34
ISSUE: `urlFor(property.amenitiesSectionImage.asset).width(800).url()` — no `quality()` call. Amenities section image quality not controlled.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 404
ISSUE: Causes section uses `bg-gray-900` and `text-white`. Neither is a design token. Should use `bg-primary text-primary-foreground` or another token-based dark background.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 412
ISSUE: `prose prose-invert` Tailwind Typography plugin classes used in Causes section. Not part of the design token system — prose overrides body text styles with generic defaults that conflict with the custom type scale.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 417
ISSUE: `md:grid-cols-2` on the Causes image grid. Violates the single `max-[820px]:` breakpoint rule. Should be `grid-cols-1 max-[820px]:grid-cols-1` with `min-[821px]:grid-cols-2` or restructured as flex.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 436-437
ISSUE: Reviews section uses `container` utility class (not defined in this design system) and `py-16`. Heading uses `text-3xl font-bold` — not using `font-heading`, `italic`, or the documented type scale (`text-[30px]`, `tracking-[0.3em]`).
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 438
ISSUE: `md:grid-cols-2 lg:grid-cols-3` on the reviews grid — both `md:` and `lg:` breakpoints violate the single `max-[820px]:` rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 444
ISSUE: `text-yellow-400` for star ratings. Should use `text-accent` (`#F2C94C`) to stay within the token system.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 451
ISSUE: `text-gray-700` on review body text. Should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 455
ISSUE: `text-gray-500` on review meta text (guest name, location, date). Should be `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 469
ISSUE: Bottom CTA section uses `bg-black` (not a token) and `text-white`. Should use `bg-primary text-primary-foreground` or another token-pair for the dark CTA background.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 471
ISSUE: Bottom CTA heading uses `text-3xl font-bold md:text-4xl`. Token violations: wrong type scale, `font-bold` instead of `font-heading italic`, and `md:` breakpoint (768px) instead of `max-[820px]:`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 475-480
ISSUE: "FIND AVAILABILITY" button: `bg-white` (not `bg-accent`), `text-black` (not `text-accent-foreground`), `hover:bg-gray-100` (not a token). `rounded-full` diverges from the `rounded-[5px]` button shape used everywhere else on the site.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/our-homes/[slug]/page.tsx
LINE: 404-432
ISSUE: Causes and Reviews sections (7, 8) are entirely unstyled placeholder sections with no design system tokens applied — they use Tailwind defaults (`container`, `prose`, `text-3xl`, `grid`, `md:`, `lg:`, `rounded-2xl`, `text-gray-*`, `text-yellow-*`, `bg-gray-900`, `bg-black`). These sections need full design system alignment before ship.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-gallery-section.tsx
LINE: 25
ISSUE: Gallery section has a fixed `h-[625px]` with no `max-[820px]:` variant. On mobile the gallery will render at 625px tall with all absolutely-positioned children at desktop coordinates — completely broken layout at ≤820px. No mobile layout defined at all.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-gallery-section.tsx
LINE: 27
ISSUE: Main gallery image container is `w-[720px]` fixed — at viewports narrower than 720px it will overflow the screen. No `max-[820px]:` width override.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-gallery-section.tsx
LINE: 27-35
ISSUE: Main gallery `<Img>` (which uses Next.js `<Image>`) has no `sizes` prop specified. `Img` component likely defaults to `sizes="100vw"` or a large default — at 720px rendered width the browser may download unnecessarily large image variants.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-gallery-section.tsx
LINE: 56
ISSUE: Pull quote uses `font-heading` without `italic`. All `font-heading` usage on the site uses `italic` — this is the only instance without it, creating visual inconsistency in the typographic system.
CATEGORY: typography-consistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-experiences-section.tsx
LINE: 44
ISSUE: Mobile horizontal padding is `max-[820px]:px-[24px]` — should be `max-[820px]:px-[18px]` per the design token spec. 24px vs 18px is an inconsistency with every other section's mobile padding.
CATEGORY: spacing-inconsistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-experiences-section.tsx
LINE: 48-53
ISSUE: Background `<Image>` has no `priority` prop and no `quality` prop. A full-bleed section background image (1600px wide) without quality control defaults to Sanity's 75% quality. Should have `quality={85}` at minimum.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/our-homes-hero.tsx
LINE: 49
ISSUE: Three divider `<div>` elements use `bg-[#5F5D5D]` hardcoded hex. Should use a token class such as `bg-muted` or a border token.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/our-homes-hero.tsx
LINE: 24-31
ISSUE: Hero background `<Image>` uses `urlFor(heroBackground.asset).url()` with no `.width()` or `.quality()` calls — fetches the full-resolution Sanity original. Should set `.width(1440).quality(85)` minimum.
CATEGORY: image-quality-and-performance
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/our-homes-cta.tsx
LINE: 27
ISSUE: CTA background `<Image>` uses `urlFor(ctaBackground.asset).url()` with no `.width()` or `.quality()` call — fetches full-resolution original. Should set `.width(1440).quality(85)`.
CATEGORY: image-quality-and-performance
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-showcase.tsx
LINE: 85
ISSUE: Hero image uses `urlFor(heroImage.asset).url()` with no `.width()` or `.quality()`. For a property listing hero that renders at `~55vw` (768fr column), this fetches the full-resolution Sanity original on every page load.
CATEGORY: image-quality-and-performance
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-showcase.tsx
LINE: 133
ISSUE: Secondary showcase image uses `urlFor(showcaseSecondaryImage.asset).url()` with no `.width()` or `.quality()`. Renders at `max-w-[625px]` — should specify `.width(625).quality(85)`.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-showcase.tsx
LINE: 72
ISSUE: Decor image uses `urlFor(showcaseDecorImage.asset).url()` with no `.width()` — fetches full resolution for what is a small decorative overlay element (width driven by CMS `showcaseDecorWidth`). Should constrain with `.width(300)` or similar.
CATEGORY: image-quality-and-performance
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 43
ISSUE: Property grid link uses `md:grid-cols-2` breakpoint — violates the single `max-[820px]:` rule. Should be `grid-cols-1 max-[820px]:grid-cols-1` (or flex column) on mobile, two columns otherwise.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 56
ISSUE: Property title uses `text-3xl font-bold` — not using `font-heading italic` or the documented type scale. Tracking is absent.
CATEGORY: typography-consistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 58
ISSUE: `text-gray-600` on short description. Should be `text-foreground` or `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 34
ISSUE: `text-gray-500` on "no properties available" empty state message. Should be `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 71
ISSUE: CTA button uses `bg-black text-white hover:bg-yellow-600` and `rounded-full`. Token violations: `bg-black` (not `bg-accent`), `text-white` (not `text-accent-foreground`), `hover:bg-yellow-600` (not a token), `rounded-full` (should be `rounded-[5px]`). This is the property card CTA — a critical conversion element.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-search.tsx
LINE: 27
ISSUE: Uses `container` utility class for section wrapper. `container` is not a defined design system primitive in this project — sections should use explicit `px-[90px] max-[820px]:px-[18px]` padding pattern.
CATEGORY: spacing-inconsistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/our-homes/property-showcase.module.css
LINE: 1-16
ISSUE: CSS module is valid and justified — it stores JS-driven CSS custom properties (`--deco-top`, `--deco-right`, `--deco-width`, `--deco-height`, `--deco-rotation`) that cannot be expressed in Tailwind without `style` prop + arbitrary values. The `@media (max-width: 820px)` breakpoint correctly matches the single-breakpoint rule. No hygiene issues.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

<!-- A2 complete: 42 findings across 8 files -->

## A3 — Content Pages

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 1
ISSUE: This file is the OLD top-level experience grid. `src/app/(site)/experiences/page.tsx` imports exclusively from `experiences-updated/experience-grid.tsx`. The top-level `experience-grid.tsx` is dead code — never rendered, never imported. Should be deleted to avoid confusion.
CATEGORY: file-hygiene
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 38-55
ISSUE: Filter chip buttons use `bg-black text-white` (active state) and `bg-white text-black` (inactive state) — all four are token violations. Active should be `bg-primary text-primary-foreground`; inactive should use `bg-background text-foreground` with `border-foreground` hover.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 72
ISSUE: Card grid uses `sm:grid-cols-2 lg:grid-cols-3` — both `sm:` (640px) and `lg:` (1024px) breakpoints violate the single `max-[820px]:` rule. Should be `grid-cols-1 max-[820px]:grid-cols-1` single-column on mobile, and 3-column on desktop without forbidden breakpoints.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 68
ISSUE: Empty-state message uses `text-gray-500` — should be `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 77
ISSUE: Card `<Link>` uses `border-gray-200` and `hover:shadow-md`. No design token for either. Border should use `border-muted` or equivalent token; shadow has no documented token equivalent on this project.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 81-86
ISSUE: Card `<Img>` has no `sizes` prop. At 3-column grid layout the image renders at ~33vw but the component calls `width={600}` with no `sizes`, so Next.js image optimisation cannot choose the right source size. Should add `sizes="(max-width: 820px) 100vw, 33vw"`.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 91
ISSUE: Card title uses `font-bold` — not `font-heading italic`. Experience card headings should use `font-heading italic` per the typography system.
CATEGORY: typography-consistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experience-grid.tsx
LINE: 96
ISSUE: Card description uses `text-gray-600` — should be `text-foreground` or `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-card.tsx
LINE: 48-49
ISSUE: Outer card shell uses `style={{ backgroundColor: 'rgb(227,213,193)' }}` — a hardcoded RGB value for the beige card background. This bypasses the token system entirely. Should be mapped to a CSS custom property or a Tailwind arbitrary class using a defined token (e.g., `bg-[var(--color-card-shell)]`).
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-card.tsx
LINE: 55-57
ISSUE: Image placeholder background uses `style={{ backgroundColor: 'rgb(217,217,217)' }}` — hardcoded grey. Should use a token class (e.g., `bg-muted` or a skeleton token).
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-card.tsx
LINE: 59-66
ISSUE: Card `<Img>` has no `sizes` prop. Card renders at roughly 327px wide in the Figma spec, but inside a 3-column grid the actual rendered size varies. Should add `sizes="(max-width: 820px) 100vw, 360px"` to let Next.js pick the correct variant.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-card.tsx
LINE: 43
ISSUE: Focus ring uses `focus-visible:outline-primary` — `outline-primary` is not a standard Tailwind utility; this will silently produce no outline. Should be `focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-4` using `ring` utilities, e.g., `focus-visible:ring-2 focus-visible:ring-primary`.
CATEGORY: interactive-states
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 27-28
ISSUE: `urlFor(heroBackground.asset).url()` — no `.width()` or `.quality()` call. Fetches full-resolution Sanity original for a full-bleed hero background. Should use `.width(1440).quality(85)` at minimum.
CATEGORY: image-quality-and-performance
SEVERITY: high
CMS-DEP: yes — heroBackground from Sanity `experiencesPage`
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 58
ISSUE: `font-['Playfair_Display']` on the `<h1>` headline — explicit token violation. Must use `font-heading` instead.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 67
ISSUE: `font-['Playfair_Display']` on the supporting tagline `<p>` — same explicit token violation.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 74
ISSUE: `font-['Playfair_Display']` on the leading tagline `<p>` — third instance of the same explicit token violation in the same file.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 90-92
ISSUE: Decorative circle uses `style={{ backgroundColor: 'rgb(203,69,43)' }}` — a brand red-orange value with no design token. If this colour is intentional and recurring it needs a CSS custom property; if one-off it should at least be an arbitrary Tailwind value `bg-[rgb(203,69,43)]` to remain visible in the design system audit trail.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experiences-hero.tsx
LINE: 116-128
ISSUE: SVG arrow inside the decorative circle uses hardcoded `stroke="white"`. On the red-orange background white is technically valid, but the project token equivalent for white-on-dark is `text-primary-foreground` (`#FCF6EA`). Minor but inconsistent.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-grid.tsx
LINE: 136
ISSUE: Filter chevron SVG uses `stroke="rgb(58,58,58)"` — hardcoded RGB for the foreground colour. Should use `currentColor` and apply `text-foreground` on the parent to inherit.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-grid.tsx
LINE: 147
ISSUE: Filter dropdown panel uses `bg-white` — should be `bg-background` (cream `#FCF6EA`). White is not the background token.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/pages/experiences/experiences-updated/experience-grid.tsx
LINE: 191
ISSUE: Card grid is `grid-cols-3` fixed — no intermediate fluid step between 820px and 1440px. At viewport widths just above 820px (e.g. 900px) three columns of `(900px - 180px padding - 64px gaps) / 3 ≈ 219px` may be too narrow for the card proportions. Consider `grid-cols-[repeat(3,minmax(0,1fr))]` or a min content width guard.
CATEGORY: responsiveness
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/experiences/page.tsx
LINE: 1-49
ISSUE: Page is clean — uses only `experiences-updated` components, correct token imports, no violations. No findings.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: yes — page, properties, experiences from Sanity
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 16
ISSUE: Hero section uses `bg-gray-900` — not a design token. Should use `bg-primary` or another token-based dark background.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 28-33
ISSUE: Hero `<h1>` and `<p>` use `text-white font-bold text-5xl md:text-7xl`. Token violations: `text-white` (on dark bg, acceptable, but `text-primary-foreground` is the correct token); `font-bold` instead of `font-heading italic`; `md:` breakpoint (768px) violates single-breakpoint rule; `text-5xl/text-7xl` not from the documented type scale.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 28
ISSUE: `md:text-7xl` breakpoint violation — `md:` (768px) used instead of `max-[820px]:`.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 42
ISSUE: Mission split section uses `container` utility class and `md:grid-cols-2` breakpoint — both violate project rules. `container` is undefined in the design system; `md:` (768px) must be `max-[820px]:`.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 54
ISSUE: Mission text uses `text-gray-700 md:text-2xl`. `text-gray-700` should be `text-foreground`. `md:` breakpoint violation.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 63
ISSUE: Value props section uses `bg-gray-50` — not a token. Should be `bg-background` or another token.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 66
ISSUE: Value prop headline uses `text-3xl font-bold md:text-4xl`. Token violations: `font-bold` not `font-heading`, wrong type scale, `md:` breakpoint.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 70
ISSUE: `md:grid-cols-2` on value props grid — breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 72
ISSUE: Value prop card uses `bg-white rounded-2xl border` — `bg-white` not a token (should be `bg-background`); `rounded-2xl` inconsistent with `rounded-[5px]` used everywhere else.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 77
ISSUE: `text-gray-600` on value prop body text — should be `text-foreground` or `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 108
ISSUE: Promise text uses `font-semibold md:text-3xl` — `md:` breakpoint violation; `font-semibold` is not `font-heading italic`.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 115
ISSUE: Promise CTA button uses `bg-black text-white rounded-full hover:bg-gray-800`. Token violations: `bg-black` (not `bg-accent`), `text-white` (not `text-accent-foreground`), `rounded-full` (not `rounded-[5px]`), `hover:bg-gray-800` (not a token). Critical CTA element.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 125
ISSUE: Stats bar uses `bg-black` — not a token. Should be `bg-primary` or another dark token.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 132
ISSUE: Stats grid uses `grid-cols-2 md:grid-cols-4` — `md:` (768px) breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 158
ISSUE: Reviews section heading uses `text-3xl font-bold` — not `font-heading italic`, wrong type scale.
CATEGORY: typography-consistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 171
ISSUE: Star ratings use `text-yellow-400` — should be `text-accent` (`#F2C94C`) to stay within the token system.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 178
ISSUE: Review body text uses `text-gray-700` — should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 182
ISSUE: Review meta text uses `text-gray-500` — should be `text-muted`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 198
ISSUE: Bottom CTA section uses `bg-gray-50` — not a token. Should be `bg-background` or `bg-primary`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 200
ISSUE: Bottom CTA heading uses `text-3xl font-bold md:text-4xl` — `md:` breakpoint violation; `font-bold` not `font-heading italic`; wrong type scale.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 207
ISSUE: Bottom CTA button uses `bg-black text-white rounded-full hover:bg-gray-800` — same token violations as the Promise CTA above (line 115). All CTA buttons on this page use the wrong token set.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 17-22
ISSUE: Hero `<Img>` has no `quality` prop. Full-bleed 1440px-wide hero background image quality not controlled. Should specify `quality={85}`. Also, `loading="eager"` is used instead of `priority` — for above-the-fold images `priority` is the correct Next.js pattern (it also adds a `<link rel="preload">`).
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: yes — heroBackground from Sanity `altWayPage`
---

---
FILE: src/app/(site)/the-alt-way/page.tsx
LINE: 41-58
ISSUE: This entire page is an unstyled placeholder — every section uses Tailwind defaults (`container`, `bg-gray-*`, `md:`, `lg:`, `text-gray-*`, `font-bold`, `rounded-2xl`, `bg-black`, `bg-white`). None of the design tokens are applied. The page needs a full design pass before ship.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 14
ISSUE: Hero section uses `bg-gray-900` — not a design token. Should be `bg-primary` or token-based dark fallback.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 24
ISSUE: Hero `<h1>` uses `text-white font-bold text-4xl md:text-5xl`. Token violations: `text-white` (should be `text-primary-foreground` on dark bg); `font-bold` not `font-heading italic`; `md:` breakpoint (768px); non-standard type scale.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 24
ISSUE: `md:text-5xl` — `md:` (768px) breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 34
ISSUE: Fallback hero section (no image path) uses `container` and `text-4xl font-bold md:text-5xl`. `container` is not a design system primitive; `md:` breakpoint violation; `font-bold` not `font-heading`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 42
ISSUE: Two-column body uses `container md:grid-cols-2`. `container` not a design system primitive; `md:` (768px) breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 50-52
ISSUE: Contact detail labels (Phone, Email, Office, Follow us) use `text-gray-500 uppercase tracking-wide` — `text-gray-500` should be `text-muted`; tracking should use `tracking-[0.1em]` to match design token.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 55
ISSUE: Phone/email/social links use `hover:text-yellow-600` — should use `hover:text-accent` to stay within the token system.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 83
ISSUE: Office address `<p>` uses `text-gray-600` — should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/contact/page.tsx
LINE: 42
ISSUE: Contact page has no `px-[90px] max-[820px]:px-[18px]` page padding — uses `container` instead. The horizontal padding is completely uncontrolled relative to the design token spec.
CATEGORY: spacing-inconsistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 34-39
ISSUE: Success state uses `bg-green-50 border-green-200 text-green-800` — none are design tokens. Should use `bg-background border-primary text-primary` or a dedicated success token pair.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 55
ISSUE: Form labels use bare `font-semibold text-sm` with no explicit `text-foreground`. Without a token, the label colour inherits from parent context which could be unpredictable. Should add `text-foreground` and `tracking-[0.1em]` per design spec.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 62
ISSUE: Input focus ring uses `focus:ring-black` — should use `focus:ring-primary` to stay within the token system. Same on all inputs and textarea in this file (lines 62, 77, 92, 110).
CATEGORY: interactive-states
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 62
ISSUE: Input uses `rounded-lg` — inconsistent with `rounded-[5px]` used in the partner form and throughout the design system.
CATEGORY: spacing-inconsistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 122
ISSUE: Checkbox uses `border-gray-300 focus:ring-black` — `border-gray-300` should be a token; `focus:ring-black` should be `focus:ring-primary`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 124
ISSUE: Consent label uses `text-gray-700` — should be `text-foreground`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 126
ISSUE: Privacy Policy link uses `hover:text-black` — should be `hover:text-foreground` or `hover:text-primary`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 141
ISSUE: Submit button uses `bg-black text-white rounded-full hover:bg-gray-800` — token violations: `bg-black` (not `bg-accent`), `text-white` (not `text-accent-foreground`), `rounded-full` (not `rounded-[5px]`), `hover:bg-gray-800` (not a token). The submit CTA is the most critical interactive element and it uses zero design tokens.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/contact-form.tsx
LINE: 43-144
ISSUE: The contact form input style (`rounded-lg`, `border`, `px-4 py-3`) is visually inconsistent with the partner form's underline style (`border-0 border-b border-[#5F5D5D] bg-transparent`). The two forms on the same site have completely different visual languages — one boxed, one underline. This inconsistency should be resolved in favour of a single form token pattern.
CATEGORY: spacing-inconsistency
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/availability-form.tsx
LINE: 29-30
ISSUE: `inputClass` uses `bg-white` and `focus:ring-black`. `bg-white` (not `bg-background`); `focus:ring-black` should be `focus:ring-primary`. Consistent violations across all form files.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/availability-form.tsx
LINE: 31-32
ISSUE: `labelClass` uses `text-gray-600` — should be `text-muted` or `text-foreground`. Also uses `tracking-wide` instead of `tracking-[0.1em]`.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/availability-form.tsx
LINE: 88
ISSUE: Submit button uses `bg-black text-white rounded-full hover:bg-gray-800` — same token violations as contact form submit: `bg-black` → `bg-accent`, `text-white` → `text-accent-foreground`, `rounded-full` → `rounded-[5px]`, `hover:bg-gray-800` → token hover.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/partner-form.tsx
LINE: 45
ISSUE: `input` class string uses `border-[#5F5D5D]` and `placeholder:text-[#5F5D5D]/50` — both are hardcoded hex values. `#5F5D5D` has no documented design token alias. Should be mapped to a named token (e.g., `border-muted`, `placeholder:text-muted/50`).
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/partner-form.tsx
LINE: 113
ISSUE: Custom checkbox uses `border border-[#5F5D5D]` — same hardcoded hex as input underlines.
CATEGORY: token-violation
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/forms/partner-form.tsx
LINE: 58
ISSUE: Partner form grid is `grid-cols-2 gap-x-[93px]` with no `max-[820px]:` override. On mobile (≤820px) two columns with `93px` gap will cause inputs to be extremely narrow (e.g. at 390px viewport: `(390px - 36px padding - 93px gap) / 2 ≈ 130px`). Must add `max-[820px]:grid-cols-1` to stack inputs on mobile.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/forms/partner-form.tsx
LINE: 104
ISSUE: Partner form consent/submit area uses `flex-col items-center` centering — visually inconsistent with the left-aligned label-input pairs above it. On mobile this looks detached from the form body.
CATEGORY: layout
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 43
ISSUE: Hero cover image `urlFor(...).width(1440).url()` — no `.quality()` call. Above-the-fold hero image quality not controlled. Should add `.quality(85)`.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: yes — heroImage from Sanity `joinUsPage`
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 43
ISSUE: Hero `<Image>` uses `sizes="1440px"` fixed pixel hint — should use `sizes="100vw"` for a full-bleed fill image.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 53
ISSUE: Hero section has `pl-[194px] pr-[90px]` — asymmetric and non-standard padding. Left padding is 194px, right is 90px (the token value). Should use `px-[90px]` (symmetric) or document the asymmetry as intentional Figma spec.
CATEGORY: spacing-inconsistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 35
ISSUE: Hero section is `h-[470px]` fixed — no `max-[820px]:` variant. On mobile the text layout (`pl-[194px]`) will overflow. The fixed height with deeply inset left content will be broken below 820px.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 53
ISSUE: Hero content uses `gap-[90px] pl-[194px]` with no `max-[820px]:` overrides. At ≤820px this creates a 194px left indent on a ~390px screen leaving only ~106px for the headline — too narrow for a `text-[72px]` heading.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 68
ISSUE: Content section `px-[90px]` is correct for desktop but has no `max-[820px]:px-[18px]` mobile override. All fixed inner content widths (`w-[384px]`, `w-[624px]`) will overflow on mobile.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 69
ISSUE: Content section uses `flex items-start gap-12` with `w-[384px]` and `w-[624px]` fixed-width children. Total content width = 384 + 48 (gap) + 624 = 1056px — at any viewport below 1236px (1056 + 180px padding) this overflows. No `max-[820px]:flex-col` or responsive widths provided.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 117
ISSUE: Form wrapper uses `mx-[192px] bg-white px-[51px]`. `bg-white` should be `bg-background` (cream `#FCF6EA`); the `mx-[192px]` margin has no `max-[820px]:` responsive override, so on mobile the form would have a 192px margin on each side of a ~390px screen, collapsing the form to ~6px wide — completely broken.
CATEGORY: token-violation
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/join-us/page.tsx
LINE: 117
ISSUE: `mx-[192px]` has no `max-[820px]:` mobile override — form is completely broken on mobile viewports.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/app/(site)/[slug]/page.tsx
LINE: 17
ISSUE: Legal page uses `container py-20` wrapper. `container` is not a design system primitive — should use `px-[90px] max-[820px]:px-[18px]` padding.
CATEGORY: spacing-inconsistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/[slug]/page.tsx
LINE: 18
ISSUE: `<h1>` uses `text-4xl font-bold` — not `font-heading italic`; wrong type scale.
CATEGORY: typography-consistency
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/app/(site)/[slug]/page.tsx
LINE: 21
ISSUE: `prose max-w-none` classes use the Tailwind Typography plugin. This is the legal/privacy pages so prose styling may be intentional, but it overrides the design system's type scale. If prose plugin is used site-wide it should be customised to match the design tokens (font-heading, correct colours, tracking).
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/hero.split.tsx
LINE: 9
ISSUE: Anonymous default export — should be a named function `HeroSplit` for dev tools and error trace clarity.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/hero.split.tsx
LINE: 18
ISSUE: `md:grid-cols-2` breakpoint — uses `md:` (768px) instead of the required `max-[820px]:` single breakpoint.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/hero.split.tsx
LINE: 22-25
ISSUE: `image.onRight && 'md:order-last'` and `image.afterContent && 'max-md:order-last'` both use forbidden `md:` / `max-md:` breakpoints.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/hero.split.tsx
LINE: 38
ISSUE: `CTAList` receives `className="max-md:*:w-full"` — `max-md:` (768px) breakpoint violation.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/hero.split.tsx
LINE: 28
ISSUE: `<Img>` has no `sizes` prop. The image renders at up to 50vw (half the 2-column grid) on desktop. Should specify `sizes="(max-width: 820px) 100vw, 50vw"`.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/index.tsx
LINE: 11
ISSUE: Anonymous default export — should be named `ProseModule` for dev tools clarity.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/index.tsx
LINE: 22-23
ISSUE: `toc && 'flex gap-4 max-md:flex-col md:items-start'` — `max-md:` and `md:` breakpoints (768px) violate the single `max-[820px]:` rule. Should be `max-[820px]:flex-col min-[821px]:items-start` or restructured.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/index.tsx
LINE: 29-32
ISSUE: `TableOfContents` receives `className` with `md:sticky-below-header`, `md:w-[20ch]`, and `toc === 'right' && 'md:order-last'` — all use `md:` (768px) breakpoint in violation of the single breakpoint rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/anchored-heading.tsx
LINE: 4
ISSUE: Anonymous default export — should be named `AnchoredHeading`.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/code.tsx
LINE: 9
ISSUE: Anonymous default export — should be named `CodeBlock` or `ProseCode`.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/code.tsx
LINE: 57
ISSUE: `ClickToCopy` receives `!theme.includes('light') && 'text-white'` — conditional `text-white` applied generically based on theme string. Should use `text-primary-foreground` for dark themes rather than `text-white`.
CATEGORY: token-violation
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/image.tsx
LINE: 4
ISSUE: Anonymous default export — should be named `ProseImage`.
CATEGORY: file-hygiene
SEVERITY: low
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/image.tsx
LINE: 8
ISSUE: `max-md:full-bleed` and `md:col-[bleed]!` — both use `md:`/`max-md:` (768px) breakpoints in violation of the single `max-[820px]:` rule.
CATEGORY: responsiveness
SEVERITY: high
CMS-DEP: no
---

---
FILE: src/ui/modules/prose/image.tsx
LINE: 9
ISSUE: `<Img>` uses `width={900}` with no explicit `sizes` prop. For a prose image rendered inside a `max-w-3xl` container (~768px), `sizes="(max-width: 820px) 100vw, 768px"` would be correct.
CATEGORY: image-quality-and-performance
SEVERITY: medium
CMS-DEP: no
---

<!-- A3 complete: 82 findings across 16 files -->

## A4 — Blog
