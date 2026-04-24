import { z } from 'zod'

export const partnerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone number is required'),
	location: z.string().min(1, 'Location is required'),
	propertyType: z.string().min(1, 'Property type is required'),
	status: z.string().min(1, 'Status is required'),
	operational: z.string().min(1, 'Operational status is required'),
	photosLink: z.url('Must be a valid URL'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type PartnerInput = z.infer<typeof partnerSchema>
