import { z } from 'zod'

export const contactSchema = z.object({
	name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
	email: z.email('Invalid email address'),
	phone: z.string().min(1, 'Phone is required').max(20, 'Phone too long'),
	message: z
		.string()
		.min(1, 'Message is required')
		.max(2000, 'Message must be 2000 characters or less'),
	privacyConsent: z.literal(true, {
		error: 'You must accept the privacy policy',
	}),
	_hp: z.string().max(0).optional(),
})

export type ContactInput = z.infer<typeof contactSchema>
