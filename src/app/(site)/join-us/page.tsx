import { getJoinUsPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function JoinUsPage() {
	const page = await getJoinUsPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.heroHeadline && (
					<h1 className="text-4xl font-bold">{page.heroHeadline}</h1>
				)}
				{page.pullQuote && (
					<p className="mt-6 text-xl italic text-muted-foreground">{page.pullQuote}</p>
				)}
				{page.bodyParagraph && (
					<p className="mt-6 prose max-w-none">{page.bodyParagraph}</p>
				)}
			</section>
			{page.bulletPoints && page.bulletPoints.length > 0 && (
				<section className="container py-8">
					<ul className="list-disc pl-6 space-y-2">
						{page.bulletPoints.map((point, i) => (
							<li key={i}>{point}</li>
						))}
					</ul>
				</section>
			)}
			{page.formHeadline && (
				<section className="container py-12">
					<h2 className="text-2xl font-bold">{page.formHeadline}</h2>
					{page.formCTAText && (
						<p className="mt-4 text-muted-foreground">{page.formCTAText}</p>
					)}
				</section>
			)}
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
