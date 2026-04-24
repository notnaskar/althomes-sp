import { getExperiencesPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

export default async function ExperiencesPage() {
	const page = await getExperiencesPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.heroHeadline && (
					<h1 className="text-4xl font-bold">{page.heroHeadline}</h1>
				)}
				{page.discountBadgeText && (
					<span className="mt-4 inline-block rounded-full bg-black px-4 py-1 text-sm font-semibold text-white">
						{page.discountBadgeText}
					</span>
				)}
				{page.introBody && (
					<div className="mt-6 prose max-w-none">
						<PortableText value={page.introBody} />
					</div>
				)}
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
