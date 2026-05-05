import { describe, expect, it } from 'vitest'
import { getIcon, ICON_MAP } from '@/ui/atoms/icon-map'

describe('getIcon', () => {
	it('returns a function for a known icon name', () => {
		const icon = getIcon('FaWifi')
		expect(icon).toBeDefined()
		expect(typeof icon).toBe('function')
	})

	it('returns null for unknown icon name', () => {
		expect(getIcon('NotAnIcon')).toBeNull()
	})

	it('returns null for empty string', () => {
		expect(getIcon('')).toBeNull()
	})

	it('returns null for null', () => {
		expect(getIcon(null)).toBeNull()
	})

	it('returns null for undefined', () => {
		expect(getIcon(undefined)).toBeNull()
	})

	it('ICON_MAP contains at least 60 icons', () => {
		expect(Object.keys(ICON_MAP).length).toBe(73)
	})
})
