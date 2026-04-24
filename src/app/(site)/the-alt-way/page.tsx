import { getAltWayPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

export default async function AltWayPage() {
	const page = await getAltWayPage()
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
			{page.sections?.map((section) => (
				<section key={section._key} className="container py-12">
					{section.title && (
						<h2 className="text-2xl font-semibold">{section.title}</h2>
					)}
					{section.body && (
						<div className="mt-4 prose max-w-none">
							<PortableText value={section.body} />
						</div>
					)}
					{section.image?.asset && (
						<div className="mt-6 relative w-full aspect-[16/9]">
							<Image
								src={urlFor(section.image).width(1200).url()}
								alt={section.image.alt ?? ''}
								fill
								className="object-cover rounded-lg"
							/>
						</div>
					)}
				</section>
			))}
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
