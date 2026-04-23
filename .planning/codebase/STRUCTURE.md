# Directory Structure

**Last mapped:** 2026-04-24

---

## Top-Level Layout

```
althomes-sp/
├── src/                    # All application source
├── sanity.config.ts        # Sanity Studio configuration
├── sanity.cli.ts           # Sanity CLI config
├── next.config.ts          # Next.js config (redirects from CMS)
├── postcss.config.mjs      # PostCSS / Tailwind CSS 4 config
├── tsconfig.json           # TypeScript config
├── .env.example            # Required env vars
├── .env.local              # Local env (gitignored)
├── .nvmrc                  # Node version pin
├── .npmrc                  # npm config
├── .prettierrc             # Prettier config
└── .planning/              # GSD planning artifacts
```

---

## `src/` Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (frontend)/         # Public site route group
│   │   ├── [[...slug]]/    # Catch-all page renderer
│   │   ├── blog/
│   │   │   ├── [slug]/     # Blog post page
│   │   │   └── rss.xml/    # RSS feed route
│   │   ├── api/
│   │   │   ├── draft-mode/ # Draft enable/disable
│   │   │   └── og/         # OG image generation
│   │   ├── layout.tsx      # Frontend root layout
│   │   └── not-found.tsx   # 404 page
│   ├── (studio)/
│   │   ├── admin/[[...tool]]/ # Embedded Sanity Studio
│   │   └── layout.tsx
│   ├── favicon.ico
│   └── sitemap.ts          # Auto-generated sitemap
│
├── sanity/                 # Sanity schema + data access
│   ├── schemaTypes/
│   │   ├── documents/      # Top-level CMS document types
│   │   ├── modules/        # Page module schema definitions
│   │   ├── objects/        # Reusable field objects
│   │   ├── fragments/      # modules.ts array fragment
│   │   └── index.ts        # Schema registry
│   ├── lib/
│   │   ├── client.ts       # Sanity client
│   │   ├── live.ts         # sanityFetchLive wrapper
│   │   ├── queries.ts      # GROQ queries + fragments
│   │   ├── image.ts        # Image URL builder
│   │   ├── builders.ts     # Shared GROQ builders
│   │   ├── token.ts        # API token accessor
│   │   ├── resolve-slug.ts # Slug resolution helpers
│   │   └── get-block-text.tsx # Portable text → plain text
│   ├── ui/
│   │   └── character-count.tsx # Studio UI component
│   ├── env.ts              # Sanity env vars
│   ├── icon.tsx            # Sanity document icons
│   ├── presentation.ts     # Presentation / visual editing config
│   ├── structure.ts        # Studio desk structure
│   ├── types.ts            # Generated TypeScript types (typegen)
│   └── schema.json         # Extracted schema (typegen source)
│
├── ui/                     # React UI components
│   ├── modules/            # Page module components
│   │   ├── index.tsx       # MODULES_MAP dispatcher
│   │   ├── blog/           # Blog-specific modules
│   │   │   ├── blog-index/ # Paginated blog listing with store
│   │   │   └── ...
│   │   ├── prose/          # Rich text renderer
│   │   ├── custom-html/    # Raw HTML/CSS/JS injection
│   │   ├── form-module/    # Form renderer + resolver
│   │   ├── search/         # Google search module with store
│   │   └── *.tsx           # Other module components
│   ├── header/             # Site header + navigation
│   ├── footer/             # Site footer + navigation
│   ├── table-of-contents/  # TOC component
│   ├── img.tsx             # Sanity image wrapper
│   ├── logo.tsx            # Logo component
│   ├── cta-list.tsx        # CTA button list
│   ├── overline.tsx        # Overline text
│   ├── sanity-link.tsx     # Internal/external link resolver
│   ├── social-navigation.tsx
│   ├── loading.tsx
│   ├── hover-details.tsx
│   └── click-to-copy.tsx
│
├── hooks/
│   ├── useMatchMedia.ts    # Responsive media query hook
│   └── usePagination.tsx   # Pagination logic hook
│
├── lib/
│   ├── env.ts              # App env vars (ROUTES, dev flag)
│   └── utils.ts            # Shared utilities
│
├── types/
│   └── global.d.ts         # Global TypeScript declarations
│
└── app.css                 # Global CSS (Tailwind + custom)
```

---

## Naming Conventions

| Pattern | Example | Rule |
|---|---|---|
| Module schema files | `hero.split.ts` | kebab-case, dot for variants |
| Module components | `hero.split.tsx` | matches schema filename |
| Document schemas | `blog.post.ts` | `category.variant` format |
| Object schemas | `link.list.ts` | kebab/dot for related types |
| CSS Modules | `header.module.css` | co-located with component |
| Route handlers | `route.ts` | Next.js App Router convention |
| Store files | `store.ts` | co-located with feature |

---

## Key File Locations

| What | Where |
|---|---|
| Add new module (schema) | `src/sanity/schemaTypes/modules/<name>.ts` |
| Add new module (UI) | `src/ui/modules/<name>.tsx` |
| Register module | `src/ui/modules/index.tsx` → `MODULES_MAP` |
| Add document type | `src/sanity/schemaTypes/documents/<name>.ts` |
| Add GROQ query | `src/sanity/lib/queries.ts` |
| App-wide env vars | `src/lib/env.ts` |
| Sanity env vars | `src/sanity/env.ts` |
| Regenerate types | `npm run typegen` |
| Global styles | `src/app.css` |
| Blog route prefix | `src/lib/env.ts` → `ROUTES.blog` |
