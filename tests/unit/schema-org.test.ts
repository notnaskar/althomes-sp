import { describe, expect, it } from 'vitest'
import { buildLodgingSchema } from '@/lib/schema-org'

const baseProperty = {
	title: 'The Hilltop',
	slug: { _type: 'slug', current: 'the-hilltop' },
	priceFrom: '₹12,000',
	bedrooms: 3,
	location: {
		displayLocation: 'Ooty, Tamil Nadu',
		streetAddress: '12 Hillside Road',
		addressLocality: 'Ooty',
		addressRegion: 'Tamil Nadu',
		postalCode: '643001',
		addressCountry: 'IN',
		lat: 11.4102,
		lng: 76.695,
		distanceFromLandmark: null,
		googleMapsUrl: null,
	},
	amenities: [
		{ name: 'Pool', icon: '🏊' },
		{ name: 'WiFi', icon: '📶' },
	],
	reviews: [
		{
			guestName: 'Alice',
			rating: 5,
			body: 'Great!',
			guestLocation: 'Mumbai',
			stayDate: '2024-01-01',
		},
		{
			guestName: 'Bob',
			rating: 3,
			body: 'OK',
			guestLocation: 'Delhi',
			stayDate: '2024-02-01',
		},
	],
} as any

const baseSite = {
	contactPhone: '+91 9876543210',
	checkinTime: '14:00',
	checkoutTime: '11:00',
} as any

describe('buildLodgingSchema', () => {
	it('returns correct @context and @type', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result['@context']).toBe('https://schema.org')
		expect(result['@type']).toBe('LodgingBusiness')
	})

	it('includes property name and url', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.name).toBe('The Hilltop')
		expect(result.url).toBe('https://althomes.in/our-homes/the-hilltop#booking')
	})

	it('petsAllowed is always true', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.petsAllowed).toBe(true)
	})

	it('includes site contact, checkin, checkout', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.telephone).toBe('+91 9876543210')
		expect(result.checkinTime).toBe('14:00')
		expect(result.checkoutTime).toBe('11:00')
	})

	it('computes aggregateRating from reviews', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.aggregateRating).toEqual({
			'@type': 'AggregateRating',
			ratingValue: '4.0',
			reviewCount: 2,
			bestRating: 5,
			worstRating: 1,
		})
	})

	it('omits aggregateRating when no reviews', () => {
		const property = { ...baseProperty, reviews: [] }
		const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
		expect(result.aggregateRating).toBeUndefined()
	})

	it('maps amenities to LocationFeatureSpecification', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.amenityFeature).toEqual([
			{ '@type': 'LocationFeatureSpecification', name: 'Pool', value: true },
			{ '@type': 'LocationFeatureSpecification', name: 'WiFi', value: true },
		])
	})

	it('includes structured address', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.address).toEqual({
			'@type': 'PostalAddress',
			streetAddress: '12 Hillside Road',
			addressLocality: 'Ooty',
			addressRegion: 'Tamil Nadu',
			postalCode: '643001',
			addressCountry: 'IN',
		})
	})

	it('omits streetAddress when null — does not fall back to displayLocation', () => {
		const property = {
			...baseProperty,
			location: { ...baseProperty.location, streetAddress: null },
		}
		const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
		expect(result.address?.streetAddress).toBeUndefined()
	})

	it('includes geo coordinates', () => {
		const result = buildLodgingSchema(
			baseProperty,
			baseSite,
			'https://althomes.in',
		)
		expect(result.geo).toEqual({
			'@type': 'GeoCoordinates',
			latitude: 11.4102,
			longitude: 76.695,
		})
	})

	it('omits geo when lat/lng missing', () => {
		const property = {
			...baseProperty,
			location: { ...baseProperty.location, lat: null, lng: null },
		}
		const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
		expect(result.geo).toBeUndefined()
	})

	it('omits address when location is null', () => {
		const property = { ...baseProperty, location: null }
		const result = buildLodgingSchema(property, baseSite, 'https://althomes.in')
		expect(result.address).toBeUndefined()
		expect(result.geo).toBeUndefined()
	})
})
