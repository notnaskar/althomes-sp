# Atomic Component System + Sanity CMS Wiring — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace hardcoded nav/footer content and inline SVG decorations with Sanity CMS fields, and introduce a 3-tier atomic component structure (atoms/molecules/organisms).

**Architecture:** Phase 1 (Schema Agent) adds navbar/footer/assets groups to `site.ts` and regenerates TypeScript types. Phase 2 (Frontend Agent) creates atomic primitives, refactors organisms to consume Sanity data, and writes `COMPONENT_DESIGN.md`. Each agent produces one clean typecheck commit. Frontend Agent starts only after Phase 1 commit lands.

**Tech Stack:** Next.js 16 App Router, Sanity v3 (defineType/defineField/defineArrayMember), TypeScript, Tailwind v4, next/image

---

## PHASE 1 — Schema Agent

### Task 1: Add navbar/footer/assets groups to site.ts

**Files:**
- Modify: `src/sanity/schemaTypes/documents/site.ts`

- [ ] **Step 1: Add `defineArrayMember` to imports**

Open `src/sanity/schemaTypes/documents/site.ts`. The first import line is from `'sanity'`. Add `defineArrayMember`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'
```

- [ ] **Step 2: Replace `navigation` group with `navbar`, add `footer` and `assets` groups**

In the `groups` array, change `{ name: 'navigation' }` to three new groups:

```ts
{ name: 'navbar' },
{ name: 'footer' },
{ name: 'assets' },
```

- [ ] **Step 3: Update all `group: 'navigation'` field references to `group: 'navbar'`**

Find the four fields with `group: 'navigation'` (`navCtaLabel`, `navCtaLink`, `whatsappNumber`, `bookDirectLink`) and change each to `group: 'navbar'`.

- [ ] **Step 4: Add new `navbar` group fields**

After the `bookDirectLink` field definition, insert:

```ts
defineField({
  name: 'overlayNavLinks',
  title: 'Overlay Nav Links',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'url', type: 'string', title: 'URL' }),
      ],
    }),
  ],
  group: 'navbar',
}),
defineField({
  name: 'menuPhoto',
  title: 'Menu Overlay Photo',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
  group: 'navbar',
}),
defineField({
  name: 'contactEmail',
  title: 'Contact Email',
  type: 'string',
  group: 'navbar',
}),
defineField({
  name: 'contactPhone',
  title: 'Contact Phone',
  type: 'string',
  group: 'navbar',
}),
```

- [ ] **Step 5: Add `footer` group fields**

After the last socials field (`youtubeUrl`), insert:

```ts
defineField({
  name: 'footerBrandName',
  title: 'Footer Brand Name',
  type: 'string',
  description: 'Italic brand text in footer. Falls back to Site Title if empty.',
  group: 'footer',
}),
defineField({
  name: 'footerAboutLinks',
  title: 'Footer About Column Links',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'url', type: 'string', title: 'URL' }),
      ],
    }),
  ],
  group: 'footer',
}),
defineField({
  name: 'footerPolicyLinks',
  title: 'Footer Policies Column Links',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'object',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'url', type: 'string', title: 'URL' }),
      ],
    }),
  ],
  group: 'footer',
}),
```

- [ ] **Step 6: Add `assets` group fields**

After the footer group fields, insert:

```ts
defineField({
  name: 'heroBgCircle',
  title: 'Hero Background Circle',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', initialValue: '' })],
  group: 'assets',
}),
defineField({
  name: 'heroFgCircle',
  title: 'Hero Foreground Circle (photo frame)',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', initialValue: '' })],
  group: 'assets',
}),
defineField({
  name: 'heroDecorStars',
  title: 'Hero Decor — Stars',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', initialValue: '' })],
  group: 'assets',
}),
defineField({
  name: 'heroDecorFlowers',
  title: 'Hero Decor — Flowers',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', initialValue: '' })],
  group: 'assets',
}),
defineField({
  name: 'heroDecorStripes',
  title: 'Hero Decor — Stripes',
  type: 'image',
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', initialValue: '' })],
  group: 'assets',
}),
```

### Task 2: Run typegen + typecheck + commit

**Files:**
- Auto-generated: `src/sanity/types.ts` (do not hand-edit)

- [ ] **Step 1: Run typegen**

```bash
npm run typegen
```

Expected: exits 0. `src/sanity/types.ts` is updated. The `SITE_QUERY_RESULT` type now includes `overlayNavLinks`, `menuPhoto`, `contactEmail`, `contactPhone`, `footerBrandName`, `footerAboutLinks`, `footerPolicyLinks`, `heroBgCircle`, `heroFgCircle`, `heroDecorStars`, `heroDecorFlowers`, `heroDecorStripes`.

- [ ] **Step 2: Verify typecheck passes**

```bash
npm run typecheck
```

Expected: exits 0. No errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/site.ts src/sanity/types.ts
git commit -m "feat(schema): add navbar/footer/assets groups to site — CMS fields for nav links, footer columns, decorative images"
```

