import { defineField, defineType } from 'sanity'

export default defineType({
	title: 'SEO',
	name: 'seo',
	type: 'object',
	fields: [
		defineField({
			name: 'metaTitle',
			title: 'Meta Title',
			type: 'string',
		}),
		defineField({
			name: 'metaDescription',
			title: 'Meta Description',
			type: 'text',
			validation: (Rule) =>
				Rule.max(160).warning('Optimal length is under 160 characters'),
		}),
		defineField({
			name: 'ogImage',
			title: 'Open Graph Image',
			type: 'image',
			options: {
				hotspot: true,
			},
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alternative text',
				}),
			],
		}),
	],
})
