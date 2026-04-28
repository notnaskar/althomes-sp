import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'review',
	title: 'Review',
	type: 'document',
	fields: [
		defineField({
			name: 'guestName',
			title: 'Guest Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'property',
			title: 'Property',
			type: 'reference',
			to: [{ type: 'property' }],
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'guestLocation',
			title: 'Guest Location',
			type: 'string',
		}),
		defineField({
			name: 'rating',
			title: 'Rating',
			type: 'number',
			validation: (Rule) => Rule.required().min(1).max(5),
		}),
		defineField({
			name: 'stayDate',
			title: 'Stay Date',
			type: 'date',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'body',
			title: 'Review Body',
			type: 'text',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'published',
			title: 'Published',
			type: 'boolean',
			initialValue: false,
		}),
		defineField({
			name: 'featured',
			title: 'Featured',
			type: 'boolean',
			initialValue: false,
		}),
	],
	preview: {
		select: {
			title: 'guestName',
			subtitle: 'property.title',
		},
	},
})
