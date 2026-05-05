# PMS SDK Availability Integration

**Date:** 2026-05-05
**Branch:** `feature/pms-sdk-availability`
**Status:** Approved

## Goal

Replace the stub `searchAvailability` server action with a real implementation using `@onemineral/pms-js-sdk`. Property availability form on `/our-homes` filters Sanity properties by matching against available property IDs returned from the PMS API. Responses are cached server-side to protect against API rate limits.

## Architecture

```
User submits form
  → searchAvailability() [server action, 'use server']
    → unstable_cache(sdkSearch, [checkIn, checkOut, guests], { revalidate: 900 })
      → cache HIT  → return cached external_ids
      → cache MISS → client.property.search({ daterange: { start, end }, guests })
                   → extract external_id[] from paginated results
                   → cache + return
  → success: { availableIds: string[] } → filter Sanity properties
  → error:   { error: string }          → inline error in form
```

## New Files

### `src/lib/pms-client.ts`

Lazy singleton SDK client. Initialised once per process.

```typescript
import { newPmsClient } from '@onemineral/pms-js-sdk'

let _client: ReturnType<typeof newPmsClient> | null = null

export function getPmsClient() {
  if (!_client) {
    _client = newPmsClient({
      baseURL: process.env.RENTALWISE_API_HOST!,
      tokenProvider: { get: () => process.env.RENTALWISE_API_TOKEN! },
    })
  }
  return _client
}
```

### `src/lib/availability-cache.ts`

`unstable_cache` wraps the raw SDK call. Primitive args form a serializable cache key.

```typescript
import { unstable_cache } from 'next/cache'
import { getPmsClient } from './pms-client'

async function fetchAvailableIds(checkIn: string, checkOut: string, guests: number) {
  const res = await getPmsClient().property.search({
    daterange: { start: checkIn, end: checkOut },
    guests,
  })
  return (res.data ?? []).map((p: any) => String(p.external_id)).filter(Boolean)
}

export const getCachedAvailableIds = unstable_cache(fetchAvailableIds, ['availability'], {
  revalidate: 900,
})
```

## Edited Files

### `src/actions/availability.ts`

Discriminated union return type. Zod re-validates at action boundary (defense in depth).

```typescript
'use server'
import { availabilitySchema, type AvailabilityInput } from '@/lib/schemas/availability'
import { getCachedAvailableIds } from '@/lib/availability-cache'

export type AvailabilityResult = { availableIds: string[] } | { error: string }

export async function searchAvailability(data: AvailabilityInput): Promise<AvailabilityResult> {
  const parsed = availabilitySchema.safeParse(data)
  if (!parsed.success) return { error: 'Invalid search parameters.' }
  try {
    const ids = await getCachedAvailableIds(parsed.data.checkIn, parsed.data.checkOut, parsed.data.guests)
    return { availableIds: ids }
  } catch {
    return { error: 'Availability search failed. Please try again.' }
  }
}
```

### `src/ui/forms/availability-form.tsx`

Adds local `error` state. Clears on new submit. Inline error displayed below submit button.

- `onResult` called only on success — error does not propagate to parent
- Error styled same as field validation errors (`text-xs text-red-600`)

### `src/ui/pages/our-homes/our-homes-client.tsx`

Adds `searchError` state for its direct `searchAvailability` call. Handles discriminated union. Renders inline error near the form.

## Return Type Change

`searchAvailability` changes from `{ availableIds: null }` stub to:

```typescript
{ availableIds: string[] } | { error: string }
```

`AvailabilityResult` is exported from `src/actions/availability.ts` for use by call sites.

All call sites updated:
- `AvailabilityForm.onSubmit` — handles error internally, calls `onResult` on success only
- `our-homes-client.tsx` handler — checks `'error' in result` before calling `setAvailableIds`

## Edge Cases

| Case | Behaviour |
|------|-----------|
| SDK returns `[]` | `{ availableIds: [] }` → existing "no properties found" UI |
| `external_id` null on some results | `.filter(Boolean)` drops silently |
| Env vars missing | `getPmsClient()` throws → caught → inline error |
| Rate limit hit (cold start burst) | SDK throws → caught → inline error |
| Same params within 15 min | Cache hit, no SDK call |

## Environment Variables

Already documented in CLAUDE.md. No new vars required.

```
RENTALWISE_API_HOST=   # staging URL for dev
RENTALWISE_API_TOKEN=
```

## Out of Scope

- Pagination (single page sufficient for alt-homes property count)
- Cache tag invalidation (TTL-only)
- `availability-search/index.tsx` cleanup
