'use client'

import { useEffect, useRef, useState } from 'react'
import type { AltWayPage } from '@/sanity/types'

type Stat = NonNullable<AltWayPage['stats']>[number]

export default function StatsSlider({ stats }: { stats: Stat[] }) {
	const [activeIndex, setActiveIndex] = useState(0)
	const trackRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const track = trackRef.current
		if (!track) return

		const handler = () => {
			const index = Math.round(track.scrollLeft / track.clientWidth)
			setActiveIndex(index)
		}

		track.addEventListener('scroll', handler, { passive: true })
		return () => track.removeEventListener('scroll', handler)
	}, [])

	function goTo(index: number) {
		const track = trackRef.current
		if (!track) return
		track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
	}

	return (
		<>
			{/* Mobile: single-stat slider */}
			<div className="md:hidden">
				<div
					ref={trackRef}
					className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
					style={{ scrollbarWidth: 'none' }}
				>
					{stats.map((stat) => (
						<div
							key={stat._key}
							className="min-w-full snap-center text-center px-8 py-4"
						>
							{stat.value && (
								<p className="text-5xl font-bold text-primary-foreground">
									{stat.value}
								</p>
							)}
							{stat.label && (
								<p className="mt-2 text-sm font-semibold tracking-wide text-primary-foreground/80 uppercase">
									{stat.label}
								</p>
							)}
							{stat.subtext && (
								<p className="mt-1 mx-auto max-w-[60%] text-primary-foreground/50">
									{stat.subtext}
								</p>
							)}
						</div>
					))}
				</div>

				{/* Dots */}
				<div className="mt-6 flex justify-center gap-2">
					{stats.map((stat, i) => (
						<button
							key={stat._key}
							onClick={() => goTo(i)}
							aria-label={`Go to stat ${i + 1}`}
							className={`h-2 rounded-full transition-all duration-300 ${
								i === activeIndex
									? 'w-6 bg-primary-foreground'
									: 'w-2 bg-primary-foreground/40'
							}`}
						/>
					))}
				</div>
			</div>

			{/* Desktop: 4-column grid */}
			<div className="hidden md:grid md:grid-cols-4 gap-8">
				{stats.map((stat) => (
					<div key={stat._key} className="text-center justify-items-center">
						{stat.value && (
							<p className="text-5xl font-bold text-primary-foreground">
								{stat.value}
							</p>
						)}
						{stat.label && (
							<p className="mt-2 text-sm font-semibold tracking-wide text-primary-foreground/80 uppercase">
								{stat.label}
							</p>
						)}
						{stat.subtext && (
							<p className="mt-1 w-[60%] text-primary-foreground/50">{stat.subtext}</p>
						)}
					</div>
				))}
			</div>
		</>
	)
}
