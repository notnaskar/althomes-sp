'use client'

import { useState } from 'react'
import type { PROPERTY_QUERY_RESULT } from '@/sanity/types'
import Img from '@/ui/img'

type Props = {
	gallery: NonNullable<NonNullable<PROPERTY_QUERY_RESULT>['gallery']>
	quote: string | null | undefined
	decorImage:
		| NonNullable<PROPERTY_QUERY_RESULT>['galleryDecorImage']
		| null
		| undefined
}

export default function PropertyGallerySection({
	gallery,
	quote,
	decorImage,
}: Props) {
	const [index, setIndex] = useState(0)
	const total = gallery.length
	if (total === 0) return null

	const prev = () => setIndex((i) => (i - 1 + total) % total)
	const next = () => setIndex((i) => (i + 1) % total)

	const mainImg = gallery[index]
	const secondaryImg = gallery[(index + 1) % total]

	return (
		<section className="bg-background flex flex-col gap-8 overflow-hidden lg:h-[625px] lg:flex-row lg:items-end lg:gap-[42px]">
			{/* Left: main gallery image */}
			<div className="h-[360px] w-full shrink-0 overflow-hidden rounded-[5px] lg:h-full lg:w-[720px]">
				{mainImg && (
					<Img
						image={mainImg}
						width={720}
						alt={mainImg.alt ?? ''}
						sizes="(max-width: 1023px) 100vw, 720px"
						className="h-full w-full object-cover transition-opacity duration-300"
					/>
				)}
			</div>

			{/* Right: Frame 71 */}
			<div className="flex w-full flex-col justify-end gap-[11px] overflow-hidden lg:w-[479px]">
				{/* Frame 70: absolute-positioned collage */}
				<div className="relative flex flex-col gap-4 px-[3px] lg:block lg:h-[614px]">
					{/* Botanical decor illustration */}
					{decorImage?.asset && (
						<div className="pointer-events-none order-1 h-[240px] w-full lg:absolute lg:top-0 lg:right-0 lg:order-none lg:h-[405px] lg:w-[421px]">
							<Img
								image={decorImage}
								width={421}
								alt=""
								className="h-full w-full object-cover"
							/>
						</div>
					)}

					{/* Pull quote */}
					{quote && (
						<p className="font-heading text-foreground order-2 w-full text-[30px] leading-[40px] tracking-[0.1em] lg:absolute lg:top-[230px] lg:left-0 lg:order-none lg:w-[478px]">
							{quote}
						</p>
					)}

					{/* Secondary gallery photo */}
					{secondaryImg && (
						<div className="relative order-3 h-[240px] w-full overflow-hidden rounded-[5px] lg:absolute lg:bottom-0 lg:left-0 lg:order-none lg:h-[361px] lg:w-[479px]">
							<Img
								image={secondaryImg}
								width={479}
								alt={secondaryImg.alt ?? ''}
								className="h-full w-full object-cover transition-opacity duration-300"
							/>
						</div>
					)}
				</div>

				{/* Carousel indicator */}
				<div className="flex items-center justify-center gap-4 pb-2">
					<button
						onClick={prev}
						aria-label="Previous image"
						className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
					>
						{'<'}
					</button>
					<span className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em]">
						{index + 1}/{total}
					</span>
					<button
						onClick={next}
						aria-label="Next image"
						className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em] transition-opacity hover:opacity-60"
					>
						{'>'}
					</button>
				</div>
			</div>
		</section>
	)
}
