import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
	getAllExperiences,
	getAllProperties,
	getExperiencesPage,
	getSite,
} from '@/sanity/lib/data'
import ExperienceGrid from '@/ui/pages/experiences/experiences-updated/experience-grid'
import ExperiencesHero from '@/ui/pages/experiences/experiences-updated/experiences-hero'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'

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
				heroFlower={page.heroFlower}
				heroBackground={page.heroBackground}
			/>
			<ExperienceGrid
				experiences={experiences}
				properties={properties}
				cardsMaxShown={page.cardsMaxShown}
				supportingTagline={page.supportingTagline}
				badgeText={page.heroBadgeText}
				decorBasket={page.decorBasket}
				decorStars={page.decorStars}
				decorDaisy={page.decorDaisy}
			/>
			{(page.ctaQuestion || page.ctaButtonLabel) && (
				<OurHomesCta
					ctaQuestion={page.ctaQuestion ?? null}
					ctaButtonLabel={page.ctaButtonLabel ?? null}
					ctaBackground={page.ctaBackground ?? null}
					ctaHref={page.ctaHref ?? '/our-homes'}
					noOverlap
				/>
			)}
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
