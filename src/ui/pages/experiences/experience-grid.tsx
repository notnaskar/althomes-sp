'use client'

import Link from 'next/link'
import { useState } from 'react'
import type {
	ALL_EXPERIENCES_QUERY_RESULT,
	ALL_PROPERTIES_QUERY_RESULT,
} from '@/sanity/types'
import Img from '@/ui/img'

type Props = {
	experiences: ALL_EXPERIENCES_QUERY_RESULT
	properties: ALL_PROPERTIES_QUERY_RESULT
	cardsMaxShown?: number | null
}

export default function ExperienceGrid({
	experiences,
	properties,
	cardsMaxShown,
}: Props) {
	const [selectedId, setSelectedId] = useState<string | null>(null)

	const filtered = selectedId
		? experiences.filter((e) => e.propertyIds?.includes(selectedId))
		: cardsMaxShown
			? experiences.slice(0, cardsMaxShown)
			: experiences

	return (
		<>
			{/* Property filter chips */}
			{properties.length > 0 && (
				<section className="container py-6">
					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => setSelectedId(null)}
							className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
								selectedId === null
									? 'border-black bg-black text-white'
									: 'border-gray-300 bg-white text-black hover:border-black'
							}`}
						>
							All
						</button>
						{properties.map((p) => (
							<button
								key={p._id}
								onClick={() =>
									setSelectedId(selectedId === p._id ? null : p._id)
								}
								className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
									selectedId === p._id
										? 'border-black bg-black text-white'
										: 'border-gray-300 bg-white text-black hover:border-black'
								}`}
							>
								{p.title}
							</button>
						))}
					</div>
				</section>
			)}

			{/* Experience card grid */}
			<section className="container py-8">
				{filtered.length === 0 ? (
					<p className="py-12 text-center text-gray-500">
						No experiences found.
					</p>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((exp) => (
							<Link
								key={exp._id}
								href={`/experiences/${exp.slug ?? ''}`}
								className="group block overflow-hidden rounded-xl border border-gray-200 transition hover:shadow-md"
							>
								{exp.image && (
									<div className="overflow-hidden">
										<Img
											image={exp.image}
											width={600}
											alt={exp.image.alt ?? ''}
											className="h-56 w-full object-cover transition duration-300 group-hover:scale-105"
										/>
									</div>
								)}
								<div className="p-5">
									{exp.title && (
										<h3 className="text-lg leading-snug font-bold">
											{exp.title}
										</h3>
									)}
									{exp.description && (
										<p className="mt-2 line-clamp-3 text-sm text-gray-600">
											{exp.description}
										</p>
									)}
								</div>
							</Link>
						))}
					</div>
				)}
			</section>
		</>
	)
}
