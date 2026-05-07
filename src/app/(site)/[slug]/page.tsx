import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { notFound } from 'next/navigation'
import { getLegalPage, getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'

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
			<section className="px-6 pt-20 pb-12 lg:px-60">
				<h1 className="font-stories text-secondary-foreground text-[48px] leading-tight lg:text-[88px]">
					<span className="block w-fit bg-accent px-4 pt-2">
						{page.displayTitle || page.seoTitle}
					</span>
					{page.displayTitleLine2 && (
						<span className="mt-2 block w-fit bg-accent px-4 py-2">
							{page.displayTitleLine2}
						</span>
					)}
				</h1>
			</section>

			<section className="px-6 pb-20">
				<div className="prose mx-auto max-w-[720px] text-left">
					{page.body && <PortableText value={page.body as any} />}
				</div>
			</section>

			{page.ctaBackground?.asset && (
				<section className="relative flex min-h-[400px] flex-col overflow-hidden lg:min-h-[720px]">
					<Image
						src={urlFor(page.ctaBackground.asset)
							.width(1440)
							.quality(85)
							.url()}
						alt={page.ctaBackground.alt ?? ''}
						fill
						sizes="100vw"
						className="object-cover object-top"
						aria-hidden="true"
					/>
				</section>
			)}
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
