import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAltWayPage, getSite } from '@/sanity/lib/data'
import Img from '@/ui/img'
import ReviewsSection from '@/ui/molecules/reviews-section'

export default async function AltWayPage() {
	const page = await getAltWayPage()
	if (!page) notFound()

	const cappedReviews = page.reviews ?? []

	return (
		<main className="flex-1">
			{/* Hero */}
			<section className="relative w-full overflow-hidden bg-primary">
				{page.heroBackground && (
					<Img
						image={page.heroBackground}
						width={1440}
						loading="eager"
						imageOptions={{ q: 85 }}
						alt={page.heroBackground.alt ?? ''}
						className="h-[70vh] w-full object-cover opacity-60"
					/>
				)}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					{page.heroHeadline && (
						<h1 className="text-[48px] leading-tight font-heading italic text-primary-foreground">
							{page.heroHeadline}
						</h1>
					)}
					{page.heroHeadlineLine2 && (
						<p className="mt-2 text-[48px] leading-tight font-heading italic text-primary-foreground">
							{page.heroHeadlineLine2}
						</p>
					)}
				</div>
			</section>

			{/* Mission split */}
			{(page.missionImage || page.missionText) && (
				<section className="px-[90px] max-[820px]:px-[18px] grid items-center gap-12 py-20 max-[820px]:grid-cols-1 min-[821px]:grid-cols-2">
					{page.missionImage && (
						<div className="overflow-hidden rounded-[5px]">
							<Img
								image={page.missionImage}
								width={700}
								alt={page.missionImage.alt ?? ''}
								className="h-auto w-full object-cover"
							/>
						</div>
					)}
					{page.missionText && (
						<p className="text-xl leading-relaxed text-foreground md:text-2xl">
							{page.missionText}
						</p>
					)}
				</section>
			)}

			{/* Value props 2×2 grid */}
			{page.valueProps && page.valueProps.length > 0 && (
				<section className="bg-background py-20">
					<div className="px-[90px] max-[820px]:px-[18px]">
						{page.valuePropHeadline && (
							<h2 className="mb-12 text-center font-heading italic text-[30px] tracking-[0.3em]">
								{page.valuePropHeadline}
							</h2>
						)}
						<div className="grid gap-8 max-[820px]:grid-cols-1 min-[821px]:grid-cols-2">
							{page.valueProps.map((vp) => (
								<div key={vp._key} className="rounded-[5px] border bg-background p-8">
									{vp.title && (
										<h3 className="mb-3 text-xl font-bold">{vp.title}</h3>
									)}
									{vp.body && (
										<p className="leading-relaxed text-foreground">{vp.body}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Editorial images */}
			{page.editorialImages && page.editorialImages.length > 0 && (
				<section className="px-[90px] max-[820px]:px-[18px] overflow-x-auto py-16">
					<div className="flex gap-4">
						{page.editorialImages.map((img, i) => (
							<div key={i} className="flex-shrink-0 overflow-hidden rounded-xl">
								<Img
									image={img}
									width={400}
									alt={img.alt ?? ''}
									className="h-64 w-auto object-cover"
								/>
							</div>
						))}
					</div>
				</section>
			)}

			{/* Promise CTA */}
			{(page.promiseText || page.promiseCTALabel) && (
				<section className="px-[90px] max-[820px]:px-[18px] py-20 text-center">
					{page.promiseText && (
						<p className="mx-auto max-w-2xl font-heading italic text-[30px] tracking-[0.3em]">
							{page.promiseText}
						</p>
					)}
					{page.promiseCTALabel && (
						<Link
							href="/our-homes"
							className="mt-8 inline-block rounded-[5px] bg-accent px-10 py-4 font-bold text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90"
						>
							{page.promiseCTALabel}
						</Link>
					)}
				</section>
			)}

			{/* Stats bar */}
			{page.stats && page.stats.length > 0 && (
				<section className="bg-primary py-16 text-primary-foreground">
					<div className="px-[90px] max-[820px]:px-[18px]">
						{page.statsHeadline && (
							<h2 className="mb-12 text-center text-2xl font-semibold text-primary-foreground/80">
								{page.statsHeadline}
							</h2>
						)}
						<div className="grid grid-cols-2 gap-8 min-[821px]:grid-cols-4">
							{page.stats.map((stat) => (
								<div key={stat._key} className="text-center">
									{stat.value && (
										<p className="text-5xl font-bold text-primary-foreground">
											{stat.value}
										</p>
									)}
									{stat.label && (
										<p className="mt-2 text-sm font-semibold tracking-wide text-primary-foreground/80 uppercase">
											{stat.label}
										</p>
									)}
									{stat.subtext && (
										<p className="mt-1 text-xs text-primary-foreground/50">{stat.subtext}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Reviews */}
			{cappedReviews.length > 0 && (
				<ReviewsSection reviews={cappedReviews as Parameters<typeof ReviewsSection>[0]['reviews']} />
			)}

			{/* Bottom CTA */}
			{(page.bottomCTAHeadline || page.bottomCTALabel) && (
				<section className="bg-background py-20 text-center">
					{page.bottomCTAHeadline && (
						<h2 className="mb-8 font-heading italic text-[30px] tracking-[0.3em]">
							{page.bottomCTAHeadline}
						</h2>
					)}
					{page.bottomCTALabel && (
						<Link
							href="/experiences"
							className="inline-block rounded-[5px] bg-accent px-10 py-4 font-bold text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90"
						>
							{page.bottomCTALabel}
						</Link>
					)}
				</section>
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
