# Availability Form UX Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire Sonner toasts, fix searchError placement, add grid dimming, reset mechanism, empty state CTA, guest cap, and delete three dead UI files.

**Architecture:** All changes land in `OurHomesClient` (the single live availability UI) plus a one-line addition to the site layout. No new abstractions — surgical edits only.

**Tech Stack:** Next.js 15 App Router, React, Sonner, react-day-picker, date-fns, Tailwind 4, Vitest

---

## File Map

| File | Action | What changes |
|---|---|---|
| `package.json` | Modify | Add `sonner` dependency |
| `src/app/(site)/layout.tsx` | Modify | Import + render `<Toaster>` after `<SanityLive />` (line 184) |
| `src/ui/pages/our-homes/our-homes-client.tsx` | Modify | All UX changes (see tasks below) |
| `src/ui/forms/availability-form.tsx` | Delete | Dead — never rendered |
| `src/ui/availability-search/index.tsx` | Delete | Dead — never rendered |
| `src/ui/pages/our-homes/property-search.tsx` | Delete | Dead — never rendered |

---

## Task 1: Install Sonner and wire Toaster into site layout

**Files:**
- Modify: `package.json`
- Modify: `src/app/(site)/layout.tsx`

- [ ] **Step 1: Install sonner**

```bash
npm install sonner
```

Expected: `sonner` appears in `package.json` dependencies.

- [ ] **Step 2: Import Toaster in layout.tsx**

Add this import near the top of `src/app/(site)/layout.tsx`, after the existing UI imports:

```ts
import { Toaster } from 'sonner'
```

- [ ] **Step 3: Render Toaster after SanityLive**

In `src/app/(site)/layout.tsx`, find the `<SanityLive />` line (line 183). Add `<Toaster>` immediately after:

```tsx
<SanityLive />
<Toaster position="bottom-right" richColors />
```

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/app/\(site\)/layout.tsx
git commit -m "feat: install sonner and wire Toaster into site layout"
```

---

## Task 2: Delete dead UI files

**Files:**
- Delete: `src/ui/forms/availability-form.tsx`
- Delete: `src/ui/availability-search/index.tsx`
- Delete: `src/ui/pages/our-homes/property-search.tsx`

None of these files are imported anywhere in the app. Confirmed via grep — only self-referential exports.

- [ ] **Step 1: Verify nothing imports them**

```bash
grep -r "availability-form\|AvailabilityForm\|AvailabilitySearch\|availability-search\|PropertySearch\|property-search" \
  src --include="*.tsx" --include="*.ts" -l
```

Expected output (only the dead files themselves, no page or layout file):
```
src/ui/availability-search/index.tsx
src/ui/forms/availability-form.tsx
src/ui/pages/our-homes/property-search.tsx
```

If any other file appears, stop and investigate before deleting.

- [ ] **Step 2: Delete the three files**

```bash
rm src/ui/forms/availability-form.tsx
rm src/ui/availability-search/index.tsx
rm src/ui/pages/our-homes/property-search.tsx
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: delete dead availability UI files (never rendered)"
```

---

## Task 3: Refactor OurHomesClient state — remove searchError, add toast, add handleClearSearch

**Files:**
- Modify: `src/ui/pages/our-homes/our-homes-client.tsx`

- [ ] **Step 1: Add toast import**

At the top of `src/ui/pages/our-homes/our-homes-client.tsx`, add:

```ts
import { toast } from 'sonner'
```

- [ ] **Step 2: Remove searchError state**

Find and delete this line (~line 117):

```ts
const [searchError, setSearchError] = useState<string | null>(null)
```

- [ ] **Step 3: Add handleClearSearch function**

Add this function after `handleRangeSelect` (~line 142):

```ts
function handleClearSearch() {
  setAvailableIds(null)
  setRange(undefined)
  setAdults(1)
  setChildren(0)
}
```

- [ ] **Step 4: Update handleSearch to use toasts instead of searchError**

Replace the current `handleSearch` function (~lines 152–171) with:

```ts
async function handleSearch() {
  if (!range?.from || !range?.to) {
    setErrors({ dates: 'Select check-in and check-out dates' })
    return
  }
  setErrors({})
  setIsSearching(true)
  const result = await searchAvailability({
    checkIn: format(range.from, 'yyyy-MM-dd'),
    checkOut: format(range.to, 'yyyy-MM-dd'),
    guests: adults + children,
  })
  setIsSearching(false)
  if (!result.ok) {
    toast.error(result.error)
    return
  }
  setAvailableIds(result.availableIds)
  if (result.availableIds.length > 0) {
    const count = result.availableIds.length
    toast.success(`Found ${count} available propert${count === 1 ? 'y' : 'ies'}`)
  }
}
```

- [ ] **Step 5: Remove searchError display from JSX**

Find and delete this block (~lines 303–305, after the submit button):

```tsx
{searchError && (
  <p className="mt-1 text-xs text-red-600">{searchError}</p>
)}
```

- [ ] **Step 6: Update "Clear dates" button to also reset availableIds**

Find the "Clear dates" button onClick (~line 210):

```tsx
onClick={() => setRange(undefined)}
```

Replace with:

```tsx
onClick={() => { setRange(undefined); setAvailableIds(null) }}
```

- [ ] **Step 7: Typecheck**

```bash
npm run typecheck
```

Expected: no errors (searchError references all gone).

- [ ] **Step 8: Commit**

```bash
git add src/ui/pages/our-homes/our-homes-client.tsx
git commit -m "feat: replace searchError state with sonner toasts in OurHomesClient"
```

---

## Task 4: Add loading state on property grid + scroll-to-results

**Files:**
- Modify: `src/ui/pages/our-homes/our-homes-client.tsx`

- [ ] **Step 1: Add resultsRef**

In the existing refs block (~line 119, after `barRef`), add:

```ts
const resultsRef = useRef<HTMLElement>(null)
```

`useRef` is already imported — confirm `HTMLElement` generic is valid (it is, `<section>` maps to `HTMLElement`).

- [ ] **Step 2: Attach ref and add dimming class to property listing section**

Find the property listing section (~line 310):

```tsx
<section className="px-[90px] max-[820px]:px-[18px]">
```

Replace with:

```tsx
<section
  ref={resultsRef}
  className={`px-[90px] max-[820px]:px-[18px] transition-opacity duration-300${isSearching ? ' opacity-50 pointer-events-none' : ''}`}
