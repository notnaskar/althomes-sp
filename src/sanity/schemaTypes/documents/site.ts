import { defineType, defineField } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site Settings',
	type: 'document',
	groups: [
		{ name: 'branding', default: true },
		{ name: 'navigation' },
		{ name: 'socials' },
		{ name: 'forms' },
		{ name: 'colours' },
		{ name: 'seo' },
		{ name: 'announcement' },
	],
	fields: [
		defineField({
			name: 'title',
			title: 'Site Title',
			type: 'string',
			validation: (Rule) => Rule.required(),
			group: 'branding',
		}),
		defineField({
			name: 'logoImage',
			title: 'Logo Image',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alternative text',
				}),
			],
			group: 'branding',
		}),
		defineField({
			name: 'logoText',
			title: 'Logo Text',
			type: 'string',
			group: 'branding',
		}),
		defineField({
			name: 'navCtaLabel',
			title: 'Nav CTA Label',
			type: 'string',
			group: 'navigation',
		}),
		defineField({
			name: 'navCtaLink',
			title: 'Nav CTA Link',
			type: 'string',
			group: 'navigation',
		}),
		defineField({
			name: 'whatsappNumber',
			title: 'WhatsApp Number',
			type: 'string',
			description: 'Digits only (e.g. 447123456789)',
			group: 'navigation',
		}),
		defineField({
			name: 'bookDirectLink',
			title: 'Book Direct Link',
			type: 'string',
			group: 'navigation',
		}),
		defineField({
			name: 'instagramUrl',
			title: 'Instagram URL',
			type: 'string',
			group: 'socials',
		}),
		defineField({
			name: 'facebookUrl',
			title: 'Facebook URL',
			type: 'string',
			group: 'socials',
		}),
		defineField({
			name: 'linkedinUrl',
			title: 'LinkedIn URL',
			type: 'string',
			group: 'socials',
		}),
		defineField({
			name: 'youtubeUrl',
			title: 'YouTube URL',
			type: 'string',
			group: 'socials',
		}),
		defineField({
			name: 'contactFormEmail',
			title: 'Contact Form Email',
			type: 'string',
			group: 'forms',
		}),
		defineField({
			name: 'partnerEnquiryEmail',
			title: 'Partner Enquiry Email',
			type: 'string',
			group: 'forms',
		}),
		defineField({
			name: 'colours',
			title: 'Colours',
			type: 'object',
			group: 'colours',
			fields: [
				{ name: 'primary', type: 'string', title: 'Primary (Hex)' },
				{ name: 'primaryForeground', type: 'string', title: 'Primary Foreground (Hex)' },
				{ name: 'accent', type: 'string', title: 'Accent (Hex)' },
				{ name: 'accentForeground', type: 'string', title: 'Accent Foreground (Hex)' },
				{ name: 'background', type: 'string', title: 'Background (Hex)' },
				{ name: 'foreground', type: 'string', title: 'Foreground (Hex)' },
				{ name: 'muted', type: 'string', title: 'Muted (Hex)' },
				{ name: 'border', type: 'string', title: 'Border (Hex)' },
			],
		}),
		defineField({
			name: 'seo',
			title: 'SEO Fallback',
			type: 'seo',
			group: 'seo',
		}),
		defineField({
			name: 'announcement',
			title: 'Announcement Bar',
			type: 'object',
			group: 'announcement',
			fields: [
				{ name: 'enabled', type: 'boolean', title: 'Enabled' },
				{ name: 'message', type: 'string', title: 'Message' },
				{ name: 'link', type: 'string', title: 'Link (optional)' },
			],
		}),
	],
	preview: {
		prepare: () => ({
			title: 'Site Settings',
		}),
	},
})
