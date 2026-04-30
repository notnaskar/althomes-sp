# UI Audit & Remediation — Design Spec

**Date:** 2026-04-30
**Scope:** All public pages, all UI components
**Approach:** Parallel audit → designer synthesis → staged execution with user approval gates

---

## Goals

- Surface UI inconsistencies, token violations, spacing issues, responsiveness gaps, and image quality/performance problems across the entire frontend
- Produce a designer-reviewed remediation plan the user approves before any code changes
- Execute fixes atomically, preserving brand style — no new colors, no font introductions, no full layout redesigns
- Flag CMS-side dependencies without executing them

---

## Audit Phase

### Page Clusters (run in parallel)

| Agent | Cluster | Files |
|---|---|---|
| A1 | Shared shell | `src/ui/header/`, `src/ui/footer/`, `src/ui/menu-overlay.tsx`, `src/ui/home-hero.tsx`, `src/ui/atoms/`, `src/ui/molecules/` |
| A2 | Property pages | `src/app/(site)/our-homes/`, `src/ui/pages/our-homes/` |
| A3 | Content pages | `src/app/(site)/experiences/`, `src/app/(site)/the-alt-way/`, `src/app/(site)/contact/`, `src/app/(site)/join-us/`, `src/app/(site)/[slug]/`, `src/ui/pages/experiences/`, `src/ui/forms/` |
| A4 | Blog | `src/app/(site)/blog/`, `src/ui/modules/blog/` |

### Finding Format

Each finding in `AUDIT.md` uses:

```
FILE: <relative path>
LINE: <line number or range>
ISSUE: <what is wrong>
CATEGORY: <see below>
SEVERITY: high | medium | low
CMS-DEP: no | yes — <description of required CMS change>
```

### Audit Categories

| Category | What to check |
|---|---|
| `token-violation` | Hardcoded hex/color/font not from `UI_GUIDELINES.md` design tokens; `text-black` instead of `text-foreground`; non-token bg values |
| `spacing-inconsistency` | px values deviating from established page padding (`px-[90px]` desktop / `px-[18px]` mobile); arbitrary margin/padding not justified by design |
| `responsiveness` | Missing or wrong `max-[820px]:` breakpoint handling; layout breaks on mobile; touch targets below 44px; overflow/scroll bleed; text truncation vs wrap; fluid behaviour at intermediate widths (400–819px and 821–1100px) — fixed pixel widths that cause overflow flagged; fluid units preferred |
| `layout` | Grid/flex problems; component ordering; proportion issues; minor layout improvements that clearly better fit the design system |
| `file-hygiene` | Unused imports; dead code; inconsistent naming; wrong tier placement (e.g. atom fetching Sanity data); CSS module used for non-JS-driven properties |
| `typography-consistency` | `font-heading italic` vs raw `font-['Playfair_Display'] italic` drift; tracking values (`tracking-[0.1em]` vs arbitrary); heading hierarchy (h1/h2/h3 semantic order) |
| `interactive-states` | Inconsistent hover/focus/active on buttons, links, cards; missing or inconsistent transitions; luxury sites require consistent motion treatment |
| `image-quality-and-performance` | `fill` images missing `sizes` prop; missing `priority` on LCP/above-fold images; `quality` prop — hero/gallery ≥85, thumbnails default 75; images hidden on mobile via CSS but still loaded; missing `placeholder="blur"` on large images; raw `<img>` tags; security — user-controlled `src` passed to `<Image>` without domain whitelist in `next.config.ts`; Sanity assets not going through `urlFor()` |

---

## Designer Synthesis Phase

One designer agent reads all audit findings and produces `REMEDIATION.md`.

### Remediation Plan Structure

```
# UI Remediation Plan

## Group 1: Token Violations
## Group 2: Typography Consistency
## Group 3: Spacing & Layout
## Group 4: Responsiveness
## Group 5: Interactive States
## Group 6: Image Quality & Performance
## Group 7: File Hygiene

## CMS Dependencies (flag only — no execution plan)
```

Each group entry specifies:
- File + line
- What to change and what to change it to
- Which token or guideline justifies the fix
- Cross-cutting decisions noted at group level (e.g. unified card hover treatment)

### Designer Constraints

- No new colors or fonts — only tokens defined in `UI_GUIDELINES.md`
- No full layout redesigns — moderate depth only (grid tweaks, proportions, component reordering)
- Every fix must cite a token, rule, or pattern from `UI_GUIDELINES.md` or `COMPONENT_DESIGN.md`
- Fixes that improve quality at intermediate screen widths must use fluid/relative units, not additional breakpoints

### User Review Gate

User approves/rejects/modifies each group in `REMEDIATION.md` before execution begins. Execution only proceeds on approved groups.

---

## Execution Phase

A frontend executor agent works through each approved group:

- One atomic commit per fix
- TypeCheck (`npm run typecheck`) passes before each commit
- Fixes requiring CMS changes are skipped and added to `CMS-DEPS.md`
- No fix introduces new hardcoded values — all values from design tokens
- If `typegen` is needed (query/schema change), run `npm run typegen` first

---

## Deliverables

| File | Path | Produced by | Purpose |
|---|---|---|---|
| `AUDIT.md` | `docs/superpowers/ui-audit/AUDIT.md` | 4 parallel auditor agents | Raw findings per cluster |
| `REMEDIATION.md` | `docs/superpowers/ui-audit/REMEDIATION.md` | Designer agent | Prioritised fix plan — user review gate |
| `CMS-DEPS.md` | `docs/superpowers/ui-audit/CMS-DEPS.md` | Designer agent | CMS changes flagged, not executed |

---

## Constraints

- **Single breakpoint**: 820px — `max-[820px]:` for mobile overrides only
- **Design language**: warm, editorial, premium — no generic SaaS aesthetics introduced
- **No Vercel APIs, no Sanity writes from forms, `output: standalone` never removed**
- **`next/image` always** — never raw `<img>`
- **CSS modules only** for JS-driven custom properties — not to avoid long Tailwind classes
