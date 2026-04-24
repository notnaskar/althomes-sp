'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { availabilitySchema, type AvailabilityInput } from '@/lib/schemas/availability'
import { searchAvailability } from '@/actions/availability'

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
		'w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white'
	const labelClass = 'block text-xs font-semibold uppercase tracking-wide mb-1 text-gray-600'

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-wrap gap-4 items-end"
			noValidate
		>
			<div className="flex-1 min-w-[140px]">
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

			<div className="flex-1 min-w-[140px]">
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
				className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:bg-gray-800 transition disabled:opacity-50 whitespace-nowrap"
			>
				{isSubmitting ? 'Searching…' : 'CHECK AVAILABILITY'}
			</button>
		</form>
	)
}
