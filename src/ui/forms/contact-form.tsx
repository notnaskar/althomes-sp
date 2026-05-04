'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { submitContact } from '@/actions/contact'
import { contactSchema, type ContactInput } from '@/lib/schemas/contact'

export default function ContactForm() {
	const [success, setSuccess] = useState(false)
	const [serverError, setServerError] = useState<string | null>(null)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<ContactInput>({
		resolver: zodResolver(contactSchema),
	})

	async function onSubmit(data: ContactInput) {
		setServerError(null)
		const result = await submitContact(data)
		if (result.success) {
			setSuccess(true)
		} else {
			setServerError('Something went wrong. Please try again.')
		}
	}

	if (success) {
		return (
			<div className="rounded-xl border border-primary bg-background p-8 text-center">
				<p className="text-lg font-semibold text-primary">
					Thanks for reaching out! We&rsquo;ll be in touch soon.
				</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
			{/* Honeypot */}
			<input
				type="text"
				{...register('_hp')}
				className="hidden"
				tabIndex={-1}
				autoComplete="off"
				aria-hidden="true"
			/>

			<div>
				<label htmlFor="cf-name" className="mb-1 block text-[11px] font-bold text-foreground/80 tracking-[0.15em] uppercase">
					NAME*
				</label>
				<input
					id="cf-name"
					type="text"
					{...register('name')}
					className="w-full border-0 border-b border-foreground/30 bg-transparent rounded-none px-0 py-3 text-sm focus:ring-0 focus:border-foreground focus:outline-none transition-colors"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-email" className="mb-1 block text-[11px] font-bold text-foreground/80 tracking-[0.15em] uppercase">
					EMAIL*
				</label>
				<input
					id="cf-email"
					type="email"
					{...register('email')}
					className="w-full border-0 border-b border-foreground/30 bg-transparent rounded-none px-0 py-3 text-sm focus:ring-0 focus:border-foreground focus:outline-none transition-colors"
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-phone" className="mb-1 block text-[11px] font-bold text-foreground/80 tracking-[0.15em] uppercase">
					PHONE NUMBER*
				</label>
				<input
					id="cf-phone"
					type="tel"
					{...register('phone')}
					className="w-full border-0 border-b border-foreground/30 bg-transparent rounded-none px-0 py-3 text-sm focus:ring-0 focus:border-foreground focus:outline-none transition-colors"
				/>
				{errors.phone && (
					<p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="cf-message"
					className="mb-1 block text-[11px] font-bold text-foreground/80 tracking-[0.15em] uppercase"
				>
					MESSAGE
				</label>
				<textarea
					id="cf-message"
					rows={3}
					{...register('message')}
					className="w-full resize-none border-0 border-b border-foreground/30 bg-transparent rounded-none px-0 py-3 text-sm focus:ring-0 focus:border-foreground focus:outline-none transition-colors"
				/>
				{errors.message && (
					<p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
				)}
			</div>

			<div className="flex items-start gap-3 mt-8">
				<input
					id="cf-consent"
					type="checkbox"
					{...register('privacyConsent')}
					className="mt-[2px] h-3.5 w-3.5 rounded-sm border-foreground/40 bg-transparent focus:ring-0 text-foreground/70"
				/>
				<label htmlFor="cf-consent" className="text-[11px] font-bold text-foreground/70 tracking-wide">
					I have read the{' '}
					<Link href="/privacy-policy" className="underline text-foreground/80 hover:text-foreground">
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
				className="mt-6 inline-block w-full min-[821px]:w-auto rounded-[3px] bg-accent px-10 py-3.5 text-[11px] font-bold text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90 disabled:opacity-50"
			>
				{isSubmitting ? 'Sending…' : 'SUBMIT'}
			</button>
		</form>
	)
}
