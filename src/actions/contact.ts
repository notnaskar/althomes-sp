'use server'

import type { ContactInput } from '@/lib/schemas/contact'

export async function submitContact(data: ContactInput) {
	if (data._hp) return { success: false, error: 'Bot detected' }
	// TODO: wire Resend — send to site.contactFormEmail
	console.log('Contact submission:', data)
	return { success: true }
}
