import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'contactPage',
	title: 'Contact Page',
	type: 'document',
	fields: [
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
			name: 'sectionTitle',
			title: 'Section Title',
			type: 'string',
		}),
		defineField({
			name: 'phone',
			title: 'Phone Number',
			type: 'string',
		}),
		defineField({
			name: 'email',
			title: 'Email Address',
			type: 'string',
		}),
		defineField({
			name: 'officeCity',
			title: 'Office City',
			type: 'string',
		}),
		defineField({
			name: 'officeAddress',
			title: 'Office Address',
			type: 'text',
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
		prepare: () => ({ title: 'Contact Page' }),
	},
})
