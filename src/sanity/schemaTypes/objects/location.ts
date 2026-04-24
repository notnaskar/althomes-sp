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
	],
})
