# AltHomes SP — Project Overview

AltHomes is a luxury property rental platform (Goa, India). This repo is the public-facing website.

## Tech Stack
- Next.js 16 (App Router) + TypeScript
- Sanity v3 (CMS, Live Content API, Visual Editing)
- Tailwind CSS v4 (CSS-first config via app.css @theme)
- Resend (email for contact/partner forms)
- RentalWise API (availability/booking data, server-side only)

## Deployment
- Hetzner + Coolify (NOT Vercel)
- `output: 'standalone'` in next.config.ts — never remove

## Path Aliases
- `@/*` → `src/*`
- `@@/*` → project root
