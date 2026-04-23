import { defineField, defineType } from 'sanity'
import { VscInspect } from 'react-icons/vsc'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'callout',
	title: 'Callout',
	type: 'object',
	icon: VscInspect,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'attributes',
			type: 'module-attributes',
			group: 'options',
		}),
		defineField({
			name: 'overline',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
		},
		prepare: ({ intro }) => ({
			title: getBlockText(intro),
			subtitle: 'Callout',
		}),
	},
})