**→ Phase 1 complete. Frontend Agent unblocks now.**

---

## PHASE 2 — Frontend Agent

> Start only after Phase 1 commit lands. Confirm new fields exist in `src/sanity/types.ts` before proceeding:
> ```bash
> grep -c "heroDecorStars\|overlayNavLinks\|footerAboutLinks" src/sanity/types.ts
> ```
> Expected: 3 (or more). If 0, Phase 1 has not been applied — stop and wait.

### Task 3: Create `hero-decor-image` molecule

This molecule enforces the no-SVG rule. It renders `null` when no Sanity asset is present.

**Files:**
- Create: `src/ui/molecules/hero-decor-image.tsx`

- [ ] **Step 1: Create molecules directory**

```bash
mkdir -p src/ui/molecules
```

- [ ] **Step 2: Create `src/ui/molecules/hero-decor-image.tsx`**

```tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface HeroDecorImageProps {
  asset?: { asset?: { _ref: string; _type: string } | null } | null
  alt?: string
  sizes?: string
  className?: string
  style?: React.CSSProperties
}

export default function HeroDecorImage({
  asset,
  alt = '',
  sizes = '100vw',
  className,
  style,
}: HeroDecorImageProps) {
  if (!asset?.asset) return null
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
}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

### Task 4: Create atoms

**Files:**
- Create: `src/ui/atoms/badge.tsx`
- Create: `src/ui/atoms/pill.tsx`
- Create: `src/ui/atoms/nav-cta.tsx`
- Create: `src/ui/atoms/icon.tsx`

- [ ] **Step 1: Create atoms directory**

```bash
mkdir -p src/ui/atoms
```

- [ ] **Step 2: Create `src/ui/atoms/badge.tsx`**

Yellow nav badge link used in the homepage hero overlay.

```tsx
import Link from 'next/link'

interface BadgeProps {
  label: string
  href: string
  className?: string
  style?: React.CSSProperties
}

export default function Badge({ label, href, className, style }: BadgeProps) {
  return (
    <Link
      href={href}
      className={
        className ??
        'absolute inline-flex items-center justify-center rounded-[5px] bg-[#F2C94C] px-[14px] h-[26px] font-bold text-[13px] tracking-[0.3em] text-[#3A3A3A] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]'
      }
      style={style}
    >
      {label}
    </Link>
  )
}
```

- [ ] **Step 3: Create `src/ui/atoms/pill.tsx`**

Floating action pill (Book Direct / WhatsApp).

```tsx
interface PillProps {
  label: string
  href: string
  icon: React.ReactNode
}

