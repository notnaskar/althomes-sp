# Althomes

Boutique stay rentals — marketing site, property catalogue, and booking funnel.

Built on **Next.js 16** (App Router) + **Sanity v3** CMS + **Tailwind 4**, with **RentalWise** PMS for live availability/booking and **Resend** for transactional email. Type-safe end-to-end via Sanity TypeGen.

## Stack

- **Frontend**: Next.js 16 App Router, React 19, TypeScript, Tailwind 4
- **CMS**: Sanity v3 (Studio at `/studio`), Live Content API, Visual Editing
- **Booking**: RentalWise (OneMineral PMS) widget + JS SDK
- **Email**: Resend (contact + partner-enquiry forms)
- **Forms**: react-hook-form + Zod
- **Deploy**: Hetzner / Coolify (standalone Next output)
- **Tests**: Vitest (unit), Playwright (e2e)

## Routes

```
src/app/
├── (site)/
│   ├── layout.tsx              # Root layout — <SanityLive /> mounts here ONLY
│   ├── page.tsx                # /
│   ├── our-homes/              # /our-homes, /our-homes/[slug]
│   ├── the-alt-way/            # /the-alt-way
│   ├── experiences/            # /experiences
│   ├── join-us/                # /join-us — partner enquiry form
│   ├── contact/                # /contact
│   ├── blog/                   # /blog, /blog/[slug]
│   ├── [slug]/                 # Legal pages (privacy-policy, terms-of-use…)
│   └── api/og/                 # OG image generation
└── (studio)/                   # Sanity Studio at /studio
```

## Sanity Schema

`src/sanity/schemaTypes/`:

- **`documents/`** — 14 types: `site` (singleton), `property`, `experience`, `review`, `amenity`, `homePage`, `ourHomesPage`, `altWayPage`, `experiencesPage`, `joinUsPage`, `contactPage`, `legalPage`, `blog.post`, `redirect`
- **`modules/`** — 13 page-building modules assembled into `modules[]` arrays
- **`objects/`** — Reusable field groups: `seo`, `link`, `location`, `cta`, `blockContent`, `navLabel`, `megamenu`

Module dispatcher: `src/ui/modules/index.tsx`. Queries: `src/sanity/lib/queries.ts`. Fetch helpers: `src/sanity/lib/data.ts`.

## Getting Started

### 1. Install

```sh
npm install
```

### 2. Environment

Duplicate `.env.example` → `.env.local`:

```sh
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_READ_TOKEN=             # Viewer scope only — never Editor
NEXT_PUBLIC_BASE_URL=http://localhost:3000
REVALIDATE_SECRET=                 # Sanity webhook secret

# RentalWise (use staging for dev)
RENTALWISE_API_HOST=https://app.onemineralstaging.com
RENTALWISE_API_TOKEN=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_TO_EMAIL=
```

### 3. Run

```sh
npm run dev          # Next dev server (webpack)
npm run build        # Production build
npm run typecheck    # tsc --noEmit
npm run typegen      # Regenerate Sanity types from schema + queries
npm run format       # Prettier
```

- Frontend: http://localhost:3000
- Studio: http://localhost:3000/studio

Run `typegen` after any GROQ change in `src/sanity/lib/queries.ts` or schema edit in `src/sanity/schemaTypes/`. Output: `src/sanity/types.ts` (auto-generated, do not hand-edit).

## Non-Negotiables

1. **`output: 'standalone'`** in `next.config.ts` — required for Hetzner/Coolify deploy
2. **`<SanityLive />`** in `(site)/layout.tsx` only — nowhere else
3. **`next/image` always** — never raw `<img>`
4. **No Vercel-specific APIs** — `@vercel/kv`, `@vercel/blob` forbidden
5. **Viewer-scoped token** for `SANITY_API_READ_TOKEN` — never Editor
6. **No Sanity writes from forms** — Resend email is the only form destination
7. **RentalWise calls server-side only** via server actions; `cache: 'no-store'` on availability
8. **Every GROQ query uses `defineQuery()`** — plain `groq` tag breaks TypeGen silently

## Path Aliases

```
@/*   → src/*
@@/*  → ./
```

## Key Files

| File | Purpose |
|------|---------|
| `src/sanity/lib/queries.ts` | All GROQ queries |
| `src/sanity/lib/data.ts` | Fetch helpers |
| `src/sanity/types.ts` | Auto-generated types |
| `src/sanity/structure.ts` | Studio sidebar |
| `src/ui/modules/index.tsx` | Module dispatcher |
| `src/ui/UI_GUIDELINES.md` | Design tokens + component contracts |
| `next.config.ts` | Redirects pulled from Sanity at build time |
| `sanity.cli.ts` | TypeGen watch paths |

## Deployment

Standalone Next output → Hetzner via Coolify. RentalWise env must flip from staging to production host at final deploy. No Vercel.

## Credits

Built on the [SanityPress with TypeGen](https://typed.sanitypress.dev) starter, heavily extended for Althomes' property + experience domain.
