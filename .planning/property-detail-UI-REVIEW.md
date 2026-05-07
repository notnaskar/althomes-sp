# Property Detail Page — UI Review

**Audited:** 2026-04-30
**Baseline:** Abstract 6-pillar standards + UI_GUIDELINES.md design system
**Screenshots:** Not captured (dev server detected at localhost:3000 but property slug unknown; code-only audit performed)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | CTA labels are intentional and on-brand; booking bar uses placeholder static text instead of real date inputs |
| 2. Visuals | 2/4 | Specs strip has 4 empty placeholder divs with no icons; page has no `<h1>` — property title never renders |
| 3. Color | 2/4 | Lower sections (Experiences, Amenities, Reviews, Bottom CTA) use raw Tailwind grays and black/white instead of design tokens |
| 4. Typography | 2/4 | Split personality: Figma sections use arbitrary px sizes; legacy lower sections use `text-3xl font-bold` with no tracking, mixing two type systems |
| 5. Spacing | 3/4 | Figma sections correctly use pixel-precise arbitrary values; lower sections switch to standard Tailwind scale inconsistently |
| 6. Experience Design | 2/4 | No loading/skeleton states anywhere; booking bar is purely cosmetic (no interactivity); no `<Suspense>` boundary |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **Property title `<h1>` is missing from the page** — Search engines and screen readers have no primary heading; the property name never appears on the page — Add `<h1 className="font-heading italic text-[30px] tracking-[0.1em] text-foreground">{property.title}</h1>` inside the hero overlay or directly below it.

