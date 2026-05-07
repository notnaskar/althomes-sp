# Amenity React Icon Picker — Design Spec

**Date:** 2026-04-30  
**Status:** Approved  
**Scope:** Amenity document type only

---

## Problem

`amenity.icon` is a plain `string` field with description "Emoji or icon key". Editors have no discoverability — they must know icon names externally. No icon is rendered on the public site from this field.

---

## Solution Overview

Add a searchable icon picker input to the Sanity Studio for the `amenity.icon` field. Store the selected icon as a string name (e.g., `"FaWifi"`). Render it on the frontend via a static lookup map — SSR-safe, tree-shakeable, no dynamic imports.

---

## Icon Families

Restricted to two families:
- **`react-icons/fa6`** — Font Awesome 6 (property-relevant: wifi, pool, bed, car, utensils, etc.)
- **`react-icons/md`** — Material Design (broad coverage: AC, laundry, balcony, gym, etc.)

A curated list of ~80–100 icons is pre-selected from these families covering realistic amenity use cases.

---

## Components

### 1. Studio Icon Picker — `src/sanity/ui/icon-picker.tsx`

- Custom Sanity input component (`StringInputProps`)
- Text field for search/filter
- Icon grid showing matching icons (name + preview)
- Click to select — writes icon name string to schema field
- Search filters by icon name substring
- Runs inside Sanity Studio only; zero public-site footprint
- No network requests; all icons imported statically at Studio bundle time

### 2. Static Icon Map — `src/ui/atoms/icon-map.ts`

- Named static imports of curated fa6 + md icons
- Exports `ICON_MAP: Record<string, IconType>` — plain object lookup
- Exports `getIcon(name: string): IconType | null` — returns `null` for unknown names
- Tree-shakeable: only included icons enter the Next.js bundle
- No dynamic `import()` calls — SSR renders icons server-side without hydration gap

### 3. ReactIcon Atom — `src/ui/atoms/react-icon.tsx`

```tsx
interface ReactIconProps {
  name: string | null | undefined
  size?: number
  className?: string
}
```

- Calls `getIcon(name)`, renders the component if found
- Returns `null` for unknown/empty names — silent fallback, no crash
- Existing emoji values in `amenity.icon` render nothing (graceful degradation)

### 4. Amenity Schema Update — `src/sanity/schemaTypes/documents/amenity.ts`

- Add `components: { input: IconPicker }` to the `icon` field
- Update `description` to reflect icon picker usage
- Field type remains `string` — no migration, no typegen change required

### 5. Property Detail Page — amenity icon rendering

- Find wherever `amenity.icon` is consumed in the UI (property showcase / property detail)
- Replace raw string render with `<ReactIcon name={amenity.icon} />`

---

## Data Flow

```
Editor searches in Studio picker
  → selects icon (e.g. "FaWifi")
    → Sanity stores "FaWifi" as string
      → PROPERTY_QUERY fetches amenities[]->{ name, icon }
        → Frontend receives { name: "WiFi", icon: "FaWifi" }
          → <ReactIcon name="FaWifi" /> → getIcon("FaWifi") → FaWifi component → SVG
```

---

## Performance

- Static imports only — full tree-shaking via Next.js/webpack
- Only curated ~80–100 icons enter the public bundle (not entire icon packs)
- Icons render server-side (SSR) — no hydration delay, no layout shift
- No React.lazy, no dynamic import(), no runtime network requests

## SEO

- Icons are SVG elements rendered in the initial HTML response
- No client-only rendering — search crawlers see icon content

## Security

- Icon name from CMS is looked up against a fixed `ICON_MAP` object
- Unknown names return `null` — no eval, no raw HTML injection, no dynamic code execution
- Studio component is sandboxed inside Sanity Studio — no public route exposure

---

## Out of Scope

- Other schema types (card-list, experience, etc.) — future work
- Custom icon upload — not needed, react-icons covers all amenity use cases
- Icon color customization — handled via CSS `className` prop if needed
- Migrating existing emoji values — they silently render nothing; editors update at their own pace

---

## Files Changed

| File | Action |
|------|--------|
| `src/sanity/ui/icon-picker.tsx` | Create — Studio input component |
| `src/ui/atoms/icon-map.ts` | Create — static icon lookup map |
| `src/ui/atoms/react-icon.tsx` | Create — ReactIcon atom |
| `src/sanity/schemaTypes/documents/amenity.ts` | Update — add `components.input` |
| Property detail / showcase UI file | Update — render `<ReactIcon>` |
