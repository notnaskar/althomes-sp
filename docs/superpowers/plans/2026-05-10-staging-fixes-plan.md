# Staging f107737 Fix — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Land 9 fixes from the f107737 post-merge review across three sequential, independently-revertable PRs.

**Architecture:** Three phases match three PRs. Phase 1 is correctness/security hotfix. Phase 2 is the perf bundle (LCP, fonts, ISR, preconnect, cache wrapper). Phase 3 is footer DOM dedup + header scroll-flash polish. Each phase has its own verification gate and is mergeable on its own.

**Tech Stack:** Next.js 16.2.4 (App Router, webpack), Tailwind 4, Sanity v3, next-sanity 12, TypeScript, Vitest.

**Spec:** `docs/superpowers/specs/2026-05-10-staging-fixes-design.md` (commit `c8be0f9`).

**Testing note (from spec §11):** every change is a config edit, single-line tag string, or layout tweak. The existing 49-test Vitest suite must stay green; no new unit tests are introduced. Verification is per-phase manual gates (Lighthouse, network audit, visual QA).

---

## File Structure

| Phase | File | Action | Responsibility |
|-------|------|--------|----------------|
| 1 | `src/sanity/lib/data.ts` | Modify | Tag string `post` → `blog.post` (lines 117, 125) |
| 1 | `src/sanity/lib/live.ts` | Modify | Drop `browserToken` from `defineLive` config |
| 1 | `src/app/(site)/layout.tsx` | Modify | Gate `<SanityLive />` behind `draftMode` |
| 1 | `src/ui/forms/partner-form.tsx` | Modify | Replace `focus:ring-0` with focus-visible ring |
| 1 | `src/ui/forms/contact-form.tsx` | Modify (audit) | Same focus fix if same pattern present |
| 2 | `src/ui/home-hero.tsx` | Modify | Hero `width(1920)` + `sizes` + `quality={80}` |
| 2 | `src/ui/molecules/hero-decor-image.tsx` | Modify | Decor `width(1200)` + `quality={70}` |
| 2 | `src/app/(site)/layout.tsx` | Modify | `revalidate=1800`, font cull, drop preconnect, drop `themeCSS` font branches |
| 2 | `src/sanity/schemaTypes/documents/site.ts` | Modify | Remove `fonts` field group + group definition |
| 2 | `src/app.css` | Verify | Keep existing fallback chain (no edit unless drift) |
| 2 | `src/sanity/lib/data.ts` | Modify | Wrap `getAllProperties` with React `cache()` |
| 3 | `src/ui/footer/index.tsx` | Modify | Single-render footer with CSS Grid template areas |
| 3 | `src/ui/header/header-shell.tsx` | Modify | `useLayoutEffect` for pre-paint scroll read |

---

## Pre-flight (run once at start of each phase)

- [ ] **Confirm clean working tree on `staging` branch**

```bash
git status --short
git rev-parse --abbrev-ref HEAD
```
Expected: `staging`, no unrelated modified files.

- [ ] **Confirm baseline build is green**

```bash
npm run build
```
Expected: `Compiled successfully`. If this fails, stop — do not start the phase.

---

# Phase 1 — PR1 Hotfix (correctness + security)

**Branch:** `fix/f107737-hotfix-1-blog-cache-and-token-leak`

```bash
git checkout staging
git pull origin staging
git checkout -b fix/f107737-hotfix-1-blog-cache-and-token-leak
```

---

### Task 1.1: Fix blog cache tag mismatch

**Spec ref:** §6.1.

**Files:**
- Modify: `src/sanity/lib/data.ts:117` and `src/sanity/lib/data.ts:125`

- [ ] **Step 1: Open `src/sanity/lib/data.ts` and update `getAllPosts`**

Replace:
```ts
export async function getAllPosts() {
	return await sanityFetchLive<ALL_POSTS_QUERY_RESULT>({
		query: ALL_POSTS_QUERY,
		tags: ['post'],
	})
}
```
With:
```ts
export async function getAllPosts() {
	return await sanityFetchLive<ALL_POSTS_QUERY_RESULT>({
		query: ALL_POSTS_QUERY,
		tags: ['blog.post'],
	})
}
```

- [ ] **Step 2: Update `getPostBySlug`**

