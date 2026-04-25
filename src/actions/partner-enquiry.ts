'use server'

import { Resend } from 'resend'
import { getSite } from '@/sanity/lib/data'
import type { PartnerInput } from '@/lib/schemas/partner'

export async function submitPartner(data: PartnerInput) {
	if (data._hp) return { success: false, error: 'Bot detected' }

	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) {
		console.error('RESEND_API_KEY not set')
		return { success: false, error: 'Email service not configured' }
	}

	const site = await getSite()
	const to = site?.partnerEnquiryEmail ?? process.env.RESEND_TO_EMAIL
	const from = process.env.RESEND_FROM_EMAIL ?? 'noreply@althomes.co'

	if (!to) {
		console.error('No partner enquiry destination email configured')
		return { success: false, error: 'Email destination not configured' }
	}

	const resend = new Resend(apiKey)

	const { error } = await resend.emails.send({
		from,
		to,
		subject: `Partner enquiry: ${data.name}`,
		text: [
			`Name: ${data.name}`,
			`Email: ${data.email}`,
			`Phone: ${data.phone}`,
			`Location: ${data.location}`,
			`Property Type: ${data.propertyType}`,
			`Status: ${data.status}`,
			`Operational: ${data.operational}`,
			`Photos / Website: ${data.photosLink}`,
		].join('\n'),
	})

	if (error) {
		console.error('Resend error:', error)
		return { success: false, error: 'Failed to send enquiry' }
	}

	return { success: true }
}
