import { getHomePage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import { ROUTES } from '@/lib/env'
import pkg from '@@/package.json'
import NavLabels from '@/ui/NavLabels'

export default async function HomePage() {
	const page = await getHomePage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			{page.heroImage ? (
				<NavLabels
					heroImage={page.heroImage}
					navLabels={page.navLabels ?? []}
				/>
			) : (
				<section className="container py-20 text-center">
					<h1 className="text-4xl font-bold">{page.heroHeadline || 'AltHomes'}</h1>
				</section>
			)}
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getHomePage(), getSite()])
	const { metaTitle, metaDescription, ogImage } = page?.seo ?? site?.seo ?? {}
	const title = metaTitle || site?.title || 'AltHomes'
	const description = metaDescription || site?.seo?.metaDescription

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			url: process.env.NEXT_PUBLIC_BASE_URL,
			images: [
				ogImage
					? urlFor(ogImage).width(1200).url()
					: site?.logoImage
						? urlFor(site.logoImage).width(1200).url()
						: `${process.env.NEXT_PUBLIC_BASE_URL}/api/og`,
			],
		},
		generator: `SanityPress v${pkg.version}`,
	}
}
