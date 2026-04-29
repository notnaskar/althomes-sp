import { defineField, defineType } from 'sanity'
import IconPicker from '@/sanity/ui/icon-picker'

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
			description: 'Search and select an icon from the picker below.',
			components: { input: IconPicker },
			validation: (Rule) => Rule.required(),
		}),
	],
})
