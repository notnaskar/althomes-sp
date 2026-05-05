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
