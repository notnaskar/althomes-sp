# Testing

**Last mapped:** 2026-04-24

---

## Status: No Tests Configured

**Zero test coverage.** No test framework installed. No test files exist anywhere in the codebase.

---

## What's Missing

| Layer | Status |
|---|---|
| Unit tests | None |
| Integration tests | None |
| E2E tests | None |
| Component tests | None |
| Type checks | Available (`npm run typecheck`) |
| Linting | Available (`npm run lint`) |

---

## Available Quality Scripts (Non-Test)

```json
"typecheck": "tsc --noEmit"
"lint": "next lint"
"format": "prettier --write '**/*.{ts,tsx,js,jsx}'"
```

No `test` script in `package.json`.

---

## No Test Infrastructure

- No Jest, Vitest, Playwright, Cypress, or Testing Library packages in `package.json`
- No `__tests__/` or `*.test.ts` / `*.spec.ts` files
- No test configuration files (`jest.config.*`, `vitest.config.*`, `playwright.config.*`)
- No CI pipeline configured (no `.github/workflows/` or similar)

---

## Implications for Development

- Type safety is the primary correctness gate (`tsc --noEmit`)
- Sanity Presentation / visual editing provides manual preview verification
- No regression protection when modifying modules or GROQ queries
- Adding tests from scratch — no existing patterns to follow

---

## Recommended Starting Point (If Adding Tests)

Given the architecture (Next.js App Router + Sanity), pragmatic starting point:

1. **Vitest** for unit/component tests (works with Vite-compatible Next.js setup)
2. **Playwright** for E2E (Next.js has first-class Playwright support)
3. Start with GROQ query output shape tests and module component smoke tests
4. Mock Sanity client with `createClient` mock for isolated component tests