2. **Specs strip icons are empty divs** — Four `<div className="h-[46px] w-[46px]" />` render as invisible whitespace; the visual row of beds/baths/guests/type communicates nothing visually — Wire actual SVG icon components (or Sanity-sourced icon images from each amenity's `icon` field) or replace with the `<Icon>` atom from `src/ui/atoms/icon.tsx`.

3. **Sections below Highlights use a different design system** — Experiences (lines 373–418), Amenities (421–458), Causes (461–492), Reviews (495–525), and Bottom CTA (529–541) use `bg-gray-50`, `bg-gray-900`, `text-gray-600`, `text-gray-700`, `rounded-xl`, `rounded-2xl`, `border-2 border-black`, `bg-black` — none of which are AltHomes design tokens — Replace all with token equivalents: `bg-background`, `text-foreground`, `bg-primary text-primary-foreground` for the Causes section, `bg-accent text-accent-foreground` for the bottom CTA button, and remove arbitrary `rounded-xl/2xl` in favour of `rounded-[5px]`.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Passing:**
- `BOOK NOW` (line 98) — intentional, uppercase, on-brand for a luxury booking CTA.
- `FIND AVAILABILITY` (line 539) — bottom CTA label is clear and action-oriented.
- `FIND US ON THE MAP` fallback (line 231) — good descriptive default.
- `WHAT'S ON THE MENU?` fallback (line 354) — brand-voice appropriate.
- `WHAT'S WAITING FOR YOU?` section heading (line 244) — editorial, on-brand.
- `notFound()` is called when property is null (line 19) — correct 404 handling.

**Issues:**
- **Booking bar static text (line 75):** `Check In &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Check Out` is a visual placeholder using non-breaking em-spaces instead of real date pickers or even labelled input slots. The bar has no interactivity — it links to `#booking` which points back to the Intro section (`id="booking"` is on the intro section, line 104), not an actual booking widget. This copy is misleading.
- **`TAXES INCLUDED` (line 85):** Rendered at `text-[9px]` — this is below any readable threshold and may be legally meaningful copy. Consider `text-[11px]` at minimum.
- **`View All Experiences` (line 413):** The only sentence-case CTA on the page. All other CTAs are uppercase. Change to `VIEW ALL EXPERIENCES` for consistency.
- **`What Our Guests Say` (line 497):** Sentence case heading when every other section heading uses all-caps or title case with wide tracking. Normalise to `WHAT OUR GUESTS SAY` with `tracking-[0.3em]`.

---

### Pillar 2: Visuals (2/4)

**Passing:**
- Full-bleed hero image with correct `fill` + `sizes="1440px"` + `priority` (lines 53–61).
- Gallery section has clear focal hierarchy: large main image left, secondary + quote right.
- Decorative image overlaps (showcaseDecorImage, highlights decorImage) add visual depth matching Figma collage style.
- No raw `<img>` tags found — all images go through `next/image` or `Img` wrapper.
- Gallery prev/next buttons have `aria-label` attributes (lines 78, 88).

**Issues:**
- **No `<h1>` on the page.** The property `title` field is never rendered anywhere in the markup. The hero section shows only a `tagline` (line 65) in 12px all-caps. The property name — the single most important piece of identity on the page — is invisible. This is a critical visual and SEO gap.
- **Specs strip: 4 empty icon divs (lines 130, 138, 146, 154).** Each spec item has `<div className="h-[46px] w-[46px]" />` which renders nothing. Users see only labels with blank space above them. The icons are the visual anchor for this strip.
- **Booking bar is decorative only.** The bar renders "Check In / Check Out / Guests" as static `<p>` text with underlines drawn as `<div>` borders. There are no `<input>` elements, no date pickers, no guest selector. This is a significant user expectation gap — it looks interactive but is not.
- **`book now` button scrolls to the intro section** (`href="#booking"` → `id="booking"` on the intro `<section>` at line 104), not to a booking widget. The user clicks a booking CTA and lands on descriptive copy.
- **Highlights Row 2 image overlap (lines 286–296):** Two images from highlights[1] and highlights[2] are absolutely positioned at `top-0` and `top-[10px]` with `opacity-80` on the second — this will visually merge them. If either image is missing, the section still renders an empty grey box.
- **Lower sections break the editorial aesthetic.** Experiences cards use `rounded-xl border bg-white hover:shadow-md` — standard SaaS card styling. Amenity items use `rounded-xl border p-4`. These are visually incompatible with the pixel-precise luxury layout of sections 1–5.

---

### Pillar 3: Color (2/4)

**Passing:**
- Hero overlay text uses `text-white` correctly — it is over a guaranteed-dark image (line 64). UI_GUIDELINES explicitly permits `text-white` on dark overlays.
- Gallery section, Highlights section, Location section, and Intro section all use `text-foreground` and `bg-background` consistently.
- Booking button correctly uses `bg-accent text-accent-foreground` (line 96).
- No hardcoded color hex values in the gallery component.

**Issues:**
- **`bg-[#5F5D5D]` hardcoded on booking bar dividers (lines 77, 81).** This is a non-token gray used for the `h-px` underlines. The nearest token is `text-muted` (`#D0D0D0`) or `text-foreground` (`#3A3A3A`). Replace with `bg-foreground` or `bg-muted`.
- **`text-black` used in booking bar (lines 85, 89).** UI_GUIDELINES flags `text-black` as forbidden — use `text-foreground` instead. These two instances are in the price display area.
- **`bg-white` on the booking bar container (line 72).** The design token for white/cream is `bg-background` (`#FCF6EA`). Pure `bg-white` (`#FFFFFF`) will look different against the cream page background.
- **Lower sections use raw Tailwind grays throughout:**
  - `bg-gray-50` (line 373) — Experiences section background
  - `bg-gray-900 text-white` (line 464) — Causes section
  - `text-gray-600` (line 400) — Experience card body text
  - `text-gray-700 italic` (line 511) — Review quote text
  - `text-gray-500` (line 515) — Review metadata
  - `bg-black text-white` (line 529) — Bottom CTA section
  - `bg-white` / `hover:bg-gray-100` (line 537) — Bottom CTA button
  - `border-2 border-black text-black` (line 411) — View All Experiences button
  These are all off-token. The token palette has `bg-primary` (dark green) and `bg-accent` (yellow) for high-contrast sections — the Causes and Bottom CTA sections should use these.

**Token usage count:** `text-foreground` / `bg-background` appear 27 times (primarily in sections 1–5). The lower 5 sections have approximately 0 token usages.

---

### Pillar 4: Typography (2/4)

**Passing:**
- Figma sections use `font-sans text-[15px] leading-[23px] tracking-[0.1em]` as a consistent body text pattern — this matches UI_GUIDELINES precisely.
- `font-heading` is used for Playfair Display headings (lines 112, 242) and the gallery quote (gallery-section line 56).
- Uppercase CTA labels use `tracking-[0.3em]` consistently (lines 96, 229, 352).

**Issues — Two type systems co-exist in one page:**

**System A (Figma, sections 1–5):**
- Body: `font-sans text-[15px] leading-[23px] tracking-[0.1em]`
- Display: `font-heading text-[30px] leading-[40px] tracking-[0.1em]`
- CTA: `font-sans text-[12px] font-semibold tracking-[0.3em]`
- Sizes: `text-[9px]`, `text-[12px]`, `text-[15px]`, `text-[30px]`

**System B (legacy, sections 5–9):**
- `text-3xl font-bold` — used on 5 different `<h2>` elements (lines 375, 425, 467, 497, 531)
- `text-lg font-bold` — experience card titles (line 397)
- `text-sm text-gray-600` — experience card body (line 400)
- `md:text-4xl` — bottom CTA heading uses an `md:` breakpoint (line 531), but the project uses a single `max-[820px]:` breakpoint system, not Tailwind's default `md:`

**Distinct font sizes found:** `text-[9px]`, `text-[12px]`, `text-[15px]`, `text-[30px]`, `text-sm`, `text-lg`, `text-xl`, `text-3xl`, `text-4xl` — 9 distinct sizes. The guideline flags >4 as a concern. The 5 legacy sizes (`sm`, `lg`, `xl`, `3xl`, `4xl`) should be replaced with the pixel-precise equivalents used in System A.

**Font weights found:** `font-normal` (1), `font-medium` (5), `font-semibold` (8), `font-bold` (14) — 4 distinct weights. Technically within the abstract standard but `font-bold` appears 14 times, almost exclusively in legacy sections.

**`font-heading` is never italic (lines 112, 242, gallery line 56).** UI_GUIDELINES states: "Display text is always italic Playfair Display." None of the three `font-heading` usages include `italic`. This breaks the brand's editorial voice.

---

### Pillar 5: Spacing (3/4)

**Passing:**
- Pixel-precise Figma sections (1–5) use consistent arbitrary values that match the layout spec: `pl-[191px] pr-[188px]` (intro), `px-[90px]` (highlights, matching the page horizontal padding token in UI_GUIDELINES), `gap-[26px]`, `gap-[28px]`, `gap-[44px]`.
- Gallery section uses `gap-[42px]` and `h-[625px]` which are clearly spec-derived values.
- Location section has logical column widths: `w-[576px]` + `w-[435px]` filling ~1440px at standard padding.

**Issues:**
- **Booking bar uses `mx-[96px]` and `px-[48px]` (line 72).** The UI_GUIDELINES page horizontal padding token is `px-[90px]`. The booking bar uses a different value (`96px` margin + `48px` padding) that does not align with the page grid. This will cause the booking bar edges to sit at different positions than every other section.
- **`pl-[191px] pr-[188px]` on the Intro section (line 107)** — asymmetric padding (191px vs 188px). This is likely a Figma measurement artefact but is semantically odd; both values should match or use the standard `px-[90px]` with internal flex layout.
- **Lower sections mix spacing scales:** `py-16`, `p-5`, `p-4`, `p-6`, `px-8`, `py-3` — standard Tailwind scale. Figma sections use `py-[48px]`, `py-[72px]` etc. This is a real inconsistency when both systems appear on one scroll.
- **`gap-[3px]` on specs strip items (lines 129, 137, 145, 153)** — 3px gap between the empty icon div and label text. With the icon being invisible, this gap is invisible too, but once icons are added this will look very tight. Use `gap-[8px]` at minimum.

---

### Pillar 6: Experience Design (2/4)

**Passing:**
- `notFound()` correctly called when property is null (line 19) — renders Next.js 404 page.
- All content fields are conditionally rendered — sections with no CMS data are hidden (no empty ghost sections).
- Gallery component guards `total === 0` and returns null (gallery-section line 16).
- Gallery prev/next buttons have correct `aria-label` attributes (lines 78, 88).
- `cappedExperiences` and `cappedReviews` respect `experiencesMaxShown` / `reviewsMaxShown` caps.
- Schema.org JSON-LD is injected for SEO (lines 30–48).

**Issues:**
- **No loading states anywhere.** The page is a Server Component and fetches `getProperty()` + `getSite()` before rendering. There is no `<Suspense>` boundary and no skeleton. If either fetch is slow (RentalWise availability fetch, cold Sanity edge), the user sees a blank white screen until the entire page resolves.
- **Booking bar is fully non-functional (lines 72–101).** "Check In / Check Out / Guests" are static `<p>` elements — not inputs. The `BOOK NOW` button is an `<a href="#booking">` that scrolls to the Intro section. There is no booking flow, no RentalWise availability widget, no date picker. For a luxury property booking site this is the primary user action — its absence is the highest-impact experience gap.
- **`<details>/<summary>` for House Rules (lines 446–456)** — The HTML details element has inconsistent cross-browser styling. The `<summary>` text uses `text-lg font-bold` (System B typography) and `hover:bg-gray-50` (off-token). Consider replacing with a styled accordion component.
- **`<a href="..." target="_blank">` without keyboard focus indicator** on the Location CTA (line 225) and menu CTA (line 348). Both use `hover:opacity-70` but no visible `:focus-visible` ring.
- **No `<Suspense>` wrapping the page or its sections.** The `cappedExperiences` and `cappedReviews` data comes from the same `getProperty()` query — if the property has 20 reviews and 6 experiences, they all block the initial paint. Adding `<Suspense fallback={<div className="h-32 bg-muted/20 animate-pulse rounded-[5px]" />}>` around the lower sections would improve perceived performance.
- **Highlight images at `opacity-80` overlap (lines 292–295):** If `highlights[1].image` is present but `highlights[2].image` is not, only the first image renders — this is handled. But if both exist, image 2 renders at 80% opacity on top of image 1 at `top-[10px]` offset. This creates a near-identical blur effect that may confuse users into thinking the image is loading incorrectly.

---

## Files Audited

- `/Users/akashnaskar/Desktop/Projects/althomes-sanitypress/althomes-sp/src/app/(site)/our-homes/[slug]/page.tsx` — 564 lines, primary page component
- `/Users/akashnaskar/Desktop/Projects/althomes-sanitypress/althomes-sp/src/ui/pages/our-homes/property-gallery-section.tsx` — 97 lines, gallery/carousel component
- `/Users/akashnaskar/Desktop/Projects/althomes-sanitypress/althomes-sp/src/ui/UI_GUIDELINES.md` — design system reference
- `/Users/akashnaskar/Desktop/Projects/althomes-sanitypress/althomes-sp/src/sanity/schemaTypes/documents/property.ts` — schema reference (field availability)

Registry audit: shadcn not initialised (`components.json` absent) — skipped.
