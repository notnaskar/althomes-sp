# Technical Concerns

**Last mapped:** 2026-04-24

---

## High Priority

### No Test Coverage
- **Impact:** High — no regression protection, no confidence in refactors
- **Scope:** Entire codebase — zero tests, zero test infra
- **Risk:** Any change to GROQ queries, module components, or routing is unverified
- **Files:** All of `src/`

### Form Submission Has No CSRF Protection
- **Impact:** High — forms POST directly to CMS-configured external URL
- **Location:** `src/ui/modules/form-module/contact.tsx`
- **Issue:** `<form action={form.endpoint} method="POST">` — no token, no honeypot, no rate limiting
- **Risk:** Spam submissions, endpoint abuse

### Sanity API Token Exposed to Browser
- **Impact:** Medium-High
- **Location:** `src/sanity/lib/live.ts` — `browserToken: token`
- **Issue:** Read token sent to browser for Live Content API. This is a `next-sanity` pattern but the token grants read access including drafts
- **Mitigation:** Token is "Viewer" permissions only — but still exposes unpublished draft content in browser

---

## Medium Priority

### No CI/CD Pipeline
- **Impact:** Medium — no automated quality gate on PRs
- **Issue:** No `.github/workflows/`, no Vercel preview checks beyond deployment
- **Risk:** Broken TypeScript or lint errors can merge undetected

### `custom-html` Module: XSS Surface
- **Impact:** Medium — arbitrary HTML/CSS/JS injection from CMS
- **Location:** `src/ui/modules/custom-html/index.tsx`, `with-script.tsx`, `css.tsx`
- **Issue:** Content editors can inject raw `<script>` and `<style>` tags
- **Mitigation:** Only CMS admins can edit; acceptable if access is controlled

### Webpack Forced (Turbopack Disabled for Build)
- **Impact:** Low-Medium — slower builds
- **Location:** `package.json` scripts: `"dev": "next dev --webpack"`, `"build": "next build --webpack"`
- **Issue:** React Compiler requires webpack; Turbopack support is a separate script (`dev:turbopack`) but not used for builds
- **Risk:** Build times will be slow on large content sets

### `@codemirror/state` Version Pinned
- **Impact:** Low — dependency conflict workaround
- **Location:** `package.json` `overrides` — `"@codemirror/state": "6.5.3"`
- **Issue:** Version conflict requiring override; may break when upgrading Sanity

---

## Low Priority / Tech Debt

### `ROUTES` Config is Underdeveloped
- **Location:** `src/lib/env.ts`
- **Issue:** Only `blog` route defined; commented-out `services`, `caseStudies`. Path structure for future content types is unclear
- **Risk:** Inconsistent URL patterns if expanded ad-hoc

### No Error Monitoring
- **Issue:** No Sentry or equivalent. Runtime errors in production are invisible beyond Vercel logs

### Generated Types Require Manual Regeneration
- **Location:** `src/sanity/types.ts`, `src/sanity/schema.json`
- **Issue:** `npm run typegen` must be run manually after schema changes — easy to forget, leads to stale types
- **Risk:** TypeScript passes with outdated query result types

### `// global moddules (after)` Typo in Query
- **Location:** `src/app/(frontend)/[[...slug]]/page.tsx` line 101
- **Issue:** Comment says "moddules" (double-d) — minor but indicates copy-paste origin

### No 404 Handling for Blog Posts
- **Location:** `src/app/(frontend)/blog/[slug]/page.tsx`
- **Issue:** Unclear if `notFound()` is called for missing blog post slugs (not verified)

### `demo.tar.gz` in Repo Root
- **Impact:** Low — repo bloat
- **Issue:** Binary archive committed to git; should be in `.gitignore` or removed
- **Location:** `demo.tar.gz`

### `package-lock.json` + `bun.lock` Both Present
- **Impact:** Low — lock file confusion
- **Issue:** Two lock files suggest mixed package manager usage (npm vs bun)
- **Risk:** Inconsistent installs across environments

---

## Security Checklist

| Item | Status |
|---|---|
| API token in .env (not hardcoded) | ✅ |
| .env.local gitignored | ✅ |
| Image domain whitelist in next.config | ✅ |
| Form CSRF protection | ❌ Missing |
| Rate limiting on API routes | ❌ Missing |
| Draft token browser exposure | ⚠️ By design (next-sanity pattern) |
| XSS via custom-html module | ⚠️ CMS-admin-only risk |
