import { defineType, defineField } from 'sanity'

export default defineType({
	title: 'Location',
	name: 'location',
	type: 'object',
	fields: [
		defineField({
			name: 'displayLocation',
			title: 'Display Location',
			type: 'string',
		}),
		defineField({
			name: 'distanceFromLandmark',
			title: 'Distance from Landmark',
			type: 'string',
		}),
		defineField({
			name: 'googleMapsUrl',
			title: 'Google Maps URL',
			type: 'url',
		}),
		defineField({
			name: 'lat',
			title: 'Latitude',
			type: 'number',
		}),
		defineField({
			name: 'lng',
			title: 'Longitude',
			type: 'number',
		}),
		defineField({
			name: 'streetAddress',
			title: 'Street Address',
			type: 'string',
		}),
		defineField({
			name: 'addressLocality',
			title: 'City',
			type: 'string',
		}),
		defineField({
			name: 'addressRegion',
			title: 'State / Region',
			type: 'string',
		}),
		defineField({
			name: 'postalCode',
			title: 'Postal Code',
			type: 'string',
		}),
		defineField({
			name: 'addressCountry',
			title: 'Country Code',
			type: 'string',
			description: 'ISO 3166-1 alpha-2, e.g. IN',
		}),
	],
})
