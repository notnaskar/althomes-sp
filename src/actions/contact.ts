'use server'

import { Resend } from 'resend'
import { contactSchema } from '@/lib/schemas/contact'
import { getSite } from '@/sanity/lib/data'
import { checkOrigin, checkRateLimit, getClientIp } from '@/lib/server/security'
import { contactEmailHtml } from '@/lib/server/email-templates/contact'

export async function submitContact(rawData: unknown) {
	const parsed = contactSchema.safeParse(rawData)
	if (!parsed.success) return { success: false, error: 'Invalid input' }
	const data = parsed.data

	if (data._hp) return { success: false, error: 'Bot detected' }

	if (!(await checkOrigin())) return { success: false, error: 'Forbidden' }

	const ip = await getClientIp()
	if (!checkRateLimit('contact', ip)) {
		return { success: false, error: 'Too many requests. Please wait before trying again.' }
	}

	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY not set')
		return { success: false, error: 'Email service not configured' }
	}

	const site = await getSite()
	const to =
		site?.contactFormEmail ?? site?.formNotificationEmail ?? process.env.RESEND_TO_EMAIL
	const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

	if (!to) {
		console.error('No contact form destination email configured')
		return { success: false, error: 'Email destination not configured' }
	}

	const resend = new Resend(apiKey)

	const { error } = await resend.emails.send({
		from,
		to,
		replyTo: data.email,
		subject: `New Contact: ${data.name}`,
		html: contactEmailHtml({
			name: data.name,
			email: data.email,
			phone: data.phone,
			message: data.message,
		}),
	})

	if (error) {
		console.error('Resend error (contact):', error)
		return { success: false, error: 'Failed to send message' }
	}

	return { success: true }
}
