# PMS SDK Availability Integration

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stub `searchAvailability` action with a real `@onemineral/pms-js-sdk` implementation that filters `/our-homes` properties by live availability, cached server-side for 120 seconds.

**Architecture:** A lazy singleton SDK client (`pms-client.ts`) is initialised once per process. `availability-cache.ts` wraps the SDK's `property.search()` in `unstable_cache` (120s TTL, keyed per unique arg tuple). The server action returns an `ok`-discriminated union; both UI call sites handle errors inline without propagating them to parents.

**Tech Stack:** `@onemineral/pms-js-sdk` v0.2.12, Next.js App Router `unstable_cache`, Zod v3, Vitest

---

## File Map

| Path | Status | Responsibility |
|------|--------|----------------|
| `src/lib/pms-client.ts` | **Create** | Lazy singleton SDK client |
| `src/lib/availability-cache.ts` | **Create** | `unstable_cache`-wrapped SDK search |
| `src/actions/availability.ts` | **Modify** | Server action — `ok` union return, Zod gate |
| `src/lib/schemas/availability.ts` | **Modify** | Add past-date refine |
| `src/ui/forms/availability-form.tsx` | **Modify** | Add inline `error` state |
| `src/ui/pages/our-homes/our-homes-client.tsx` | **Modify** | Handle `ok` union, add `searchError` state |
| `tests/setup.ts` | **Modify** | Add `RENTALWISE_*` env vars + `next/cache` mock |
| `tests/unit/forms/availability.schema.test.ts` | **Modify** | Update stale past-dates + add past-date test |
| `tests/unit/lib/availability-cache.test.ts` | **Create** | SDK call params + ID mapping |
| `tests/unit/actions/availability.test.ts` | **Create** | Return type + error path |

---

## Task 1: Create branch and install SDK

**Files:**
- Modify: `package.json` (automatic)

- [ ] **Step 1: Create feature branch**

```bash
git checkout -b feature/pms-sdk-availability
```

Expected: `Switched to a new branch 'feature/pms-sdk-availability'`

- [ ] **Step 2: Install SDK**

```bash
npm install @onemineral/pms-js-sdk
```

- [ ] **Step 3: Verify installation**

```bash
node -e "const { newPmsClient } = require('@onemineral/pms-js-sdk'); console.log(typeof newPmsClient)"
```

Expected: `function`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @onemineral/pms-js-sdk"
```

---

## Task 2: PMS client singleton

**Files:**
- Create: `src/lib/pms-client.ts`

- [ ] **Step 1: Create `src/lib/pms-client.ts`**

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

- [ ] **Step 2: Commit**

```bash
git add src/lib/pms-client.ts
git commit -m "feat: add PMS SDK client singleton"
```

---

## Task 3: Add RENTALWISE env vars and next/cache mock to test setup

**Files:**
- Modify: `tests/setup.ts`

- [ ] **Step 1: Add to `tests/setup.ts`**

After the existing `process.env.NEXT_PUBLIC_SANITY_DATASET` line, add:

```typescript
process.env.RENTALWISE_API_HOST = 'https://test.rentalwise.com'
process.env.RENTALWISE_API_TOKEN = 'test-token'
```

After the last existing `vi.mock(...)` call, add:

```typescript
vi.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: unknown[]) => unknown) => fn,
}))
```

- [ ] **Step 2: Run existing tests to confirm nothing broken**

```bash
npx vitest run tests/unit
```

Expected: All pass.

- [ ] **Step 3: Commit**

```bash
git add tests/setup.ts
git commit -m "test: add RENTALWISE env vars and next/cache mock to setup"
```

---

## Task 4: Zod schema — past-date guard + fix stale test dates

**Files:**
- Modify: `src/lib/schemas/availability.ts`
- Modify: `tests/unit/forms/availability.schema.test.ts`

- [ ] **Step 1: Replace `tests/unit/forms/availability.schema.test.ts` with updated tests**

All dates updated to 2030 (well past today). New past-date test added at the end.

```typescript
import { describe, expect, it } from 'vitest'
import { availabilitySchema } from '@/lib/schemas/availability'

