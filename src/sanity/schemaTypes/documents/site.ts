import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
	name: 'site',
	title: 'Site Settings',
	type: 'document',
	groups: [
		{ name: 'branding', default: true },
		{ name: 'navbar' },
		{ name: 'footer' },
		{ name: 'assets' },
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
			name: 'favicon',
			title: 'Favicon',
			type: 'image',
			description: 'Browser tab icon (ICO or PNG, square)',
			group: 'branding',
		}),
		defineField({
			name: 'navCtaLabel',
			title: 'Nav CTA Label',
			type: 'string',
			group: 'navbar',
		}),
		defineField({
			name: 'navCtaLink',
			title: 'Nav CTA Link',
			type: 'string',
			group: 'navbar',
		}),
		defineField({
			name: 'whatsappNumber',
			title: 'WhatsApp Number',
			type: 'string',
			description: 'Digits only (e.g. 447123456789)',
			group: 'navbar',
		}),
		defineField({
			name: 'bookDirectLink',
			title: 'Book Direct Link',
			type: 'string',
			group: 'navbar',
		}),
		defineField({
			name: 'overlayNavLinks',
			title: 'Overlay Nav Links',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string', title: 'Label' }),
						defineField({ name: 'url', type: 'string', title: 'URL' }),
					],
				}),
			],
			group: 'navbar',
		}),
		defineField({
			name: 'menuPhoto',
			title: 'Menu Overlay Photo',
			type: 'image',
			fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text' })],
			group: 'navbar',
		}),
		defineField({
			name: 'contactEmail',
			title: 'Contact Email',
			type: 'string',
			group: 'navbar',
		}),
		defineField({
			name: 'contactPhone',
			title: 'Contact Phone',
			type: 'string',
			group: 'navbar',
		}),
		defineField({
			name: 'checkinTime',
			title: 'Check-in Time',
			type: 'string',
			description: '24-hour format, e.g. 14:00',
			group: 'navbar',
		}),
		defineField({
			name: 'checkoutTime',
			title: 'Check-out Time',
			type: 'string',
			description: '24-hour format, e.g. 11:00',
			group: 'navbar',
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
			name: 'footerBrandName',
			title: 'Footer Brand Name',
			type: 'string',
			description:
				'Italic brand text in footer. Falls back to Site Title if empty.',
			group: 'footer',
		}),
		defineField({
			name: 'footerAboutLinks',
			title: 'Footer About Column Links',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string', title: 'Label' }),
						defineField({ name: 'url', type: 'string', title: 'URL' }),
					],
				}),
			],
			group: 'footer',
		}),
		defineField({
			name: 'footerPolicyLinks',
			title: 'Footer Policies Column Links',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					fields: [
						defineField({ name: 'label', type: 'string', title: 'Label' }),
						defineField({ name: 'url', type: 'string', title: 'URL' }),
					],
				}),
			],
			group: 'footer',
		}),
		defineField({
			name: 'heroBgCircle',
			title: 'Hero Background Circle',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					initialValue: '',
				}),
			],
			group: 'assets',
		}),
		defineField({
			name: 'heroFgCircle',
			title: 'Hero Foreground Circle (photo frame)',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					initialValue: '',
				}),
			],
			group: 'assets',
		}),
		defineField({
			name: 'heroDecorStars',
			title: 'Hero Decor — Stars',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					initialValue: '',
				}),
			],
			group: 'assets',
		}),
		defineField({
			name: 'heroDecorFlowers',
			title: 'Hero Decor — Flowers',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					initialValue: '',
				}),
			],
			group: 'assets',
		}),
		defineField({
			name: 'heroDecorStripes',
			title: 'Hero Decor — Stripes',
			type: 'image',
			fields: [
				defineField({
					name: 'alt',
					type: 'string',
					title: 'Alt text',
					initialValue: '',
				}),
			],
			group: 'assets',
		}),
		defineField({
			name: 'formNotificationEmail',
			title: 'Form Notification Email',
			type: 'string',
			description:
				'Default address for all form submission notifications. Per-form overrides below take precedence.',
			group: 'forms',
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
				{
					name: 'primaryForeground',
					type: 'string',
					title: 'Primary Foreground (Hex)',
				},
				{ name: 'accent', type: 'string', title: 'Accent (Hex)' },
				{
					name: 'accentForeground',
					type: 'string',
					title: 'Accent Foreground (Hex)',
				},
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
