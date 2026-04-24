import { getContactPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export default async function ContactPage() {
	const page = await getContactPage()
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				{page.sectionTitle && (
					<h1 className="text-4xl font-bold">{page.sectionTitle}</h1>
				)}
			</section>
			{(page.phone || page.email || page.officeCity || page.officeAddress) && (
				<section className="container py-8 grid gap-4 md:grid-cols-2">
					{page.phone && (
						<div>
							<span className="font-medium">Phone: </span>
							<a href={`tel:${page.phone}`} className="underline">{page.phone}</a>
						</div>
					)}
					{page.email && (
						<div>
							<span className="font-medium">Email: </span>
							<a href={`mailto:${page.email}`} className="underline">{page.email}</a>
						</div>
					)}
					{page.officeCity && (
						<div>
							<span className="font-medium">City: </span>
							<span>{page.officeCity}</span>
						</div>
					)}
					{page.officeAddress && (
						<div>
							<span className="font-medium">Address: </span>
							<span>{page.officeAddress}</span>
						</div>
					)}
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
