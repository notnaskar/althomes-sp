import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'contactPage',
	title: 'Contact Page',
	type: 'document',
	fields: [
		defineField({
			name: 'heroHeadline',
			title: 'Hero Headline',
			type: 'string',
		}),
		defineField({
			name: 'contactDetails',
			title: 'Contact Details',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						{ name: 'label', type: 'string', title: 'Label' },
						{ name: 'value', type: 'string', title: 'Value' },
						{ name: 'link', type: 'string', title: 'Link (optional)' },
					],
				},
			],
		}),
		defineField({
			name: 'officeAddress',
			title: 'Office Address',
			type: 'blockContent',
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