Replace:
```ts
export async function getPostBySlug(slug: string) {
	return await sanityFetchLive<POST_BY_SLUG_QUERY_RESULT>({
		query: POST_BY_SLUG_QUERY,
		params: { slug },
		tags: ['post', `post:${slug}`],
	})
}
```
With:
```ts
export async function getPostBySlug(slug: string) {
	return await sanityFetchLive<POST_BY_SLUG_QUERY_RESULT>({
		query: POST_BY_SLUG_QUERY,
		params: { slug },
		tags: ['blog.post', `blog.post:${slug}`],
	})
}
```

- [ ] **Step 3: Verify no other `'post'` tag literals remain**

```bash
grep -n "tags:.*'post'" src/sanity/lib/data.ts
```
Expected: no matches.

- [ ] **Step 4: Type-check + lint pass**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/sanity/lib/data.ts
git commit -m "fix(cms): align blog cache tags with schema _type 'blog.post'

Webhook /api/revalidate emits revalidateTag(body._type, ...) where
_type is 'blog.post'. data.ts was tagging entries 'post' and 'post:\${slug}',
so blog publishes never invalidated cached pages until ISR window elapsed.
Aligning tags to the canonical schema name fixes the mismatch."
```

---

### Task 1.2: Drop `browserToken` from defineLive

**Spec ref:** §6.2 Layer B.

**Files:**
- Modify: `src/sanity/lib/live.ts`

- [ ] **Step 1: Replace file contents**

Replace the file with:
```ts
// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
import { defineLive } from 'next-sanity/live'
import { client } from './client'
import { token } from './token'

export const { sanityFetch, SanityLive } = defineLive({
	client: client.withConfig({
		// Live content is currently only available on the experimental API
		// https://www.sanity.io/docs/api-versioning
		apiVersion: '2025-10-23',
	}),
	serverToken: token,
})
```

(The change is the removal of the `browserToken: token` line.)

- [ ] **Step 2: Type-check**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/lib/live.ts
git commit -m "fix(security): stop shipping Sanity read token to browser

defineLive previously set both serverToken and browserToken to
SANITY_API_READ_TOKEN. next-sanity serializes browserToken into the
client output, exposing the token to every public visitor. Drop the
browserToken; serverToken alone is sufficient for SSR/RSC fetches.
Studio editors lose websocket-driven live preview in draft mode and
fall back to fresh content on hard reload — acceptable trade."
```

---

### Task 1.3: Gate `<SanityLive />` behind draftMode

**Spec ref:** §6.2 Layer A.

**Files:**
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Add `draftMode` import**

Open `src/app/(site)/layout.tsx`. Add to the top imports block (under `import type { Metadata } from 'next'`):
```ts
import { draftMode } from 'next/headers'
```

- [ ] **Step 2: Read draft state in `RootLayout`**

Inside `RootLayout`, after `preconnect('https://cdn.sanity.io')`, add:
```ts
const isDraft = (await draftMode()).isEnabled
```

(Place it on its own line, before `const site = await getSite()`.)

- [ ] **Step 3: Replace `<SanityLive />` render with gated render**

Find:
```tsx
<SanityLive />
```
Replace with:
```tsx
{isDraft && <SanityLive />}
```

- [ ] **Step 4: Type-check**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 5: Build**

```bash
npm run build
```
Expected: `Compiled successfully`.

- [ ] **Step 6: Bundle audit — token must not reach client**

