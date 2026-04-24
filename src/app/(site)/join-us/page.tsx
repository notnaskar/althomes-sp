import { getJoinUsPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function JoinUsPage() {
	const page = await getJoinUsPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20 text-center">
				<h1 className="text-4xl font-bold">Join Us</h1>
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
