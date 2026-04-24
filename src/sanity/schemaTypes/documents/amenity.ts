import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'amenity',
	title: 'Amenity',
	type: 'document',
	fields: [
		defineField({
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'icon',
			title: 'Icon',
			type: 'string',
			description: 'Emoji or icon key',
			validation: (Rule) => Rule.required(),
		}),
	],
})
