# AltHomes

## What This Is

AltHomes is a luxury short-term rental website for a property management company in India. It showcases curated holiday properties, integrates with the RentalWise PMS for live availability and booking, and provides a content-managed experience for the client to publish property listings, experiences, reviews, and site copy. Built on Next.js + Sanity CMS (SanityPress template), deployed to Hetzner + Coolify + Cloudflare with Vercel for previews.

## Core Value

Guests can discover AltHomes properties, check real-time availability, and be sent directly to the booking checkout — with zero friction between browsing and booking.

## Requirements

### Validated

- ✓ SanityPress (Next.js 16 + Sanity v5 + Tailwind 4) project scaffolded — existing
- ✓ Next.js App Router with catch-all slug routing — existing
- ✓ Embedded Sanity Studio at `/admin` — existing
- ✓ Live Content API (`defineLive`) wired — existing
- ✓ TypeGen configured — existing
- ✓ Vercel deployment pipeline — existing

### Active

- [ ] Project setup: standalone output, studio rename, demo strip, env vars, Vercel build
- [ ] All Sanity schemas defined: property, experience, review, amenity, siteSettings, all page singletons, legalPage
- [ ] Route architecture: all pages scaffolded with correct grouping and data fetching
- [ ] All GROQ queries wrapped in `defineQuery()` and typed
- [ ] Frontend: all 10 pages pixel-perfect from Figma, data-driven from Sanity
- [ ] RentalWise booking widget on property detail pages
- [ ] RentalWise availability search on Our Homes page (server action, no token exposure)
- [ ] Contact form → Resend email (no Sanity write)
- [ ] Partner enquiry form → Resend email (no Sanity write)
- [ ] 95+ Lighthouse Performance/Accessibility/Best Practices, 90+ SEO
- [ ] Production deploy: Hetzner + Coolify + Cloudflare, RentalWise switched to production

### Out of Scope

- iCal integration — removed entirely; `<rw-widget>` handles availability natively
- Payment processing on AltHomes site — RentalWise checkout handles payments
- Sanity writes from forms — free tier dataset is public; personal data goes to Resend only
- Vercel as production host — non-commercial ToS; preview-only
- OAuth/social login — no user accounts on this site
- Mobile app — web-first only
- Real-time chat — not in scope
- Vercel-specific APIs (`@vercel/kv`, `@vercel/blob`, Edge Runtime) — production target is Hetzner

## Context

- **Client:** Alt Homes (Ref: AH-2026-001)
- **Consultant:** Akash Naskar
- **Delivery:** 12 business days
- **Testing period:** May 2026 (per service agreement)
- **Retainer:** ₹3,500/month post-launch

**RentalWise PMS integration:**
- Staging: `https://app.onemineralstaging.com/` (dev only)
- Production: `https://app.rentalwise.io/` (switch at Phase 8 only)
- Booking widget: `<rw-widget>` web component — client-side only, cannot SSR
- Availability search: `POST /rest/property/query` server action — bearer token never in browser

**Key pre-start blockers (must be resolved before coding):**
- Figma file access
- RentalWise staging credentials + property IDs
- RentalWise widget script URL
- Resend sender domain (DNS propagation takes 48h — start immediately)
- Client email addresses for form destinations
- Production domain

## Constraints

- **Deployment:** `output: 'standalone'` in `next.config.ts` — set Day 1, never remove. Required for Coolify/Hetzner.
- **No Vercel APIs:** All Vercel-specific APIs forbidden — production is Hetzner + Coolify.
- **SanityLive placement:** `<SanityLive />` in `(site)/layout.tsx` only — never root layout (causes Studio reload loop).
- **All GROQ in `defineQuery()`:** Plain `groq` tagged strings break TypeGen silently.
- **Sanity token:** Viewer-scoped only for `SANITY_API_READ_TOKEN` — Editor token must never reach browser.
- **Images:** `next/image` always — never raw `<img>`. Required for Lighthouse score.
- **RentalWise API:** Server-side only — bearer token never exposed to browser.
- **Availability fetch:** `cache: 'no-store'` always — real-time data, never cached.
- **Package manager:** bun or npm — pick one, stay consistent. Current: npm (package-lock.json present).
- **Routes:** Use Figma-derived paths — `/our-homes/[slug]`, not `/properties/[slug]`.
- **Page builder:** `modules[]` scoped to `blog/post` only. All other pages are fixed-layout templates.
- **Performance:** 95+ Lighthouse Performance/Accessibility/Best Practices · 90+ SEO target.

## Key Decisions

| Decision | Rationale | Outcome |
|---|---|---|
| Fork `nuotsu/sanitypress-with-typegen` over main SanityPress | TypeGen + Live Content API + Visual Editing already scaffolded — saves 1-2 days | — Pending |
| Hetzner + Coolify + Cloudflare for production | Vercel free tier is non-commercial; Hetzner CX22 = €4.15/month | — Pending |
| RentalWise `<rw-widget>` for booking | Handles full booking flow natively — no custom checkout needed | — Pending |
| No form data in Sanity | Free tier dataset is public — personal data via Resend only | ✓ Good |
| Static nav links (hardcoded routes) | Adding/removing nav = code change = design decision, not content | — Pending |
| `defineQuery()` for all GROQ | TypeGen breaks silently with plain `groq` tagged templates | ✓ Good |
| Resend for email delivery | Free tier 3k/month; sender domain verification needed early | — Pending |
| package-lock.json / npm (not bun) | Both lock files present — npm chosen for consistency with package-lock.json | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-24 after initialization*
