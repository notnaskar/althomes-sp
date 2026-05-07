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
	showcaseDecorBottom: PropertyItem['showcaseDecorBottom']
	showcaseDecorLeft: PropertyItem['showcaseDecorLeft']
	showcaseDecorWidth: PropertyItem['showcaseDecorWidth']
	showcaseDecorHeight: PropertyItem['showcaseDecorHeight']
	showcaseDecorRotation: PropertyItem['showcaseDecorRotation']
	showcaseSecondaryDecorImage: PropertyItem['showcaseSecondaryDecorImage']
	showcaseSecondaryDecorTop: PropertyItem['showcaseSecondaryDecorTop']
	showcaseSecondaryDecorRight: PropertyItem['showcaseSecondaryDecorRight']
	showcaseSecondaryDecorWidth: PropertyItem['showcaseSecondaryDecorWidth']
	showcaseSecondaryDecorHeight: PropertyItem['showcaseSecondaryDecorHeight']
	showcaseSecondaryDecorBottom: PropertyItem['showcaseSecondaryDecorBottom']
	showcaseSecondaryDecorLeft: PropertyItem['showcaseSecondaryDecorLeft']
	showcaseSecondaryDecorRotation: PropertyItem['showcaseSecondaryDecorRotation']
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
	showcaseDecorBottom,
	showcaseDecorLeft,
	showcaseDecorWidth,
	showcaseDecorHeight,
	showcaseDecorRotation,
	showcaseSecondaryDecorImage,
	showcaseSecondaryDecorTop,
	showcaseSecondaryDecorRight,
	showcaseSecondaryDecorWidth,
	showcaseSecondaryDecorHeight,
	showcaseSecondaryDecorBottom,
	showcaseSecondaryDecorLeft,
	showcaseSecondaryDecorRotation,
	shortDescription,
	pullQuote,
	locationHeadline,
	cardAmenities,
	priceFrom,
}: Props) {
	return (
		<section className="relative flex flex-col gap-6 overflow-visible lg:grid lg:min-h-[912px] lg:grid-cols-[768fr_625fr] lg:grid-rows-[auto_auto_auto_auto_auto] lg:gap-x-0 lg:gap-y-[33px]">
			{/* Main image panel — mobile #1, desktop col-1 spanning all rows */}
			<div className="relative min-h-[420px] sm:min-h-[478px] lg:col-start-1 lg:row-span-5 lg:row-start-1 lg:min-h-[912px]">
				{heroImage?.asset ? (
					<Image
						src={urlFor(heroImage.asset).width(1200).quality(85).url()}
						alt={heroImage.alt ?? title}
						fill
						sizes="(max-width: 1024px) 100vw, 55vw"
						loading="eager"
						priority
						className="rounded-none object-cover lg:rounded-[10px_5px_5px_10px]"
					/>
				) : (
					<div className="bg-muted absolute inset-0 rounded-none lg:rounded-[10px_5px_5px_10px]" />
				)}

				{/* Overlay */}
				<div className="absolute inset-x-0 top-0 bottom-0 z-[2] flex flex-col items-center gap-1 bg-gradient-to-t from-black/[0.55] to-transparent px-[24px] pt-[120px] pb-6 lg:pb-[40px]">
					{/* CONTENT: tagline */}
					{tagline && (
						<span className="text-center text-[clamp(11px,1.8vw,14px)] tracking-[0.07em] text-white">
							{tagline}
						</span>
					)}
					{/* CONTENT: title — clamp keeps title on a single visual line on small viewports */}
					<h2 className="font-heading text-center text-[clamp(26px,6vw,55px)] leading-[1] tracking-[0.07em] text-white">
						{title}
					</h2>
				</div>

				{/* CONTENT: showcaseDecorImage (CSS module hides on mobile) */}
				{showcaseDecorImage?.asset && (
					<div
						className={styles.deco}
						style={
							{
								'--deco-top': showcaseDecorTop ?? 'auto',
								'--deco-right': showcaseDecorRight ?? 'auto',
								'--deco-bottom': showcaseDecorBottom ?? 'auto',
								'--deco-left': showcaseDecorLeft ?? 'auto',
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
			</div>

			{/* CONTENT: showcaseSecondaryImage — mobile #2, desktop col-2 row-3 */}
			{showcaseSecondaryImage?.asset && (
				<div className="px-[18px] lg:col-start-2 lg:row-start-3 lg:px-0 lg:pl-[90px]">
					<div className="relative h-[200px] w-full lg:h-[337px]">
						<Image
							src={urlFor(showcaseSecondaryImage.asset)
								.width(625)
								.quality(85)
								.url()}
							alt={showcaseSecondaryImage.alt ?? ''}
							fill
							sizes="(max-width: 1024px) 100vw, 45vw"
							className="rounded-[5px_10px_10px_5px] object-cover"
						/>
						{/* CONTENT: showcaseSecondaryDecorImage (CSS module hides on mobile) */}
						{showcaseSecondaryDecorImage?.asset && (
							<div
								className={styles.secondaryDeco}
								style={
									{
										'--secondary-deco-top': showcaseSecondaryDecorTop ?? 'auto',
										'--secondary-deco-right':
											showcaseSecondaryDecorRight ?? 'auto',
										'--secondary-deco-bottom':
											showcaseSecondaryDecorBottom ?? 'auto',
										'--secondary-deco-left':
											showcaseSecondaryDecorLeft ?? 'auto',
										'--secondary-deco-width': `${showcaseSecondaryDecorWidth ?? 100}px`,
										'--secondary-deco-height': `${showcaseSecondaryDecorHeight ?? 100}px`,
										'--secondary-deco-rotation': `${showcaseSecondaryDecorRotation ?? 0}deg`,
									} as React.CSSProperties
								}
								aria-hidden="true"
							>
								<Image
									src={urlFor(showcaseSecondaryDecorImage.asset)
										.width(300)
										.url()}
									alt=""
									fill
									sizes="200px"
									className="object-contain"
								/>
							</div>
						)}
					</div>
				</div>
			)}

			{/* CONTENT: shortDescription — mobile #3, desktop col-2 row-1 */}
			{shortDescription && (
				<p className="text-foreground px-[18px] text-[15px] leading-[1.533] tracking-[0.1em] whitespace-pre-line lg:col-start-2 lg:row-start-1 lg:max-w-[432px] lg:px-0 lg:pt-[44px] lg:pl-[90px]">
					{shortDescription}
				</p>
			)}

			{/* CONTENT: pullQuote — mobile #4, desktop col-2 row-2 */}
			{pullQuote && (
				<p className="font-heading text-foreground px-[18px] text-[22px] leading-[32px] tracking-[0.1em] lg:col-start-2 lg:row-start-2 lg:max-w-[432px] lg:px-0 lg:pl-[90px] lg:text-[30px] lg:leading-[40px]">
					{pullQuote}
				</p>
			)}

			{/* Meta — location + amenities. Mobile: stacked (#5 + #6). Desktop: row, col-2 row-4 */}
			{(locationHeadline || cardAmenities) && (
				<div className="flex flex-col items-start gap-5 px-[18px] lg:col-start-2 lg:row-start-4 lg:flex-row lg:gap-[40px] lg:px-0 lg:pl-[90px]">
					{/* CONTENT: locationHeadline */}
					{locationHeadline && (
						<div className="flex flex-shrink-0 flex-col gap-2">
							<FiMapPin size={33} className="text-foreground" />
							<p className="text-foreground max-w-[189px] text-[15px] leading-[16px] font-bold tracking-[0.1em]">
								{locationHeadline}
							</p>
						</div>
					)}
					<div className="flex min-w-0 flex-1 flex-col gap-1">
						{/* CONTENT: cardAmenities */}
						{cardAmenities && (
							<p className="text-foreground text-[15px] leading-[23px] tracking-[0.1em] whitespace-pre-line break-words">
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

			{/* CONTENT: priceFrom — mobile #7 (full-width two-line button), desktop col-2 row-5 */}
			{priceFrom && (
				<div className="flex flex-col gap-[5px] px-[18px] pb-2 lg:col-start-2 lg:row-start-5 lg:px-0 lg:pb-[44px] lg:pl-[90px]">
					{/* Desktop-only price + tax text above button */}
					<div className="hidden lg:flex lg:flex-col">
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
						className="bg-accent text-accent-foreground inline-flex w-full items-center justify-center rounded-[5px] py-3 text-[12px] font-bold tracking-[0.3em] uppercase lg:h-[33px] lg:w-[144px] lg:py-0"
					>
						{/* Mobile: two-line "BOOK NOW FOR {priceFrom} / Tax inclusive" */}
						<span className="flex flex-col items-center gap-0.5 lg:hidden">
							<span>BOOK NOW FOR {priceFrom}</span>
							<span className="text-[9px] font-normal tracking-[0.1em] normal-case">
								Tax inclusive
							</span>
						</span>
						<span className="hidden lg:inline">BOOK NOW</span>
					</Link>
				</div>
			)}
		</section>
	)
}
