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
			<div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
				<p className="text-lg font-semibold text-green-800">
					Thanks for reaching out! We&rsquo;ll be in touch soon.
				</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
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
				<label htmlFor="cf-name" className="mb-1 block text-sm font-semibold">
					NAME
				</label>
				<input
					id="cf-name"
					type="text"
					{...register('name')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-email" className="mb-1 block text-sm font-semibold">
					EMAIL
				</label>
				<input
					id="cf-email"
					type="email"
					{...register('email')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-phone" className="mb-1 block text-sm font-semibold">
					PHONE
				</label>
				<input
					id="cf-phone"
					type="tel"
					{...register('phone')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
				/>
				{errors.phone && (
					<p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="cf-message"
					className="mb-1 block text-sm font-semibold"
				>
					MESSAGE
				</label>
				<textarea
					id="cf-message"
					rows={5}
					{...register('message')}
					className="w-full resize-none rounded-lg border px-4 py-3 text-sm focus:ring-2 focus:ring-black focus:outline-none"
				/>
				{errors.message && (
					<p className="mt-1 text-xs text-red-600">{errors.message.message}</p>
				)}
			</div>

			<div className="flex items-start gap-3">
				<input
					id="cf-consent"
					type="checkbox"
					{...register('privacyConsent')}
					className="mt-1 h-4 w-4 rounded border-gray-300 focus:ring-black"
				/>
				<label htmlFor="cf-consent" className="text-sm text-gray-700">
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
				className="w-full rounded-full bg-black py-4 text-sm font-bold text-white transition hover:bg-gray-800 disabled:opacity-50"
			>
				{isSubmitting ? 'Sending…' : 'SEND MESSAGE'}
			</button>
		</form>
	)
}