export default function Pill({ label, href, icon }: PillProps) {
  return (
    <a
      href={href}
      className="relative flex items-center justify-end w-[142px] h-[32px] bg-white rounded-[20px] pl-2 pr-9 text-[9px] tracking-[0.1em] leading-[1.1] text-[#3A3A3A] whitespace-pre-line text-right shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-transform hover:-translate-y-px hover:shadow-[0_4px_10px_rgba(0,0,0,0.08)]"
    >
      {label}
      <span className="absolute right-0 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center">
        {icon}
      </span>
    </a>
  )
}
```

- [ ] **Step 4: Create `src/ui/atoms/nav-cta.tsx`**

"STAY WITH US" button — used in header and menu overlay.

```tsx
interface NavCtaProps {
  label: string
  href: string
  variant?: 'dark' | 'light'
  compact?: boolean
}

export default function NavCta({ label, href, variant = 'dark', compact = false }: NavCtaProps) {
  const bg = variant === 'dark' ? '#2F5D50' : '#FCF6EA'
  const color = variant === 'dark' ? '#FCF6EA' : '#3A3A3A'
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-[5px] font-bold tracking-[0.3em] transition-opacity hover:opacity-90"
      style={{
        background: bg,
        color,
        height: compact ? 30 : 48,
        padding: compact ? '0 12px' : '0 24px',
        minWidth: compact ? 70 : 192,
        fontSize: 14,
      }}
    >
      {label}
    </a>
  )
}
```

- [ ] **Step 5: Create `src/ui/atoms/icon.tsx`**

Thin passthrough wrapper for inline SVGs (social, close, hamburger, etc.).

```tsx
interface IconProps {
  children: React.ReactNode
  size?: number
  className?: string
}

