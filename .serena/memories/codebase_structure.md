# Codebase Structure

```
src/
  app/
    (site)/          # All public pages
      layout.tsx     # Root layout — SanityLive lives HERE only
      page.tsx       # Homepage /
      our-homes/     # /our-homes, /our-homes/[slug]
      the-alt-way/
      experiences/
      join-us/       # Partner enquiry form
      contact/
      [slug]/        # Legal pages
      blog/          # /blog, /blog/[slug]
      not-found.tsx  # Must be inside (site) to get layout
      api/og/
    (studio)/        # Sanity Studio at /studio
  ui/
    header/          # Fixed-position, hamburger-only nav
    footer/          # Brand green multi-column nav
    modules/         # Page-building module components
      index.tsx      # MODULES_MAP dispatcher
    pages/           # Page-level UI components
    forms/
    home-hero.tsx    # Bespoke homepage hero
    menu-overlay.tsx # Full-screen nav overlay
    menu-state.tsx   # Client component for menu toggle state
  sanity/
    lib/
      queries.ts     # ALL GROQ queries (must use defineQuery())
      data.ts        # Data fetch functions
      live.ts        # sanityFetch helper
    schemaTypes/
      documents/     # 14 doc types incl. site singleton, homePage, property
      modules/       # 13 page-building modules
      objects/       # seo, link, location, cta, blockContent, navLabel, megamenu
    structure.ts     # Studio sidebar layout
  actions/           # Server actions (RentalWise calls go here)
  hooks/
  lib/
    schemas/         # Zod schemas for forms
  types/
```