```bash
grep -r "$(node -e "console.log(process.env.SANITY_API_READ_TOKEN || 'SKIP_NO_LOCAL_TOKEN')")" .next/static 2>/dev/null | head
```
Expected: no matches (or `SKIP_NO_LOCAL_TOKEN` if env not loaded — which still proves the literal isn't hardcoded).

Manual check via DevTools after `npm run start`:
- Open `http://localhost:3000/`
- DevTools → Network → filter by `wss` — no Sanity websocket connection.
- DevTools → Sources → search any chunk for `sk` (token prefix) — no match.

- [ ] **Step 7: Commit**

```bash
git add src/app/\(site\)/layout.tsx
git commit -m "fix(perf,security): gate <SanityLive /> behind draftMode

<SanityLive /> opens a websocket to Sanity for live content updates.
This is only meaningful for Studio editors in draft mode; public
visitors paid the cost (extra bundle + persistent connection) for
no benefit. Render only when draftMode().isEnabled, matching the
existing <VisualEditing /> gating pattern."
```

---

### Task 1.4: Restore visible focus on partner-form consent

**Spec ref:** §6.3.

**Files:**
- Modify: `src/ui/forms/partner-form.tsx` (around line 200)

- [ ] **Step 1: Replace the consent checkbox `className`**

Find:
```tsx
<input
  id="pf-consent"
  type="checkbox"
  {...register('privacyConsent')}
  className="border-foreground/40 text-foreground/70 mt-[6px] h-3.5 w-3.5 rounded-[5px] bg-transparent focus:ring-0"
/>
```
Replace with:
```tsx
<input
  id="pf-consent"
  type="checkbox"
  {...register('privacyConsent')}
  className="border-foreground/40 text-foreground/70 mt-[6px] h-3.5 w-3.5 rounded-[5px] bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60"
/>
```

- [ ] **Step 2: Audit `contact-form.tsx` for the same anti-pattern**

```bash
grep -n "focus:ring-0" src/ui/forms/contact-form.tsx
```

If a match exists on a checkbox/radio, apply the same swap (replace `focus:ring-0` with `focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60`). If no match, skip.

- [ ] **Step 3: Manual a11y verification**

Run:
```bash
npm run dev
```

In a browser:
- Visit `/join-us`.
- Tab through the form; on reaching the consent checkbox, a 2 px ring should be visible.
- Click the checkbox with the mouse — no ring (focus-visible suppresses ring on pointer interaction).

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/ui/forms/partner-form.tsx
# include contact-form.tsx in the same commit only if Step 2 modified it
git commit -m "fix(a11y): restore visible focus on consent checkboxes

partner-form had focus:ring-0 stripping the focus indicator from the
consent checkbox — WCAG 2.4.7 violation for keyboard users. Swap to
focus-visible:ring-2 so the ring shows on keyboard focus and stays
hidden on mouse interaction."
```

---

### Phase 1 Verification Gate (spec §6.4)

- [ ] **Build passes**

```bash
npm run build
```
Expected: green.

- [ ] **Typecheck passes**

```bash
npm run typecheck
```
Expected: green.

- [ ] **Existing test suite passes**

```bash
npm test
```
Expected: all 49 tests green.

- [ ] **Webhook smoke test (after deploy)**

After PR1 lands and Coolify redeploys staging:
1. Open Sanity Studio.
2. Edit any blog post and publish.
3. Watch Sanity webhook Attempts tab — confirm 200 response with `tags: ['blog.post', 'blog.post:<slug>']` in body.
4. Reload the affected blog page on staging within 5 s — content updated.

- [ ] **Bundle audit**

After deploy, view-source on production homepage. Search for `SANITY_API_READ_TOKEN` value (or token prefix). Expected: no occurrence in any served JS chunk.

- [ ] **Open PR**

```bash
git push -u origin fix/f107737-hotfix-1-blog-cache-and-token-leak
gh pr create --base staging --title "fix(hotfix): blog cache tag, SanityLive token leak, partner-form a11y" --body "$(cat <<'EOF'
## Summary
- Align blog cache tags with schema `_type` (`blog.post`) so webhook revalidation actually invalidates blog pages.
- Drop `browserToken` from `defineLive` and gate `<SanityLive />` behind draft mode — stops shipping `SANITY_API_READ_TOKEN` to public visitors.
- Replace `focus:ring-0` on partner-form consent checkbox with `focus-visible:ring-2` — WCAG 2.4.7 fix.

Spec: `docs/superpowers/specs/2026-05-10-staging-fixes-design.md` §6.

## Test plan
- [ ] `npm run build` green
- [ ] `npm run typecheck` green
- [ ] `npm test` green (49 tests)
- [ ] Manual: tab to consent checkbox → ring visible
- [ ] After deploy: publish blog post in Studio → page reflects edit within 5 s
- [ ] After deploy: grep production JS chunks for token prefix → no match

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Phase 2 — PR2 Performance

**Branch:** `perf/f107737-hotfix-2-lcp-fonts-isr`

**Pre-condition:** Phase 1 merged to staging. Pull latest before branching.

```bash
git checkout staging
git pull origin staging
git checkout -b perf/f107737-hotfix-2-lcp-fonts-isr
```

---

### Task 2.1: Hero image — bump source width, add sizes, set quality

**Spec ref:** §7.1.

**Files:**
- Modify: `src/ui/home-hero.tsx`

- [ ] **Step 1: Update `imageUrl` construction**

Find:
```ts
const imageUrl = page.heroImage?.asset
  ? urlFor(page.heroImage.asset).width(900).url()
  : null
```
Replace with:
```ts
const imageUrl = page.heroImage?.asset
  ? urlFor(page.heroImage.asset).width(1920).auto('format').url()
  : null
```

- [ ] **Step 2: Update the `<Image>` element**

Find:
```tsx
<Image
  src={imageUrl}
  alt={page.heroImage?.alt ?? ''}
  fill
  priority
  className="object-cover"
/>
```
Replace with:
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

- [ ] **Step 3: Type-check**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/ui/home-hero.tsx
git commit -m "perf(home-hero): request 1920w source, add sizes, quality 80

width(900) capped Sanity source resolution → blurry on >900px viewports.
Bump to 1920 + auto('format'). Add sizes prop so Next image optimizer
can pick correct responsive width per device. quality=80 balances LCP
vs sharpness."
```

---

### Task 2.2: Decor image widths

**Spec ref:** §7.2.

**Files:**
- Modify: `src/ui/molecules/hero-decor-image.tsx`

- [ ] **Step 1: Cap source width and pass quality**

Find:
```tsx
const url = urlFor(asset.asset).url()
return (
  <Image
    src={url}
    alt={alt}
    fill
    sizes={sizes}
    className={className ?? 'object-contain'}
    style={style}
  />
)
```
Replace with:
```tsx
const url = urlFor(asset.asset).width(1200).auto('format').url()
return (
  <Image
    src={url}
    alt={alt}
    fill
    sizes={sizes}
    quality={70}
    className={className ?? 'object-contain'}
    style={style}
  />
)
```

- [ ] **Step 2: Type-check**

```bash
npm run typecheck
```
Expected: no errors.

- [ ] **Step 3: Visual smoke test**

```bash
npm run dev
```

In a browser, visit `/`. Confirm decor images (bg circle, stars, flowers, stripes) render correctly without obvious quality loss. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/ui/molecules/hero-decor-image.tsx
git commit -m "perf(hero-decor): cap source width to 1200, quality 70

HeroDecorImage was requesting Sanity originals (potentially 4K PNGs).
Cap source dimension to 1200 with auto-format, drop quality to 70
since these are non-LCP decorative elements competing with hero
bandwidth."
```

---

### Task 2.3: Bump ISR fallback to 1800 s

**Spec ref:** §7.3.

**Files:**
- Modify: `src/app/(site)/layout.tsx` (around line 28-30)

- [ ] **Step 1: Update `revalidate` constant + comment**

Find:
```ts
// ISR safety net: re-render every 5min if no webhook revalidation arrived.
// Webhook (POST /api/revalidate) handles instant invalidation on Sanity publish.
export const revalidate = 300
```
Replace with:
```ts
// ISR safety net: re-render every 30min if no webhook revalidation arrived.
// Webhook (POST /api/revalidate) handles instant invalidation on Sanity publish.
export const revalidate = 1800
```

- [ ] **Step 2: Commit**

```bash
git add src/app/\(site\)/layout.tsx
git commit -m "perf(isr): raise root layout revalidate from 300 to 1800

Webhook revalidation handles real-time invalidation. 5-min ISR
fallback was overkill; bumping to 30 min cuts idle Sanity bandwidth
~6x while keeping a safety net for webhook delivery failures."
```

---

### Task 2.4: Drop preconnect to cdn.sanity.io

**Spec ref:** §7.5.

**Files:**
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Remove preconnect call**

Find:
```ts
preconnect('https://cdn.sanity.io')
```
Delete that line.

- [ ] **Step 2: Remove unused `preconnect` import**

Find at top of file:
```ts
import { preconnect } from 'react-dom'
```
Delete the line.

- [ ] **Step 3: Type-check + build**

```bash
npm run typecheck && npm run build
```
Expected: green. (`react-dom` import removal must not break anything.)

- [ ] **Step 4: Commit**

```bash
git add src/app/\(site\)/layout.tsx
git commit -m "perf(layout): drop dead preconnect to cdn.sanity.io

All Sanity images route through /_next/image (same origin); the
browser never connects to cdn.sanity.io directly, so the preconnect
hint was a no-op. Remove the call and the now-unused react-dom
import."
```

---

### Task 2.5: Cull fonts and remove CMS font dropdown

**Spec ref:** §7.4.

**Files:**
- Modify: `src/app/(site)/layout.tsx`
- Modify: `src/sanity/schemaTypes/documents/site.ts`
- Verify: `src/app.css` (no edit expected; verify fallback chain still references `--font-poppins`, `--font-playfair-display`, `--font-a-day-without-sun`)

- [ ] **Step 1: Reduce font imports in layout**

In `src/app/(site)/layout.tsx`, find the block:
```ts
import {
  Cormorant_Garamond,
  DM_Sans,
  Geist,
  Inter,
  JetBrains_Mono,
  Libre_Baskerville,
  Lora,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Poppins,
  Space_Mono,
} from 'next/font/google'
```
Replace with:
```ts
import { Playfair_Display, Poppins } from 'next/font/google'
```

- [ ] **Step 2: Remove unused font instances**

Delete these blocks from `src/app/(site)/layout.tsx`:
```ts
const geist = Geist({ ... })
const inter = Inter({ ... })
const dmSans = DM_Sans({ ... })
const plusJakartaSans = Plus_Jakarta_Sans({ ... })
const lora = Lora({ ... })
const libreBaskerville = Libre_Baskerville({ ... })
const cormorantGaramond = Cormorant_Garamond({ ... })
const jetbrainsMono = JetBrains_Mono({ ... })
const spaceMono = Space_Mono({ ... })
```

Keep:
```ts
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
})
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})
const aDayWithoutSun = localFont({
  src: '../fonts/a-day-without-sun.otf',
  variable: '--font-a-day-without-sun',
  weight: '400',
  style: 'normal',
  display: 'swap',
})
```

- [ ] **Step 3: Reduce `ALL_FONT_CLASSES`**

Find:
```ts
const ALL_FONT_CLASSES = [
  geist.variable,
  inter.variable,
  dmSans.variable,
  plusJakartaSans.variable,
  playfairDisplay.variable,
  lora.variable,
  libreBaskerville.variable,
  cormorantGaramond.variable,
  jetbrainsMono.variable,
  spaceMono.variable,
  poppins.variable,
  aDayWithoutSun.variable,
].join(' ')
```
Replace with:
```ts
const ALL_FONT_CLASSES = [
  playfairDisplay.variable,
  poppins.variable,
  aDayWithoutSun.variable,
].join(' ')
```

- [ ] **Step 4: Remove `FONT_VAR_MAP` and font branches in `themeCSS`**

Delete `FONT_VAR_MAP` constant entirely (the whole `Record<string, string>` block).

In the `rawVars` object inside `RootLayout`, delete:
```ts
'--font-sans': f?.body ? FONT_VAR_MAP[f.body] : undefined,
'--font-heading': f?.heading ? FONT_VAR_MAP[f.heading] : undefined,
'--font-mono': f?.mono ? FONT_VAR_MAP[f.mono] : undefined,
```

Delete the `const f = site?.fonts` line if present.

The remaining `rawVars` should be colour vars only.

- [ ] **Step 5: Verify `app.css` fallback chain still resolves**

```bash
grep -n "font-poppins\|font-playfair-display\|font-a-day-without-sun" src/app.css
```
Expected: existing entries reference these CSS variables. No edit needed.

- [ ] **Step 6: Remove `fonts` field from site schema**

Open `src/sanity/schemaTypes/documents/site.ts`.

Delete the `fonts` group line:
```ts
{ name: 'fonts' },
```
(around line 15).

Delete the entire `fonts` `defineField` block (lines ~302-353):
```ts
defineField({
  name: 'fonts',
  title: 'Fonts',
  type: 'object',
  group: 'fonts',
  fields: [ ... ],
}),
```

- [ ] **Step 7: Regenerate Sanity types**

```bash
npm run typegen
```
Expected: `src/sanity/types.ts` updated. Verify:
```bash
grep -n "fonts" src/sanity/types.ts
```
The `fonts` field should no longer appear on the `Site` type.

- [ ] **Step 8: Type-check + build**

```bash
npm run typecheck && npm run build
```
Expected: green. Any reference to `site.fonts` outside layout.tsx (already removed) would surface here.

- [ ] **Step 9: Network audit on dev**

```bash
npm run dev
```

DevTools → Network → filter `font`. Reload `/`. Expected:
- 2 Google font requests (Playfair Display, Poppins).
- 1 local font (`a-day-without-sun.otf`).
- No requests for Geist, Inter, DM Sans, Plus Jakarta, Lora, Libre Baskerville, Cormorant, JetBrains Mono, Space Mono.

Stop dev server.

- [ ] **Step 10: Commit**

```bash
git add src/app/\(site\)/layout.tsx src/sanity/schemaTypes/documents/site.ts src/sanity/types.ts
git commit -m "perf(fonts): cull to Playfair, Poppins, a-day-without-sun

Layout was loading 11 Google fonts; only 3 are referenced (Playfair
heading, Poppins body, a-day-without-sun stories). Each unused
next/font invocation triggered a preload link. Drop the 9 unused
faces; remove the now-redundant CMS fonts dropdown from the site
schema since CMS-driven font switching is no longer wired."
```

---

### Task 2.6: Wrap `getAllProperties` with React `cache()`

**Spec ref:** §7.6.

**Files:**
- Modify: `src/sanity/lib/data.ts` (around line 93-98)

- [ ] **Step 1: Wrap function**

Find:
```ts
export async function getAllProperties() {
	return await sanityFetchLive<ALL_PROPERTIES_QUERY_RESULT>({
		query: ALL_PROPERTIES_QUERY,
		tags: ['property'],
	})
}
```
Replace with:
```ts
export const getAllProperties = cache(async () => {
	return await sanityFetchLive<ALL_PROPERTIES_QUERY_RESULT>({
		query: ALL_PROPERTIES_QUERY,
		tags: ['property'],
	})
})
```

(The `cache` import from `react` is already at the top of the file.)

- [ ] **Step 2: Type-check**

```bash
npm run typecheck
```
Expected: no errors. (`getAllProperties` is awaited everywhere, so the function-vs-const change is invisible to callers.)

- [ ] **Step 3: Commit**

```bash
git add src/sanity/lib/data.ts
git commit -m "perf(data): wrap getAllProperties with React cache()

getAllProperties is called from Footer (every page) and /our-homes
within a single render. Wrapping with React cache() dedupes the
call per request, matching the existing getSite pattern."
```

---

### Phase 2 Verification Gate (spec §7.7)

- [ ] **Build + typecheck + tests green**

```bash
npm run typegen && npm run typecheck && npm run build && npm test
```
Expected: all green.

- [ ] **Lighthouse before/after**

Capture Lighthouse on staging `/` BEFORE merging this PR. After merge + deploy, capture again. Compare LCP, TBT, total transferred bytes. Attach screenshots to PR description.

- [ ] **Network verification**

After deploy, on production `/`:
- Network tab → only Playfair Display + Poppins font requests.
- Hero `<img>` `srcset` attribute on a 1440 px viewport: contains a candidate ≥ 1024 w.
- No request to `cdn.sanity.io` from the browser.

- [ ] **Studio sanity check**

Open Sanity Studio → Site Settings document. The Fonts tab should be gone. The colour group should still render.

- [ ] **Cross-page font regression check**

Visit `/our-homes`, `/experiences`, `/blog`, `/the-alt-way`, `/contact`, `/join-us`. Typography renders correctly (no fallback-stack flash, no obviously wrong family). If a page uses `font-geist`/`font-inter`/etc. via app code (not via CMS), it would fail here.

- [ ] **Open PR**

```bash
git push -u origin perf/f107737-hotfix-2-lcp-fonts-isr
gh pr create --base staging --title "perf: hero image, font cull, ISR 1800, drop preconnect, cache wrapper" --body "$(cat <<'EOF'
## Summary
- Hero `<Image>`: bump Sanity source to 1920w, add `sizes`, `quality={80}`. Sharper on retina, still fast.
- Decor images: cap to 1200w, quality 70. Stops fetching 4K PNGs.
- Cull Google fonts from 11 → 2 (Playfair, Poppins). Remove CMS fonts dropdown.
- Drop `preconnect('cdn.sanity.io')` — dead hint (all images proxied through Next).
- Bump root ISR fallback 300 → 1800 s.
- Wrap `getAllProperties` with React `cache()` for per-render dedup.

Spec: `docs/superpowers/specs/2026-05-10-staging-fixes-design.md` §7.

## Test plan
- [ ] `npm run typegen` clean
- [ ] `npm run build` green
- [ ] `npm test` green
- [ ] Lighthouse LCP/TBT before vs after — capture screenshots
- [ ] Network tab: only Playfair + Poppins fonts loaded
- [ ] Visit /our-homes, /experiences, /blog, /the-alt-way, /contact, /join-us — typography ok
- [ ] Studio: Site Settings has no Fonts tab; colours still work

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

# Phase 3 — PR3 Polish

**Branch:** `polish/f107737-hotfix-3-footer-and-header`

**Pre-condition:** Phase 2 merged to staging.

```bash
git checkout staging
git pull origin staging
git checkout -b polish/f107737-hotfix-3-footer-and-header
```

---

### Task 3.1: Footer single-render with grid template areas

**Spec ref:** §8.1.

**Files:**
- Modify: `src/ui/footer/index.tsx`

- [ ] **Step 1: Replace the desktop+mobile two-branch render with one grid**

Open `src/ui/footer/index.tsx`. The current return statement renders two siblings (one `xl:flex hidden` desktop block, one `xl:hidden flex` mobile block). Replace the entire `return (...)` block with:

```tsx
return (
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
)
```

The `brand`, `connect`, `ourHomes`, `about`, `policies` JSX variables defined above the return stay as-is.

- [ ] **Step 2: Build**

```bash
npm run build
```
Expected: green. Tailwind 4 must accept arbitrary `grid-template-areas` values.

- [ ] **Step 3: View-source check — no DOM duplicates**

```bash
npm run dev
```

Visit `http://localhost:3000/`. View source. Search for `OUR HOMES`. Expected: exactly one match.

- [ ] **Step 4: Visual QA at 6 breakpoints**

In DevTools device toolbar, render `/` at:
- 360 px (mobile narrow) — single column, brand on top.
- 480 px (mobile wide) — 2-col with brand|connect, then ourhomes/about/policies stacked full-width.
- 768 px — same as 480 layout.
- 1024 px — same as 480 layout (xl breakpoint is 1280; lg is 1024).
- 1280 px — desktop row layout: brand · ourhomes · about · policies · connect.
- 1440 px — same as 1280 desktop layout.

Confirm:
- No overlapping elements.
- Connect (social icons) right-aligned on desktop.
- Brand text scales correctly per existing `font-stories` rules.

If any breakpoint visibly breaks, fall back to the alternative in spec §8.1: keep the two-branch render but add `aria-hidden="true"` on the visually-hidden branch. Document the fallback in commit body.

Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add src/ui/footer/index.tsx
git commit -m "refactor(footer): single-render with grid template areas

Footer previously rendered the entire link tree twice (desktop branch
hidden xl:flex + mobile branch xl:hidden). Crawlers and screen readers
saw every footer link in duplicate. Switch to one grid with named
template areas swapped per breakpoint — DOM is rendered once."
```

---

### Task 3.2: HeaderShell pre-paint scroll read

**Spec ref:** §8.2.

**Files:**
- Modify: `src/ui/header/header-shell.tsx`

- [ ] **Step 1: Replace component implementation**

Open `src/ui/header/header-shell.tsx`. Replace the entire file with:

```tsx
'use client'

import { useEffect, useLayoutEffect, useState } from 'react'

const useIsoLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

export default function HeaderShell({
	children,
}: {
	children: React.ReactNode
}) {
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
		<header
			className={`fixed top-0 right-0 left-0 z-50 flex w-full flex-row-reverse items-center justify-between gap-3 px-[18px] py-4 transition-[background-color,box-shadow] duration-200 [padding-top:calc(env(safe-area-inset-top)+16px)] lg:flex-row lg:gap-6 lg:px-[90px] lg:py-6 ${
				scrolled
					? 'bg-background shadow-[0_2px_10px_rgba(0,0,0,0.08)]'
					: 'bg-transparent shadow-none'
			}`}
		>
			{children}
		</header>
	)
}
```

The change: `useIsoLayoutEffect` runs synchronously after commit, before paint, correcting `scrolled` if the page already scrolled before hydration.

- [ ] **Step 2: Build**

```bash
npm run build
```
Expected: green, no hydration warning during build.

- [ ] **Step 3: Manual flash test**

```bash
npm run dev
```

In a browser:
1. Visit `http://localhost:3000/`.
2. Scroll halfway down the homepage.
3. Hit Cmd-R (hard reload).
4. Watch the header during reload.

