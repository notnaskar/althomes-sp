# Code Conventions

**Last mapped:** 2026-04-24

---

## Language & Runtime

- **TypeScript** — strict mode, `typescript` ^6.0.3
- **React 19** with React Compiler (`babel-plugin-react-compiler`, `reactCompiler: true` in next.config)
- **Next.js App Router** — Server Components by default, Client Components opt-in with `'use client'`

---

## File & Component Naming

- Files: `kebab-case.tsx` / `kebab-case.ts`
- Module variants use dots: `hero.split.tsx`, `blog.post.ts`, `link.list.ts`
- CSS Modules co-located: `header.module.css` next to `header/index.tsx`
- `index.tsx` used for directory entry points (header, footer, prose, etc.)

---

## Component Style

- **Default exports** for all components — no named component exports
- Anonymous default exports common: `export default function ({ prop }: Props) {}`
- Props typed inline or with local `type Props = {}`
- Server Components: no `'use client'`, async functions OK
- Client Components: `'use client'` at top

---

## Styling

- **Tailwind CSS 4** — utility-first, config via `postcss.config.mjs`
- **`tailwind-merge`** (`clsx` + `twMerge`) for conditional class merging
- **CSS Modules** for component-specific styles (`.module.css`)
- Global styles in `src/app.css`
- Tailwind class sorting enforced by `prettier-plugin-tailwindcss`

---

## Data Fetching

- All Sanity data fetches go through `sanityFetchLive` from `src/sanity/lib/live.ts`
- GROQ queries written with `groq` tagged template literal from `next-sanity`
- Page-level queries defined inline in route files (e.g. `PAGE_QUERY` in `[[...slug]]/page.tsx`)
- Reusable GROQ fragments in `src/sanity/lib/queries.ts`
- Draft perspective auto-selected when `draftMode().isEnabled` or `dev === true`

---

## State Management

- **Zustand** for client-side feature state (blog filters, search state)
  - Stores co-located: `src/ui/modules/blog/blog-index/store.ts`, `src/ui/modules/search/store.ts`
- **nuqs** for URL-synced state (sort/filter params that persist in URL)
- No global app state — state is local to feature modules

---

## TypeScript Patterns

- Generated types from Sanity typegen: `src/sanity/types.ts`
  - Regenerate: `npm run typegen` (extracts schema → `schema.json` → generates types)
- `@sanity-typegen-ignore` comment suppresses typegen for dynamic GROQ fragments
- `type` imports preferred: `import type { Foo } from '...'`
- Path aliases: `@/` → `src/`, `@@/` → root (used for `package.json` import)

---

## Import Order

Enforced by `@ianvs/prettier-plugin-sort-imports`:
1. External packages
2. Internal aliases (`@/`, `@@/`)
3. Relative imports

---

## Formatting

- **Prettier** ^3.8.3 — config in `.prettierrc`
- Plugins: `prettier-plugin-tailwindcss`, `@ianvs/prettier-plugin-sort-imports`
- Format command: `npm run format` → `prettier --write '**/*.{ts,tsx,js,jsx}'`
- Tabs for indentation (Sanity convention)

---

## Error Handling

- Missing pages: `notFound()` from `next/navigation` — triggers `not-found.tsx`
- Missing modules: `MODULES_MAP` lookup returns `null` silently (no throw)
- No global error boundary — relies on Next.js default error handling
- No explicit try/catch in data fetching — Sanity client throws, Next.js catches

---

## Module Pattern (Adding New Modules)

1. Create schema: `src/sanity/schemaTypes/modules/<name>.ts`
2. Register in schema index: `src/sanity/schemaTypes/index.ts`
3. Create component: `src/ui/modules/<name>.tsx`
4. Register in dispatcher: `src/ui/modules/index.tsx` → `MODULES_MAP`
5. Optionally add GROQ fragment in `MODULES_QUERY` if needs joined data

---

## Sanity Schema Conventions

- Documents: `defineDocument` with `name`, `title`, `fields`
- Modules: named `module.<type>` or just `<type>` (check `_type` in MODULES_MAP)
- Objects: reusable across documents/modules
- Icons: from `react-icons` or custom SVG components
- `metadata` object: standard SEO block on pages and blog posts
- `module-attributes` object: shared `uid`, `theme`, `padding` on all modules

---

## Code Comments

Minimal comments. Only non-obvious WHY comments present (e.g. `// @sanity-typegen-ignore` with reason). No JSDoc/multi-line comment blocks.
