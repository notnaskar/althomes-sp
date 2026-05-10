# Staging f107737 — Post-Merge Fix Plan

**Date:** 2026-05-10
**Author:** Akash + Claude
**Status:** Approved, awaiting implementation plan
**Related commit:** `f107737` (Sanity webhook revalidation + ISR + UI polish)

---

## 1. Background

Code review of staging commit `f107737` surfaced 9 issues plus 1 follow-up (`getAllProperties` cache consistency). They cluster into three risk tiers: critical correctness/security, perf, and polish. This spec lays out the fixes as three sequential, independently-revertable PRs.

Two prior items were ruled out of scope:
- **Rate limit on `/api/revalidate`** — low real-world risk; HMAC-protected, no platform abuse seen. Defer until evidence.
- **`getSite` token leak via `cache()`** — non-issue on re-examination. `cache()` is per-request RSC memo; token never crosses server boundary. Drop.

---

## 2. Goals

1. Eliminate one cache-invalidation correctness bug that silently delays blog publishes.
2. Stop shipping the Sanity read token to public visitors via `<SanityLive />`'s `browserToken`.
3. Restore visible focus on the partner-form consent checkbox (WCAG 2.4.7).
4. Improve homepage LCP and reduce font/network bloat.
5. Remove duplicate footer DOM and the header scroll-state flash on mid-page reload.

---

## 3. Non-goals

- Application-level rate limiter on `/api/revalidate`.
- Multi-instance distributed debounce for webhook flushes.
- Redesign of the Sanity Studio font dropdown (we are removing it entirely).
- New Sanity webhook config — assume existing webhook from f107737 keeps working with `_type` projection unchanged.
- RentalWise, Resend, or any module outside the listed files.

---

## 4. Constraints

- Next.js 16.2.4 + Tailwind 4 + Sanity v3, hosted on Hetzner via Coolify.
- `output: 'standalone'` must remain in `next.config.ts`.
- `<SanityLive />` must keep working in draft mode for Studio editors; live updates for public visitors are explicitly dropped.
- Schema changes must round-trip through `npm run typegen` cleanly.

---

## 5. Architecture

Three PRs land in order. Each is mergeable on its own; later PRs do not depend on earlier ones at the file level (only at the deployment-state level).

```
PR1 hotfix          PR2 perf                   PR3 polish
├ data.ts (#1)      ├ home-hero.tsx (#3)       ├ footer/index.tsx (#5)
├ live.ts (#2B)     ├ hero-decor-image (#3b)   └ header-shell.tsx (#6)
├ layout.tsx (#2A)  ├ layout.tsx (#7,#8,#9)
└ partner-form (#4) ├ app.css (#8)
                    ├ site.ts schema (#8)
                    └ data.ts (#2.7)
```

PR1 is correctness + security only. PR2 is the perf bundle. PR3 is the visual/a11y polish that's lowest urgency.

---

## 6. PR1 — Hotfix (correctness + security)

### 6.1 Blog cache tag mismatch (#1)

**File:** `src/sanity/lib/data.ts`

**Change:**
```ts
// getAllPosts (line ~117)
tags: ['blog.post'],

// getPostBySlug (line ~125)
tags: ['blog.post', `blog.post:${slug}`],
```

**Why:** Sanity webhook emits `body._type === 'blog.post'` (matches schema doc name), so the route currently writes `revalidateTag('blog.post', 'default')`. The data layer was tagging cache entries `'post'`, so blog publishes never invalidate. Aligning data.ts with the canonical `_type` string is the safer half of the fix (avoids touching the webhook contract).

**Verification:** publish a blog post on staging, confirm webhook log shows tag `blog.post`, confirm staging blog page reflects edit within ~3 s.

### 6.2 SanityLive token leak + bundle (#2)

**Goal:** stop shipping `SANITY_API_READ_TOKEN` and the next-sanity live websocket client to public visitors.

**Two-layer fix:**

**Layer A — gate the component.**
`src/app/(site)/layout.tsx` — render `<SanityLive />` only when draft mode is active.

```tsx
import { draftMode } from 'next/headers'

const isDraft = (await draftMode()).isEnabled
// ...
{isDraft && <SanityLive />}
```

