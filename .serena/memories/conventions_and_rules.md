# Conventions and Non-Negotiables

## GROQ Queries
- ALL queries in `src/sanity/lib/queries.ts`
- MUST use `defineQuery()` — plain `groq` tag breaks TypeGen silently

## Images
- Always `next/image` — never raw `<img>`

## Forms
- No Sanity writes from forms — Resend only

## RentalWise
- API calls server-side only via server actions
- `cache: 'no-store'` on availability fetches
- Use staging env during dev: `RENTALWISE_API_HOST=https://app.onemineralstaging.com`

## Sanity Live
- `<SanityLive />` in `(site)/layout.tsx` ONLY — nowhere else

## Stega / Draft Mode
- Add `stega: false` to any `sanityFetch` that feeds CSS values (hex colors etc.)
- Stega encoding corrupts hex/non-text strings

## Forbidden
- `@vercel/kv`, `@vercel/blob` — Vercel-specific, forbidden
- Editor-level Sanity token — viewer scope only
- Removing `output: 'standalone'` from next.config.ts

## Logo in Header
- Logo component renders its own `<a>` — never wrap it in another anchor (hydration error)

## not-found.tsx
- Must live at `src/app/(site)/not-found.tsx` to inherit site layout
