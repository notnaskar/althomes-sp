import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'contactPage',
	title: 'Contact Page',
	type: 'document',
	fields: [
		defineField({
			name: 'heroImage',
			title: 'Hero Image',
			type: 'image',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'sectionTitle',
			title: 'Section Title',
			type: 'string',
		}),
		defineField({
			name: 'phone',
			title: 'Phone Number',
			type: 'string',
		}),
		defineField({
			name: 'email',
			title: 'Email Address',
			type: 'string',
		}),
		defineField({
			name: 'officeCity',
			title: 'Office City',
			type: 'string',
		}),
		defineField({
			name: 'officeAddress',
			title: 'Office Address',
			type: 'text',
		}),
		defineField({
			name: 'formHeadline',
			title: 'Form Headline (Hero)',
			type: 'string',
		}),
		defineField({
			name: 'formCardHeading',
			title: 'Form Card Heading',
			type: 'string',
			description: 'The headline above the contact form (e.g. "Write To Us")',
		}),
		defineField({
			name: 'officeSectionTitle',
			title: 'Office Section Title',
			type: 'string',
			description:
				'Heading above the office address block. Defaults to "Our Office" if empty.',
		}),
		defineField({
			name: 'followUsSectionTitle',
			title: 'Follow Us Section Title',
			type: 'string',
			description:
				'Heading above the social links block. Defaults to "Follow Us" if empty.',
		}),
		defineField({
			name: 'mobileHeroAsset',
			title: 'Mobile Hero Asset',
			type: 'image',
			description:
				'Decorative image (e.g. red tulip) overlapping the hero image on mobile view.',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'backgroundCloudAsset',
			title: 'Background Cloud Asset',
			type: 'image',
			description:
				'Decorative cloud image placed behind the contact details text on desktop.',
			options: { hotspot: true },
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
		}),
		defineField({
			name: 'sideFlowerAsset',
			title: 'Side Flower Asset',
			type: 'image',
			description:
				'Decorative flower image positioned next to the contact form on desktop.',
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
		prepare: () => ({ title: 'Contact Page' }),
	},
})
