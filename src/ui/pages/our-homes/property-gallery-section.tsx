'use client'

import { useState } from 'react'
import Img from '@/ui/img'
import type { PROPERTY_QUERY_RESULT } from '@/sanity/types'

type Props = {
	gallery: NonNullable<NonNullable<PROPERTY_QUERY_RESULT>['gallery']>
	quote: string | null | undefined
	decorImage: NonNullable<PROPERTY_QUERY_RESULT>['galleryDecorImage'] | null | undefined
}

export default function PropertyGallerySection({ gallery, quote, decorImage }: Props) {
	const [index, setIndex] = useState(0)
	const total = gallery.length
	if (total === 0) return null

	const prev = () => setIndex((i) => (i - 1 + total) % total)
	const next = () => setIndex((i) => (i + 1) % total)

	const mainImg = gallery[index]
	const secondaryImg = gallery[(index + 1) % total]

	return (
		<section className="flex flex-col overflow-visible lg:my-[100px] lg:flex-row gap-8 lg:gap-[42px] lg:h-[625px] lg:items-end overflow-hidden bg-background">
			{/* Left: main gallery image */}
			<div className="h-[360px] lg:h-full w-full lg:w-[770px] shrink-0 overflow-hidden rounded-[5px]">
				{mainImg && (
					<Img
						image={mainImg}
						width={720}
						alt={mainImg.alt ?? ''}
						sizes="(max-width: 1023px) 100vw, 770px"
						className="h-full w-full object-cover transition-opacity duration-300"
					/>
				)}
			</div>

			{/* Right: Frame 71 */}
			<div className="flex w-full lg:w-[479px] flex-col justify-end gap-[11px]">
				{/* Frame 70: absolute-positioned collage */}
				<div className="relative justify-end flex flex-col gap-4 lg:h-[614px] px-[3px]">
					{/* Botanical decor illustration */}
					{decorImage?.asset && (
						<div className="lg:absolute lg:right-[-260px] lg:top-[-150px] h-[240px] lg:h-[405px] w-full lg:w-[421px] order-1 lg:order-none pointer-events-none">
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
						<p className=" lg:left-0 lg:top-[230px] w-full lg:w-[478px] order-2 lg:order-none font-heading text-[30px] leading-[40px] tracking-[0.1em] text-foreground">
							{quote}
						</p>
					)}

					{/* Secondary gallery photo */}
					{secondaryImg && (
						<div className="relative lg:left-0 lg:bottom-0 h-[240px] lg:h-[361px] w-full lg:w-[479px] order-3 lg:order-none overflow-hidden rounded-[5px]">
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
				<div className="flex items-center justify-start gap-4 pb-2">
					<button
						onClick={prev}
						aria-label="Previous image"
						className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground hover:opacity-60 transition-opacity"
					>
						{'<'}
					</button>
					<span className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground">
						{index + 1}/{total}
					</span>
					<button
						onClick={next}
						aria-label="Next image"
						className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground hover:opacity-60 transition-opacity"
					>
						{'>'}
					</button>
				</div>
			</div>
		</section>
	)
}
