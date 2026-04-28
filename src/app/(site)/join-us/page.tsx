import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getJoinUsPage, getSite } from '@/sanity/lib/data'
import PartnerForm from '@/ui/forms/partner-form'
import Img from '@/ui/img'

export default async function JoinUsPage() {
	const page = await getJoinUsPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			{/* Hero */}
			{page.heroImage && (
				<section className="relative w-full overflow-hidden bg-gray-900">
					<Img
						image={page.heroImage}
						width={1440}
						loading="eager"
						alt={page.heroImage.alt ?? ''}
						className="h-[60vh] w-full object-cover opacity-70"
					/>
					<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
						{page.heroHeadline && (
							<h1 className="text-4xl font-bold text-white md:text-6xl">
								{page.heroHeadline}
							</h1>
						)}
						{page.pullQuote && (
							<p className="mt-6 max-w-2xl text-xl text-white/80 italic md:text-2xl">
								{page.pullQuote}
							</p>
						)}
					</div>
				</section>
			)}

			{/* Hero fallback (no image) */}
			{!page.heroImage && (page.heroHeadline || page.pullQuote) && (
				<section className="container py-20 text-center">
					{page.heroHeadline && (
						<h1 className="text-4xl font-bold md:text-6xl">
							{page.heroHeadline}
						</h1>
					)}
					{page.pullQuote && (
						<p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500 italic">
							{page.pullQuote}
						</p>
					)}
				</section>
			)}

			{/* Body section — two-column */}
			<section className="container grid gap-12 py-16 md:grid-cols-2">
				{/* Left: body paragraph + bullet points */}
				<div className="space-y-6">
					{page.bodyParagraph && (
						<p className="text-lg leading-relaxed text-gray-700">
							{page.bodyParagraph}
						</p>
					)}
					{page.bulletPoints && page.bulletPoints.length > 0 && (
						<ul className="list-disc space-y-2 pl-6 text-gray-700">
							{page.bulletPoints.map((point, i) => (
								<li key={i}>{point}</li>
							))}
						</ul>
					)}
				</div>

				{/* Right: CTA text + property image */}
				<div className="space-y-6">
					{page.formCTAText && (
						<p className="text-xl font-semibold text-gray-800">
							{page.formCTAText}
						</p>
					)}
					{page.propertyImage && (
						<div className="overflow-hidden rounded-xl">
							<Img
								image={page.propertyImage}
								width={600}
								alt={page.propertyImage.alt ?? ''}
								className="h-auto w-full object-cover"
							/>
						</div>
					)}
				</div>
			</section>

			{/* Form section */}
			<section className="container py-16">
				{page.formHeadline && (
					<h2 className="mb-8 text-center text-3xl font-bold">
						{page.formHeadline}
					</h2>
				)}
				<PartnerForm />
			</section>
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getJoinUsPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title: metaTitle || 'Join Us | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
