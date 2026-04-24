import { describe, it, expect } from 'vitest'
import { partnerSchema } from '@/lib/schemas/partner'
import { submitPartner } from '@/actions/partner-enquiry'

const valid = {
  name: 'Test Owner',
  email: 'owner@example.com',
  phone: '+44 7700 900001',
  location: 'London, UK',
  propertyType: 'Villa',
  status: 'Available',
  operational: 'Yes',
  photosLink: 'https://example.com/photos',
  privacyConsent: true as const,
}

describe('partner enquiry form Zod schema', () => {
  it('valid 9-field data with consent returns success: true', () => {
    const result = partnerSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('missing name returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, name: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('name')
  })

  it('missing email returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, email: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('email')
  })

  it('invalid email format returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, email: 'bad-email' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('email')
  })

  it('missing phone returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, phone: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('phone')
  })

  it('missing location returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, location: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('location')
  })

  it('missing propertyType returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, propertyType: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('propertyType')
  })

  it('missing status returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, status: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('status')
  })

  it('missing operational returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, operational: '' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('operational')
  })

  it('invalid photosLink URL returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, photosLink: 'not-a-url' })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('photosLink')
  })

  it('privacyConsent false returns error', () => {
    const result = partnerSchema.safeParse({ ...valid, privacyConsent: false })
    expect(result.success).toBe(false)
    expect(result.error?.issues[0].path).toContain('privacyConsent')
  })

  it('honeypot field populated — server action returns early without submitting', async () => {
    const result = await submitPartner({ ...valid, _hp: 'bot' })
    expect(result.success).toBe(false)
  })
})