**Layer B — drop `browserToken` from prod config.**
`src/sanity/lib/live.ts` — remove `browserToken: token`. `serverToken: token` stays.

```ts
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({ apiVersion: '2025-10-23' }),
  serverToken: token,
})
```

**Trade-off accepted:** Studio editors lose websocket-driven live preview while in draft mode. They get fresh content on hard reload. Worth it vs token exposure to all visitors.

**Verification:**
- Network tab on prod homepage: no `wss://` connection, no `cdn.sanity.io` traffic from browser, no `SANITY_API_READ_TOKEN` substring in any chunk (`grep` the built `.next/static`).
- Draft mode at `/api/draft-mode/enable`: VisualEditing overlay still renders.

### 6.3 Partner form focus (#4)

**File:** `src/ui/forms/partner-form.tsx` (line 200)

**Change:** swap `focus:ring-0` for a focus-visible ring.
```tsx
className="border-foreground/40 text-foreground/70 mt-[6px] h-3.5 w-3.5 rounded-[5px] bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
```

**Audit:** `src/ui/forms/contact-form.tsx` for any matching `focus:ring-0` on its consent checkbox; same fix if present.

**Verification:** keyboard tab to `pf-consent` → visible 2px ring. Mouse-click → no ring (focus-visible suppresses on pointer).

### 6.4 PR1 verification gate

- `npm run build` passes.
- `npm run typecheck` passes.
- Manual webhook smoke test on staging.
- Manual a11y check on partner form.
- Bundle audit confirms no `SANITY_API_READ_TOKEN` in client output.

---

## 7. PR2 — Performance

### 7.1 Hero image (#3)

**File:** `src/ui/home-hero.tsx`

**Change:**
```ts
const imageUrl = page.heroImage?.asset
  ? urlFor(page.heroImage.asset).width(1920).auto('format').url()
  : null
```

```tsx
<Image
  src={imageUrl}
  alt={page.heroImage?.alt ?? ''}
  fill
  priority
  sizes="(max-width: 768px) 100vw, 1024px"
  quality={80}
  className="object-cover"
/>
```

**Why:** width(900) caps source resolution → blurry at >900 px display. width(1920) gives Next's optimizer headroom; `sizes` lets it pick the right responsive size; `quality={80}` balances LCP vs sharpness. `priority` already emits the preload link tag.

### 7.2 Decor image widths (#3b)

**File:** `src/ui/molecules/hero-decor-image.tsx`

**Change:**
```ts
const url = urlFor(asset.asset).width(1200).auto('format').url()
```

Pass `quality={70}` on the `<Image>` element.

**Why:** current code requests Sanity originals (potentially 4K PNGs). Cap source size + drop quality on non-LCP decor.

### 7.3 ISR fallback (#7)

**File:** `src/app/(site)/layout.tsx` (line 30)

```ts
// ISR safety net: re-render every 30 min if no webhook revalidation arrived.
// Webhook (POST /api/revalidate) handles instant invalidation on Sanity publish.
export const revalidate = 1800
```

**Why:** webhook is real-time; 5-min fallback is overkill and burns Sanity bandwidth. 30 min keeps the safety net without idle cost.

### 7.4 Font cull (#8)

**Active fonts:** Playfair Display (heading), Poppins (body), a-day-without-sun (local — `font-stories`). Drop the other 8 Google fonts.

**File 1:** `src/app/(site)/layout.tsx` — remove imports + invocations of `Geist`, `Inter`, `DM_Sans`, `Plus_Jakarta_Sans`, `Lora`, `Libre_Baskerville`, `Cormorant_Garamond`, `JetBrains_Mono`, `Space_Mono`. Keep `Playfair_Display`, `Poppins`, `aDayWithoutSun`.

`ALL_FONT_CLASSES` reduces to 3 entries.

`FONT_VAR_MAP` and the `themeCSS` font branches are removed (CMS no longer drives fonts; see schema change).

**File 2:** `src/sanity/schemaTypes/documents/site.ts` — remove the `fonts` field group (lines ~302-353) and the `fonts` group definition (line 15).

