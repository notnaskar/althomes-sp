import { describe, it } from 'vitest'

describe('contact form Zod schema', () => {
  it.todo('valid data returns success: true')
  it.todo('missing name returns error on name field')
  it.todo('missing email returns error on email field')
  it.todo('invalid email format returns error on email field')
  it.todo('missing phone returns error on phone field')
  it.todo('missing message returns error on message field')
  it.todo('privacyConsent false returns error on privacyConsent field')
  it.todo('honeypot field populated — server action returns early without submitting')
})
