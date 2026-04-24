import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'joinUsPage',
	title: 'Join Us Page',
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
			name: 'benefits',
			title: 'Benefits',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'title', type: 'string', title: 'Title' },
						{ name: 'body', type: 'text', title: 'Body' },
					],
				},
			],
		}),
		defineField({
			name: 'formHeadline',
			title: 'Form Headline',
			type: 'string',
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Join Us Page' }),
	},
})
