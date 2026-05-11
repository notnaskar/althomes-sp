import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
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
			<section className="px-6 pb-20">
				<div className="mx-auto mt-40 mb-10 max-w-[1024px] text-left md:mt-40">
					<h1 className="font-stories text-secondary-foreground text-[64px] leading-tight lg:text-[88px]">
						<span className="bg-accent block w-fit px-4 pt-2">
							{page.displayTitle || page.seoTitle}
						</span>
						{page.displayTitleLine2 && (
							<span className="bg-accent mt-2 block w-fit px-4 py-2">
								{page.displayTitleLine2}
							</span>
						)}
					</h1>
				</div>
				<div className="prose mx-auto max-w-[1024px] text-left">
					{page.body && <PortableText value={page.body as any} />}
				</div>
			</section>

			{page.ctaBackground?.asset && (
				<section className="relative -mt-60 flex min-h-[400px] flex-col overflow-hidden lg:min-h-[720px]">
					<Image
						src={urlFor(page.ctaBackground.asset).width(1440).quality(85).url()}
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
