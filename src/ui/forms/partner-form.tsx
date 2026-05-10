'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { submitPartner } from '@/actions/partner-enquiry'
import { partnerSchema, type PartnerInput } from '@/lib/schemas/partner'

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
			<div className="py-12 text-center">
				<p className="font-heading text-foreground text-[24px] leading-[32px] tracking-[0.07em]">
					Thank you! We&rsquo;ll review your enquiry and get back to you
					shortly.
				</p>
			</div>
		)
	}

	const label =
		'block font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground uppercase'
	const input =
		'w-full border-0 border-b border-muted bg-transparent pb-1 font-heading text-[15px] leading-[23px] tracking-[0.1em] text-foreground placeholder:text-muted/50 focus:outline-none focus:border-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors'

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<input
				type="text"
				{...register('_hp')}
				className="hidden"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
			/>

			<div className="grid grid-cols-2 gap-x-[93px] gap-y-[48px] max-[820px]:grid-cols-1">
				<div>
					<label htmlFor="pf-name" className={label}>
						NAME*
					</label>
					<input
						id="pf-name"
						type="text"
						placeholder="First Name     Last Name"
						{...register('name')}
						className={input}
					/>
					{errors.name && (
						<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="pf-email" className={label}>
						EMAIL*
					</label>
					<input
						id="pf-email"
						type="email"
						placeholder="user@email.com"
						{...register('email')}
						className={input}
					/>
					{errors.email && (
						<p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="pf-phone" className={label}>
						PHONE NUMBER*
					</label>
					<input
						id="pf-phone"
						type="tel"
						placeholder="+91 9876543210"
						{...register('phone')}
						className={input}
					/>
					{errors.phone && (
						<p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
					)}
				</div>
				<div>
					<label htmlFor="pf-location" className={label}>
						LOCATION*
					</label>
					<input
						id="pf-location"
						type="text"
						placeholder="City, State"
						{...register('location')}
						className={input}
					/>
					{errors.location && (
						<p className="mt-1 text-xs text-red-600">
							{errors.location.message}
						</p>
					)}
				</div>

				<div>
					<label htmlFor="pf-propertyType" className={label}>
						TYPE OF PROPERTY*
					</label>
					<input
						id="pf-propertyType"
						type="text"
						placeholder="Villa / Resort / Flat"
						{...register('propertyType')}
						className={input}
					/>
					{errors.propertyType && (
						<p className="mt-1 text-xs text-red-600">
							{errors.propertyType.message}
						</p>
					)}
				</div>
				<div>
					<label htmlFor="pf-status" className={label}>
						STATUS*
					</label>
					<input
						id="pf-status"
						type="text"
						placeholder="Furnished / Unfurnished"
						{...register('status')}
						className={input}
					/>
					{errors.status && (
						<p className="mt-1 text-xs text-red-600">{errors.status.message}</p>
					)}
				</div>

				<div>
					<label htmlFor="pf-operational" className={label}>
						OPERATIONAL*
					</label>
					<input
						id="pf-operational"
						type="text"
						placeholder="Under Construction / Operational"
						{...register('operational')}
						className={input}
					/>
					{errors.operational && (
						<p className="mt-1 text-xs text-red-600">
							{errors.operational.message}
						</p>
					)}
				</div>
				<div>
					<label htmlFor="pf-photosLink" className={label}>
						PHOTOS / WEBSITE LINK*
					</label>
					<input
						id="pf-photosLink"
						type="url"
						placeholder="https://..."
						{...register('photosLink')}
						className={input}
					/>
					{errors.photosLink && (
						<p className="mt-1 text-xs text-red-600">
							{errors.photosLink.message}
						</p>
					)}
				</div>
			</div>

			<div className="mt-[42px] flex flex-col items-center gap-[10px]">
				<div className="flex items-start gap-3">
					<input
						id="pf-consent"
						type="checkbox"
						{...register('privacyConsent')}
						className="border-foreground/40 text-foreground/70 mt-[6px] h-3.5 w-3.5 rounded-[5px] bg-transparent focus:ring-0"
					/>
					<label
						htmlFor="pf-consent"
						className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]"
					>
						I have read the{' '}
						<Link href="/privacy-policy" className="underline">
							Privacy Policy
						</Link>
					</label>
				</div>
				{errors.privacyConsent && (
					<p className="text-xs text-red-600">
						{errors.privacyConsent.message}
					</p>
				)}

				{serverError && <p className="text-sm text-red-600">{serverError}</p>}

				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-accent text-accent-foreground focus-visible:ring-primary mt-[25px] h-[26px] min-w-[95px] rounded-[5px] px-4 font-sans text-[12px] font-semibold tracking-[0.3em] focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50"
				>
					{isSubmitting ? 'Sending…' : 'SUBMIT'}
				</button>
			</div>
		</form>
	)
}
