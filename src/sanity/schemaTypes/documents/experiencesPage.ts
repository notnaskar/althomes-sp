import { defineField, defineType } from 'sanity'

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
			name: 'heroBackground',
			title: 'Hero Background',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'cardsMaxShown',
			title: 'Max Cards Shown',
			type: 'number',
			initialValue: 9,
		}),
		defineField({
			name: 'leadingTagline',
			title: 'Hero Leading Tagline',
			type: 'string',
		}),
		defineField({
			name: 'supportingTagline',
			title: 'Hero Supporting Tagline',
			type: 'string',
		}),
		defineField({
			name: 'heroFlower',
			title: 'Hero Flower Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'heroBadgeText',
			title: 'Hero Circle Badge Text',
			description:
				'Text around the decorative circle badge in the hero. Defaults to "your questions, answered" if empty.',
			type: 'string',
		}),
		defineField({
			name: 'decorBasket',
			title: 'Grid Decoration — Basket',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'decorStars',
			title: 'Grid Decoration — Stars',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'decorDaisy',
			title: 'Grid Decoration — Daisy',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'ctaQuestion',
			title: 'Bottom CTA Question',
			type: 'text',
			description: 'Italic question/headline above the bottom CTA button',
		}),
		defineField({
			name: 'ctaButtonLabel',
			title: 'Bottom CTA Button Label',
			type: 'string',
		}),
		defineField({
			name: 'ctaHref',
			title: 'Bottom CTA Link',
			type: 'string',
			description: 'Destination for the bottom CTA button. Defaults to /our-homes.',
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
	preview: {
		prepare: () => ({ title: 'Experiences Page' }),
	},
})
