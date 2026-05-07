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
			<div className="border-primary bg-background rounded-xl border p-8 text-center">
				<p className="text-primary text-lg font-semibold">
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
				<label
					htmlFor="cf-name"
					className="text-foreground/80 mb-1 block text-[11px] font-bold tracking-[0.15em] uppercase"
				>
					NAME*
				</label>
				<input
					id="cf-name"
					type="text"
					{...register('name')}
					className="border-foreground/30 focus:border-foreground w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="cf-email"
					className="text-foreground/80 mb-1 block text-[11px] font-bold tracking-[0.15em] uppercase"
				>
					EMAIL*
				</label>
				<input
					id="cf-email"
					type="email"
					{...register('email')}
					className="border-foreground/30 focus:border-foreground w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="cf-phone"
					className="text-foreground/80 mb-1 block text-[11px] font-bold tracking-[0.15em] uppercase"
				>
					PHONE NUMBER*
				</label>
				<input
					id="cf-phone"
					type="tel"
					{...register('phone')}
					className="border-foreground/30 focus:border-foreground w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
				/>
				{errors.phone && (
					<p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="cf-message"
					className="text-foreground/80 mb-1 block text-[11px] font-bold tracking-[0.15em] uppercase"
				>
					MESSAGE
				</label>
				<textarea
					id="cf-message"
					rows={3}
					{...register('message')}
					className="border-foreground/30 focus:border-foreground w-full resize-none rounded-none border-0 border-b bg-transparent px-0 py-3 text-sm transition-colors focus:ring-0 focus:outline-none"
				/>
				{errors.message && (
					<p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
				)}
			</div>

			<div className="mt-8 flex items-start gap-3">
				<input
					id="cf-consent"
					type="checkbox"
					{...register('privacyConsent')}
					className="border-foreground/40 text-foreground/70 mt-[2px] h-3.5 w-3.5 rounded-[5px] bg-transparent focus:ring-0"
				/>
				<label
					htmlFor="cf-consent"
					className="text-foreground/70 text-[11px] font-bold tracking-wide"
				>
					I have read the{' '}
					<Link
						href="/privacy-policy"
						className="text-foreground/80 hover:text-foreground underline"
					>
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
				className="bg-accent text-accent-foreground hover:bg-accent/90 mt-6 inline-block w-full rounded-[5px] px-10 py-3 text-[11px] font-bold tracking-[0.3em] uppercase transition disabled:opacity-50 min-[821px]:w-auto"
			>
				{isSubmitting ? 'Sending…' : 'SUBMIT'}
			</button>
		</form>
	)
}
