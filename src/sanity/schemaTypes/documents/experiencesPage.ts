import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'experiencesPage',
	title: 'Experiences Page',
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
			name: 'discountBadgeText',
			title: 'Discount Badge Text',
			type: 'string',
		}),
		defineField({
			name: 'cardsMaxShown',
			title: 'Max Cards Shown',
			type: 'number',
			initialValue: 9,
		}),
		defineField({
			name: 'seo',
			title: 'SEO',
			type: 'seo',
		}),
	],
	preview: {
		prepare: () => ({ title: 'Experiences Page' }),
	},
})
