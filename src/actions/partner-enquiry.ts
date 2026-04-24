'use server'

import type { PartnerInput } from '@/lib/schemas/partner'

export async function submitPartner(data: PartnerInput) {
	if (data._hp) return { success: false, error: 'Bot detected' }
	// TODO: wire Resend — send to site.partnerEnquiryEmail
	console.log('Partner enquiry:', data)
	return { success: true }
}
