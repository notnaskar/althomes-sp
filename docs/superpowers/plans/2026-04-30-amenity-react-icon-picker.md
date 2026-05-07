# Amenity React Icon Picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the plain-string amenity icon field with a searchable icon picker in Sanity Studio and render the selected icon as an SVG on the property detail page.

**Architecture:** A curated static map of ~80 fa6 + md react-icons is shared between Studio (picker grid) and the public frontend (SSR renderer). The amenity schema field stays `string` — no migration. The frontend `ReactIcon` atom does a map lookup and renders the SVG component server-side.

**Tech Stack:** react-icons v5, Sanity v3 custom input API (`@sanity/ui`, `set`/`unset` patches), Next.js 16 App Router (SSR), Vitest

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/ui/atoms/icon-map.ts` | Create | Curated ICON_MAP + `getIcon()` utility |
| `src/ui/atoms/react-icon.tsx` | Create | Public-facing ReactIcon atom |
| `src/sanity/ui/icon-picker.tsx` | Create | Studio custom input: searchable icon grid |
| `src/sanity/schemaTypes/documents/amenity.ts` | Modify | Wire `components.input` to IconPicker |
| `src/app/(site)/our-homes/[slug]/page.tsx` | Modify | Replace raw emoji spans with `<ReactIcon>` |
| `tests/unit/icon-map.test.ts` | Create | Unit tests for `getIcon()` |

---

## Task 1: Static Icon Map

**Files:**
- Create: `src/ui/atoms/icon-map.ts`
- Create: `tests/unit/icon-map.test.ts`

- [ ] **Step 1: Create the icon map file**

```ts
// src/ui/atoms/icon-map.ts
import type { IconType } from 'react-icons'
import {
  FaWifi,
  FaPersonSwimming,
  FaBed,
  FaCar,
  FaUtensils,
  FaUmbrellaBeach,
  FaHotTubPerson,
  FaTv,
  FaKitchenSet,
  FaSnowflake,
  FaFire,
  FaSpa,
  FaBicycle,
  FaDumbbell,
  FaShirt,
  FaTree,
  FaMountain,
  FaWater,
  FaWineGlass,
  FaMugHot,
  FaShield,
  FaParking,
  FaBaby,
  FaDog,
  FaSmokingBan,
  FaSmoking,
  FaWheelchair,
  FaElevator,
  FaLock,
  FaKey,
  FaCamera,
  FaHouseChimney,
  FaConciergeBell,
  FaUmbrella,
  FaSun,
  FaMusic,
  FaGamepad,
  FaBook,
  FaTableTennis,
  FaLeaf,
} from 'react-icons/fa6'
import {
  MdOutlineAcUnit,
  MdOutlineLocalLaundryService,
  MdOutlineBalcony,
  MdOutlinePool,
  MdOutlineKitchen,
  MdOutlineMicrowave,
  MdOutlineFitnessCenter,
  MdOutlineWifi,
  MdOutlineLocalParking,
  MdOutlineSmokeFree,
  MdOutlineSmokingRooms,
  MdOutlinePets,
  MdOutlineChildFriendly,
  MdOutlineAccessible,
  MdOutlineElevator,
  MdOutlineSecurity,
  MdOutlineHotTub,
  MdOutlineBeachAccess,
  MdOutlineIron,
  MdOutlineRoofing,
  MdOutlineYard,
  MdOutlineLocalDining,
  MdOutlineRoomService,
  MdOutlineTv,
  MdOutlineFireplace,
  MdOutlineBathtub,
  MdOutlineShower,
  MdOutlineKingBed,
  MdOutlineSingleBed,
  MdOutlineDeck,
  MdOutlineCoffeemaker,
  MdOutlineDirectionsBike,
  MdOutlineDirectionsCar,
  MdOutlineNaturePeople,
  MdOutlineLandscape,
  MdOutlineWaterDrop,
  MdOutlineGrill,
  MdOutlineSportsFootball,
  MdOutlineMedicalServices,
} from 'react-icons/md'

