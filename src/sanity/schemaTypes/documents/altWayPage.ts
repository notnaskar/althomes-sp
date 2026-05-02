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
			name: 'editorialImages',
			title: 'Editorial Images',
			type: 'array',
			of: [
				{
					type: 'image',
					options: { hotspot: true },
					fields: [
						defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
					],
				},
			],
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
