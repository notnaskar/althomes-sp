'use server'

import type { AvailabilityInput } from '@/lib/schemas/availability'

export async function searchAvailability(_data: AvailabilityInput) {
	// TODO: wire RentalWise POST /rest/property/query
	return { availableIds: null }
}
