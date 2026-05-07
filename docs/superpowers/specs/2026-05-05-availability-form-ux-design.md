# Availability Form UX Improvements — Design Spec

**Date:** 2026-05-05  
**Branch:** feature/pms-sdk-availability  
**Scope:** `OurHomesClient` only — the single live availability UI on `/our-homes`

---

## Background

The availability search bar (`src/ui/pages/our-homes/our-homes-client.tsx`) has several UX gaps identified after PMS SDK integration:

- `searchError` renders inside the flex row — appears beside the button on desktop, not below it
- No async feedback beyond the button label changing to "SEARCHING…"
- No way to reset filtered results without refreshing
- No result count after search
- Guest counters unbounded (can go to 99+)
- "No results" empty state has no CTA
- Three dead UI files that never render

---

## Changes

### 1. Sonner Toast Library

**Install:** `sonner`

**Placement:** `<Toaster position="bottom-right" richColors />` in `src/app/(site)/layout.tsx`, alongside `<SanityLive />`.

**Toast triggers:**

| Event | Toast |
|---|---|
| Search returns ≥1 result | `toast.success("Found N available propert[y/ies]")` |
| Search returns 0 results | No toast — empty state UI handles it |
| API/network error | `toast.error(result.error)` |

**Removed:** `searchError` state and its `<p>` display in the flex row.

---

### 2. Loading State on Property Grid

While `isSearching === true`, the property listing section receives:

```
opacity-50 pointer-events-none transition-opacity duration-300
```

Reverts to full opacity when search completes. Button label already shows "SEARCHING…".

---

### 3. Reset Mechanism

**New function `handleClearSearch()`:**
```ts
function handleClearSearch() {
  setAvailableIds(null)
  setRange(undefined)
  setAdults(1)
  setChildren(0)
}
```

**Two trigger points:**
1. Existing "Clear dates" button — add `setAvailableIds(null)` to its onClick
2. Status line below search bar (visible when `availableIds !== null`):
   ```
   Showing 2 of 3 properties · Clear search
   ```
   "Clear search" is a button calling `handleClearSearch()`. Styled as muted text link.

---

### 4. Scroll to Results

Add `resultsRef = useRef<HTMLElement>(null)` on the property listing `<section>`.

After `setAvailableIds(result.availableIds)` in `handleSearch`:
```ts
resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
```

---

### 5. Empty State CTA

When `availableIds !== null && displayed.length === 0`:

```tsx
<div className="py-12 text-center">
  <p className="text-muted font-sans mb-4">
    No properties available for the selected dates.
  </p>
  <button
    onClick={handleClearSearch}
    className="rounded-[5px] bg-accent px-6 py-3 text-sm font-bold uppercase tracking-[0.3em] text-accent-foreground transition hover:bg-accent/90"
  >
    Show all properties
  </button>
</div>
```

---

### 6. Guest Counter Cap

Adults and children each cap independently at **16**.

```ts
setAdults((v) => Math.min(16, v + 1))
setChildren((v) => Math.min(16, v + 1))
```

---

### 7. Dead Code Deletion

Files to delete — none render on any page:

- `src/ui/forms/availability-form.tsx`
- `src/ui/availability-search/index.tsx`
- `src/ui/pages/our-homes/property-search.tsx`

`src/lib/schemas/availability.ts` is **kept** — used by `src/actions/availability.ts`.

---

## Files Changed

| File | Change |
|---|---|
| `package.json` | Add `sonner` |
| `src/app/(site)/layout.tsx` | Add `<Toaster richColors position="bottom-right" />` |
| `src/ui/pages/our-homes/our-homes-client.tsx` | All UX changes |
| `src/ui/forms/availability-form.tsx` | Delete |
| `src/ui/availability-search/index.tsx` | Delete |
| `src/ui/pages/our-homes/property-search.tsx` | Delete |

---

## Out of Scope

- Minimum nights validation (requires per-property config from PMS)
- Animation on property grid filter (Framer Motion adds dep weight)
- Refactoring OurHomesClient into sub-components
