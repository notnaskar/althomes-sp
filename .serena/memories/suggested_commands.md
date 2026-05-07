# Suggested Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run typecheck    # tsc --noEmit
npm run typegen      # Regenerate Sanity types from schema + queries
npm run lint         # next lint
npm run format       # Prettier on all TS/JS files
```

## Key rule
Run `typegen` after changing any GROQ query in `src/sanity/lib/queries.ts` or schema in `src/sanity/schemaTypes/`.
Output: `src/sanity/types.ts` (auto-generated, do NOT hand-edit).

## Port management
Kill stale ports: `lsof -ti :3000/:3001 | xargs kill -9`
