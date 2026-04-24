import { getOurHomesPage, getSite, getAllProperties } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import PropertySearch from '@/ui/pages/our-homes/property-search'

export default async function OurHomesPage() {
	const [page, properties] = await Promise.all([getOurHomesPage(), getAllProperties()])
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container pt-20 pb-6">
				<h1 className="text-4xl font-bold text-center">{page.heroHeadline || 'Our Homes'}</h1>
			</section>
			<PropertySearch properties={properties ?? []} />
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getOurHomesPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}

	return {
		title: metaTitle || 'Our Homes | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
