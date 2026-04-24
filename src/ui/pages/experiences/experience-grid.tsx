'use client'

import { useState } from 'react'
import Link from 'next/link'
import Img from '@/ui/img'
import type { ALL_EXPERIENCES_QUERY_RESULT, ALL_PROPERTIES_QUERY_RESULT } from '@/sanity/types'

type Props = {
	experiences: ALL_EXPERIENCES_QUERY_RESULT
	properties: ALL_PROPERTIES_QUERY_RESULT
	cardsMaxShown?: number | null
}

export default function ExperienceGrid({ experiences, properties, cardsMaxShown }: Props) {
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
							className={`rounded-full px-5 py-2 text-sm font-semibold border transition ${
								selectedId === null
									? 'bg-black text-white border-black'
									: 'bg-white text-black border-gray-300 hover:border-black'
							}`}
						>
							All
						</button>
						{properties.map((p) => (
							<button
								key={p._id}
								onClick={() => setSelectedId(selectedId === p._id ? null : p._id)}
								className={`rounded-full px-5 py-2 text-sm font-semibold border transition ${
									selectedId === p._id
										? 'bg-black text-white border-black'
										: 'bg-white text-black border-gray-300 hover:border-black'
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
					<p className="text-gray-500 text-center py-12">No experiences found.</p>
				) : (
					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
						{filtered.map((exp) => (
							<Link
								key={exp._id}
								href={`/experiences/${exp.slug ?? ''}`}
								className="group block overflow-hidden rounded-xl border border-gray-200 hover:shadow-md transition"
							>
								{exp.image && (
									<div className="overflow-hidden">
										<Img
											image={exp.image}
											width={600}
											alt={exp.image.alt ?? ''}
											className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
										/>
									</div>
								)}
								<div className="p-5">
									{exp.title && (
										<h3 className="font-bold text-lg leading-snug">{exp.title}</h3>
									)}
									{exp.description && (
										<p className="mt-2 text-sm text-gray-600 line-clamp-3">{exp.description}</p>
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
