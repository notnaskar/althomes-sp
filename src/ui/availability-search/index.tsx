'use client'

import { useState } from 'react'
import AvailabilityForm from '@/ui/forms/availability-form'

type Props = {
	children: (availableIds: string[] | null) => React.ReactNode
}

export default function AvailabilitySearch({ children }: Props) {
	const [availableIds, setAvailableIds] = useState<string[] | null>(null)

	return (
		<>
			<AvailabilityForm onResult={setAvailableIds} />
			{children(availableIds)}
		</>
	)
}
