import { describe, it, expect } from 'vitest'
import { contactSchema } from '@/lib/schemas/contact'
import { submitContact } from '@/actions/contact'

const valid = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '+44 7700 900000',
  message: 'Hello, I have a question.',
  privacyConsent: true as const,
}

describe('contact form Zod schema', () => {
  it('valid data returns success: true', () => {
    const result = contactSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('missing name returns error on name field', () => {
    const result = contactSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('name')
  })

  it('missing email returns error on email field', () => {
    const result = contactSchema.safeParse({ ...valid, email: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('email')
  })

  it('invalid email format returns error on email field', () => {
    const result = contactSchema.safeParse({ ...valid, email: 'not-an-email' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('email')
  })

  it('missing phone returns error on phone field', () => {
    const result = contactSchema.safeParse({ ...valid, phone: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('phone')
  })

  it('missing message returns error on message field', () => {
    const result = contactSchema.safeParse({ ...valid, message: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('message')
  })

  it('privacyConsent false returns error on privacyConsent field', () => {
    const result = contactSchema.safeParse({ ...valid, privacyConsent: false })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('privacyConsent')
  })

  it('honeypot field populated — server action returns early without submitting', async () => {
    const result = await submitContact({ ...valid, _hp: 'bot' })
    expect(result.success).toBe(false)
  })
})
