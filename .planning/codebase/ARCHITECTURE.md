# Architecture

**Last mapped:** 2026-04-24

---

## Pattern

**Headless CMS + Next.js App Router (module-based page builder)**

Sanity acts as the single source of truth for all content and site configuration. Next.js renders pages by fetching a list of "modules" from Sanity for each page slug and dispatching each module type to a React component via a static registry map.

---

## Route Groups

Two parallel route groups in `src/app/`:

| Group | Path | Purpose |
|---|---|---|
| `(frontend)` | `/*` | Public site — catch-all slug routing + API routes |
| `(studio)` | `/admin` | Embedded Sanity Studio |

---

## Data Flow

```
Request (slug)
  → src/app/(frontend)/[[...slug]]/page.tsx
  → sanityFetchLive(PAGE_QUERY, { slug })
    → Sanity Content Lake (GROQ)
      → returns page doc with resolved modules[]
  → <ModulesResolver page={page} />
    → iterates modules[]
    → MODULES_MAP[module._type] → React component
      → renders module with Sanity data
```

### Global Modules
Pages also include global modules injected before/after page-specific modules:
- `*[_type == 'global-module' && path == '*']` — site-wide (header injections etc.)
- `*[_type == 'global-module' && path != '*' && startsWith(slug, path)]` — path-scoped

---

## Layers

1. **CMS Layer** — Sanity schema definitions (`src/sanity/schemaTypes/`)
   - Documents: `page`, `blog.post`, `site`, `navigation`, `form`, `redirect`, `person`, `quote`, `logo`, `global-module`
   - Modules: 15 module types (accordion-list, hero.split, blog-index, etc.)
   - Objects: `link`, `link.list`, `cta`, `megamenu`, `metadata`, `module-attributes`

2. **Data Access Layer** — `src/sanity/lib/`
   - `client.ts` — configured `next-sanity` client
   - `live.ts` — `sanityFetchLive` wrapper (draft vs published perspective)
   - `queries.ts` — GROQ query fragments and `getSite()`
   - `image.ts` — `@sanity/image-url` builder
   - `builders.ts` — shared query builders

3. **Routing Layer** — `src/app/(frontend)/`
   - `[[...slug]]/page.tsx` — catch-all page renderer
   - `blog/[slug]/page.tsx` — blog post renderer
   - `api/draft-mode/` — draft enable/disable
   - `api/og/` — OG image generation
   - `blog/rss.xml/` — RSS feed
   - `sitemap.ts` — XML sitemap

4. **UI Layer** — `src/ui/`
   - `modules/index.tsx` — `MODULES_MAP` dispatcher
   - `modules/<name>.tsx` — individual module components
   - `header/`, `footer/` — layout chrome
   - Shared: `img.tsx`, `logo.tsx`, `cta-list.tsx`, `overline.tsx`, etc.

5. **State Layer**
   - `zustand` — blog index store (`src/ui/modules/blog/blog-index/store.ts`), search store (`src/ui/modules/search/store.ts`)
   - `nuqs` — URL-synced state (sort/filter params)

---

## Entry Points

| Entry | File |
|---|---|
| Frontend layout | `src/app/(frontend)/layout.tsx` |
| Studio layout | `src/app/(studio)/layout.tsx` |
| Catch-all page | `src/app/(frontend)/[[...slug]]/page.tsx` |
| Blog post | `src/app/(frontend)/blog/[slug]/page.tsx` |
| Module dispatcher | `src/ui/modules/index.tsx` |
| Sanity config | `sanity.config.ts` |
| Schema index | `src/sanity/schemaTypes/index.ts` |

---

## Key Abstractions

### `sanityFetchLive`
Wraps `sanityFetch` from `next-sanity/live`. Switches perspective to `drafts` when draft mode is active or in dev. All data fetching goes through this. Location: `src/sanity/lib/live.ts`.

### `MODULES_MAP`
Static `const` object mapping Sanity `_type` strings to React components. Adding a new module requires: (1) Sanity schema type, (2) React component, (3) entry in `MODULES_MAP`. Location: `src/ui/modules/index.tsx`.

### `ModulesResolver`
Iterates `page.modules[]` and renders each via `MODULES_MAP`. Passes `createDataAttribute` for visual editing. Handles `blog-post-content` and `breadcrumbs` special cases. Location: `src/ui/modules/index.tsx`.

### Redirects from CMS
`next.config.ts` fetches `redirect` documents from Sanity at build time and injects them as Next.js redirects.

---

## Metadata & SEO

- Per-page metadata from Sanity `metadata` object (title, description, image, noIndex)
- OG images: Sanity image → `urlFor().width(1200)`, fallback to `/api/og` dynamic route
- Sitemap: auto-generated from all published `page` docs
- RSS: auto-generated from `blog.post` docs
- Schema.org: `src/ui/modules/blog/schema.tsx`

---

## Visual Editing

Sanity Presentation overlay enabled via `stega` encoding in client config and `<VisualEditing />` component (`src/ui/modules/visual-editing.tsx`). Studio URL: `/admin`.
