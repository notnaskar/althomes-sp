import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import { notFound } from 'next/navigation'
import { getLegalPage, getSite } from '@/sanity/lib/data'

export default async function LegalPage({
	params,
}: {
	params: Promise<{ slug: string }>
}) {
	const { slug } = await params
	const page = await getLegalPage(slug)
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="px-[90px] max-[820px]:px-[18px] py-20">
				<h1 className="mb-8 font-heading italic text-[36px] tracking-[0.2em]">
					{page.displayTitle || page.seoTitle}
				</h1>
				<div className="prose max-w-none">
					{page.body && <PortableText value={page.body as any} />}
				</div>
			</section>
		</main>
	)
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>
}): Promise<Metadata> {
	const { slug } = await params
	const [page, site] = await Promise.all([getLegalPage(slug), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title:
			metaTitle ||
			`${page?.displayTitle || page?.seoTitle || 'Legal'} | AltHomes`,
		description: metaDescription || site?.seo?.metaDescription,
	}
}
