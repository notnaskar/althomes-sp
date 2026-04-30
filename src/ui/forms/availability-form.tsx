'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { searchAvailability } from '@/actions/availability'
import {
	availabilitySchema,
	type AvailabilityInput,
} from '@/lib/schemas/availability'

type Props = {
	onResult: (availableIds: string[] | null) => void
}

export default function AvailabilityForm({ onResult }: Props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AvailabilityInput>({
		resolver: zodResolver(availabilitySchema),
	})

	async function onSubmit(data: AvailabilityInput) {
		const result = await searchAvailability(data)
		onResult(result.availableIds)
	}

	const inputClass =
		'w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background'
	const labelClass =
		'block text-xs font-semibold uppercase tracking-[0.1em] mb-1 text-muted'

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-wrap items-end gap-4"
			noValidate
		>
			<div className="min-w-[140px] flex-1">
				<label htmlFor="av-checkIn" className={labelClass}>
					Check In
				</label>
				<input
					id="av-checkIn"
					type="date"
					{...register('checkIn')}
					className={inputClass}
				/>
				{errors.checkIn && (
					<p className="mt-1 text-xs text-red-600">{errors.checkIn.message}</p>
				)}
			</div>

			<div className="min-w-[140px] flex-1">
				<label htmlFor="av-checkOut" className={labelClass}>
					Check Out
				</label>
				<input
					id="av-checkOut"
					type="date"
					{...register('checkOut')}
					className={inputClass}
				/>
				{errors.checkOut && (
					<p className="mt-1 text-xs text-red-600">{errors.checkOut.message}</p>
				)}
			</div>

			<div className="w-24">
				<label htmlFor="av-guests" className={labelClass}>
					Guests
				</label>
				<input
					id="av-guests"
					type="number"
					min={1}
					{...register('guests', { valueAsNumber: true })}
					className={inputClass}
				/>
				{errors.guests && (
					<p className="mt-1 text-xs text-red-600">{errors.guests.message}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="rounded-[5px] bg-accent px-8 py-3 text-sm font-bold whitespace-nowrap text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90 disabled:opacity-50"
			>
				{isSubmitting ? 'Searching…' : 'CHECK AVAILABILITY'}
			</button>
		</form>
	)
}