export const ICON_MAP: Record<string, IconType> = {
  // fa6
  FaWifi,
  FaPersonSwimming,
  FaBed,
  FaCar,
  FaUtensils,
  FaUmbrellaBeach,
  FaHotTubPerson,
  FaTv,
  FaKitchenSet,
  FaSnowflake,
  FaFire,
  FaSpa,
  FaBicycle,
  FaDumbbell,
  FaShirt,
  FaTree,
  FaMountain,
  FaWater,
  FaWineGlass,
  FaMugHot,
  FaShield,
  FaParking,
  FaBaby,
  FaDog,
  FaSmokingBan,
  FaSmoking,
  FaWheelchair,
  FaElevator,
  FaLock,
  FaKey,
  FaCamera,
  FaHouseChimney,
  FaConciergeBell,
  FaUmbrella,
  FaSun,
  FaMusic,
  FaGamepad,
  FaBook,
  FaTableTennis,
  FaLeaf,
  // md
  MdOutlineAcUnit,
  MdOutlineLocalLaundryService,
  MdOutlineBalcony,
  MdOutlinePool,
  MdOutlineKitchen,
  MdOutlineMicrowave,
  MdOutlineFitnessCenter,
  MdOutlineWifi,
  MdOutlineLocalParking,
  MdOutlineSmokeFree,
  MdOutlineSmokingRooms,
  MdOutlinePets,
  MdOutlineChildFriendly,
  MdOutlineAccessible,
  MdOutlineElevator,
  MdOutlineSecurity,
  MdOutlineHotTub,
  MdOutlineBeachAccess,
  MdOutlineIron,
  MdOutlineRoofing,
  MdOutlineYard,
  MdOutlineLocalDining,
  MdOutlineRoomService,
  MdOutlineTv,
  MdOutlineFireplace,
  MdOutlineBathtub,
  MdOutlineShower,
  MdOutlineKingBed,
  MdOutlineSingleBed,
  MdOutlineDeck,
  MdOutlineCoffeemaker,
  MdOutlineDirectionsBike,
  MdOutlineDirectionsCar,
  MdOutlineNaturePeople,
  MdOutlineLandscape,
  MdOutlineWaterDrop,
  MdOutlineGrill,
  MdOutlineSportsFootball,
  MdOutlineMedicalServices,
}

export function getIcon(name: string | null | undefined): IconType | null {
  if (!name) return null
  return ICON_MAP[name] ?? null
}
```

- [ ] **Step 2: Write the unit test**

```ts
// tests/unit/icon-map.test.ts
import { describe, it, expect } from 'vitest'
import { getIcon, ICON_MAP } from '@/ui/atoms/icon-map'

describe('getIcon', () => {
  it('returns a function for a known icon name', () => {
    const icon = getIcon('FaWifi')
    expect(icon).toBeDefined()
    expect(typeof icon).toBe('function')
  })

  it('returns null for unknown icon name', () => {
    expect(getIcon('NotAnIcon')).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(getIcon('')).toBeNull()
  })

  it('returns null for null', () => {
    expect(getIcon(null)).toBeNull()
  })

  it('returns null for undefined', () => {
    expect(getIcon(undefined)).toBeNull()
  })

  it('ICON_MAP contains at least 60 icons', () => {
    expect(Object.keys(ICON_MAP).length).toBeGreaterThanOrEqual(60)
  })
})
```

- [ ] **Step 3: Run tests — expect PASS**

```bash
npm run test -- tests/unit/icon-map.test.ts
```

Expected: all 6 tests pass. If any icon import fails (icon doesn't exist in the installed version), remove that specific icon from `ICON_MAP` and re-run.

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/ui/atoms/icon-map.ts tests/unit/icon-map.test.ts
git commit -m "feat(icons): add curated fa6+md icon map with getIcon utility"
```

---

## Task 2: ReactIcon Atom

**Files:**
- Create: `src/ui/atoms/react-icon.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/ui/atoms/react-icon.tsx
import { getIcon } from '@/ui/atoms/icon-map'

interface ReactIconProps {
  name: string | null | undefined
  size?: number
  className?: string
}

export default function ReactIcon({ name, size = 24, className }: ReactIconProps) {
  const IconComp = getIcon(name)
  if (!IconComp) return null
  return <IconComp size={size} className={className} />
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/ui/atoms/react-icon.tsx
git commit -m "feat(icons): add ReactIcon atom — SSR-safe icon renderer"
```

---

## Task 3: Studio Icon Picker Input

**Files:**
- Create: `src/sanity/ui/icon-picker.tsx`

- [ ] **Step 1: Create the Studio input component**

