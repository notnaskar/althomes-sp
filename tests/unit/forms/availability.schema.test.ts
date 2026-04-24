import { describe, it } from 'vitest'

describe('availability search Zod schema', () => {
  it.todo('valid checkIn, checkOut, guests returns success: true')
  it.todo('missing checkIn returns error')
  it.todo('missing checkOut returns error')
  it.todo('checkOut before checkIn returns error on checkOut field')
  it.todo('guests = 0 returns error')
  it.todo('guests < 1 returns error')
})
