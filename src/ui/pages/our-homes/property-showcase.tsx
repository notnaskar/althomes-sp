import Image from 'next/image'
import Link from 'next/link'
import { FiMapPin } from 'react-icons/fi'
import { urlFor } from '@/sanity/lib/image'
import type { ALL_PROPERTIES_QUERY_RESULT } from '@/sanity/types'
import styles from './property-showcase.module.css'

// FALLBACKS:
// heroImage → null (muted bg placeholder shown)
// showcaseSecondaryImage → null (section omitted)
// showcaseDecorImage → null (no decoration)
// tagline → null (overlay tagline omitted)
// priceFrom → null (pricing block omitted)

type PropertyItem = ALL_PROPERTIES_QUERY_RESULT[number]

type Props = {
	title: string
	slug: string
	tagline: PropertyItem['tagline']
	heroImage: PropertyItem['heroImage']
	showcaseSecondaryImage: PropertyItem['showcaseSecondaryImage']
	showcaseDecorImage: PropertyItem['showcaseDecorImage']
	showcaseDecorTop: PropertyItem['showcaseDecorTop']
	showcaseDecorRight: PropertyItem['showcaseDecorRight']
	showcaseDecorWidth: PropertyItem['showcaseDecorWidth']
	showcaseDecorHeight: PropertyItem['showcaseDecorHeight']
	showcaseDecorRotation: PropertyItem['showcaseDecorRotation']
	shortDescription: PropertyItem['shortDescription']
	pullQuote: PropertyItem['pullQuote']
	locationHeadline: PropertyItem['locationHeadline']
	cardAmenities: PropertyItem['cardAmenities']
	priceFrom: PropertyItem['priceFrom']
}

