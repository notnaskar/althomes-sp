'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import Link from 'next/link'
import { contactSchema, type ContactInput } from '@/lib/schemas/contact'
import { submitContact } from '@/actions/contact'

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
			<input type="text" {...register('_hp')} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

			<div>
				<label htmlFor="cf-name" className="block text-sm font-semibold mb-1">
					NAME
				</label>
				<input
					id="cf-name"
					type="text"
					{...register('name')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
				/>
				{errors.name && (
					<p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-email" className="block text-sm font-semibold mb-1">
					EMAIL
				</label>
				<input
					id="cf-email"
					type="email"
					{...register('email')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
				/>
				{errors.email && (
					<p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-phone" className="block text-sm font-semibold mb-1">
					PHONE
				</label>
				<input
					id="cf-phone"
					type="tel"
					{...register('phone')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black"
				/>
				{errors.phone && (
					<p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
				)}
			</div>

			<div>
				<label htmlFor="cf-message" className="block text-sm font-semibold mb-1">
					MESSAGE
				</label>
				<textarea
					id="cf-message"
					rows={5}
					{...register('message')}
					className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
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

			{serverError && (
				<p className="text-sm text-red-600">{serverError}</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full rounded-full bg-black py-4 text-sm font-bold text-white hover:bg-gray-800 transition disabled:opacity-50"
			>
				{isSubmitting ? 'Sending…' : 'SEND MESSAGE'}
			</button>
		</form>
	)
}