Expected: header appears with the solid `bg-background` background immediately on first paint. No transparent flash.

For a stricter test: DevTools → Network → throttle to "Slow 3G" + check "Disable cache". Repeat the reload. Same result.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add src/ui/header/header-shell.tsx
git commit -m "fix(header): eliminate scroll-state flash on mid-page hydration

HeaderShell defaulted scrolled=false at SSR; on a hard reload of a
mid-scrolled page, the transparent-header style painted briefly
before the post-hydration useEffect corrected it. Read window.scrollY
in a layout effect so the correct background is applied before the
browser paints the first frame."
```

---

### Phase 3 Verification Gate (spec §8.3)

- [ ] **Build + typecheck + tests green**

```bash
npm run typecheck && npm run build && npm test
```
Expected: green.

- [ ] **Footer view-source: single OUR HOMES heading**

After deploy, `view-source:` the staging homepage. Search `OUR HOMES`. Expected: 1 match.

- [ ] **Visual QA matrix**

Confirm footer renders correctly at 360 / 480 / 768 / 1024 / 1280 / 1440 px on staging.

- [ ] **Header flash repro**

On staging, scroll mid-page, hard reload. No transparent flash.

- [ ] **A11y scan (optional but recommended)**

Run axe-core (browser extension) on `/` after deploy. Expected: no new violations beyond pre-existing baseline.

- [ ] **Open PR**

```bash
git push -u origin polish/f107737-hotfix-3-footer-and-header
gh pr create --base staging --title "polish: footer single-render + header pre-paint scroll" --body "$(cat <<'EOF'
## Summary
- Footer now renders link sections once, with CSS grid template areas swapping layout per breakpoint. Eliminates duplicate links in DOM.
- HeaderShell reads `window.scrollY` in a layout effect so the correct background paints before the first frame on mid-page hard reloads.

