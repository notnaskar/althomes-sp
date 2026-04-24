import { getExperiencesPage, getSite, getAllProperties, getAllExperiences } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Img from '@/ui/img'
import { PortableText } from 'next-sanity'
import ExperienceGrid from '@/ui/pages/experiences/experience-grid'

export default async function ExperiencesPage() {
	const [page, properties, experiences] = await Promise.all([
		getExperiencesPage(),
		getAllProperties(),
		getAllExperiences(),
	])
	if (!page) notFound()

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
						className="w-full h-[60vh] object-cover opacity-60"
					/>
				)}
				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					{page.heroHeadline && (
						<h1 className="text-5xl md:text-6xl font-bold text-white">{page.heroHeadline}</h1>
					)}
					{page.heroSubtext && (
						<p className="mt-4 text-xl text-white/80 max-w-2xl">{page.heroSubtext}</p>
					)}
					{page.discountBadgeText && (
						<span className="mt-6 inline-block rounded-full bg-yellow-400 text-black px-5 py-2 text-sm font-bold">
							{page.discountBadgeText}
						</span>
					)}
				</div>
			</section>

			{/* Intro */}
			{page.introBody && (
				<section className="container py-16">
					<div className="prose prose-lg max-w-3xl mx-auto">
						<PortableText value={page.introBody} />
					</div>
				</section>
			)}

			{/* Filter bar + experience card grid (client component) */}
			<ExperienceGrid
				experiences={experiences}
				properties={properties}
				cardsMaxShown={page.cardsMaxShown}
			/>

			{/* Bottom CTA */}
			<section className="container py-20 text-center">
				<Link
					href="/our-homes"
					className="inline-block px-10 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition"
				>
					BOOK A STAY
				</Link>
			</section>
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getExperiencesPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title: metaTitle || 'Experiences | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
