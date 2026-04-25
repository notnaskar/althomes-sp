import { z } from 'zod'

export const availabilitySchema = z
	.object({
		checkIn: z.string().min(1, 'Check-in date is required'),
		checkOut: z.string().min(1, 'Check-out date is required'),
		guests: z.number().min(1, 'At least 1 guest required'),
	})
	.refine((d) => new Date(d.checkOut) > new Date(d.checkIn), {
		message: 'Check-out must be after check-in',
		path: ['checkOut'],
	})

export type AvailabilityInput = z.infer<typeof availabilitySchema>