export default function Icon({ children, size = 24, className }: IconProps) {
  return (
    <span
      className={className}
      style={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 6: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 7: Commit**

```bash
git add src/ui/atoms/ src/ui/molecules/hero-decor-image.tsx
git commit -m "feat(ui): add atoms (badge, pill, nav-cta, icon) and hero-decor-image molecule"
```

### Task 5: Create remaining molecules

**Files:**
- Create: `src/ui/molecules/footer-col.tsx`
- Create: `src/ui/molecules/social-links.tsx`
- Create: `src/ui/molecules/menu-toggle.tsx`

- [ ] **Step 1: Create `src/ui/molecules/footer-col.tsx`**

One footer nav column: heading + list of `{label, url}` links.

```tsx
import Link from 'next/link'

interface FooterColProps {
  heading: string
  links: { label: string; url: string }[]
}

export default function FooterCol({ heading, links }: FooterColProps) {
  return (
    <div>
      <h4 className="mb-[14px] font-bold text-[12px] tracking-[0.1em]">{heading}</h4>
      <ul className="flex flex-col gap-[6px] list-none p-0 m-0">
        {links.map((link) => (
          <li key={link.url} className="text-[11px] tracking-[0.1em] leading-[1.4]">
            <Link href={link.url} className="transition-opacity hover:opacity-75">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Create `src/ui/molecules/social-links.tsx`**

Row of social icon links. Renders nothing if all URLs are null.

```tsx
interface SocialLinksProps {
  instagram?: string | null
  facebook?: string | null
  linkedin?: string | null
  youtube?: string | null
  size?: number
}

export default function SocialLinks({
  instagram,
  facebook,
  linkedin,
  youtube,
  size = 14,
}: SocialLinksProps) {
  const links = [
    {
      href: instagram,
      label: 'Instagram',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
    {
      href: facebook,
      label: 'Facebook',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
        </svg>
      ),
    },
    {
      href: linkedin,
      label: 'LinkedIn',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      href: youtube,
      label: 'YouTube',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
          <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
        </svg>
      ),
    },
  ].filter((l) => !!l.href)

  if (links.length === 0) return null

  return (
    <div className="flex gap-[5px] items-center">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href!}
          aria-label={link.label}
          className="inline-flex"
          style={{ width: size, height: size, color: 'inherit' }}
        >
          {link.icon}
        </a>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/ui/molecules/menu-toggle.tsx`**

Hamburger button — client component.

```tsx
'use client'

interface MenuToggleProps {
  onOpen: () => void
}

export default function MenuToggle({ onOpen }: MenuToggleProps) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onOpen}
      className="inline-flex items-center justify-center w-8 h-8"
    >
      <svg viewBox="0 0 25 18" width="25" height="18" fill="none">
        <line x1="0" y1="2" x2="25" y2="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="9" x2="25" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="0" y1="16" x2="25" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  )
}
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/ui/molecules/
git commit -m "feat(ui): add footer-col, social-links, menu-toggle molecules"
```

### Task 6: Refactor home-hero — remove inline SVGs, wire Sanity decor assets

**Files:**
- Modify: `src/ui/home-hero.tsx`

The file currently has three inline SVG functions (`StarsDecor` lines 12-34, `FlowersDecor` lines 36-50, `StripesDecor` lines 52-60). These are deleted and replaced with `HeroDecorImage`.

- [ ] **Step 1: Delete the three inline SVG functions**

Delete lines 12-60 of `src/ui/home-hero.tsx` (the `StarsDecor`, `FlowersDecor`, `StripesDecor` function definitions). The file should jump straight from the imports block to `type Props = {`.

- [ ] **Step 2: Add HeroDecorImage import**

At the top of `src/ui/home-hero.tsx`, add:

```tsx
import HeroDecorImage from '@/ui/molecules/hero-decor-image'
```

- [ ] **Step 3: Replace bgCircle with HeroDecorImage**

Change:

```tsx
<div className={css.bgCircle} />
```

to:

```tsx
<div className={css.bgCircle}>
  <HeroDecorImage asset={site?.heroBgCircle} sizes="1110px" />
</div>
```

- [ ] **Step 4: Replace the three decor SVG usages with HeroDecorImage**

Change:

```tsx
<div className={css.stars}>
  <StarsDecor />
</div>
<div className={css.flowers}>
  <FlowersDecor />
</div>
<div className={css.stripes}>
  <StripesDecor />
</div>
```

to:

```tsx
<div className={css.stars}>
  <HeroDecorImage asset={site?.heroDecorStars} sizes="336px" />
</div>
<div className={css.flowers}>
  <HeroDecorImage asset={site?.heroDecorFlowers} sizes="199px" />
</div>
<div className={css.stripes}>
  <HeroDecorImage asset={site?.heroDecorStripes} sizes="146px" />
</div>
```

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0. If you get `Property 'heroDecorStars' does not exist on type 'SITE_QUERY_RESULT'`, Phase 1 typegen has not run — stop and run Phase 1 first.

- [ ] **Step 6: Commit**

```bash
git add src/ui/home-hero.tsx
git commit -m "feat(ui): replace StarsDecor/FlowersDecor/StripesDecor SVGs with HeroDecorImage — Sanity-driven, null when no asset"
```

### Task 7: Refactor footer — wire Sanity fields, delete hardcoded arrays

**Files:**
- Modify: `src/ui/footer/index.tsx`

`ABOUT_LINKS` (lines 2-7) and `POLICY_LINKS` (lines 9-12) are hardcoded constants that must be deleted and replaced with Sanity data.

- [ ] **Step 1: Add FooterCol and SocialLinks imports**

At the top of `src/ui/footer/index.tsx`, add:

```tsx
import FooterCol from '@/ui/molecules/footer-col'
import SocialLinks from '@/ui/molecules/social-links'
```

- [ ] **Step 2: Delete ABOUT_LINKS constant**

Remove lines 2-7 (`const ABOUT_LINKS = [...]`) entirely.

- [ ] **Step 3: Delete POLICY_LINKS constant**

Remove lines 9-12 (`const POLICY_LINKS = [...]`) entirely.

- [ ] **Step 4: Replace ABOUT_LINKS JSX usage with Sanity-driven FooterCol**

Find where `ABOUT_LINKS` is mapped in the JSX (previously line 80 after deletions, now a different line number — search for `ABOUT_LINKS`). Replace the entire block that renders the About column with:

```tsx
{site?.footerAboutLinks && site.footerAboutLinks.length > 0 && (
  <FooterCol
    heading="ABOUT"
    links={site.footerAboutLinks.map((l) => ({ label: l.label ?? '', url: l.url ?? '#' }))}
  />
)}
```

- [ ] **Step 5: Replace POLICY_LINKS JSX usage with Sanity-driven FooterCol**

Find where `POLICY_LINKS` is mapped (search for `POLICY_LINKS`). Replace the entire block that renders the Policies column with:

```tsx
{site?.footerPolicyLinks && site.footerPolicyLinks.length > 0 && (
  <FooterCol
    heading="POLICIES"
    links={site.footerPolicyLinks.map((l) => ({ label: l.label ?? '', url: l.url ?? '#' }))}
  />
)}
```

- [ ] **Step 6: Replace hardcoded footer brand text with Sanity field**

Find the hardcoded footer brand text (the string `'AltHomes'` or `logoText` usage in the footer JSX). Replace with:

```tsx
<div className="font-['Playfair_Display'] italic text-[49px] leading-none tracking-[0.1em] text-white">
  {site?.footerBrandName ?? site?.title ?? 'AltHomes'}
</div>
```

- [ ] **Step 7: Replace inline social icon links with SocialLinks molecule**

Find the social links section in the footer (renders instagramUrl, etc. inline). Replace with:

```tsx
<SocialLinks
  instagram={site?.instagramUrl}
  facebook={site?.facebookUrl}
  linkedin={site?.linkedinUrl}
  youtube={site?.youtubeUrl}
  size={14}
/>
```

- [ ] **Step 8: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 9: Commit**

```bash
git add src/ui/footer/index.tsx
git commit -m "feat(ui): wire footer brand/about/policy/socials to Sanity — remove hardcoded ABOUT_LINKS and POLICY_LINKS"
```

### Task 8: Refactor menu-overlay — wire Sanity nav links, photo, contact info

**Files:**
- Modify: `src/ui/menu-overlay.tsx`

`NAV_LINKS` (lines 12-18, 5 hardcoded items) must be deleted and replaced with `site.overlayNavLinks`.

- [ ] **Step 1: Add imports**

At the top of `src/ui/menu-overlay.tsx`, ensure these imports exist (add any missing):

```tsx
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'
import NavCta from '@/ui/atoms/nav-cta'
import SocialLinks from '@/ui/molecules/social-links'
```

- [ ] **Step 2: Delete NAV_LINKS constant (lines 12-18)**

Remove the hardcoded `NAV_LINKS` array entirely.

- [ ] **Step 3: Replace NAV_LINKS nav section with site.overlayNavLinks**

Find where `NAV_LINKS` is mapped in the overlay nav section (search for `NAV_LINKS` in JSX). Replace with:

```tsx
<nav className="flex flex-col items-end mt-[30px]">
  {(site?.overlayNavLinks ?? []).map((item) => (
    <a
      key={item.url ?? item.label}
      href={item.url ?? '#'}
      className="font-['Playfair_Display'] italic font-normal text-[30px] leading-[40px] tracking-[0.1em] text-[#FCF6EA] transition-opacity hover:opacity-75"
    >
      {item.label}
    </a>
  ))}
</nav>
```

- [ ] **Step 4: Wire menuPhoto to overlay left panel**

Find the overlay left-panel div (it uses `background-image` CSS or an `<img>` with a placeholder path). Replace entirely with:

```tsx
<div className="hidden md:block relative overflow-hidden">
  {site?.menuPhoto?.asset && (
    <Image
      src={urlFor(site.menuPhoto.asset).url()}
      alt={(site.menuPhoto as { alt?: string }).alt ?? ''}
      fill
      className="object-cover object-center"
      sizes="50vw"
    />
  )}
</div>
```

- [ ] **Step 5: Wire contactEmail and contactPhone to overlay contact panel**

Find the contact info section in the overlay (where phone/email is displayed). Replace with:

```tsx
<div className="flex flex-col items-end gap-[4px] text-[15px] tracking-[0.1em] leading-[23px]">
  {site?.contactPhone && (
    <div className="flex items-center gap-[10px]">
      <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
      </svg>
      <span>{site.contactPhone}</span>
    </div>
  )}
  {site?.contactEmail && (
    <div className="flex items-center gap-[10px]">
      <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14}>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
      <span>{site.contactEmail}</span>
    </div>
  )}
</div>
```

- [ ] **Step 6: Replace overlay social icons with SocialLinks molecule**

Find the overlay social icons (search for `instagramUrl` in the overlay file). Replace with:

```tsx
<SocialLinks
  instagram={site?.instagramUrl}
  facebook={site?.facebookUrl}
  linkedin={site?.linkedinUrl}
  youtube={site?.youtubeUrl}
  size={26}
/>
```

- [ ] **Step 7: Replace overlay "STAY WITH US" button with NavCta atom**

Find the overlay CTA button (search for `overlay-stay` class or `STAY WITH US` text). Replace with:

```tsx
{site?.navCtaLink && (
  <NavCta
    label={site.navCtaLabel ?? 'STAY WITH US'}
    href={site.navCtaLink}
    variant="light"
  />
)}
```

- [ ] **Step 8: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 9: Commit**

```bash
git add src/ui/menu-overlay.tsx
git commit -m "feat(ui): wire menu overlay nav/photo/contact/socials to Sanity — remove NAV_LINKS constant"
```

### Task 9: Write COMPONENT_DESIGN.md

**Files:**
- Create: `src/ui/COMPONENT_DESIGN.md`

- [ ] **Step 1: Create `src/ui/COMPONENT_DESIGN.md`** with this exact content:

```markdown
# AltHomes Component Design System

Authoritative reference for agents, skills, and engineers adding or modifying UI components.

## Atomic Design Tiers

### Tier 1 — Atoms (`src/ui/atoms/`)

Single-purpose, stateless, no Sanity data dependencies. Receive all data via props.

| File | Purpose |
|------|---------|
| `badge.tsx` | Yellow nav badge link (homepage hero overlay) |
| `pill.tsx` | Floating action pill (Book Direct / WhatsApp) |
| `nav-cta.tsx` | "STAY WITH US" CTA button — supports `dark`/`light` variant and `compact` flag |
| `icon.tsx` | SVG icon passthrough wrapper |

**Rules for atoms:**
- No `getSite()` or any Sanity fetch
- Always sync — never async default export
- Props define the full data contract

### Tier 2 — Molecules (`src/ui/molecules/`)

Composed from atoms or small primitives. Simple local state permitted. No Sanity fetches.

| File | Purpose |
|------|---------|
| `hero-decor-image.tsx` | Sanity image slot — renders `null` if asset missing, never SVG |
| `footer-col.tsx` | One footer nav column: heading + list of `{label, url}` links |
| `social-links.tsx` | Row of social icon links (Instagram, Facebook, LinkedIn, YouTube) |
| `menu-toggle.tsx` | Hamburger open button — client component |

**Rules for molecules:**
- Data flows down from parent organism — no Sanity fetches
- `'use client'` only when interaction is required

### Tier 3 — Organisms

Full sections. Fetch Sanity data via `getSite()` or page queries. Pass data down to molecules/atoms.

| Path | Sanity fields consumed |
|------|----------------------|
| `src/ui/header/index.tsx` | `navCtaLabel`, `navCtaLink`, `whatsappNumber`, `bookDirectLink` |
| `src/ui/footer/index.tsx` | `footerBrandName`, `footerAboutLinks`, `footerPolicyLinks`, `instagramUrl`, `facebookUrl`, `linkedinUrl`, `youtubeUrl` |
| `src/ui/home-hero.tsx` | `heroBgCircle`, `heroDecorStars`, `heroDecorFlowers`, `heroDecorStripes` (all from `site`) |
| `src/ui/menu-overlay.tsx` | `overlayNavLinks`, `menuPhoto`, `contactEmail`, `contactPhone`, `navCtaLabel`, `navCtaLink`, `instagramUrl`, `facebookUrl`, `linkedinUrl`, `youtubeUrl` |

## Naming Convention

- Files: `kebab-case.tsx`
- Exports: single `default` PascalCase function matching the filename
- CSS Modules: `kebab-case.module.css` co-located with the component

## No-SVG Rule

**Never draw SVG as a content placeholder for a missing asset.**

`HeroDecorImage` enforces this:
- `asset?.asset` present → `<Image>` via `urlFor()`
- `asset?.asset` null/undefined → `null` (renders nothing)

Apply `HeroDecorImage` to every decorative image slot. Do not write inline SVG functions as fallbacks.

## Image Rules

- Always `next/image` (`<Image>`) — never raw `<img>`
- Always provide `sizes` prop on `<Image fill>` components
- Decorative: `alt=""`, no `priority`. LCP images: `priority` only.

## CSS Strategy

- **CSS Modules** (`*.module.css`): layout, positioning, pixel-precise geometry, complex animations
- **Tailwind v4 utilities**: spacing, color, typography, flex/grid, hover states
- Do not use both for the same property on the same element

## Data Flow

```
Sanity CMS → getSite() → Organism → molecules (props) → atoms (props)
```

Only organisms call `getSite()` or `sanityFetch`. Molecules and atoms are purely presentational.

## Adding a New Component

1. Decide tier: renders with props only? → atom or molecule. Fetches data? → organism.
2. Create file in correct tier directory.
3. Export single default PascalCase function.
4. Add a row to the table in this document.
5. Run `npm run typecheck` before committing.
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: exits 0. (Doc-only step — confirms nothing was accidentally broken.)

- [ ] **Step 3: Commit**

```bash
git add src/ui/COMPONENT_DESIGN.md
git commit -m "docs(ui): add COMPONENT_DESIGN.md — atomic design system reference for agents and engineers"
```

### Task 10: Final verification

- [ ] **Step 1: Confirm no SVG fallback functions remain**

```bash
grep -rn "function.*Decor()" src/ui/
```

Expected: no output.

- [ ] **Step 2: Confirm no hardcoded link arrays remain**

```bash
grep -rn "ABOUT_LINKS\|POLICY_LINKS\|NAV_LINKS" src/ui/
```

Expected: no output.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: exits 0. Fix any errors before continuing.

- [ ] **Step 4: Final typecheck**

```bash
npm run typecheck
```

Expected: exits 0.

- [ ] **Step 5: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000. Confirm:
- Homepage loads (no 500)
- Hero section renders — decor slots show empty (not SVG, not broken img) when no Sanity assets uploaded yet
- Footer renders — About/Policy columns empty until content team populates in Sanity Studio
- Menu overlay opens — nav links empty until populated in Sanity Studio
- No console errors in browser DevTools

---

## Out of Scope

- `src/ui/modules/` and `src/ui/forms/` — not restructured this task
- Moving `header/` and `footer/` into an `organisms/` subfolder — can be done as follow-up; documented in COMPONENT_DESIGN.md
- Actual Sanity Studio content population — content team uploads assets after this ships
- `heroFgCircle` in home-hero: the fgCircle div currently clips the property hero photo (not a decorative image). Wire it only if a separate decorative circle image is needed behind the photo; otherwise leave the existing Image component in place.
