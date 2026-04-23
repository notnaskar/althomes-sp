import { defineField, defineType } from 'sanity'
import { FeedbackIcon } from '@sanity/icons'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'quote-list',
	title: 'Quote list',
	type: 'object',
	icon: FeedbackIcon,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'attributes',
			type: 'module-attributes',
			group: 'options',
		}),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'testimonials',
			type: 'array',
			of: [{ type: 'quote' }, { type: 'reference', to: [{ type: 'quote' }] }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Quote list',
		}),
	},
})
