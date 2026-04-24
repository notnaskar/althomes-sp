import { getContactPage, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Img from '@/ui/img'

export default async function ContactPage() {
	const [page, site] = await Promise.all([getContactPage(), getSite()])
	if (!page) notFound()

	return (
		<main className="flex-1">
			{/* Hero */}
			{page.heroImage && (
				<section className="relative w-full overflow-hidden bg-gray-900">
					<Img
						image={page.heroImage}
						width={1440}
						alt=""
						className="w-full h-[60vh] object-cover opacity-70"
					/>
					{page.formHeadline && (
						<div className="absolute inset-0 flex items-center justify-center">
							<h1 className="text-4xl md:text-5xl font-bold text-white text-center px-6">
								{page.formHeadline}
							</h1>
						</div>
					)}
				</section>
			)}

			{/* Two-column body */}
			<section className="container py-16 grid gap-12 md:grid-cols-2">
				{/* Left: contact details */}
				<div className="space-y-6">
					{page.sectionTitle && (
						<h2 className="text-3xl font-bold">{page.sectionTitle}</h2>
					)}
					{page.phone && (
						<div>
							<span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Phone</span>
							<a
								href={`tel:${page.phone}`}
								className="text-lg font-medium underline hover:text-yellow-600 transition"
							>
								{page.phone}
							</a>
						</div>
					)}
					{page.email && (
						<div>
							<span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Email</span>
							<a
								href={`mailto:${page.email}`}
								className="text-lg font-medium underline hover:text-yellow-600 transition"
							>
								{page.email}
							</a>
						</div>
					)}
					{(page.officeCity || page.officeAddress) && (
						<div>
							<span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">Office</span>
							{page.officeCity && (
								<p className="text-lg font-medium">{page.officeCity}</p>
							)}
							{page.officeAddress && (
								<p className="text-gray-600">{page.officeAddress}</p>
							)}
						</div>
					)}
					{(site?.facebookUrl || site?.instagramUrl) && (
						<div>
							<span className="block text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Follow us</span>
							<div className="flex gap-4">
								{site?.facebookUrl && (
									<a
										href={site.facebookUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline hover:text-yellow-600 transition"
									>
										Facebook
									</a>
								)}
								{site?.instagramUrl && (
									<a
										href={site.instagramUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline hover:text-yellow-600 transition"
									>
										Instagram
									</a>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Right: form placeholder */}
				<div className="flex items-start">
					<div className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg text-center text-gray-400">
						Form coming in Phase 4
					</div>
				</div>
			</section>
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
