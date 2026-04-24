import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'property',
	title: 'Property',
	type: 'document',
	groups: [
		{ name: 'identity', title: 'Identity', default: true },
		{ name: 'rentalwise', title: 'RentalWise' },
		{ name: 'listingCard', title: 'Listing Card' },
		{ name: 'hero', title: 'Hero' },
		{ name: 'intro', title: 'Intro' },
		{ name: 'specs', title: 'Specs & Amenities' },
		{ name: 'location', title: 'Location' },
		{ name: 'highlights', title: 'Highlights' },
		{ name: 'experiences', title: 'Experiences' },
		{ name: 'causes', title: 'Causes' },
		{ name: 'reviews', title: 'Reviews' },
		{ name: 'seo', title: 'SEO' },
	],
	fields: [
		// Identity
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'identity',
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required(),
			group: 'identity',
		}),
		defineField({
			name: 'status',
			title: 'Status',
			type: 'string',
			options: {
				list: [
					{ title: 'Active', value: 'active' },
					{ title: 'Hidden', value: 'hidden' },
					{ title: 'Coming Soon', value: 'coming-soon' },
				],
			},
			initialValue: 'active',
			validation: (Rule) => Rule.required(),
			group: 'identity',
		}),
		defineField({
			name: 'displayOrder',
			title: 'Display Order',
			type: 'number',
			group: 'identity',
		}),

		// RentalWise
		defineField({
			name: 'rentalwisePropertyId',
			title: 'RentalWise Property ID',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'rentalwise',
		}),
		defineField({
			name: 'rentalwiseIdentifier',
			title: 'RentalWise Identifier',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'rentalwise',
		}),

		// Listing Card
		defineField({
			name: 'tagline',
			title: 'Tagline',
			type: 'string',
			group: 'listingCard',
		}),
		defineField({
			name: 'shortDescription',
			title: 'Short Description',
			type: 'text',
			group: 'listingCard',
		}),
		defineField({
			name: 'cardThumbnail',
			title: 'Card Thumbnail',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }],
			group: 'listingCard',
		}),
		defineField({
			name: 'cardAmenities',
			title: 'Card Amenities (Text)',
			type: 'string',
			group: 'listingCard',
		}),
		defineField({
			name: 'propertyType',
			title: 'Property Type',
			type: 'string',
			group: 'listingCard',
		}),
		defineField({
			name: 'priceFrom',
			title: 'Price From',
			type: 'string',
			group: 'listingCard',
		}),

		// Hero
		defineField({
			name: 'heroImage',
			title: 'Hero Image',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }],
			group: 'hero',
		}),

		// Intro
		defineField({
			name: 'description',
			title: 'Description',
			type: 'blockContent',
			group: 'intro',
		}),
		defineField({
			name: 'pullQuote',
			title: 'Pull Quote',
			type: 'text',
			group: 'intro',
		}),
		defineField({
			name: 'gallery',
			title: 'Gallery',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }],
				},
			],
			validation: (Rule) => Rule.min(2),
			group: 'intro',
		}),

		// Specs & Amenities
		defineField({
			name: 'maxGuests',
			title: 'Max Guests',
			type: 'number',
			group: 'specs',
		}),
		defineField({
			name: 'bedrooms',
			title: 'Bedrooms',
			type: 'number',
			group: 'specs',
		}),
		defineField({
			name: 'bathrooms',
			title: 'Bathrooms',
			type: 'number',
			group: 'specs',
		}),
		defineField({
			name: 'amenities',
			title: 'Amenities',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'amenity' }] }],
			group: 'specs',
		}),
		defineField({
			name: 'houseRulesTeaser',
			title: 'House Rules Teaser',
			type: 'string',
			group: 'specs',
		}),
		defineField({
			name: 'houseRules',
			title: 'House Rules',
			type: 'blockContent',
			group: 'specs',
		}),

		// Location
		defineField({
			name: 'location',
			title: 'Location Data',
			type: 'location',
			group: 'location',
		}),
		defineField({
			name: 'locationHeadline',
			title: 'Location Headline',
			type: 'string',
			group: 'location',
		}),
		defineField({
			name: 'locationDescription',
			title: 'Location Description',
			type: 'text',
			group: 'location',
		}),

		// Highlights
		defineField({
			name: 'highlights',
			title: 'Highlights',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() },
						{ name: 'body', type: 'text', title: 'Body', validation: (Rule) => Rule.required() },
						{
							name: 'image',
							type: 'image',
							title: 'Image',
							options: { hotspot: true },
							fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
						},
					],
				},
			],
			validation: (Rule) => Rule.min(2),
			group: 'highlights',
		}),

		// Experiences
		defineField({
			name: 'experiences',
			title: 'Related Experiences',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'experience' }] }],
			group: 'experiences',
		}),
		defineField({
			name: 'experiencesMaxShown',
			title: 'Max Experiences Shown',
			type: 'number',
			initialValue: 3,
			group: 'experiences',
		}),

		// Causes
		defineField({
			name: 'causeHeadline',
			title: 'Cause Headline',
			type: 'string',
			group: 'causes',
		}),
		defineField({
			name: 'causeBody',
			title: 'Cause Body',
			type: 'blockContent',
			group: 'causes',
		}),
		defineField({
			name: 'causeImages',
			title: 'Cause Images',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }],
				},
			],
			validation: (Rule) => Rule.length(2),
			group: 'causes',
		}),

		// Reviews
		defineField({
			name: 'reviewsMaxShown',
			title: 'Max Reviews Shown',
			type: 'number',
			initialValue: 5,
			group: 'reviews',
		}),

		// Bottom CTA
		defineField({
			name: 'ctaHeadline',
			title: 'CTA Headline',
			type: 'string',
		}),

		// SEO
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
			group: 'seo',
		}),
	],
	preview: {
		select: {
			title: 'title',
			status: 'status',
			media: 'cardThumbnail',
		},
		prepare({ title, status, media }) {
			const statusIcons: Record<string, string> = {
				active: '●',
				hidden: '○',
				'coming-soon': '◌',
			}
			return {
				title,
				subtitle: `${statusIcons[status as string] || ''} ${status || ''}`,
				media,
			}
		},
	},
})
