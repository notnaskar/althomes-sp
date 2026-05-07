import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'legalPage',
	title: 'Legal Page',
	type: 'document',
	fields: [
		defineField({
			name: 'displayTitle',
			title: 'Display Title (Line 1)',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'displayTitleLine2',
			title: 'Display Title (Line 2)',
			type: 'string',
			description: 'Optional second line for the heading.',
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
			name: 'ctaBackground',
			title: 'Bottom CTA Background Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
})
