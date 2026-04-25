import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	email: z.string().email('Invalid email address'),
	phone: z.string().min(1, 'Phone is required'),
	message: z.string().min(1, 'Message is required'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
