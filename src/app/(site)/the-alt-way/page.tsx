import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAltWayPage, getSite } from '@/sanity/lib/data'
import Img from '@/ui/img'

export default async function AltWayPage() {
	const page = await getAltWayPage()
	if (!page) notFound()

	const cappedReviews = page.reviews?.slice(0, page.reviewsMaxShown ?? 20) ?? []

	return (
		<main className="flex-1">
			{/* Hero */}
			<section className="relative w-full overflow-hidden bg-gray-900">
				{page.heroBackground && (
					<Img
						image={page.heroBackground}
						width={1440}
						loading="eager"
						alt={page.heroBackground.alt ?? ''}
						className="h-[70vh] w-full object-cover opacity-60"
					/>
				)}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					{page.heroHeadline && (
						<h1 className="text-5xl leading-tight font-bold text-white md:text-7xl">
							{page.heroHeadline}
						</h1>
					)}
					{page.heroHeadlineLine2 && (
						<p className="mt-2 text-5xl leading-tight font-bold text-white md:text-7xl">
							{page.heroHeadlineLine2}
						</p>
					)}
				</div>
			</section>

			{/* Mission split */}
			{(page.missionImage || page.missionText) && (
				<section className="container grid items-center gap-12 py-20 md:grid-cols-2">
					{page.missionImage && (
						<div className="overflow-hidden rounded-2xl">
							<Img
								image={page.missionImage}
								width={700}
								alt={page.missionImage.alt ?? ''}
								className="h-auto w-full object-cover"
							/>
						</div>
					)}
					{page.missionText && (
						<p className="text-xl leading-relaxed text-gray-700 md:text-2xl">
							{page.missionText}
						</p>
					)}
				</section>
			)}

			{/* Value props 2×2 grid */}
			{page.valueProps && page.valueProps.length > 0 && (
				<section className="bg-gray-50 py-20">
					<div className="container">
						{page.valuePropHeadline && (
							<h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
								{page.valuePropHeadline}
							</h2>
						)}
						<div className="grid gap-8 md:grid-cols-2">
							{page.valueProps.map((vp) => (
								<div key={vp._key} className="rounded-2xl border bg-white p-8">
									{vp.title && (
										<h3 className="mb-3 text-xl font-bold">{vp.title}</h3>
									)}
									{vp.body && (
										<p className="leading-relaxed text-gray-600">{vp.body}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Editorial images */}
			{page.editorialImages && page.editorialImages.length > 0 && (
				<section className="container overflow-x-auto py-16">
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
				<section className="container py-20 text-center">
					{page.promiseText && (
						<p className="mx-auto max-w-2xl text-2xl leading-relaxed font-semibold md:text-3xl">
							{page.promiseText}
						</p>
					)}
					{page.promiseCTALabel && (
						<Link
							href="/our-homes"
							className="mt-8 inline-block rounded-full bg-black px-10 py-4 font-bold text-white transition hover:bg-gray-800"
						>
							{page.promiseCTALabel}
						</Link>
					)}
				</section>
			)}

			{/* Stats bar */}
			{page.stats && page.stats.length > 0 && (
				<section className="bg-black py-16 text-white">
					<div className="container">
						{page.statsHeadline && (
							<h2 className="mb-12 text-center text-2xl font-semibold text-white/80">
								{page.statsHeadline}
							</h2>
						)}
						<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
							{page.stats.map((stat) => (
								<div key={stat._key} className="text-center">
									{stat.value && (
										<p className="text-5xl font-bold text-white">
											{stat.value}
										</p>
									)}
									{stat.label && (
										<p className="mt-2 text-sm font-semibold tracking-wide text-white/80 uppercase">
											{stat.label}
										</p>
									)}
									{stat.subtext && (
										<p className="mt-1 text-xs text-white/50">{stat.subtext}</p>
									)}
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Reviews carousel */}
			{cappedReviews.length > 0 && (
				<section className="container py-20">
					<h2 className="mb-12 text-center text-3xl font-bold">
						What Our Guests Say
					</h2>
					<div className="overflow-x-auto">
						<div className="flex gap-6 pb-4">
							{cappedReviews.map((review, i) => (
								<div
									key={i}
									className="w-80 flex-shrink-0 space-y-4 rounded-2xl border p-6"
								>
									{review.rating != null && (
										<div className="flex gap-1">
											{Array.from({ length: review.rating }).map((_, j) => (
												<span key={j} className="text-lg text-yellow-400">
													★
												</span>
											))}
										</div>
									)}
									{review.body && (
										<p className="leading-relaxed text-gray-700 italic">
											&ldquo;{review.body}&rdquo;
										</p>
									)}
									<div className="text-sm text-gray-500">
										{review.guestName && (
											<p className="font-semibold">{review.guestName}</p>
										)}
										{review.guestLocation && <p>{review.guestLocation}</p>}
										{review.stayDate && <p>{review.stayDate}</p>}
									</div>
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Bottom CTA */}
			{(page.bottomCTAHeadline || page.bottomCTALabel) && (
				<section className="bg-gray-50 py-20 text-center">
					{page.bottomCTAHeadline && (
						<h2 className="mb-8 text-3xl font-bold md:text-4xl">
							{page.bottomCTAHeadline}
						</h2>
					)}
					{page.bottomCTALabel && (
						<Link
							href="/experiences"
							className="inline-block rounded-full bg-black px-10 py-4 font-bold text-white transition hover:bg-gray-800"
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
