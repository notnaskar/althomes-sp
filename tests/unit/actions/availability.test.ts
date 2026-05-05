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
		mockGetCachedAvailableIds.mockRejectedValueOnce(new Error('API error'))
		const result = await searchAvailability(validInput)
		expect(result).toEqual({
			ok: false,
			error: 'Availability search failed. Please try again.',
		})
	})

	it('returns ok:false for invalid input without calling SDK', async () => {
		const result = await searchAvailability({
			checkIn: '',
			checkOut: '2030-06-07',
			guests: 2,
		})
		expect(result).toEqual({ ok: false, error: 'Invalid search parameters.' })
		expect(mockGetCachedAvailableIds).not.toHaveBeenCalled()
	})
})
