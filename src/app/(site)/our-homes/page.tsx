import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllProperties, getOurHomesPage, getSite } from '@/sanity/lib/data'
import OurHomesClient from '@/ui/pages/our-homes/our-homes-client'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'
import OurHomesHero from '@/ui/pages/our-homes/our-homes-hero'

export default async function OurHomesPage() {
	const [page, properties] = await Promise.all([
		getOurHomesPage(),
		getAllProperties(),
	])
	if (!page) notFound()

	return (
		<main>
			<OurHomesHero
				heroHeadline={page.heroHeadline ?? null}
				heroBackground={page.heroImage ?? null}
			/>

			<OurHomesClient properties={properties ?? []} />

			<OurHomesCta
				ctaQuestion={page.ctaQuestion ?? null}
				ctaButtonLabel={page.experiencesCtaLabel ?? null}
				ctaBackground={page.ctaBackground ?? null}
			/>
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
