# Technology Stack

**Analysis Date:** 2026-04-24

## Languages

**Primary:**
- TypeScript ~6.0.3 - All source files (`.ts`, `.tsx`) in `src/`

**Secondary:**
- CSS - Global styles in `src/app.css`, module CSS files (e.g., `src/ui/header/header.module.css`, `src/ui/modules/logo-list.module.css`)

## Runtime

**Environment:**
- Node.js v22.22.0 (pinned in `.nvmrc`)

**Package Manager:**
- npm (primary — `package-lock.json` present)
- bun also supported (`bun.lock` present)
- Lockfile: Both `package-lock.json` and `bun.lock` present

## Frameworks

**Core:**
- Next.js 16.2.4 - Full-stack React framework; app router with route groups `(frontend)` and `(studio)`
- React 19.2.5 - UI rendering
- React DOM 19.2.5 - DOM rendering

**CMS:**
- Sanity 5.21.0 - Headless CMS; Studio mounted at `/admin` via `src/app/(studio)/admin/[[...tool]]/page.tsx`
- next-sanity 12.3.0 - Next.js adapter for Sanity (Live Content API, draft mode, visual editing)

**Styling:**
- Tailwind CSS 4.2.3 - Utility-first CSS via PostCSS plugin (`postcss.config.mjs`)
- tailwind-merge 3.5.0 - Conditional class merging
- clsx 2.1.1 - Conditional class name utility
- styled-components 6.4.0 - Used inside Sanity Studio (`src/app/(studio)/`)

**Build/Dev:**
- Webpack (explicit `--webpack` flag in `dev` and `build` scripts)
- Turbopack available via `dev:turbopack` script
- babel-plugin-react-compiler 1.0.0 - React Compiler optimization (enabled via `reactCompiler: true` in `next.config.ts`)
- PostCSS with `@tailwindcss/postcss` 4.2.3

## Key Dependencies

**Critical:**
- `next-sanity` 12.3.0 - Connects Next.js to Sanity; provides `createClient`, `defineLive`, `VisualEditing`, draft mode helpers
- `@sanity/image-url` 2.1.1 - Builds CDN image URLs from Sanity image references via `src/sanity/lib/image.ts`
- `@portabletext/to-html` 5.0.2 - Serializes Sanity Portable Text to HTML (used in RSS feed `src/app/(frontend)/blog/rss.xml/route.ts`)
- `nuqs` 2.8.9 - URL query state management; used for blog filter/sort and search (`src/ui/modules/blog/blog-index/store.ts`, `src/ui/modules/search/store.ts`)
- `zustand` 5.0.12 - Client-side global state; used in search store (`src/ui/modules/search/store.ts`)

**UI Extras:**
- `react-icons` 5.6.0 - Icon library used in Sanity schema type definitions (e.g., `src/sanity/schemaTypes/documents/form.ts`)
- `shiki` 4.0.2 - Syntax highlighting for code blocks in prose (`src/ui/modules/prose/code.tsx`)

**Sanity Plugins:**
- `@sanity/assist` 6.0.4 - AI content assist in Studio
- `@sanity/code-input` 7.1.0 - Code field input for Studio
- `@sanity/dashboard` 5.0.1 - Dashboard tool in Studio
- `@sanity/vision` 5.21.0 - GROQ query tool in Studio
- `sanity-plugin-dashboard-widget-vercel` 3.1.6 - Vercel deployment status widget in Studio dashboard

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2018, strict mode enabled
- Path aliases: `@/*` → `./src/*`, `@@/*` → `./*`
- Module resolution: `bundler`

**Environment:**
- `.env.example` documents required variables
- `.env.local` for local development (git-ignored)
- Required variables: `NEXT_PUBLIC_BASE_URL`, `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`
- Optional: `NEXT_PUBLIC_SANITY_API_VERSION` (defaults to `2026-03-23`)

**Build:**
- `next.config.ts` — image remote patterns limited to `cdn.sanity.io`; redirects fetched dynamically from Sanity at build time
- `sanity.config.ts` — Studio config; plugins, schema, presentation tool
- `sanity.cli.ts` — CLI config with typegen paths; project ID `cyu7k2r0`, dataset `production`

**Formatting:**
- Prettier 3.8.3 with `@ianvs/prettier-plugin-sort-imports` and `prettier-plugin-tailwindcss`
- Config: `.prettierrc` — no semicolons, tabs, single quotes, trailing commas

**Overrides:**
- `@codemirror/state` pinned to 6.5.3
- `@types/react` and `@types/react-dom` pinned to match React 19

## Platform Requirements

**Development:**
- Node.js v22.22.0
- npm or bun
- `npm run dev` (webpack) or `npm run dev:turbopack`

**Production:**
- Vercel (inferred from `sanity-plugin-dashboard-widget-vercel`, `VERCEL_ENV` env check in `src/lib/env.ts`)
- `npm run build && npm run start`

---

*Stack analysis: 2026-04-24*