```tsx
// src/sanity/ui/icon-picker.tsx
import type { StringInputProps } from 'sanity'
import { set, unset } from 'sanity'
import { Card, Flex, Grid, Stack, Text, TextInput } from '@sanity/ui'
import React, { useState } from 'react'
import { ICON_MAP } from '@/ui/atoms/icon-map'

export default function IconPicker({ value, onChange }: StringInputProps) {
  const [search, setSearch] = useState('')

  const entries = Object.entries(ICON_MAP).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  const CurrentIcon = value ? ICON_MAP[value] : null

  return (
    <Stack space={3}>
      {CurrentIcon && (
        <Flex align="center" gap={3}>
          <CurrentIcon size={28} />
          <Text size={1} muted>
            {value}
          </Text>
        </Flex>
      )}

      <TextInput
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        placeholder="Search icons (e.g. wifi, pool, bed)…"
      />

      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        <Grid columns={8} gap={1}>
          {entries.map(([name, IconComp]) => (
            <Card
              key={name}
              tone={value === name ? 'primary' : 'default'}
              padding={2}
              radius={2}
              style={{ cursor: 'pointer', textAlign: 'center' }}
              onClick={() => onChange(set(name))}
              title={name}
            >
              <IconComp size={20} />
            </Card>
          ))}
        </Grid>
      </div>

      {value && (
        <Text
          size={1}
          style={{ cursor: 'pointer', color: 'var(--card-muted-fg-color)' }}
          onClick={() => onChange(unset())}
        >
          Clear selection
        </Text>
      )}
    </Stack>
  )
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/ui/icon-picker.tsx
git commit -m "feat(studio): add searchable icon picker input for amenity icons"
```

---

## Task 4: Wire Icon Picker into Amenity Schema

**Files:**
- Modify: `src/sanity/schemaTypes/documents/amenity.ts`

- [ ] **Step 1: Update the amenity schema**

Replace the entire file content:

```ts
// src/sanity/schemaTypes/documents/amenity.ts
import { defineField, defineType } from 'sanity'
import IconPicker from '@/sanity/ui/icon-picker'

export default defineType({
  name: 'amenity',
  title: 'Amenity',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Search and select an icon from the picker below.',
      components: { input: IconPicker },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/sanity/schemaTypes/documents/amenity.ts
git commit -m "feat(schema): wire icon picker input to amenity icon field"
```

---

## Task 5: Render ReactIcon on Property Detail Page

**Files:**
- Modify: `src/app/(site)/our-homes/[slug]/page.tsx`

There are two amenity render spots in this file.

- [ ] **Step 1: Add ReactIcon import**

Find the existing imports at the top of `src/app/(site)/our-homes/[slug]/page.tsx` and add:

```tsx
import ReactIcon from '@/ui/atoms/react-icon'
```

- [ ] **Step 2: Update Spot 1 — amenity hero cards (line ~152)**

Find this block:

```tsx
{property.amenities?.slice(0, 2).map((amenity, i) => (
  <div key={i} className="flex w-[82px] flex-col items-center gap-[3px]">
    <div className="h-[46px] w-[46px]" />
    <p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
      {amenity.name}
    </p>
  </div>
))}
```

Replace with:

```tsx
{property.amenities?.slice(0, 2).map((amenity, i) => (
  <div key={i} className="flex w-[82px] flex-col items-center gap-[3px]">
    <div className="flex h-[46px] w-[46px] items-center justify-center text-foreground">
      <ReactIcon name={amenity.icon} size={36} />
    </div>
    <p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
      {amenity.name}
    </p>
  </div>
))}
```

- [ ] **Step 3: Update Spot 2 — amenities grid section (line ~390)**

Find this block:

```tsx
{property.amenities.map((amenity, i) => (
  <div
    key={i}
    className="flex items-center gap-3 rounded-xl border p-4"
  >
    {amenity.icon && (
      <span className="text-xl">{amenity.icon}</span>
    )}
    {amenity.name && (
      <span className="font-medium">{amenity.name}</span>
    )}
  </div>
))}
```

Replace with:

```tsx
{property.amenities.map((amenity, i) => (
  <div
    key={i}
    className="flex items-center gap-3 rounded-xl border p-4"
  >
    {amenity.icon && (
      <span className="text-foreground">
        <ReactIcon name={amenity.icon} size={24} />
      </span>
    )}
    {amenity.name && (
      <span className="font-medium">{amenity.name}</span>
    )}
  </div>
))}
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5: Run all unit tests**

```bash
npm test
```

Expected: all tests pass including the new icon-map tests.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(site\)/our-homes/\[slug\]/page.tsx
git commit -m "feat(ui): render ReactIcon for amenities on property detail page"
```

---

## Task 6: Smoke Test in Dev

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open Studio and verify picker works**

Navigate to `http://localhost:3000/studio`, open any Amenity document. Confirm:
- Icon picker search input appears
- Typing "wifi" filters to Wifi icons
- Clicking an icon selects it (shows preview above search)
- "Clear selection" resets the field
- Saving persists the icon name string in Sanity

- [ ] **Step 3: Verify frontend renders icons**

Navigate to `http://localhost:3000/our-homes/<any-property-slug>` for a property that has amenities with icons set. Confirm:
- Amenity hero cards (top of page) show SVG icons above the amenity name
- Amenities grid section shows SVG icons beside amenity names
- Amenities without icons set render gracefully (icon slot is empty, name still shows)

- [ ] **Step 4: Verify no console errors**

Open browser DevTools → Console. Confirm zero errors on the property detail page.
