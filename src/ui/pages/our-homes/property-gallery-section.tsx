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
		<section className="flex h-[625px] items-end gap-[42px] overflow-hidden bg-background">
			{/* Left: main gallery image */}
			<div className="h-[577px] w-[720px] shrink-0 overflow-hidden rounded-[5px]">
				{mainImg && (
					<Img
						image={mainImg}
						width={720}
						alt={mainImg.alt ?? ''}
						className="h-full w-full object-cover transition-opacity duration-300"
					/>
				)}
			</div>

			{/* Right: Frame 71 */}
			<div className="flex flex-1 flex-col justify-end gap-[11px] overflow-hidden">
				{/* Frame 70: absolute-positioned collage */}
				<div className="relative h-[614px] px-[3px]">
					{/* Botanical decor illustration */}
					{decorImage?.asset && (
						<div className="pointer-events-none absolute right-0 top-0 h-[405px] w-[421px]">
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
						<p className="absolute left-0 top-[230px] w-[478px] font-heading text-[30px] leading-[40px] tracking-[0.1em] text-foreground">
							{quote}
						</p>
					)}

					{/* Secondary gallery photo */}
					{secondaryImg && (
						<div className="absolute left-0 top-[336px] h-[361px] w-[479px] overflow-hidden rounded-[5px]">
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
