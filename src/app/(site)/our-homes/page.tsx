import { getOurHomesPage, getSite, getAllProperties } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import OurHomesHero from '@/ui/pages/our-homes/our-homes-hero'
import PropertyShowcase from '@/ui/pages/our-homes/property-showcase'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'

export default async function OurHomesPage() {
	const [page, properties] = await Promise.all([getOurHomesPage(), getAllProperties()])
	if (!page) notFound()

	return (
		<main>
			<OurHomesHero heroHeadline={page.heroHeadline ?? null} heroBackground={page.heroImage ?? null} />

			{(properties ?? []).map((property, index) => (
				<div key={property._id} className={index > 0 ? 'mt-10' : undefined}>
					<PropertyShowcase
						title={property.title ?? ''}
						slug={property.slug ?? ''}
						tagline={property.tagline ?? null}
						heroImage={property.heroImage ?? null}
						showcaseSecondaryImage={property.showcaseSecondaryImage ?? null}
						showcaseDecorImage={property.showcaseDecorImage ?? null}
						showcaseDecorTop={property.showcaseDecorTop ?? null}
						showcaseDecorRight={property.showcaseDecorRight ?? null}
						showcaseDecorWidth={property.showcaseDecorWidth ?? null}
						showcaseDecorHeight={property.showcaseDecorHeight ?? null}
						showcaseDecorRotation={property.showcaseDecorRotation ?? null}
						shortDescription={property.shortDescription ?? null}
						pullQuote={property.pullQuote ?? null}
						locationHeadline={property.locationHeadline ?? null}
						cardAmenities={property.cardAmenities ?? null}
						priceFrom={property.priceFrom ?? null}
					/>
				</div>
			))}

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
