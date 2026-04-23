import { defineField, defineType } from 'sanity'
import { EditIcon } from '@sanity/icons'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'blog-post-list',
	title: 'Blog post list',
	type: 'object',
	icon: EditIcon,
	fields: [
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
		}),
		defineField({
			name: 'limit',
			description: 'Number of posts to display',
			type: 'number',
			initialValue: 6,
			validation: (Rule) => Rule.min(1),
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Blog post (list)',
		}),
	},
})
