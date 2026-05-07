import { describe, expect, it } from 'vitest'
import { isAllowedOrigin } from '@/lib/server/origin-check'

describe('isAllowedOrigin', () => {
	it('allows matching origin', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://althomes.co')).toBe(true)
	})

	it('allows origin with path (referer format)', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://althomes.co/contact')).toBe(true)
	})

	it('blocks different origin', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://evil.com')).toBe(false)
	})

	it('blocks null source', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin(null)).toBe(false)
	})

	it('allows any origin when BASE_URL not configured', () => {
		delete process.env.NEXT_PUBLIC_BASE_URL
		expect(isAllowedOrigin(null)).toBe(true)
	})

	it('blocks subdomain-spoofed origin', () => {
		process.env.NEXT_PUBLIC_BASE_URL = 'https://althomes.co'
		expect(isAllowedOrigin('https://althomes.co.evil.com')).toBe(false)
	})
})
