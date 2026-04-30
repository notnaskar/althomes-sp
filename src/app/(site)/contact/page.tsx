import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContactPage, getSite } from '@/sanity/lib/data'
import ContactForm from '@/ui/forms/contact-form'
import Img from '@/ui/img'

export default async function ContactPage() {
	const [page, site] = await Promise.all([getContactPage(), getSite()])
	if (!page) notFound()

	return (
		<main className="flex-1">
			{/* Hero */}
			{page.heroImage && (
				<section className="relative w-full overflow-hidden bg-primary">
					<Img
						image={page.heroImage}
						width={1440}
						loading="eager"
						alt={page.heroImage.alt ?? ''}
						className="h-[60vh] w-full object-cover opacity-70"
					/>
					{page.formHeadline && (
						<div className="absolute inset-0 flex items-center justify-center">
							<h1 className="px-6 text-center text-[48px] font-heading italic text-primary-foreground">
								{page.formHeadline}
							</h1>
						</div>
					)}
				</section>
			)}

			{/* Hero fallback (no image) */}
			{!page.heroImage && page.formHeadline && (
				<section className="px-[90px] max-[820px]:px-[18px] py-20 text-center">
					<h1 className="text-4xl font-bold md:text-5xl">
						{page.formHeadline}
					</h1>
				</section>
			)}

			{/* Two-column body */}
			<section className="px-[90px] max-[820px]:px-[18px] grid gap-12 py-16 md:grid-cols-2">
				{/* Left: contact details */}
				<div className="space-y-6">
					{page.sectionTitle && (
						<h2 className="font-heading italic text-[30px] tracking-[0.3em]">{page.sectionTitle}</h2>
					)}
					{page.phone && (
						<div>
							<span className="mb-1 block text-sm font-semibold tracking-[0.1em] text-muted uppercase">
								Phone
							</span>
							<a
								href={`tel:${page.phone}`}
								className="text-lg font-medium underline transition hover:text-accent"
							>
								{page.phone}
							</a>
						</div>
					)}
					{page.email && (
						<div>
							<span className="mb-1 block text-sm font-semibold tracking-[0.1em] text-muted uppercase">
								Email
							</span>
							<a
								href={`mailto:${page.email}`}
								className="text-lg font-medium underline transition hover:text-accent"
							>
								{page.email}
							</a>
						</div>
					)}
					{(page.officeCity || page.officeAddress) && (
						<div>
							<span className="mb-1 block text-sm font-semibold tracking-[0.1em] text-muted uppercase">
								Office
							</span>
							{page.officeCity && (
								<p className="text-lg font-medium">{page.officeCity}</p>
							)}
							{page.officeAddress && (
								<p className="text-foreground">{page.officeAddress}</p>
							)}
						</div>
					)}
					{(site?.facebookUrl ||
						site?.instagramUrl ||
						site?.linkedinUrl ||
						site?.youtubeUrl) && (
						<div>
							<span className="mb-2 block text-sm font-semibold tracking-wide text-muted uppercase">
								Follow us
							</span>
							<div className="flex gap-4">
								{site?.facebookUrl && (
									<a
										href={site.facebookUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline transition hover:text-accent"
									>
										Facebook
									</a>
								)}
								{site?.instagramUrl && (
									<a
										href={site.instagramUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline transition hover:text-accent"
									>
										Instagram
									</a>
								)}
								{site?.linkedinUrl && (
									<a
										href={site.linkedinUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline transition hover:text-accent"
									>
										LinkedIn
									</a>
								)}
								{site?.youtubeUrl && (
									<a
										href={site.youtubeUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="text-lg font-medium underline transition hover:text-accent"
									>
										YouTube
									</a>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Right: contact form */}
				<div>
					<ContactForm />
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