describe('availability search Zod schema', () => {
  it('valid future checkIn, checkOut, guests returns success: true', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2030-06-01',
      checkOut: '2030-06-07',
      guests: 2,
    })
    expect(result.success).toBe(true)
  })

  it('missing checkIn returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '',
      checkOut: '2030-06-07',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkIn')
  })

  it('missing checkOut returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2030-06-01',
      checkOut: '',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkOut')
  })

  it('checkOut before checkIn returns error on checkOut field', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2030-06-10',
      checkOut: '2030-06-05',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkOut')
  })

  it('guests less than 1 returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2030-06-01',
      checkOut: '2030-06-07',
      guests: 0,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('guests')
  })

  it('past checkIn returns error on checkIn field', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2020-01-01',
      checkOut: '2020-01-07',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkIn')
  })
})
```

- [ ] **Step 2: Run tests — confirm 5 pass, 1 fail (past-date test fails before schema update)**

```bash
npx vitest run tests/unit/forms/availability.schema.test.ts
```

Expected: 5 pass, `past checkIn returns error` fails.

- [ ] **Step 3: Replace `src/lib/schemas/availability.ts`**

```typescript
import { z } from 'zod'

export const availabilitySchema = z
  .object({
    checkIn: z.string().min(1, 'Check-in date is required'),
    checkOut: z.string().min(1, 'Check-out date is required'),
    guests: z.number().min(1, 'At least 1 guest required'),
  })
  .refine((d) => d.checkIn >= new Date().toISOString().split('T')[0], {
    message: 'Check-in must be today or later',
    path: ['checkIn'],
  })
  .refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  })

export type AvailabilityInput = z.infer<typeof availabilitySchema>
```

- [ ] **Step 4: Run tests to confirm all 6 pass**

```bash
npx vitest run tests/unit/forms/availability.schema.test.ts
```

Expected: All 6 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/schemas/availability.ts tests/unit/forms/availability.schema.test.ts
git commit -m "feat: add past-date guard to availability schema"
```

---

## Task 5: Availability cache

**Files:**
- Create: `src/lib/availability-cache.ts`
- Create: `tests/unit/lib/availability-cache.test.ts`

- [ ] **Step 1: Write failing tests — create `tests/unit/lib/availability-cache.test.ts`**

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockSearch = vi.fn()

vi.mock('@/lib/pms-client', () => ({
  getPmsClient: () => ({ property: { search: mockSearch } }),
}))

const { getCachedAvailableIds } = await import('@/lib/availability-cache')

