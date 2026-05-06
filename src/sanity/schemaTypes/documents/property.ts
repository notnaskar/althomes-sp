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
		{ name: 'faqs', title: 'FAQs' },
		{ name: 'causes', title: 'Causes' },
		{ name: 'reviews', title: 'Reviews' },
		{ name: 'cta', title: 'CTA' },
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
		defineField({
			name: 'rentalwiseWidgetPropertyId',
			title: 'RentalWise Widget Property ID',
			type: 'string',
			description: 'Property ID used by the booking widget (separate from the availability API external ID)',
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
			name: 'showcaseDecorBottom',
			title: 'Deco Position — Bottom (px, can be negative)',
			type: 'string',
			description: 'CSS bottom offset, e.g. "-20px" or "300px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseDecorLeft',
			title: 'Deco Position — Left (px, can be negative)',
			type: 'string',
			description: 'CSS left offset, e.g. "-30px" or "200px"',
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
			name: 'showcaseSecondaryDecorImage',
			title: 'Secondary Image — Decorative Overlay',
			type: 'image',
			options: { hotspot: false },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
			description:
				'Botanical/decorative asset over the secondary photo — leave empty for none',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorTop',
			title: 'Secondary Deco — Top (px, can be negative)',
			type: 'string',
			description: 'CSS top offset, e.g. "-40px" or "300px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorRight',
			title: 'Secondary Deco — Right (px, can be negative)',
			type: 'string',
			description: 'CSS right offset, e.g. "-30px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorBottom',
			title: 'Secondary Deco — Bottom (px, can be negative)',
			type: 'string',
			description: 'CSS bottom offset, e.g. "-20px" or "300px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorLeft',
			title: 'Secondary Deco — Left (px, can be negative)',
			type: 'string',
			description: 'CSS left offset, e.g. "-30px"',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorWidth',
			title: 'Secondary Deco — Width (px)',
			type: 'number',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorHeight',
			title: 'Secondary Deco — Height (px)',
			type: 'number',
			group: 'listingCard',
		}),
		defineField({
			name: 'showcaseSecondaryDecorRotation',
			title: 'Secondary Deco — Rotation (degrees)',
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
			description: 'Full-bleed left photo on the Our Homes listing page.',
			group: 'listingCard',
		}),
		defineField({
			name: 'detailCoverImage',
			title: 'Detail Page Cover Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
			description:
				'Full-bleed hero shown on the property detail page. Falls back to Main Listing Photo if not set.',
			group: 'intro',
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
			name: 'detailIntroHeading',
			title: 'Detail Intro Heading',
			type: 'string',
			description:
				'Large heading shown on the left of the intro section on the property detail page.',
			group: 'intro',
		}),
		defineField({
			name: 'detailIntroBody',
			title: 'Detail Intro Body',
			type: 'text',
			description:
				'Body text shown on the right of the intro section on the property detail page.',
			group: 'intro',
		}),
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
			description:
				'Pull quote displayed over the gallery section on the property detail page.',
			group: 'intro',
		}),
		defineField({
			name: 'galleryDecorImage',
			title: 'Gallery Decor Image',
			type: 'image',
			description:
				'Botanical/decorative illustration shown in the gallery section.',
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
		defineField({
			name: 'amenitiesSectionImage',
			title: 'Amenities Section Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
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
			description:
				'Rich text for the Getting Here section. Supports bold title + body paragraphs.',
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
			title: 'Highlights (DEPRECATED — use named slots below)',
			type: 'array',
			description:
				'DEPRECATED. Migrate content to the four named slots: Wind Down, Wake Up, Hosted With Heart, Symphony. This array is no longer rendered on the live page.',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'title', type: 'string', title: 'Title' },
						{ name: 'body', type: 'text', title: 'Body' },
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
							options: { hotspot: true },
							fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
						},
						{
							name: 'decorImage',
							type: 'image',
							title: 'Decor Image',
							options: { hotspot: true },
						},
					],
				},
			],
			group: 'highlights',
		}),

		defineField({
			name: 'windDownHighlight',
			title: 'Wind Down Highlight',
			type: 'object',
			description:
				'Top-left text block + dining-table image cell (desktop row 1, cols 2-3). On mobile the image renders above the section heading.',
			group: 'highlights',
			fields: [
				defineField({
					name: 'title',
					title: 'Title',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'body',
					title: 'Body',
					type: 'text',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'image',
					title: 'Image (dining table)',
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
				}),
				defineField({
					name: 'decorImage',
					title: 'Decor Image (wrap with tassels)',
					type: 'image',
					options: { hotspot: true },
				}),
				defineField({
					name: 'secondaryDecorImage',
					title: 'Secondary Decor Image (leaf)',
					type: 'image',
					options: { hotspot: true },
				}),
			],
		}),

		defineField({
			name: 'wakeUpHighlight',
			title: 'Wake Up Highlight',
			type: 'object',
			description: 'Tea-leaves image cell + text (desktop row 2, cols 1 and 2).',
			group: 'highlights',
			fields: [
				defineField({
					name: 'title',
					title: 'Title',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'body',
					title: 'Body',
					type: 'text',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'image',
					title: 'Image (tea-leaves hand)',
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
				}),
			],
		}),

		defineField({
			name: 'hostedWithHeartHighlight',
			title: 'Hosted With Heart Highlight',
			type: 'object',
			description: 'Text-only block (desktop row 2, col 3). No image.',
			group: 'highlights',
			fields: [
				defineField({
					name: 'title',
					title: 'Title',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'body',
					title: 'Body',
					type: 'text',
					validation: (Rule) => Rule.required(),
				}),
			],
		}),

		defineField({
			name: 'symphonyHighlight',
			title: 'Symphony of Flavours Highlight',
			type: 'object',
			description:
				'Text + menu CTA + food plate image (desktop row 3). Menu CTA is the existing top-level menuCta field on the property document.',
			group: 'highlights',
			fields: [
				defineField({
					name: 'title',
					title: 'Title',
					type: 'string',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'body',
					title: 'Body',
					type: 'text',
					validation: (Rule) => Rule.required(),
				}),
				defineField({
					name: 'image',
					title: 'Image (food plate)',
					type: 'image',
					options: { hotspot: true },
					fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
				}),
			],
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
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),

		defineField({
			name: 'menuCta',
			title: 'Menu CTA',
			type: 'object',
			description:
				'"What\'s on the menu?" CTA shown at the bottom of the food highlight.',
			group: 'highlights',
			fields: [
				defineField({ name: 'label', title: 'Label', type: 'string' }),
				defineField({ name: 'url', title: 'URL', type: 'url' }),
			],
		}),

		// FAQs
		defineField({
			name: 'faqs',
			title: 'FAQs',
			type: 'array',
			group: 'faqs',
			of: [
				{
					name: 'faq',
					type: 'object',
					fields: [
						defineField({
							name: 'question',
							title: 'Question',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'answer',
							title: 'Answer',
							type: 'blockContent',
						}),
					],
					preview: {
						select: { title: 'question' },
					},
				},
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
			group: 'cta',
		}),
		defineField({
			name: 'ctaButtonLabel',
			title: 'CTA Button Label',
			type: 'string',
			group: 'cta',
		}),
		defineField({
			name: 'ctaBackground',
			title: 'CTA Background Image',
			type: 'image',
			options: { hotspot: true },
			group: 'cta',
			fields: [
				{
					name: 'alt',
					title: 'Alt Text',
					type: 'string',
				},
			],
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