**File 3:** `src/app.css` — keep existing fallback chain:
```css
--font-sans: var(--font-poppins, 'Poppins', system-ui, sans-serif);
--font-heading: var(--font-playfair-display, 'Playfair Display', serif);
--font-stories: var(--font-a-day-without-sun, serif);
```

**Migration risk:** existing site doc may have `fonts: { body: 'geist', heading: 'geist', mono: 'jetbrains-mono' }` stored. After schema removal, those fields become orphans on the document. TypeGen drops them from the type. No runtime breakage — layout no longer reads `site.fonts`. Optional follow-up: one-shot Sanity patch to delete the orphan field.

**`themeCSS` simplification:** layout.tsx still injects `<style>` for color tokens. Drop the `--font-sans/--font-heading/--font-mono` branches from `rawVars`. Keep colour vars.

### 7.5 Drop preconnect (#9)

**File:** `src/app/(site)/layout.tsx` (line 139)

Remove:
```ts
preconnect('https://cdn.sanity.io')
```

**Why:** every Sanity image is rendered via `<Image>` which routes through `/_next/image?url=...` — same origin. The browser never connects to `cdn.sanity.io`. Preconnect is dead weight.

### 7.6 `getAllProperties` cache wrapper (#2.7)

**File:** `src/sanity/lib/data.ts`

**Change:**
```ts
export const getAllProperties = cache(async () => {
  return await sanityFetchLive<ALL_PROPERTIES_QUERY_RESULT>({
    query: ALL_PROPERTIES_QUERY,
    tags: ['property'],
  })
})
```

**Why:** consistency with `getSite`. Footer + `/our-homes` both call it; React `cache()` dedupes within a render. Trivial gain but matches existing pattern.

### 7.7 PR2 verification gate

- `npm run build` + `npm run typegen` pass.
- Lighthouse on `/` before/after — capture LCP, TBT, total transferred bytes.
- Network tab on `/`: only Playfair + Poppins (+ a-day-without-sun) font requests; no Geist/DM_Sans/etc.
- Hero `<img srcSet>` on a 1440 px viewport: includes a >1024 px candidate.
- No regression on `/our-homes`, `/experiences`, `/blog` (typography still renders).
- Studio loads without crashing on the missing `fonts` field.

---

## 8. PR3 — Polish

### 8.1 Footer DOM duplication (#5)

**File:** `src/ui/footer/index.tsx`

**Goal:** single render of each link section. Layout switches via CSS only.

**Approach:** CSS Grid with named template areas at 3 breakpoints.

```tsx
<footer className="bg-primary text-primary-foreground">
  <div
    className="
      grid gap-7 px-6 py-[30px]
      [grid-template-areas:'brand_connect''ourhomes_ourhomes''about_about''policies_policies']
      [grid-template-columns:1fr_auto]
      max-[480px]:[grid-template-areas:'brand''connect''ourhomes''about''policies']
      max-[480px]:[grid-template-columns:1fr]
      xl:gap-16 xl:px-[90px] xl:pt-[37px] xl:pb-[30px]
      xl:[grid-template-areas:'brand_ourhomes_about_policies_connect']
      xl:[grid-template-columns:auto_1fr_auto_auto_auto]
    "
  >
    <div className="[grid-area:brand]">{brand}</div>
    {ourHomes && <div className="[grid-area:ourhomes]">{ourHomes}</div>}
    {about && <div className="[grid-area:about]">{about}</div>}
    {policies && <div className="[grid-area:policies]">{policies}</div>}
    <div className="[grid-area:connect]">{connect}</div>
  </div>
</footer>
```

**Visual QA matrix:** 360 px, 480 px, 768 px, 1024 px, 1280 px, 1440 px.

**Fallback if grid template areas turn out fragile across breakpoints:** keep the existing two-div structure but add `aria-hidden="true"` to the visually-hidden side. Worse for SEO (DOM still has duplicates) but eliminates the a11y duplicate-link concern. Use only if the grid attempt has visual regressions we can't quickly resolve.

### 8.2 HeaderShell scroll flash (#6)

**File:** `src/ui/header/header-shell.tsx`

**Approach:** read `window.scrollY` in a layout effect so the correct background paints before the user sees the first frame.

