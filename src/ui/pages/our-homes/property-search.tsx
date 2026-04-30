'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ALL_PROPERTIES_QUERY_RESULT } from '@/sanity/types'
import AvailabilityForm from '@/ui/forms/availability-form'
import Img from '@/ui/img'

type Props = {
	properties: ALL_PROPERTIES_QUERY_RESULT
}

export default function PropertySearch({ properties }: Props) {
	const [availableIds, setAvailableIds] = useState<string[] | null>(null)

	const displayed = availableIds
		? properties.filter(
				(p) =>
					p.rentalwisePropertyId &&
					availableIds.includes(p.rentalwisePropertyId),
			)
		: properties

	return (
		<>
			{/* Availability form */}
			<section className="container py-10">
				<AvailabilityForm onResult={setAvailableIds} />
			</section>

			{/* Property grid */}
			<section className="container py-10">
				{availableIds !== null && displayed.length === 0 ? (
					<p className="py-12 text-center text-muted">
						No properties available for the selected dates. Try different dates.
					</p>
				) : (
					<div className="grid grid-cols-1 gap-12">
						{displayed.map((property) => (
							<Link
								key={property._id}
								href={`/our-homes/${property.slug}`}
								className="group grid grid-cols-1 items-center gap-8 md:grid-cols-2"
							>
								<div className="aspect-[4/3] overflow-hidden rounded-2xl">
									{property.cardThumbnail && (
										<Img
											image={property.cardThumbnail}
											width={1200}
											alt={property.cardThumbnail.alt ?? property.title ?? ''}
											className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
										/>
									)}
								</div>
								<div className="space-y-4">
									<h2 className="font-heading italic text-[30px] tracking-[0.3em] text-foreground">{property.title}</h2>
									{property.shortDescription && (
										<p className="text-lg text-foreground">
											{property.shortDescription}
										</p>
									)}
									<div className="flex gap-4 text-sm font-medium">
										{property.bedrooms != null && (
											<span>{property.bedrooms} Bedrooms</span>
										)}
										{property.maxGuests != null && (
											<span>Up to {property.maxGuests} Guests</span>
										)}
									</div>
									<div className="pt-4">
										<span className="inline-block rounded-[5px] bg-accent px-6 py-3 font-bold text-accent-foreground transition group-hover:bg-accent/90">
											Explore Property
										</span>
									</div>
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</>
	)
}
