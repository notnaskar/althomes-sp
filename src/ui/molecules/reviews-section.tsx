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
		<section className="grid min-[821px]:grid-cols-2 max-[820px]:grid-cols-1 min-h-[60vh]">
			{/* Left: quote + thumbnail slider */}
			<div className="flex flex-col justify-between bg-primary px-[60px] py-[64px] max-[820px]:px-[18px] max-[820px]:py-[40px]">
				<p
					className="font-stories text-[28px] leading-[1.4] text-primary-foreground max-w-[420px]"
					style={{ fontFamily: 'var(--font-stories)', fontWeight: 400, fontStyle: 'normal' }}
				>
					Hearts full, stories shared<br />
					by guests who took back more than just memories.<br />
					These are the Alt Stories.
				</p>

				{/* Thumbnail slider */}
				<div className="mt-10 flex items-center gap-3">
					<button
						onClick={() => setActive((active - 1 + reviews.length) % reviews.length)}
						aria-label="Previous review"
						className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition hover:bg-primary-foreground/10"
					>
						←
					</button>

					<div className="flex gap-2 overflow-x-auto">
						{reviews.map((r, i) => (
							<button
								key={i}
								onClick={() => setActive(i)}
								aria-label={`View review by ${r.guestName ?? 'guest'}`}
								className={`shrink-0 overflow-hidden rounded-full transition-all ${
									i === active
										? 'ring-2 ring-accent ring-offset-2 ring-offset-primary'
										: 'opacity-60 hover:opacity-80'
								}`}
							>
								{r.guestPhoto ? (
									<Img
										image={r.guestPhoto as Parameters<typeof Img>[0]['image']}
										width={56}
										height={56}
										alt={r.guestPhoto.alt ?? r.guestName ?? ''}
										className="h-14 w-14 object-cover"
									/>
								) : (
									<div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-xs">
										{(r.guestName ?? '?')[0]}
									</div>
								)}
							</button>
						))}
					</div>

					<button
						onClick={() => setActive((active + 1) % reviews.length)}
						aria-label="Next review"
						className="flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition hover:bg-primary-foreground/10"
					>
						→
					</button>
				</div>
			</div>

			{/* Right: review card */}
			<div className="flex items-center justify-center bg-background px-[40px] py-[64px] max-[820px]:px-[18px] max-[820px]:py-[40px]">
				<div
					key={active}
					className="w-full max-w-[360px] rotate-[2deg] overflow-hidden rounded-2xl border border-stroke bg-card-shell shadow-lg"
				>
					{/* Image — 60% of card height */}
					<div className="h-[260px] w-full overflow-hidden">
						{review.guestPhoto ? (
							<Img
								image={review.guestPhoto as Parameters<typeof Img>[0]['image']}
								width={360}
								height={260}
								alt={review.guestPhoto.alt ?? review.guestName ?? ''}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="h-full w-full bg-muted/30" />
						)}
					</div>

					{/* Text — center aligned */}
					<div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
						{review.body && (
							<p className="font-sans text-[14px] leading-[22px] tracking-[0.05em] text-foreground italic">
								&ldquo;{review.body}&rdquo;
							</p>
						)}
						{review.guestName && (
							<p className="font-sans text-[13px] font-bold tracking-[0.1em] text-foreground">
								{review.guestName}
							</p>
						)}
						{review.propertyTitle && (
							<p className="font-sans text-[12px] tracking-[0.08em] text-muted">
								{review.propertyTitle}
							</p>
						)}
						{review.guestLocation && (
							<p className="font-sans text-[12px] tracking-[0.08em] text-muted">
								{review.guestLocation}
							</p>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
