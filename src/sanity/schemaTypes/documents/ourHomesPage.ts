import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'ourHomesPage',
	title: 'Our Homes Page',
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
			fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
		}),
		defineField({
			name: 'experiencesCtaBody',
			title: 'Experiences CTA Body',
			type: 'blockContent',
		}),
		defineField({
			name: 'experiencesCtaLabel',
			title: 'Experiences CTA Label',
			type: 'string',
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Our Homes Page' }),
	},
})
