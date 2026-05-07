import { describe, expect, it } from 'vitest'
import { splitAmenityColumns } from '@/ui/pages/our-homes/amenity-columns'

type Amenity = { name: string | null; icon: string | null }

describe('splitAmenityColumns', () => {
	it('returns three empty arrays for empty input', () => {
		expect(splitAmenityColumns([])).toEqual([[], [], []])
	})

	it('puts first 9 in col 1, next 9 in col 2, next 9 in col 3', () => {
		const amenities: Amenity[] = Array.from({ length: 27 }, (_, i) => ({
			name: `A${i}`,
			icon: null,
		}))
		const [col1, col2, col3] = splitAmenityColumns(amenities)
		expect(col1).toHaveLength(9)
		expect(col2).toHaveLength(9)
		expect(col3).toHaveLength(9)
		expect(col1[0].name).toBe('A0')
		expect(col2[0].name).toBe('A9')
		expect(col3[0].name).toBe('A18')
	})

	it('handles fewer than 9 amenities — all in col 1', () => {
		const amenities: Amenity[] = [
			{ name: 'WiFi', icon: 'FaWifi' },
			{ name: 'Pool', icon: 'FaSwimmingPool' },
		]
		const [col1, col2, col3] = splitAmenityColumns(amenities)
		expect(col1).toHaveLength(2)
		expect(col2).toHaveLength(0)
		expect(col3).toHaveLength(0)
	})

	it('handles 10 amenities — 9 in col 1, 1 in col 2', () => {
		const amenities: Amenity[] = Array.from({ length: 10 }, (_, i) => ({
			name: `A${i}`,
			icon: null,
		}))
		const [col1, col2, col3] = splitAmenityColumns(amenities)
		expect(col1).toHaveLength(9)
		expect(col2).toHaveLength(1)
		expect(col3).toHaveLength(0)
	})

	it('caps at 27 — ignores extras beyond index 26', () => {
		const amenities: Amenity[] = Array.from({ length: 30 }, (_, i) => ({
			name: `A${i}`,
			icon: null,
		}))
		const [col1, col2, col3] = splitAmenityColumns(amenities)
		expect(col1).toHaveLength(9)
		expect(col2).toHaveLength(9)
		expect(col3).toHaveLength(9)
	})
})
