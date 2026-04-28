import { defineField, defineType } from 'sanity'

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
			name: 'pullQuote',
			title: 'Pull Quote',
			type: 'text',
		}),
		defineField({
			name: 'heroImage',
			title: 'Hero Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'bodyParagraph',
			title: 'Body Paragraph',
			type: 'text',
		}),
		defineField({
			name: 'bulletPoints',
			title: 'Bullet Points',
			type: 'array',
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'formCTAText',
			title: 'Form CTA Text',
			type: 'string',
		}),
		defineField({
			name: 'propertyImage',
			title: 'Property Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
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
