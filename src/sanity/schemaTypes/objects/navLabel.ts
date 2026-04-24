import { defineType, defineField } from 'sanity'

export default defineType({
	title: 'Navigation Label',
	name: 'navLabel',
	type: 'object',
	fields: [
		defineField({
			name: 'label',
			title: 'Label',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'link',
			title: 'Link',
			type: 'string',
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'xDesktop',
			title: 'X Position (Desktop %)',
			type: 'number',
		}),
		defineField({
			name: 'yDesktop',
			title: 'Y Position (Desktop %)',
			type: 'number',
		}),
		defineField({
			name: 'xMobile',
			title: 'X Position (Mobile %)',
			type: 'number',
		}),
		defineField({
			name: 'yMobile',
			title: 'Y Position (Mobile %)',
			type: 'number',
		}),
	],
})
