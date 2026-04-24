import { getJoinUsPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

export default async function JoinUsPage() {
	const page = await getJoinUsPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.heroHeadline && (
					<h1 className="text-4xl font-bold">{page.heroHeadline}</h1>
				)}
				{page.introBody && (
					<div className="mt-6 prose max-w-none">
						<PortableText value={page.introBody} />
					</div>
				)}
			</section>
			{page.benefits && page.benefits.length > 0 && (
				<section className="container py-12 grid gap-6 md:grid-cols-2">
					{page.benefits.map((benefit) => (
						<div key={benefit._key} className="rounded-lg border p-6">
							{benefit.title && (
								<h3 className="font-semibold text-lg">{benefit.title}</h3>
							)}
							{benefit.body && (
								<p className="mt-2 text-muted-foreground">{benefit.body}</p>
							)}
						</div>
					))}
				</section>
			)}
			{page.formHeadline && (
				<section className="container py-12">
					<h2 className="text-2xl font-bold">{page.formHeadline}</h2>
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
