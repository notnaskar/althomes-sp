'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import Link from 'next/link'
import { partnerSchema, type PartnerInput } from '@/lib/schemas/partner'
import { submitPartner } from '@/actions/partner-enquiry'

export default function PartnerForm() {
	const [success, setSuccess] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<PartnerInput>({
		resolver: zodResolver(partnerSchema),
	})

	async function onSubmit(data: PartnerInput) {
		setServerError(null)
		const result = await submitPartner(data)
		if (result.success) {
			setSuccess(true)
		} else {
			setServerError('Something went wrong. Please try again.')
		}
	}

	if (success) {
		return (
			<div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
				<p className="text-lg font-semibold text-green-800">
					Thank you! We&rsquo;ll review your enquiry and get back to you shortly.
				</p>
			</div>
		)
	}

	const inputClass =
		'w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black'
	const labelClass = 'block text-sm font-semibold mb-1 uppercase tracking-wide'

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
			{/* Honeypot */}
			<input type="text" {...register('_hp')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

			<div>
				<label htmlFor="pf-name" className={labelClass}>Name</label>
				<input id="pf-name" type="text" {...register('name')} className={inputClass} />
				{errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-email" className={labelClass}>Email</label>
				<input id="pf-email" type="email" {...register('email')} className={inputClass} />
				{errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-phone" className={labelClass}>Phone Number</label>
				<input id="pf-phone" type="tel" {...register('phone')} className={inputClass} />
				{errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-location" className={labelClass}>Location</label>
				<input id="pf-location" type="text" {...register('location')} className={inputClass} />
				{errors.location && <p className="mt-1 text-xs text-red-600">{errors.location.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-propertyType" className={labelClass}>Type of Property</label>
				<input id="pf-propertyType" type="text" {...register('propertyType')} className={inputClass} />
				{errors.propertyType && <p className="mt-1 text-xs text-red-600">{errors.propertyType.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-status" className={labelClass}>Status</label>
				<input id="pf-status" type="text" {...register('status')} className={inputClass} />
				{errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-operational" className={labelClass}>Operational</label>
				<input id="pf-operational" type="text" {...register('operational')} className={inputClass} />
				{errors.operational && <p className="mt-1 text-xs text-red-600">{errors.operational.message}</p>}
			</div>

			<div>
				<label htmlFor="pf-photosLink" className={labelClass}>Photos / Website Link</label>
				<input id="pf-photosLink" type="url" {...register('photosLink')} className={inputClass} />
				{errors.photosLink && <p className="mt-1 text-xs text-red-600">{errors.photosLink.message}</p>}
			</div>

			<div className="flex items-start gap-3">
				<input
					id="pf-consent"
					type="checkbox"
					{...register('privacyConsent')}
					className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-black"
				/>
				<label htmlFor="pf-consent" className="text-sm text-gray-700">
					I agree to the{' '}
					<Link href="/privacy-policy" className="underline hover:text-black">
						Privacy Policy
					</Link>
				</label>
			</div>
			{errors.privacyConsent && (
				<p className="text-xs text-red-600">{errors.privacyConsent.message}</p>
			)}

			{serverError && <p className="text-sm text-red-600">{serverError}</p>}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full rounded-full bg-black py-4 text-sm font-bold text-white hover:bg-gray-800 transition disabled:opacity-50"
			>
				{isSubmitting ? 'Sending…' : 'SUBMIT ENQUIRY'}
			</button>
		</form>
	)
}
