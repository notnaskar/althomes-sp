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