Spec: `docs/superpowers/specs/2026-05-10-staging-fixes-design.md` §8.

## Test plan
- [ ] `npm run build` green
- [ ] `npm test` green (49 tests)
- [ ] View source: 1 occurrence of `OUR HOMES`
- [ ] Visual QA at 360 / 480 / 768 / 1024 / 1280 / 1440
- [ ] Mid-page hard reload → no transparent header flash
- [ ] axe-core scan: no new violations

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Out of scope (filed for follow-up after Phase 3)

(Per spec §13 — not part of any task in this plan.)

1. `/api/revalidate` rate limit / per-tag debounce.
2. Sanity webhook config audit (verify `slug` projection on all sluggable types).
3. `cache()` wrapping for `getHomePage`, `getOurHomesPage`, etc.
4. Decor image deferred load via `requestIdleCallback`.
5. One-shot Sanity patch to remove orphan `fonts` field on existing `site` doc.
6. Sub-480 px footer responsive QA if §8.1 alternative used.

---

## Self-review checklist (run before handoff)

- [ ] Every spec section (§6.1–§6.3, §7.1–§7.6, §8.1–§8.2) maps to a task. ✓
- [ ] No "TBD", "TODO", or "implement later" placeholders. ✓
- [ ] Every code edit shows the exact before/after content. ✓
- [ ] Commit messages reference what changed and why. ✓
- [ ] Verification gates (§6.4, §7.7, §8.3) reproduced verbatim per phase. ✓
- [ ] Branch + PR commands present for each phase. ✓
- [ ] No new types/functions referenced that aren't defined. ✓