export default function PropertyShowcase({
	title,
	slug,
	tagline,
	heroImage,
	showcaseSecondaryImage,
	showcaseDecorImage,
	showcaseDecorTop,
	showcaseDecorRight,
	showcaseDecorWidth,
	showcaseDecorHeight,
	showcaseDecorRotation,
	shortDescription,
	pullQuote,
	locationHeadline,
	cardAmenities,
	priceFrom,
}: Props) {
	return (
		<section className="relative grid min-h-[912px] grid-cols-[768fr_625fr] overflow-visible max-[820px]:min-h-0 max-[820px]:grid-cols-1">
			{/* CONTENT: showcaseDecorImage */}
			{showcaseDecorImage?.asset && (
				<div
					className={styles.deco}
					style={
						{
							'--deco-top': showcaseDecorTop ?? '0px',
							'--deco-right': showcaseDecorRight ?? '0px',
							'--deco-width': `${showcaseDecorWidth ?? 100}px`,
							'--deco-height': `${showcaseDecorHeight ?? 100}px`,
							'--deco-rotation': `${showcaseDecorRotation ?? 0}deg`,
						} as React.CSSProperties
					}
					aria-hidden="true"
				>
					<Image
						src={urlFor(showcaseDecorImage.asset).width(300).url()}
						alt=""
						fill
						sizes="200px"
						className="object-contain"
					/>
				</div>
			)}

			{/* Left panel — main photo */}
			<div className="relative min-h-[912px] max-[820px]:min-h-[478px]">
				{heroImage?.asset ? (
					<Image
						src={urlFor(heroImage.asset).width(1200).quality(85).url()}
						alt={heroImage.alt ?? title}
						fill
						sizes="(max-width: 820px) 100vw, 55vw"
						loading="eager"
						priority
						className="rounded-[10px_5px_5px_10px] object-cover max-[820px]:rounded-none"
					/>
				) : (
					<div className="bg-muted absolute inset-0 rounded-[10px_5px_5px_10px] max-[820px]:rounded-none" />
				)}

				{/* Overlay */}
				<div className="absolute inset-x-0 top-0 bottom-0 z-[2] flex flex-col items-center gap-1 bg-gradient-to-t from-black/[0.55] to-transparent px-[140px] pt-[120px] pb-[40px] max-[820px]:px-[40px] max-[820px]:pb-6">
					{/* CONTENT: tagline */}
					{tagline && (
						<span className="text-center text-[14px] tracking-[0.07em] text-white">
							{tagline}
						</span>
					)}
					{/* CONTENT: title */}
					<h2 className="font-heading text-center text-[55px] leading-[1] tracking-[0.07em] text-white max-[820px]:text-[36px]">
						{title}
					</h2>
				</div>
			</div>

			{/* Right panel — content */}
			<div className="flex flex-col justify-start gap-[33px] pt-[44px] pr-0 pb-[44px] pl-[90px] max-[820px]:gap-6 max-[820px]:px-[18px] max-[820px]:py-8">
				{/* CONTENT: shortDescription */}
				{shortDescription && (
					<p className="text-foreground text-[15px] leading-[1.533] tracking-[0.1em] whitespace-pre-line">
						{shortDescription}
					</p>
				)}

				{/* CONTENT: pullQuote */}
				{pullQuote && (
					<p className="font-heading text-foreground max-w-[432px] text-[30px] leading-[40px] tracking-[0.1em] max-[820px]:max-w-full max-[820px]:text-[22px] max-[820px]:leading-[32px]">
						{pullQuote}
					</p>
				)}

				{/* CONTENT: showcaseSecondaryImage */}
				{showcaseSecondaryImage?.asset && (
					<div className="relative h-[337px] w-full max-w-[625px] flex-shrink-0 overflow-hidden rounded-[5px_10px_10px_5px] max-[820px]:h-[200px]">
						<Image
							src={urlFor(showcaseSecondaryImage.asset)
								.width(625)
								.quality(85)
								.url()}
							alt={showcaseSecondaryImage.alt ?? ''}
							fill
							sizes="(max-width: 820px) 100vw, 45vw"
							className="object-cover"
						/>
					</div>
				)}

				{/* Meta row: location + amenities */}
				{(locationHeadline || cardAmenities) && (
					<div className="flex flex-row items-start gap-[40px] max-[820px]:flex-col max-[820px]:gap-5">
						{/* CONTENT: locationHeadline */}
						{locationHeadline && (
							<div className="flex flex-shrink-0 flex-col gap-2">
								<FiMapPin size={33} className="text-foreground" />
								<p className="text-foreground max-w-[189px] text-[15px] leading-[16px] font-bold tracking-[0.1em]">
									{locationHeadline}
								</p>
							</div>
						)}
						<div className="flex flex-col gap-1">
							{/* CONTENT: cardAmenities */}
							{cardAmenities && (
								<p className="text-foreground text-[15px] leading-[23px] tracking-[0.1em] whitespace-pre-line">
									{cardAmenities}
								</p>
							)}
							{/* STATIC */}
							<Link
								href={`/our-homes/${slug}`}
								className="text-foreground text-[12px] font-bold tracking-[0.3em] uppercase underline"
							>
								VIEW DETAILS
							</Link>
						</div>
					</div>
				)}

				{/* CONTENT: priceFrom */}
				{priceFrom && (
					<div className="flex flex-col gap-[5px]">
						<div className="flex flex-col">
							<span className="text-foreground text-[15px] leading-[16px] font-bold tracking-[0.1em]">
								{priceFrom}
							</span>
							{/* STATIC */}
							<span className="text-foreground text-[9px] leading-[23px] tracking-[0.1em]">
								Tax Inclusive
							</span>
						</div>
						<Link
							href={`/our-homes/${slug}`}
							className="bg-accent text-accent-foreground inline-flex h-[33px] w-[144px] items-center justify-center rounded-[5px] text-[12px] font-bold tracking-[0.3em] uppercase"
						>
							BOOK NOW
						</Link>
					</div>
				)}
			</div>
		</section>
	)
}
