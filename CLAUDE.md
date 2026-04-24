# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Dev server (webpack mode)
npm run build        # Production build (webpack)
npm run typecheck    # tsc --noEmit
npm run typegen      # Regenerate Sanity types from schema + queries
npm run lint         # next lint
npm run format       # Prettier on all TS/JS files
```

Run `typegen` after changing any GROQ query in `src/sanity/lib/queries.ts` or any schema in `src/sanity/schemaTypes/`. Output lands in `src/sanity/types.ts`.

## Architecture

**Next.js 16 App Router + Sanity v3 + Tailwind 4**

### Route Structure

```
src/app/
  (site)/          # All public-facing pages
    layout.tsx     # Root layout — <SanityLive /> lives HERE only
    page.tsx       # Homepage /
    our-homes/     # /our-homes, /our-homes/[slug]
    the-alt-way/   # /the-alt-way
    experiences/   # /experiences
    join-us/       # /join-us (partner enquiry form)
    contact/       # /contact
    [slug]/        # Legal pages (privacy-policy, terms-of-use, etc.)
    blog/          # /blog, /blog/[slug]
    api/og/        # OG image generation
  (studio)/        # Sanity Studio at /studio
```

### Data Layer

All GROQ queries are in `src/sanity/lib/queries.ts`, wrapped in `defineQuery()`. Data fetch functions live in `src/sanity/lib/data.ts`. The `sanityFetch` helper from `src/sanity/lib/live.ts` handles Live Content API.

**Non-negotiable**: Every GROQ query must use `defineQuery()`. Plain `groq` tag breaks TypeGen silently.

### Sanity Schema

`src/sanity/schemaTypes/` splits into:
- `documents/` — 14 document types: `site` (global singleton), `property`, `experience`, `review`, `amenity`, `homePage`, `ourHomesPage`, `altWayPage`, `experiencesPage`, `joinUsPage`, `contactPage`, `legalPage`, `blog.post`, `redirect`
- `modules/` — 13 page-building modules assembled into `modules[]` arrays on documents
- `objects/` — Reusable field groups: `seo`, `link`, `location`, `cta`, `blockContent`, `navLabel`, `megamenu`

Module dispatcher is `src/ui/modules/index.tsx`.

### Path Aliases

```
@/*  → src/*       (e.g. @/sanity/lib/queries)
@@/* → ./          (project root)
```

## Non-Negotiables

1. **`output: 'standalone'`** in `next.config.ts` — never remove, required for Hetzner/Coolify deployment
2. **`<SanityLive />`** in `(site)/layout.tsx` only — do not add it elsewhere
3. **`next/image` always** — never raw `<img>` tags
4. **No Vercel-specific APIs** — `@vercel/kv`, `@vercel/blob` are forbidden
5. **Viewer-scoped token** for `SANITY_API_READ_TOKEN` — never Editor-level
6. **No Sanity writes from forms** — Resend email is the only form destination
7. **RentalWise API calls server-side only** via server actions; use `cache: 'no-store'` on availability fetches
8. **RentalWise staging env** (`RENTALWISE_API_HOST=https://app.onemineralstaging.com`) during development; swap to production only at final deploy

## Environment Variables

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=           # Viewer scope
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REVALIDATE_SECRET=               # Webhook secret
RENTALWISE_API_HOST=             # Staging URL for dev
RENTALWISE_API_TOKEN=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

## Key Files

| File | Purpose |
|------|---------|
| `src/sanity/lib/queries.ts` | All GROQ queries |
| `src/sanity/lib/data.ts` | Data fetch functions |
| `src/sanity/types.ts` | Auto-generated — do not hand-edit |
| `src/sanity/structure.ts` | Studio sidebar layout |
| `src/ui/modules/index.tsx` | Module dispatcher (maps schema type → component) |
| `next.config.ts` | Redirects pulled from Sanity at build time |
| `sanity.cli.ts` | TypeGen watch paths and output config |