>
```

- [ ] **Step 3: Scroll to results after setAvailableIds**

In `handleSearch`, after `setAvailableIds(result.availableIds)`, add:

```ts
setTimeout(() => {
  resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}, 50)
```

The 50ms delay lets React flush the state update and re-render before scrolling.

- [ ] **Step 4: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/ui/pages/our-homes/our-homes-client.tsx
git commit -m "feat: dim property grid during search, scroll to results on complete"
```

---

## Task 5: Add status line and empty state CTA

**Files:**
- Modify: `src/ui/pages/our-homes/our-homes-client.tsx`

- [ ] **Step 1: Add status line between search bar and property listing**

After the closing `</div>` of the availability bar div (~line 307), and before the `<section>` for the property listing, add:

```tsx
{availableIds !== null && (
  <div className="ml-[10%] mr-[10%] mb-2 flex items-center gap-2 font-sans text-xs text-muted tracking-[0.05em]">
    <span>
      Showing {displayed.length} of {properties.length} propert{properties.length === 1 ? 'y' : 'ies'}
    </span>
    <span>·</span>
    <button
      type="button"
      onClick={handleClearSearch}
      className="underline underline-offset-2 hover:text-foreground transition-colors"
    >
      Clear search
    </button>
  </div>
)}
```

- [ ] **Step 2: Replace empty state with CTA button**

Find the empty state block (~line 311–314):

```tsx
{availableIds !== null && displayed.length === 0 ? (
  <p className="py-12 text-center text-muted font-sans">
    No properties available for the selected dates. Try different dates.
  </p>
) : (
```

Replace with:

```tsx
{availableIds !== null && displayed.length === 0 ? (
  <div className="py-12 text-center">
    <p className="mb-6 font-sans text-muted">
      No properties available for the selected dates.
    </p>
    <button
      type="button"
      onClick={handleClearSearch}
      className="rounded-[5px] bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-accent-foreground transition hover:bg-accent/90"
    >
      Show all properties
    </button>
  </div>
) : (
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/ui/pages/our-homes/our-homes-client.tsx
git commit -m "feat: add search status line and empty state CTA to OurHomesClient"
```

---

## Task 6: Cap guest counters at 16

**Files:**
- Modify: `src/ui/pages/our-homes/our-homes-client.tsx`

- [ ] **Step 1: Cap adults increment**

Find the adults increment button onClick (~line 256):

```tsx
onClick={() => setAdults((v) => v + 1)}
```

Replace with:

```tsx
onClick={() => setAdults((v) => Math.min(16, v + 1))}
```

- [ ] **Step 2: Cap children increment**

Find the children increment button onClick (~line 287):

```tsx
onClick={() => setChildren((v) => v + 1)}
```

Replace with:

```tsx
onClick={() => setChildren((v) => Math.min(16, v + 1))}
```

- [ ] **Step 3: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Run full test suite**

```bash
npm test
```

Expected: all 68 tests pass (no OurHomesClient unit tests exist — this confirms no regression in server-side logic).

- [ ] **Step 5: Commit**

```bash
git add src/ui/pages/our-homes/our-homes-client.tsx
git commit -m "feat: cap adults and children counters at 16 in availability search"
```

---

## Task 7: Manual browser verification

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Navigate to /our-homes and verify each UX change**

Checklist:
- [ ] Search with valid dates → green success toast appears bottom-right
- [ ] Search with API error (disconnect network) → red error toast appears
- [ ] Status line "Showing X of Y properties · Clear search" appears after search
- [ ] "Clear search" link resets grid to all properties and clears date range
- [ ] During search, property grid dims (opacity-50)
- [ ] After search, page scrolls smoothly to property listing
- [ ] When 0 results: "Show all properties" button appears and resets correctly
- [ ] Adults counter stops at 16
- [ ] Children counter stops at 16
- [ ] No inline `searchError` paragraph visible anywhere

- [ ] **Step 3: Stop dev server and confirm typecheck clean**

```bash
npm run typecheck
```

Expected: no errors.
