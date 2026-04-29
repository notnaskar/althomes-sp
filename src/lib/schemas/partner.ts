import { z } from 'zod'

export const partnerSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.email('Invalid email address'),
	phone: z.string().min(1, 'Phone number is required').max(20, 'Phone too long'),
	location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
	propertyType: z.string().min(1, 'Property type is required').max(100, 'Property type too long'),
	status: z.string().min(1, 'Status is required').max(100, 'Status too long'),
	operational: z.string().min(1, 'Operational status is required').max(100, 'Value too long'),
	photosLink: z.url('Must be a valid URL').max(500, 'URL too long'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type PartnerInput = z.infer<typeof partnerSchema>
