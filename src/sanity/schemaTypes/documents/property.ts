import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'property',
	title: 'Property',
	type: 'document',
	groups: [
		{ name: 'identity', title: 'Identity', default: true },
		{ name: 'rentalwise', title: 'RentalWise' },
		{ name: 'listingCard', title: 'Listing Card' },
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
			title: 'Card Thumbnail (SEO / OG Image)',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					validation: (Rule) => Rule.required(),
				},
			],
			description:
				'Used for social sharing / Open Graph previews. Not shown on the listing page.',
			group: 'listingCard',
		}),
		defineField({
			name: 'cardAmenities',
			title: 'Card Amenities (Text)',
			type: 'string',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryImage',
			title: 'Showcase Secondary Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					validation: (Rule) => Rule.required(),
				},
			],
			description:
				'Right-panel secondary photo shown in the Our Homes listing page',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorImage',
			title: 'Showcase Decorative Image',
			type: 'image',
			options: { hotspot: false },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
			description:
				'Botanical/decorative asset (flower, hills, etc.) — leave empty for no decoration',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorTop',
			title: 'Deco Position — Top (px, can be negative)',
			type: 'string',
			description: 'CSS top offset, e.g. "400px" or "-60px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorRight',
			title: 'Deco Position — Right (px, can be negative)',
			type: 'string',
			description: 'CSS right offset, e.g. "-30px" or "340px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorWidth',
			title: 'Deco Width (px)',
			type: 'number',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorHeight',
			title: 'Deco Height (px)',
			type: 'number',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorRotation',
			title: 'Deco Rotation (degrees)',
			type: 'number',
			description: 'Clockwise rotation in degrees. 0 = no rotation.',
			initialValue: 0,
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

		defineField({
			name: 'heroImage',
			title: 'Main Listing Photo',
			type: 'image',
			options: { hotspot: true },
			fields: [
				{
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					validation: (Rule) => Rule.required(),
				},
			],
			description:
				'Full-bleed left photo on the Our Homes listing page. Also used as the hero on the property detail page.',
			group: 'listingCard',
		}),
		defineField({
			name: 'pullQuote',
			title: 'Pull Quote',
			type: 'text',
			description:
				'Italic quote shown on the Our Homes listing card (right panel).',
			group: 'listingCard',
		}),

		// Intro
		defineField({
			name: 'description',
			title: 'Description',
			type: 'blockContent',
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
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alt text',
							validation: (Rule) => Rule.required(),
						},
					],
				},
			],
			validation: (Rule) => Rule.min(2),
			group: 'intro',
		}),

		defineField({
			name: 'gallerySectionQuote',
			title: 'Gallery Section Quote',
			type: 'text',
			description: 'Pull quote displayed over the gallery section on the property detail page.',
			group: 'intro',
		}),
		defineField({
			name: 'galleryDecorImage',
			title: 'Gallery Decor Image',
			type: 'image',
			description: 'Botanical/decorative illustration shown in the gallery section.',
			group: 'intro',
		}),

		defineField({
			name: 'locationImage',
			title: 'Location Image',
			type: 'image',
			description: 'Organic collage image shown in the Getting Here section.',
			options: { hotspot: true },
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
			description:
				'Short location text shown on the Our Homes listing card, e.g. "12.5 kms from Ooty Main Bazaar".',
			group: 'listingCard',
		}),
		defineField({
			name: 'locationBody',
			title: 'Location Body',
			type: 'blockContent',
			description: 'Rich text for the Getting Here section. Supports bold title + body paragraphs.',
			group: 'location',
		}),
		defineField({
			name: 'locationCta',
			title: 'Location CTA',
			type: 'object',
			group: 'location',
			fields: [
				defineField({ name: 'label', title: 'Label', type: 'string' }),
				defineField({ name: 'url', title: 'URL', type: 'url' }),
			],
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
						{
							name: 'title',
							type: 'string',
							title: 'Title',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'body',
							type: 'text',
							title: 'Body',
							validation: (Rule) => Rule.required(),
						},
						{
							name: 'image',
							type: 'image',
							title: 'Image',
							options: { hotspot: true },
							fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
						},
						{
							name: 'secondaryImage',
							type: 'image',
							title: 'Secondary Image',
							description: 'Optional small overlay photo for multi-image collage layouts.',
							options: { hotspot: true },
							fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
						},
						{
							name: 'decorImage',
							type: 'image',
							title: 'Decor Image',
							description: 'Optional organic/illustrative decoration (e.g. plant, flower) for this section.',
							options: { hotspot: true },
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
		defineField({
			name: 'experiencesBgImage',
			title: 'Experiences Background Image',
			type: 'image',
			description: 'Full-bleed background image for the Experiences section.',
			options: { hotspot: true },
			group: 'experiences',
		}),

		defineField({
			name: 'menuCta',
			title: 'Menu CTA',
			type: 'object',
			description: '"What\'s on the menu?" CTA shown at the bottom of the food highlight.',
			group: 'highlights',
			fields: [
				defineField({ name: 'label', title: 'Label', type: 'string' }),
				defineField({ name: 'url', title: 'URL', type: 'url' }),
			],
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
					fields: [
						{
							name: 'alt',
							type: 'string',
							title: 'Alt text',
							validation: (Rule) => Rule.required(),
						},
					],
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
