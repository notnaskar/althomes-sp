import { getExperiencesPage, getSite, getAllProperties, getAllExperiences } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ExperiencesHero from '@/ui/pages/experiences/experiences-updated/experiences-hero'
import ExperienceGrid from '@/ui/pages/experiences/experiences-updated/experience-grid'

export default async function ExperiencesPage() {
	const [page, properties, experiences] = await Promise.all([
		getExperiencesPage(),
		getAllProperties(),
		getAllExperiences(),
	])
	if (!page) notFound()

	return (
		<main className="flex-1">
			<ExperiencesHero
				headline={page.heroHeadline}
				leadingTagline={page.leadingTagline}
				supportingTagline={page.supportingTagline}
				heroFlower={page.heroFlower}
				heroBackground={page.heroBackground}
			/>
			<ExperienceGrid
				experiences={experiences}
				properties={properties}
				cardsMaxShown={page.cardsMaxShown}
				decorBasket={page.decorBasket}
				decorStars={page.decorStars}
				decorDaisy={page.decorDaisy}
			/>
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
