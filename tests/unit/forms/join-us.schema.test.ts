import { describe, it } from 'vitest'

describe('partner enquiry form Zod schema', () => {
  it.todo('valid 9-field data with consent returns success: true')
  it.todo('missing name returns error')
  it.todo('missing email returns error')
  it.todo('invalid email format returns error')
  it.todo('missing phone returns error')
  it.todo('missing location returns error')
  it.todo('missing propertyType returns error')
  it.todo('missing status returns error')
  it.todo('missing operational returns error')
  it.todo('invalid photosLink URL returns error')
  it.todo('privacyConsent false returns error')
  it.todo('honeypot field populated — server action returns early without submitting')
})