describe('getCachedAvailableIds', () => {
  beforeEach(() => mockSearch.mockReset())

  it('calls property.search with correct daterange and guests', async () => {
    mockSearch.mockResolvedValue({ response: { data: [] } })
    await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(mockSearch).toHaveBeenCalledWith({
      daterange: { start: '2030-06-01', end: '2030-06-07' },
      guests: 2,
    })
  })

  it('returns external_id strings from response', async () => {
    mockSearch.mockResolvedValue({
      response: { data: [{ external_id: 'prop-1' }, { external_id: 'prop-2' }] },
    })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual(['prop-1', 'prop-2'])
  })

  it('filters out null and undefined external_ids', async () => {
    mockSearch.mockResolvedValue({
      response: {
        data: [
          { external_id: 'prop-1' },
          { external_id: null },
          { external_id: undefined },
          { external_id: 'prop-3' },
        ],
      },
    })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual(['prop-1', 'prop-3'])
  })

  it('returns empty array when response data is empty', async () => {
    mockSearch.mockResolvedValue({ response: { data: [] } })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual([])
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run tests/unit/lib/availability-cache.test.ts
```

Expected: FAIL — `Cannot find module '@/lib/availability-cache'`

- [ ] **Step 3: Create `src/lib/availability-cache.ts`**

```typescript
import { unstable_cache } from 'next/cache'
import type { Property } from '@onemineral/pms-js-sdk'
import { getPmsClient } from './pms-client'

async function fetchAvailableIds(
  checkIn: string,
  checkOut: string,
  guests: number,
): Promise<string[]> {
  const res = await getPmsClient().property.search({
    daterange: { start: checkIn, end: checkOut },
    guests,
  })
  // PaginatedResponse shape: res.response.data is T[]
  return (res.response.data ?? [])
    .map((p: Property) => p.external_id)
    .filter((id): id is string => typeof id === 'string')
}

// unstable_cache includes JSON.stringify(args) in the invocation key —
// each unique (checkIn, checkOut, guests) tuple gets its own cache entry.
export const getCachedAvailableIds = unstable_cache(fetchAvailableIds, ['availability'], {
  revalidate: 120,
})
```

- [ ] **Step 4: Run tests to confirm all 4 pass**

```bash
npx vitest run tests/unit/lib/availability-cache.test.ts
```

Expected: All 4 pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/availability-cache.ts tests/unit/lib/availability-cache.test.ts
git commit -m "feat: add availability cache with unstable_cache (120s TTL)"
```

---

## Task 6: Implement searchAvailability action

**Files:**
- Modify: `src/actions/availability.ts`
- Create: `tests/unit/actions/availability.test.ts`

- [ ] **Step 1: Write failing tests — create `tests/unit/actions/availability.test.ts`**

```typescript
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockGetCachedAvailableIds = vi.fn()

vi.mock('@/lib/availability-cache', () => ({
  getCachedAvailableIds: mockGetCachedAvailableIds,
}))

const { searchAvailability } = await import('@/actions/availability')

const validInput = {
  checkIn: '2030-06-01',
  checkOut: '2030-06-07',
  guests: 2,
}

describe('searchAvailability', () => {
  beforeEach(() => mockGetCachedAvailableIds.mockReset())

  it('returns ok:true with availableIds on success', async () => {
    mockGetCachedAvailableIds.mockResolvedValue(['prop-1', 'prop-2'])
    const result = await searchAvailability(validInput)
    expect(result).toEqual({ ok: true, availableIds: ['prop-1', 'prop-2'] })
  })

  it('returns ok:false with error message when SDK throws', async () => {
    mockGetCachedAvailableIds.mockRejectedValue(new Error('API error'))
    const result = await searchAvailability(validInput)
    expect(result).toEqual({
      ok: false,
      error: 'Availability search failed. Please try again.',
    })
  })

  it('returns ok:false for invalid input without calling SDK', async () => {
    const result = await searchAvailability({ checkIn: '', checkOut: '2030-06-07', guests: 2 })
    expect(result).toEqual({ ok: false, error: 'Invalid search parameters.' })
    expect(mockGetCachedAvailableIds).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx vitest run tests/unit/actions/availability.test.ts
```

Expected: FAIL — stub returns `{ availableIds: null }`, not the discriminated union.

- [ ] **Step 3: Replace `src/actions/availability.ts`**

```typescript
'use server'

import { availabilitySchema, type AvailabilityInput } from '@/lib/schemas/availability'
import { getCachedAvailableIds } from '@/lib/availability-cache'

export type AvailabilityResult =
  | { ok: true; availableIds: string[] }
  | { ok: false; error: string }

export async function searchAvailability(data: AvailabilityInput): Promise<AvailabilityResult> {
  const parsed = availabilitySchema.safeParse(data)
  if (!parsed.success) return { ok: false, error: 'Invalid search parameters.' }
  try {
    const ids = await getCachedAvailableIds(
      parsed.data.checkIn,
      parsed.data.checkOut,
      parsed.data.guests,
    )
    return { ok: true, availableIds: ids }
  } catch (err) {
    console.error('[searchAvailability]', err)
    return { ok: false, error: 'Availability search failed. Please try again.' }
  }
}
```

- [ ] **Step 4: Run tests to confirm all 3 pass**

```bash
npx vitest run tests/unit/actions/availability.test.ts
```

Expected: All 3 pass.

- [ ] **Step 5: Run full unit suite**

```bash
npx vitest run tests/unit
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/actions/availability.ts tests/unit/actions/availability.test.ts
git commit -m "feat: implement searchAvailability with PMS SDK and ok-union return"
```

---

## Task 7: AvailabilityForm — inline error state

**Files:**
- Modify: `src/ui/forms/availability-form.tsx`

The `onResult` prop type narrows from `(string[] | null) => void` to `(string[]) => void` — error path no longer calls `onResult`. TypeScript contravariance guarantees existing callers (`property-search.tsx`, `availability-search/index.tsx`) are still compatible without changes.

- [ ] **Step 1: Replace `src/ui/forms/availability-form.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { searchAvailability } from '@/actions/availability'
import {
  availabilitySchema,
  type AvailabilityInput,
} from '@/lib/schemas/availability'

type Props = {
  onResult: (availableIds: string[]) => void
}

export default function AvailabilityForm({ onResult }: Props) {
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AvailabilityInput>({
    resolver: zodResolver(availabilitySchema),
  })

  async function onSubmit(data: AvailabilityInput) {
    setError(null)
    const result = await searchAvailability(data)
    if (!result.ok) {
      setError(result.error)
      return
    }
    onResult(result.availableIds)
  }

  const inputClass =
    'w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background'
  const labelClass =
    'block text-xs font-semibold uppercase tracking-[0.1em] mb-1 text-muted'

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-wrap items-end gap-4"
      noValidate
    >
      <div className="min-w-[140px] flex-1">
        <label htmlFor="av-checkIn" className={labelClass}>
          Check In
        </label>
        <input
          id="av-checkIn"
          type="date"
          {...register('checkIn')}
          className={inputClass}
        />
        {errors.checkIn && (
          <p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>
        )}
      </div>

      <div className="min-w-[140px] flex-1">
        <label htmlFor="av-checkOut" className={labelClass}>
          Check Out
        </label>
        <input
          id="av-checkOut"
          type="date"
          {...register('checkOut')}
          className={inputClass}
        />
        {errors.checkOut && (
          <p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>
        )}
      </div>

      <div className="w-24">
        <label htmlFor="av-guests" className={labelClass}>
          Guests
        </label>
        <input
          id="av-guests"
          type="number"
          min={1}
          {...register('guests', { valueAsNumber: true })}
          className={inputClass}
        />
        {errors.guests && (
          <p className="mt-1 text-xs text-red-600">{errors.guests.message}</p>
        )}
      </div>

      <div className="flex flex-col items-start gap-1">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[5px] bg-accent px-8 py-3 text-sm font-bold whitespace-nowrap text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Searching…' : 'CHECK AVAILABILITY'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </form>
  )
}
```

- [ ] **Step 2: Run typecheck — confirm no errors in callers**

```bash
npm run typecheck
```

Expected: No errors. (`property-search.tsx` and `availability-search/index.tsx` need no changes — `Dispatch<SetStateAction<string[] | null>>` is assignable to `(string[]) => void` by contravariance.)

- [ ] **Step 3: Commit**

```bash
git add src/ui/forms/availability-form.tsx
git commit -m "feat: add inline error state to AvailabilityForm"
```

---

## Task 8: OurHomesClient — handle ok-discriminated union

**Files:**
- Modify: `src/ui/pages/our-homes/our-homes-client.tsx`

- [ ] **Step 1: Add `searchError` state**

In `src/ui/pages/our-homes/our-homes-client.tsx`, after the existing `const [isSearching, setIsSearching] = useState(false)` line, add:

```typescript
const [searchError, setSearchError] = useState<string | null>(null)
```

- [ ] **Step 2: Replace `handleSearch` function**

Find the `handleSearch` function (starts with `async function handleSearch()`) and replace it entirely:

```typescript
async function handleSearch() {
  if (!range?.from || !range?.to) {
    setErrors({ dates: 'Select check-in and check-out dates' })
    return
  }
  setErrors({})
  setSearchError(null)
  setIsSearching(true)
  const result = await searchAvailability({
    checkIn: format(range.from, 'yyyy-MM-dd'),
    checkOut: format(range.to, 'yyyy-MM-dd'),
    guests: adults + children,
  })
  setIsSearching(false)
  if (!result.ok) {
    setSearchError(result.error)
    return
  }
  setAvailableIds(result.availableIds)
}
```

- [ ] **Step 3: Render searchError inline**

Locate the search submit button in the JSX (the button that calls `handleSearch` with `onClick`). Immediately after the closing `</button>` tag, add:

```tsx
{searchError && (
  <p className="mt-1 text-xs text-red-600">{searchError}</p>
)}
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 5: Run all unit tests**

```bash
npx vitest run tests/unit
```

Expected: All pass.

- [ ] **Step 6: Commit**

```bash
git add src/ui/pages/our-homes/our-homes-client.tsx
git commit -m "feat: handle availability search errors in OurHomesClient"
```

---

## Task 9: Final verification

- [ ] **Step 1: Run typecheck**

```bash
npm run typecheck
```

Expected: No errors.

- [ ] **Step 2: Run full unit test suite**

```bash
npx vitest run tests/unit
```

Expected: All pass.

- [ ] **Step 3: Start dev server and manually verify**

Ensure `.env.local` has both `RENTALWISE_API_HOST` and `RENTALWISE_API_TOKEN` set.

```bash
npm run dev
```

Open `http://localhost:3001/our-homes`. Enter a future check-in/check-out date range and submit. Confirm the property list filters to available units.

**Error path test:** Temporarily set `RENTALWISE_API_TOKEN=invalid` in `.env.local`, restart the server, and submit a search. Confirm the inline error message appears below the submit button (both the custom bar and `AvailabilityForm` if accessible).

- [ ] **Step 4: Restore correct token and do a final lint**

```bash
npm run lint
```

Expected: No errors.
