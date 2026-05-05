'use client'

import { useState } from 'react'
import type { PROPERTY_QUERY_RESULT } from '@/sanity/types'
import Img from '@/ui/img'

type Review = NonNullable<NonNullable<PROPERTY_QUERY_RESULT>['reviews']>[number]

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
	const [active, setActive] = useState(0)

	if (!reviews.length) return null

	const review = reviews[active]
	const total = reviews.length

	const prev = () => setActive((i) => (i - 1 + total) % total)
	const next = () => setActive((i) => (i + 1) % total)

	return (
		<section className="w-full bg-background overflow-hidden px-[18px] lg:px-[10%]">
			<div className="flex flex-col lg:flex-row gap-8 lg:gap-12 min-h-[60vh] lg:min-h-[640px]">

				{/* ── Left column: heading + slider controls ── */}
				<div className="relative flex flex-col justify-center px-[18px] py-12 lg:w-[40%] lg:px-[60px] lg:py-16">

					{/* Section label */}
					<p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-secondary-foreground/60 mb-6">
						{/* STATIC */}
						Alt Stories
					</p>

					{/* Heading */}
					<h2 className="font-heading text-[28px] leading-[1.45] text-secondary-foreground max-w-[420px] lg:text-[34px]">
						{/* STATIC */}
						Hearts full, stories shared
						<br />
						by guests who took back more
						<br />
						than just memories.
						<br />
						These are the{' '}
						<em className="italic font-heading">Alt Stories</em>.
					</h2>

					{/* Slider controls — hidden on mobile (shown at bottom on mobile) */}
					<div className="hidden lg:flex items-center gap-6 mt-12">
						<button
							onClick={prev}
							aria-label="Previous review"
							className="font-sans text-[12px] font-semibold tracking-[0.3em] text-secondary-foreground hover:opacity-60 transition-opacity"
						>
							{'<'}
						</button>
						<span className="font-sans text-[12px] font-semibold tracking-[0.3em] text-secondary-foreground">
							{active + 1}/{total}
						</span>
						<button
							onClick={next}
							aria-label="Next review"
							className="font-sans text-[12px] font-semibold tracking-[0.3em] text-secondary-foreground hover:opacity-60 transition-opacity"
						>
							{'>'}
						</button>
					</div>
				</div>

				{/* ── Right column: review card ── */}
				<div className="flex flex-col items-center justify-center bg-background px-[18px] py-12 lg:w-[60%] lg:px-[60px] lg:py-16">
					{/* Card — rotated on desktop */}
					<div
						key={active}
						className="w-full max-w-[520px] bg-card-shell rounded-[8px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden lg:-rotate-[2.94deg]"
					>
						{/* Guest photo */}
						<div className="h-[260px] w-full overflow-hidden">
							{review.guestPhoto ? (
								<Img
									image={review.guestPhoto as Parameters<typeof Img>[0]['image']}
									width={520}
									height={260}
									alt={review.guestPhoto.alt ?? review.guestName ?? ''}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="h-full w-full bg-muted/30" />
							)}
						</div>

						{/* Text block */}
						<div className="flex flex-col items-center justify-center px-8 py-8 text-center">
							{review.body && (
								<p className="font-sans text-[15px] leading-[1.6] tracking-[0.03em] text-foreground italic mb-4">
									&ldquo;{review.body}&rdquo;
								</p>
							)}

							<div className="flex flex-col items-center gap-1">
								{review.guestName && (
									<p className="font-sans text-[14px] font-bold tracking-[0.08em] text-foreground uppercase">
										{review.guestName}
									</p>
								)}
								<div className="flex flex-wrap items-center justify-center gap-2 mt-1">
									{review.propertyTitle && (
										<p className="font-sans text-[13px] tracking-[0.05em] text-foreground/70">
											{review.propertyTitle}
										</p>
									)}
									{review.propertyTitle && review.guestLocation && (
										<span className="text-foreground/40 text-[10px]">&bull;</span>
									)}
									{review.guestLocation && (
										<p className="font-sans text-[13px] tracking-[0.05em] text-foreground/70">
											{review.guestLocation}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Mobile-only slider controls (below the card) */}
					<div className="flex lg:hidden items-center gap-6 mt-8">
						<button
							onClick={prev}
							aria-label="Previous review"
							className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground hover:opacity-60 transition-opacity"
						>
							{'<'}
						</button>
						<span className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground">
							{active + 1}/{total}
						</span>
						<button
							onClick={next}
							aria-label="Next review"
							className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground hover:opacity-60 transition-opacity"
						>
							{'>'}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
