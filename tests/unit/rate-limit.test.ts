import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { checkRateLimit } from '@/lib/server/rate-limit'

describe('checkRateLimit', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it('allows first request', () => {
		expect(checkRateLimit('contact', '1.2.3.4')).toBe(true)
	})

	it('allows up to limit requests', () => {
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
		expect(checkRateLimit('partner', '10.0.0.1')).toBe(true)
	})

	it('blocks request exceeding limit', () => {
		const ip = '10.0.0.2'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		expect(checkRateLimit('contact', ip)).toBe(false)
	})

	it('allows request after window expires', () => {
		const ip = '10.0.0.3'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		// advance past 15-minute window
		vi.advanceTimersByTime(15 * 60 * 1000 + 1)
		expect(checkRateLimit('contact', ip)).toBe(true)
	})

	it('tracks separate limits per form key', () => {
		const ip = '10.0.0.4'
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		checkRateLimit('contact', ip)
		// blocked on contact
		expect(checkRateLimit('contact', ip)).toBe(false)
		// still allowed on partner (different key)
		expect(checkRateLimit('partner', ip)).toBe(true)
	})

	it('tracks separate limits per IP', () => {
		checkRateLimit('contact', '5.5.5.5')
		checkRateLimit('contact', '5.5.5.5')
		checkRateLimit('contact', '5.5.5.5')
		expect(checkRateLimit('contact', '5.5.5.5')).toBe(false)
		// different IP is unaffected
		expect(checkRateLimit('contact', '6.6.6.6')).toBe(true)
	})
})
