import { getContactPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'

export default async function ContactPage() {
	const page = await getContactPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.heroHeadline && (
					<h1 className="text-4xl font-bold">{page.heroHeadline}</h1>
				)}
			</section>
			{page.contactDetails && page.contactDetails.length > 0 && (
				<section className="container py-8 grid gap-4 md:grid-cols-2">
					{page.contactDetails.map((detail) => (
						<div key={detail._key}>
							{detail.label && (
								<span className="font-medium">{detail.label}: </span>
							)}
							{detail.link ? (
								<a href={detail.link} className="underline">
									{detail.value}
								</a>
							) : (
								<span>{detail.value}</span>
							)}
						</div>
					))}
				</section>
			)}
			{page.officeAddress && (
				<section className="container py-8">
					<div className="prose max-w-none">
						<PortableText value={page.officeAddress} />
					</div>
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
	const [page, site] = await Promise.all([getContactPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title: metaTitle || 'Contact | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
