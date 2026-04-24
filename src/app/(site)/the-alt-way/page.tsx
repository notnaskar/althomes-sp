import { getAltWayPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function AltWayPage() {
	const page = await getAltWayPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.heroHeadline && (
					<h1 className="text-4xl font-bold">{page.heroHeadline}</h1>
				)}
				{page.heroHeadlineLine2 && (
					<h2 className="text-3xl font-bold mt-2">{page.heroHeadlineLine2}</h2>
				)}
				{page.missionText && (
					<p className="mt-6 text-xl">{page.missionText}</p>
				)}
			</section>
			{page.valueProps && page.valueProps.length > 0 && (
				<section className="container py-12">
					{page.valuePropHeadline && (
						<h2 className="text-2xl font-semibold mb-8">{page.valuePropHeadline}</h2>
					)}
					<div className="grid gap-6 md:grid-cols-2">
						{page.valueProps.map((vp) => (
							<div key={vp._key} className="rounded-lg border p-6">
								{vp.title && <h3 className="font-semibold text-lg">{vp.title}</h3>}
								{vp.body && <p className="mt-2 text-muted-foreground">{vp.body}</p>}
							</div>
						))}
					</div>
				</section>
			)}
			{page.stats && page.stats.length > 0 && (
				<section className="container py-12">
					{page.statsHeadline && (
						<h2 className="text-2xl font-semibold mb-8">{page.statsHeadline}</h2>
					)}
					<div className="grid gap-6 md:grid-cols-4">
						{page.stats.map((stat) => (
							<div key={stat._key} className="text-center">
								{stat.value && <p className="text-4xl font-bold">{stat.value}</p>}
								{stat.label && <p className="text-sm font-medium mt-1">{stat.label}</p>}
								{stat.subtext && <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>}
							</div>
						))}
					</div>
				</section>
			)}
			{page.bottomCTAHeadline && (
				<section className="container py-20 text-center">
					<h2 className="text-3xl font-bold">{page.bottomCTAHeadline}</h2>
					{page.bottomCTALabel && (
						<button className="mt-6 px-8 py-3 bg-black text-white rounded-full font-bold">
							{page.bottomCTALabel}
						</button>
					)}
				</section>
			)}
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
