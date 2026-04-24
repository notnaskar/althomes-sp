import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'homePage',
	title: 'Home Page',
	type: 'document',
	fields: [
		defineField({
			name: 'heroHeadline',
			title: 'Hero Headline',
			type: 'string',
		}),
		defineField({
			name: 'navLabels',
			title: 'Navigation Labels',
			type: 'array',
			of: [{ type: 'navLabel' }],
			validation: (Rule) => Rule.length(6),
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Home Page' }),
	},
})
