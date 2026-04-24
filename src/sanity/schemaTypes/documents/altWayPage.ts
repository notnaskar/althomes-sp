import { defineType, defineField } from 'sanity'

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
			name: 'introBody',
			title: 'Intro Body',
			type: 'blockContent',
		}),
		defineField({
			name: 'sections',
			title: 'Content Sections',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'title', type: 'string', title: 'Title' },
						{ name: 'body', type: 'blockContent', title: 'Body' },
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
		}),
		defineField({
			name: 'reviewsMaxShown',
			title: 'Max Reviews Shown',
			type: 'number',
			initialValue: 5,
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
