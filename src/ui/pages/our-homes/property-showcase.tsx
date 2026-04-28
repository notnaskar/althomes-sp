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
		<section className="relative grid grid-cols-[768fr_625fr] min-h-[912px] overflow-visible max-[820px]:grid-cols-1 max-[820px]:min-h-0">
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
						src={urlFor(showcaseDecorImage.asset).url()}
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
						src={urlFor(heroImage.asset).url()}
						alt={heroImage.alt ?? title}
						fill
						sizes="(max-width: 820px) 100vw, 55vw"
						loading="eager"
						priority
						className="object-cover rounded-[10px_5px_5px_10px] max-[820px]:rounded-none"
					/>
				) : (
					<div className="absolute inset-0 bg-muted rounded-[10px_5px_5px_10px] max-[820px]:rounded-none" />
				)}

				{/* Overlay */}
				<div className="absolute bottom-0 inset-x-0 pt-[120px] pb-[40px] px-[140px] z-[2] bg-gradient-to-t from-black/[0.55] to-transparent flex flex-col items-center gap-1 max-[820px]:px-[40px] max-[820px]:pb-6">
					{/* CONTENT: tagline */}
					{tagline && (
						<span className="text-[14px] tracking-[0.07em] text-white text-center">
							{tagline}
						</span>
					)}
					{/* CONTENT: title */}
					<h2 className="font-heading italic text-[55px] leading-[1] tracking-[0.07em] text-white text-center max-[820px]:text-[36px]">
						{title}
					</h2>
				</div>
			</div>

			{/* Right panel — content */}
			<div className="flex flex-col justify-start pt-[44px] pb-[44px] pl-[90px] pr-0 gap-[33px] max-[820px]:px-[18px] max-[820px]:py-8 max-[820px]:gap-6">
				{/* CONTENT: shortDescription */}
				{shortDescription && (
					<p className="text-[15px] leading-[1.533] tracking-[0.1em] text-foreground whitespace-pre-line">
						{shortDescription}
					</p>
				)}

				{/* CONTENT: pullQuote */}
				{pullQuote && (
					<p className="font-heading italic text-[30px] leading-[40px] tracking-[0.1em] text-foreground max-w-[432px] max-[820px]:text-[22px] max-[820px]:leading-[32px] max-[820px]:max-w-full">
						{pullQuote}
					</p>
				)}

				{/* CONTENT: showcaseSecondaryImage */}
				{showcaseSecondaryImage?.asset && (
					<div className="relative w-full max-w-[625px] h-[337px] rounded-[5px_10px_10px_5px] overflow-hidden flex-shrink-0 max-[820px]:h-[200px]">
						<Image
							src={urlFor(showcaseSecondaryImage.asset).url()}
							alt={showcaseSecondaryImage.alt ?? ''}
							fill
							sizes="(max-width: 820px) 100vw, 45vw"
							className="object-cover"
						/>
					</div>
				)}

				{/* Meta row: location + amenities */}
				{(locationHeadline || cardAmenities) && (
					<div className="flex flex-row gap-[40px] items-start max-[820px]:flex-col max-[820px]:gap-5">
						{/* CONTENT: locationHeadline */}
						{locationHeadline && (
							<div className="flex flex-col gap-2 flex-shrink-0">
								<FiMapPin size={33} className="text-foreground" />
								<p className="font-bold text-[15px] leading-[16px] tracking-[0.1em] text-foreground max-w-[189px]">
									{locationHeadline}
								</p>
							</div>
						)}
						<div className="flex flex-col gap-1">
							{/* CONTENT: cardAmenities */}
							{cardAmenities && (
								<p className="text-[15px] leading-[23px] tracking-[0.1em] text-foreground whitespace-pre-line">
									{cardAmenities}
								</p>
							)}
							{/* STATIC */}
							<Link
								href={`/our-homes/${slug}`}
								className="font-bold text-[12px] tracking-[0.3em] underline text-foreground uppercase"
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
							<span className="font-bold text-[15px] leading-[16px] tracking-[0.1em] text-foreground">
								{priceFrom}
							</span>
							{/* STATIC */}
							<span className="text-[9px] leading-[23px] tracking-[0.1em] text-foreground">
								Tax Inclusive
							</span>
						</div>
						<Link
							href={`/our-homes/${slug}`}
							className="inline-flex items-center justify-center bg-accent text-accent-foreground font-bold text-[12px] tracking-[0.3em] uppercase rounded-[5px] w-[144px] h-[33px]"
						>
							BOOK NOW
						</Link>
					</div>
				)}
			</div>
		</section>
	)
}
