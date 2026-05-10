import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAltWayPage, getSite } from '@/sanity/lib/data'
import Img from '@/ui/img'
import ReviewsSection from '@/ui/molecules/reviews-section'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'
import TheAltWayCta from '@/ui/pages/the-alt-way/the-alt-way-cta'

export default async function AltWayPage() {
	const page = await getAltWayPage()
	if (!page) notFound()

	const cappedReviews = page.reviews ?? []

	return (
		<main className="flex-1">
			{/* Hero */}
			<section className="relative w-full overflow-hidden">
				{page.heroBackground && (
					<Img
						image={page.heroBackground}
						width={1440}
						loading="eager"
						imageOptions={{ q: 85 }}
						sizes="100vw"
						alt={page.heroBackground.alt ?? ''}
						className="h-[70vh] w-full object-cover"
					/>
				)}
				<div className="absolute inset-0 flex flex-col items-start justify-center text-start sm:px-6 lg:px-60">
					{page.heroHeadline && (
						<h1 className="font-stories text-secondary-foreground ml-4 text-[88px] leading-tight">
							<span className="bg-accent block w-fit px-4 pt-2">
								{page.heroHeadline}
							</span>
							{page.heroHeadlineLine2 && (
								<span className="bg-accent mt-2 block w-fit px-4 py-2">
									{page.heroHeadlineLine2}
								</span>
							)}
						</h1>
					)}
				</div>
			</section>

			{/* Mission split */}
			{(page.missionImage || page.missionText) && (
				<section className="grid grid-cols-1 items-center gap-4 px-4 py-4 md:grid-cols-2 md:gap-16 md:px-[90px] lg:mt-[-130px]">
					<div className="relative order-2 md:order-1">
						{page.missionImage && (
							<div className="overflow-hidden rounded-[5px]">
								<Img
									image={page.missionImage}
									width={700}
									sizes="(max-width: 767px) calc(100vw - 36px), 50vw"
									alt={page.missionImage.alt ?? ''}
									className="h-auto w-full object-cover"
								/>
							</div>
						)}
						{page.missionDecorImage && (
							<Img
								image={page.missionDecorImage}
								width={288}
								alt={page.missionDecorImage.alt ?? ''}
								aria-hidden="true"
								className="pointer-events-none absolute z-10 w-40 rotate-[-11deg] object-contain md:top-24 md:right-16 md:w-90 lg:-top-6 lg:-right-48"
							/>
						)}
					</div>
					{page.missionText && (
						<p className="font-heading text-foreground order-1 text-left text-[19px] leading-[1.53] tracking-[0.07em] md:order-2 md:text-right md:text-[30px] md:leading-[1.33]">
							{page.missionText}
						</p>
					)}
				</section>
			)}

			{/* What's waiting for you (Value Props + Editorial Images) */}
			{page.valueProps && page.valueProps.length > 0 && (
				<section className="bg-background flex items-center justify-center overflow-hidden py-12 lg:py-20">
					<div className="px-[18px] lg:w-[1200px]">
						{page.valuePropHeadline && (
							<div className="mb-16 md:mb-20">
								<h2 className="font-heading text-[24px] tracking-[0.2em] uppercase md:text-left md:text-[40px] md:tracking-[0.3em] lg:text-center">
									{page.valuePropHeadline}
								</h2>
							</div>
						)}
						<div className="relative flex flex-col items-start gap-12 md:grid md:grid-cols-3 md:gap-x-12 md:gap-y-16">
							{/* Row 1 */}
							{page.valueProps[0] && (
								<div className="flex flex-col justify-start">
									{page.valueProps[0].title && (
										<h3 className="font-heading mb-4 text-xl font-bold md:text-2xl">
											{page.valueProps[0].title}
										</h3>
									)}
									{page.valueProps[0].body && (
										<p className="text-foreground/80 font-sans leading-relaxed">
											{page.valueProps[0].body}
										</p>
									)}
								</div>
							)}

							{page.valueProps[1] && (
								<div className="flex flex-col justify-start">
									{page.valueProps[1].title && (
										<h3 className="font-heading mb-4 text-xl font-bold md:text-2xl">
											{page.valueProps[1].title}
										</h3>
									)}
									{page.valueProps[1].body && (
										<p className="text-foreground/80 font-sans leading-relaxed">
											{page.valueProps[1].body}
										</p>
									)}
								</div>
							)}

							<div className="relative z-10 w-full">
								<div className="aspect-[4/4] w-full overflow-hidden rounded-[5px]">
									{page.valuePropEditorialImage && (
										<Img
											image={page.valuePropEditorialImage}
											width={800}
											sizes="(max-width: 767px) calc(100vw - 36px), 400px"
											alt={page.valuePropEditorialImage.alt ?? ''}
											className="h-full w-full object-cover"
										/>
									)}
								</div>
								{page.valuePropEditorialDecorLeft && (
									<Img
										image={page.valuePropEditorialDecorLeft}
										width={160}
										alt={page.valuePropEditorialDecorLeft.alt ?? ''}
										className="absolute top-[30%] -left-8 z-10 w-28 drop-shadow-xl md:-left-16 md:w-40"
									/>
								)}
								{page.valuePropEditorialDecorRight && (
									<Img
										image={page.valuePropEditorialDecorRight}
										width={224}
										alt={page.valuePropEditorialDecorRight.alt ?? ''}
										className="absolute -right-6 -bottom-10 z-20 w-40 drop-shadow-xl md:-right-12 md:-bottom-12 md:w-56"
									/>
								)}
							</div>

							{/* Row 2 */}
							<div className="aspect-[4/4] w-full overflow-hidden rounded-[5px] lg:mt-[-230px]">
								{page.valuePropSecondaryImage && (
									<Img
										image={page.valuePropSecondaryImage}
										width={600}
										sizes="(max-width: 767px) calc(100vw - 36px), 400px"
										alt={page.valuePropSecondaryImage.alt ?? ''}
										className="h-full w-full object-cover"
									/>
								)}
							</div>

							{page.valueProps[2] && (
								<div className="flex flex-col justify-start">
									{page.valueProps[2].title && (
										<h3 className="font-heading mb-4 text-xl font-bold md:text-2xl">
											{page.valueProps[2].title}
										</h3>
									)}
									{page.valueProps[2].body && (
										<p className="text-foreground/80 font-sans leading-relaxed">
											{page.valueProps[2].body}
										</p>
									)}
								</div>
							)}

							{page.valueProps[3] && (
								<div className="flex flex-col justify-start">
									{page.valueProps[3].title && (
										<h3 className="font-heading mb-4 text-xl font-bold md:text-2xl">
											{page.valueProps[3].title}
										</h3>
									)}
									{page.valueProps[3].body && (
										<p className="text-foreground/80 font-sans leading-relaxed">
											{page.valueProps[3].body}
										</p>
									)}
								</div>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Promise CTA */}
			{(page.promiseText || page.promiseCTALabel) && (
				<TheAltWayCta
					ctaQuestion={page.promiseText ?? null}
					ctaButtonLabel={page.promiseCTALabel ?? null}
					ctaHref={page.promiseCTAHref ?? null}
					ctaBackground={page.promiseBackground ?? null}
					ctaDecorLeft={page.promiseCTADecorLeft ?? null}
					ctaDecorRight={page.promiseCTADecorRight ?? null}
					noOverlap={false}
				/>
			)}

			{/* Stats bar */}
			{page.stats && page.stats.length > 0 && (
				<section className="text-primary-foreground relative overflow-hidden py-16">
					{page.statsBackground && (
						<Img
							image={page.statsBackground}
							width={1440}
							sizes="100vw"
							alt={page.statsBackground.alt ?? ''}
							className="absolute inset-0 h-full w-full object-cover"
						/>
					)}
					{/* <div className="absolute inset-0 bg-black/60" /> */}
					<div className="relative z-10 px-[18px] md:px-[90px]">
						{page.statsHeadline && (
							<h2 className="font-heading text-primary-foreground/80 mb-12 text-center text-2xl font-semibold">
								{page.statsHeadline}
							</h2>
						)}
						<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
							{page.stats.map((stat) => (
								<div
									key={stat._key}
									className="justify-items-center text-center"
								>
									{stat.value && (
										<p className="text-primary-foreground text-5xl font-bold">
											{stat.value}
										</p>
									)}
									{stat.label && (
										<p className="text-primary-foreground/80 mt-2 text-sm font-semibold tracking-wide uppercase">
											{stat.label}
										</p>
									)}
									{stat.subtext && (
										<p className="text-primary-foreground/50 mt-1 w-[60%]">
											{stat.subtext}
										</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Reviews */}
			{cappedReviews.length > 0 && <ReviewsSection reviews={cappedReviews} />}

			{/* Bottom CTA */}
			{(page.bottomCTAHeadline || page.bottomCTALabel) && (
				<OurHomesCta
					ctaQuestion={page.bottomCTAHeadline ?? null}
					ctaButtonLabel={page.bottomCTALabel ?? null}
					ctaBackground={page.bottomCTABackground ?? null}
					ctaHref={page.bottomCTAHref ?? '/experiences'}
					noOverlap
				/>
			)}
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getAltWayPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title: metaTitle || 'The Alt Way | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