```tsx
'use client'
import { useEffect, useLayoutEffect, useState } from 'react'

const useIsoLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function HeaderShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false)

  useIsoLayoutEffect(() => {
    setScrolled(window.scrollY > 4)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={...}>{children}</header>
  )
}
```

**Why:** SSR returns `scrolled=false`; React hydrates matching that. Layout effect fires synchronously after commit, before browser paint, correcting the value if the page already scrolled. No hydration warning.

### 8.3 PR3 verification gate

- View source on `/`: count of `OUR HOMES` h4 = 1.
- Visual QA at 360 / 480 / 768 / 1024 / 1280 / 1440 px.
- DevTools "slow 3G" + "disable cache" + scroll mid-page + hard reload: no transparent header flash.
- Tab order: header → main → footer with no broken focus stops.
- A11y: axe-core scan, no new violations.

---

## 9. Data flow

No new data flows introduced. Existing flows touched:

- **Sanity webhook → `/api/revalidate`** — unchanged. Tags now actually match cache keys for blog (PR1 #6.1).
- **`getSite` / `getAllProperties` → React `cache()` → `sanityFetchLive` → live-actions → live.ts → Sanity client** — unchanged except `getAllProperties` gains the `cache()` wrapper.
- **Theme variables: site doc → layout `themeCSS` → CSS custom properties** — fonts removed from this chain; colours unchanged.

---

## 10. Error handling

No new failure modes:

- Layer A of #6.2: `draftMode()` is a server-only fn; errors propagate as 500 — same as today.
- Layer B of #6.2: removing `browserToken` is a config-only change; no runtime failure path added.
- PR2 hero image: `urlFor(...).width(1920)` — Sanity rejects invalid widths with a CDN error; existing null guard catches missing asset.
- PR3 footer grid: pure CSS; degrades gracefully if `grid-template-areas` unsupported (we ignore IE11).

---

## 11. Testing

**Per-PR manual checklists are inlined in §6.4, §7.7, §8.3.**

**Automated coverage:**
- Existing Vitest suite (49 tests) must stay green across all three PRs.
- No new unit tests proposed — every change is config, layout, or single-line tag string. The risk surface is verified by manual smoke + Lighthouse runs.

**Lighthouse baseline:** capture LCP, TBT, total bytes on `/` BEFORE PR2 lands. Capture again after. Attach screenshots to PR2 description.

---

## 12. Rollback

Each PR is a single git commit:

- **PR1 revert:** restores blog stale-cache + token leak. Acceptable mid-term; user-facing impact = blog edits delayed up to ISR window, focus invisible.
- **PR2 revert:** restores blurry hero, 11 fonts, 5-min ISR. Site functional.
- **PR3 revert:** footer DOM duplicate returns; header flash returns. Pure UX/SEO regression, no breakage.

Rollback procedure: `git revert <sha>` on `staging`, push, redeploy via Coolify.

---

## 13. Out-of-scope follow-ups

Open issues to file in the backlog after PR3 lands:

1. **`/api/revalidate` rate limit** — add per-tag in-memory debounce if abuse seen, or move webhook origin behind Cloudflare.
2. **Sanity webhook config audit** — confirm projection includes `slug` for all sluggable types (`legalPage`, `property`, `blog.post`); without it, slug-scoped tags silently no-op.
3. **`getHomePage`/`getOurHomesPage`/etc. cache wrapping** — apply `cache()` consistently across all data fns called more than once per render.
4. **Decor image deferred load** — investigate `requestIdleCallback`-style deferral so decor doesn't compete with hero for bandwidth.
5. **Sanity site doc cleanup** — one-shot patch to remove orphan `fonts` field after PR2 ships.
6. **Sub-480 px footer responsive QA** — if PR3 grid approach needs adjustment.

---

## 14. Open questions

None. All decisions captured in the brainstorm.

---

## 15. Approval

User approved the scope and design on 2026-05-10 across three checkpoints (PR1 / PR2 / PR3). Out-of-scope items confirmed: `getSite` cache leak (non-issue), `/api/revalidate` rate limit (defer), `getAllProperties` wrapper (added to PR2).

Next step: writing-plans skill produces a per-PR implementation plan.
