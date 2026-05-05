import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'altWayPage',
	title: 'The Alt Way Page',
	type: 'document',
	fields: [
		defineField({
			name: 'heroHeadline',
			title: 'Hero Headline',
			type: 'string',
		}),
		defineField({
			name: 'heroHeadlineLine2',
			title: 'Hero Headline Line 2',
			type: 'string',
		}),
		defineField({
			name: 'heroBackground',
			title: 'Hero Background',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'missionImage',
			title: 'Mission Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'missionDecorImage',
			title: 'Mission — Decorative Overlay Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'missionText',
			title: 'Mission Statement',
			type: 'text',
		}),
		defineField({
			name: 'valuePropHeadline',
			title: 'Value Props Headline',
			type: 'string',
		}),
		defineField({
			name: 'valueProps',
			title: 'Value Props',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'title', type: 'string', title: 'Title' }),
						defineField({ name: 'body', type: 'text', title: 'Body' }),
					],
				},
			],
			validation: (Rule) => Rule.max(4),
		}),
		defineField({
			name: 'valuePropEditorialImage',
			title: 'Value Props — Main Editorial Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'valuePropEditorialDecorLeft',
			title: 'Value Props — Left Decorative Overlay',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'valuePropEditorialDecorRight',
			title: 'Value Props — Right Decorative Overlay',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'valuePropSecondaryImage',
			title: 'Value Props — Secondary Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'promiseText',
			title: 'Promise Statement',
			type: 'string',
		}),
		defineField({
			name: 'promiseCTALabel',
			title: 'Promise CTA Label',
			type: 'string',
		}),
		defineField({
			name: 'promiseCTAHref',
			title: 'Promise CTA Link',
			type: 'string',
			description: 'Destination URL, e.g. /our-homes',
		}),
		defineField({
			name: 'promiseBackground',
			title: 'Promise CTA — Background Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'promiseCTADecorLeft',
			title: 'Promise CTA — Left Decorative Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'promiseCTADecorRight',
			title: 'Promise CTA — Right Decorative Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'statsBackground',
			title: 'Stats — Background Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'statsHeadline',
			title: 'Stats Headline',
			type: 'string',
		}),
		defineField({
			name: 'stats',
			title: 'Stats',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'value', type: 'string', title: 'Value' }),
						defineField({ name: 'label', type: 'string', title: 'Label' }),
						defineField({ name: 'subtext', type: 'string', title: 'Subtext' }),
					],
				},
			],
			validation: (Rule) => Rule.max(4),
		}),
		defineField({
			name: 'bottomCTAHeadline',
			title: 'Bottom CTA Headline',
			type: 'string',
		}),
		defineField({
			name: 'bottomCTALabel',
			title: 'Bottom CTA Button Label',
			type: 'string',
		}),
		defineField({
			name: 'bottomCTABackground',
			title: 'Bottom CTA — Background Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'bottomCTAHref',
			title: 'Bottom CTA — Button Link',
			type: 'string',
			description: 'Destination URL, e.g. /experiences',
		}),
		defineField({
			name: 'reviews',
			title: 'Featured Reviews',
			type: 'array',
			of: [{ type: 'reference', to: [{ type: 'review' }] }],
			validation: (Rule) => Rule.max(5),
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
	preview: {
		prepare: () => ({ title: 'The Alt Way Page' }),
	},
})
