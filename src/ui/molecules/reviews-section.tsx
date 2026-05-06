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
		<section className="w-full overflow-hidden px-[18px] lg:px-[10%]">
			<div className="flex min-h-[60vh] flex-col gap-8 lg:min-h-[640px] lg:flex-row lg:gap-12">
				{/* ── Left column: heading + slider controls ── */}
				<div className="relative flex flex-col justify-center px-[18px] py-12 lg:w-[60%] lg:py-16">
					{/* Section label */}
					<p className="text-secondary-foreground/60 mb-6 font-sans text-[11px] font-semibold tracking-[0.3em] uppercase">
						{/* STATIC */}
						Alt Stories
					</p>

					{/* Heading */}
					<h2 className="font-heading text-secondary-foreground max-w-[420px] text-[28px] leading-[1.45] lg:text-[34px]">
						{/* STATIC */}
						Hearts full, stories shared
						<br />
						by guests who took back more
						<br />
						than just memories.
						<br />
						These are the <em className="font-heading italic">Alt Stories</em>.
					</h2>

					{/* Slider controls — hidden on mobile (shown at bottom on mobile) */}
					<div className="mt-12 hidden items-center gap-6 lg:flex">
						<button
							onClick={prev}
							aria-label="Previous review"
							className="text-secondary-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
						>
							{'<'}
						</button>
						<span className="text-secondary-foreground font-sans text-[12px] font-semibold tracking-[0.3em]">
							{active + 1}/{total}
						</span>
						<button
							onClick={next}
							aria-label="Next review"
							className="text-secondary-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
						>
							{'>'}
						</button>
					</div>
				</div>

				{/* ── Right column: review card ── */}
				<div className="flex flex-col items-center justify-center px-[18px] py-12 lg:w-[60%] lg:py-16">
					{/* Card — rotated on desktop */}
					<div
						key={active}
						className="bg-card-shell w-full max-w-[520px] overflow-hidden rounded-[8px] border border-stroke lg:-rotate-[2.94deg]"
					>
						{/* Guest photo */}
						<div className="h-[260px] w-full overflow-hidden">
							{review.guestPhoto ? (
								<Img
									image={
										review.guestPhoto as Parameters<typeof Img>[0]['image']
									}
									width={520}
									height={260}
									alt={review.guestPhoto.alt ?? review.guestName ?? ''}
									className="h-full w-full object-cover"
								/>
							) : (
								<div className="bg-muted/30 h-full w-full" />
							)}
						</div>

						{/* Text block */}
						<div className="flex flex-col items-center justify-center px-8 py-8 text-center">
							{review.body && (
								<p className="text-foreground mb-4 font-sans text-[15px] leading-[1.6] tracking-[0.03em] italic">
									&ldquo;{review.body}&rdquo;
								</p>
							)}

							<div className="flex flex-col items-center gap-1">
								{review.guestName && (
									<p className="text-foreground font-sans text-[14px] font-bold tracking-[0.08em] uppercase">
										{review.guestName}
									</p>
								)}
								<div className="mt-1 flex flex-wrap items-center justify-center gap-2">
									{review.propertyTitle && (
										<p className="text-foreground/70 font-sans text-[13px] tracking-[0.05em]">
											{review.propertyTitle}
										</p>
									)}
									{review.propertyTitle && review.guestLocation && (
										<span className="text-foreground/40 text-[10px]">
											&bull;
										</span>
									)}
									{review.guestLocation && (
										<p className="text-foreground/70 font-sans text-[13px] tracking-[0.05em]">
											{review.guestLocation}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Mobile-only slider controls (below the card) */}
					<div className="mt-8 flex items-center gap-6 lg:hidden">
						<button
							onClick={prev}
							aria-label="Previous review"
							className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
						>
							{'<'}
						</button>
						<span className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em]">
							{active + 1}/{total}
						</span>
						<button
							onClick={next}
							aria-label="Next review"
							className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
						>
							{'>'}
						</button>
					</div>
				</div>
			</div>
		</section>
	)
}
