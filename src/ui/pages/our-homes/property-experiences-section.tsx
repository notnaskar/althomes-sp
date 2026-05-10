'use client'

import Image from 'next/image'
import { useState } from 'react'
import { urlFor } from '@/sanity/lib/image'
import type {
	SanityImageAsset,
	SanityImageCrop,
	SanityImageHotspot,
} from '@/sanity/types'
import ExperienceCard from '@/ui/pages/experiences/experiences-updated/experience-card'

interface BgImage {
	asset?: SanityImageAsset | null
	alt?: string | null
	hotspot?: SanityImageHotspot | null
	crop?: SanityImageCrop | null
}

interface ExperienceItem {
	title?: string | null
	slug?: string | null
	description?: string | null
	image?: {
		asset?: SanityImageAsset | null
		alt?: string | null
	} | null
}

interface PropertyExperiencesSectionProps {
	bgImage?: BgImage | null
	experiences: ExperienceItem[]
	propertyTitle: string
}

export default function PropertyExperiencesSection({
	bgImage,
	experiences,
	propertyTitle,
}: PropertyExperiencesSectionProps) {
	const hasBg = bgImage?.asset != null
	const bgUrl = hasBg ? urlFor(bgImage!).width(1600).quality(85).url() : null

	const items = experiences.slice(0, 3)
	const total = items.length
	const [index, setIndex] = useState(0)
	const safeIndex = total > 0 ? Math.min(index, total - 1) : 0
	const prev = () => setIndex((i) => (i - 1 + total) % total)
	const next = () => setIndex((i) => (i + 1) % total)

	const arrowClasses = [
		'shrink-0 font-sans text-[20px] font-semibold leading-none transition-opacity hover:opacity-60',
		hasBg ? 'text-white' : 'text-foreground',
	].join(' ')

	const sectionClasses = [
		'relative overflow-hidden object-bottom px-[18px] py-[48px] lg:px-[90px] lg:py-[80px]',
		hasBg ? '' : 'bg-background',
	].join(' ')

	return (
		<section data-section="experiences" className={sectionClasses}>
			{bgUrl && (
				<Image
					src={bgUrl}
					alt={bgImage?.alt ?? ''}
					fill
					priority
					quality={85}
					className="object-cover"
					sizes="100vw"
				/>
			)}
			<div className="relative z-10">
				<h2
					className={[
						'font-heading text-center text-[24px] leading-[1.2] tracking-[0.05em] lg:text-[32px]',
						hasBg
							? 'text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.08)]'
							: 'text-foreground',
					].join(' ')}
				>
					EXPERIENCES NEAR {propertyTitle.toUpperCase()}
				</h2>

				{total > 0 && (
					<>
						<div className="mt-[48px] flex justify-center gap-8 max-lg:!hidden">
							{items.map((exp, i) => (
								<div
									key={exp.title ?? i}
									className="h-full w-full max-w-[340px]"
								>
									<ExperienceCard
										title={exp.title ?? ''}
										description={exp.description}
										image={
											exp.image as Parameters<
												typeof ExperienceCard
											>[0]['image']
										}
										tilt={i % 2 === 0 ? 'cw' : 'ccw'}
									/>
								</div>
							))}
						</div>

						<div className="mt-[48px] flex items-center justify-center gap-3 lg:!hidden">
							<button
								onClick={prev}
								aria-label="Previous experience"
								disabled={total < 2}
								className={arrowClasses}
							>
								{'<'}
							</button>
							<div className="w-full max-w-[280px]">
								{items[safeIndex] && (
									<ExperienceCard
										title={items[safeIndex].title ?? ''}
										description={items[safeIndex].description}
										image={
											items[safeIndex].image as Parameters<
												typeof ExperienceCard
											>[0]['image']
										}
										tilt={safeIndex % 2 === 0 ? 'cw' : 'ccw'}
									/>
								)}
							</div>
							<button
								onClick={next}
								aria-label="Next experience"
								disabled={total < 2}
								className={arrowClasses}
							>
								{'>'}
							</button>
						</div>
					</>
				)}
			</div>
		</section>
	)
}
