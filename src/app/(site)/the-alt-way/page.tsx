import { getAltWayPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function AltWayPage() {
	const page = await getAltWayPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20 text-center">
				<h1 className="text-4xl font-bold">The Alt Way</h1>
			</section>
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
