import { describe, it, expect } from 'vitest'
import { availabilitySchema } from '@/lib/schemas/availability'

describe('availability search Zod schema', () => {
  it('valid checkIn, checkOut, guests returns success: true', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2025-06-01',
      checkOut: '2025-06-07',
      guests: 2,
    })
    expect(result.success).toBe(true)
  })

  it('missing checkIn returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '',
      checkOut: '2025-06-07',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkIn')
  })

  it('missing checkOut returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2025-06-01',
      checkOut: '',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkOut')
  })

  it('checkOut before checkIn returns error on checkOut field', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2025-06-10',
      checkOut: '2025-06-05',
      guests: 2,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('checkOut')
  })

  it('guests less than 1 returns error', () => {
    const result = availabilitySchema.safeParse({
      checkIn: '2025-06-01',
      checkOut: '2025-06-07',
      guests: 0,
    })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('guests')
  })
})
