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
			name: 'heroImage',
			title: 'Hero Image',
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
			],
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
