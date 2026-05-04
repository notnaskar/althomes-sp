'use client'

import { useState } from 'react'
import type { PROPERTY_QUERY_RESULT } from '@/sanity/types'
import Img from '@/ui/img'

type Review = NonNullable<NonNullable<PROPERTY_QUERY_RESULT>['reviews']>[number]

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
	const [active, setActive] = useState(0)

	if (!reviews.length) return null

	const review = reviews[active]

	return (
		<section className="px-[18px] lg:px-[10%] flex flex-col lg:flex-row gap-8 lg:gap-12 lg:min-h-[640px] w-full">
			<div className="relative flex flex-col justify-center w-full lg:w-[40%] bg-primary px-6 py-12 lg:pl-[120px] lg:pr-8">
				<p className="font-stories text-[30px] leading-[1.4] text-primary-foreground max-w-[453px] relative z-10">
					Hearts full, stories shared<br />
					by guests who took back more than just memories.<br />
					These are the <i className="italic font-stories">Alt Stories</i>.
				</p>

				{/* Carousel controls */}
				<div className="mt-12 flex flex-col items-center lg:items-center gap-5 relative z-10 lg:w-fit lg:mx-auto">
					<div className="flex items-center gap-8">
						<button
							onClick={() => setActive((active - 1 + reviews.length) % reviews.length)}
							aria-label="Previous review"
							className="text-primary-foreground text-xl transition hover:opacity-70 p-2"
						>
							◀
						</button>
						<span className="text-primary-foreground font-sans text-[16px] tracking-widest font-medium">
							{active + 1} / {reviews.length}
						</span>
						<button
							onClick={() => setActive((active + 1) % reviews.length)}
							aria-label="Next review"
							className="text-primary-foreground text-xl transition hover:opacity-70 p-2"
						>
							▶
						</button>
					</div>

					{/* Pagination Dots */}
					<div className="flex items-center gap-2">
						{reviews.map((_, i) => (
							<button
								key={i}
								onClick={() => setActive(i)}
								aria-label={`Go to review ${i + 1}`}
								className={`h-2 rounded-full transition-all ${
									i === active ? 'w-6 bg-primary-foreground' : 'w-2 bg-primary-foreground/40 hover:bg-primary-foreground/70'
								}`}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Right Column: review card */}
			<div className="flex flex-col items-center justify-center w-full lg:w-[60%] bg-background px-6 py-12 lg:px-8">
				<div
					key={active}
					className="w-full max-w-[541px] lg:-rotate-[2.94deg] lg:ml-[18px] bg-card-shell rounded-[8px] shadow-[0px_8px_32px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-500 ease-in-out"
				>
					{/* Image */}
					<div className="h-[260px] lg:h-[200px] w-full overflow-hidden">
						{review.guestPhoto ? (
							<Img
								image={review.guestPhoto as Parameters<typeof Img>[0]['image']}
								width={541}
								height={260}
								alt={review.guestPhoto.alt ?? review.guestName ?? ''}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="h-full w-full bg-muted/30" />
						)}
					</div>

					{/* Text Block */}
					<div className="flex flex-col justify-center px-8 py-8 min-h-[121px] text-center">
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
									<p className="font-sans text-[13px] tracking-[0.05em] text-foreground/80">
										{review.propertyTitle}
									</p>
								)}
								{review.propertyTitle && review.guestLocation && (
									<span className="text-foreground/40 text-[10px]">&bull;</span>
								)}
								{review.guestLocation && (
									<p className="font-sans text-[13px] tracking-[0.05em] text-foreground/80">
										{review.guestLocation}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
