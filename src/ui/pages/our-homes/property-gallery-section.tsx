'use client'

import { useState } from 'react'
import type { PROPERTY_QUERY_RESULT } from '@/sanity/types'
import Img from '@/ui/img'

type Props = {
	gallery: NonNullable<NonNullable<PROPERTY_QUERY_RESULT>['sliderGallery']>
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
		<section className="bg-background relative mt-4 grid grid-cols-1 gap-8 lg:my-[100px] lg:mr-[90px] lg:ml-0 lg:h-[625px] lg:grid-cols-[770fr_479fr] lg:grid-rows-[1fr_auto_auto_auto] lg:gap-x-[42px] lg:gap-y-0">
			{/* Pull quote */}
			{quote && (
				<p className="font-heading text-foreground mr-12 ml-4 text-2xl leading-[40px] tracking-[0.1em] lg:col-start-2 lg:row-start-2">
					{quote}
				</p>
			)}

			{/* Main gallery image */}
			<div className="h-[360px] w-full overflow-hidden rounded-[5px] lg:col-start-1 lg:row-span-4 lg:row-start-1 lg:h-[625px]">
				{mainImg && (
					<Img
						image={mainImg}
						width={770}
						alt={mainImg.alt ?? ''}
						sizes="(max-width: 1023px) calc(100vw - 36px), (max-width: 1439px) calc((100vw - 222px) * 0.617), 770px"
						className="h-full w-full object-cover transition-opacity duration-300"
					/>
				)}
			</div>

			{/* Secondary gallery photo */}
			{secondaryImg && (
				<div className="mx-auto -mt-10 w-[360px] overflow-hidden rounded-[5px] lg:col-start-2 lg:row-start-3 lg:mx-0 lg:mt-4 lg:h-90 lg:w-full lg:max-w-120">
					<Img
						image={secondaryImg}
						width={479}
						alt={secondaryImg.alt ?? ''}
						sizes="(max-width: 1023px) 360px, (max-width: 1439px) calc((100vw - 222px) * 0.383), 479px"
						className="h-full w-full object-cover transition-opacity duration-300"
					/>
				</div>
			)}

			{/* Carousel indicator */}
			<div className="flex items-center justify-center gap-4 pb-2 lg:col-start-2 lg:row-start-4 lg:mt-[11px] lg:justify-self-start">
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

			{/* Botanical decor illustration — absolute on section */}
			{decorImage?.asset && (
				<div className="pointer-events-none absolute top-0 -right-15 z-10 h-[180px] w-[200px] lg:top-[-240px] lg:right-[-150px] lg:h-[405px] lg:w-[421px] xl:right-[-200px]">
					<Img
						image={decorImage}
						width={421}
						alt=""
						className="h-full w-full object-cover"
					/>
				</div>
			)}
		</section>
	)
}
