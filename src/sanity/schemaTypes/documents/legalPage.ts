import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'legalPage',
	title: 'Legal Page',
	type: 'document',
	fields: [
		defineField({
			name: 'displayTitle',
			title: 'Display Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'seoTitle',
			title: 'SEO Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'displayTitle', maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Body',
			type: 'blockContent',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'backgroundImage',
			title: 'Background Image',
			type: 'image',
			options: { hotspot: true },
			fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
})
