import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getContactPage, getSite } from '@/sanity/lib/data'
import ContactForm from '@/ui/forms/contact-form'
import Img from '@/ui/img'
import SocialLinks from '@/ui/molecules/social-links'

export default async function ContactPage() {
	const [page, site] = await Promise.all([getContactPage(), getSite()])
	if (!page) notFound()

	return (
		<main className="bg-background relative flex-1 overflow-hidden">
			{/* Hero */}
			{page.heroImage && (
				<section className="bg-primary relative h-[40vh] w-full overflow-hidden min-[821px]:h-[45vh]">
					<Img
						image={page.heroImage}
						width={1440}
						loading="eager"
						sizes="100vw"
						alt={page.heroImage.alt ?? ''}
						className="h-full w-full object-cover"
					/>
				</section>
			)}

			{/* Hero fallback (no image) */}
			{!page.heroImage && page.formHeadline && (
				<section className="px-[90px] py-20 text-center max-[820px]:px-[18px]">
					<h1 className="font-stories text-4xl max-[820px]:text-[32px]">
						{page.formHeadline}
					</h1>
				</section>
			)}

			{/* Two-column body */}
			<div className="relative mx-auto w-full max-w-[1250px]">
				{/* Decor Assets */}
				{page.mobileHeroAsset && (
					<Img
						image={page.mobileHeroAsset}
						width={300}
						alt={page.mobileHeroAsset.alt || 'Tulip decoration'}
						className="pointer-events-none absolute -top-[140px] -left-[20px] z-20 w-[220px] object-contain min-[821px]:hidden"
					/>
				)}

				{page.backgroundCloudAsset && (
					<Img
						image={page.backgroundCloudAsset}
						width={800}
						alt={page.backgroundCloudAsset.alt || 'Cloud decoration'}
						className="pointer-events-none absolute bottom-0 -left-[40%] z-0 hidden w-[100%] max-w-[940px] object-contain min-[821px]:block"
					/>
				)}

				{page.sideFlowerAsset && (
					<Img
						image={page.sideFlowerAsset}
						width={600}
						alt={page.sideFlowerAsset.alt || 'Flower decoration'}
						className="pointer-events-none absolute -right-[15%] bottom-0 z-30 hidden w-[50%] max-w-[350px] object-contain min-[821px]:block"
					/>
				)}

				<section className="relative z-10 grid w-full grid-cols-1 min-[821px]:grid-cols-2 min-[821px]:items-start">
					{/* Left: contact details */}
					<div className="relative z-10 flex flex-col gap-10 px-[18px] py-12 min-[821px]:gap-12 min-[821px]:py-20 min-[821px]:pr-[40px] min-[821px]:pl-[90px]">
						{/* Contact Us Block */}
						<div>
							{page.sectionTitle && (
								<h2 className="font-stories text-foreground mb-4 text-[40px] leading-none tracking-wide min-[821px]:mb-6 min-[821px]:text-[56px]">
									{page.sectionTitle}
								</h2>
							)}
							<div className="space-y-2 pl-2">
								{page.phone && (
									<div className="flex items-center gap-3">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-foreground shrink-0"
											aria-hidden="true"
										>
											<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 9.63 19.79 19.79 0 0 1 1 1.16 2 2 0 0 1 2.96 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 7.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15h0l.92 1.92z"></path>
										</svg>
										<a
											href={`tel:${page.phone}`}
											className="text-foreground/80 hover:text-accent text-[13px] font-semibold tracking-wide"
										>
											{page.phone}
										</a>
									</div>
								)}
								{page.email && (
									<div className="flex items-center gap-3">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-foreground shrink-0"
										>
											<rect
												x="2"
												y="4"
												width="20"
												height="16"
												rx="2"
												ry="2"
											></rect>
											<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
										</svg>
										<a
											href={`mailto:${page.email}`}
											className="text-foreground/80 hover:text-accent text-[13px] font-semibold tracking-wide"
										>
											{page.email}
										</a>
									</div>
								)}
							</div>
						</div>

						{/* Our Office Block */}
						{(page.officeCity || page.officeAddress) && (
							<div>
								<h2 className="font-stories text-foreground mb-4 text-[40px] leading-none tracking-wide min-[821px]:mb-6 min-[821px]:text-[56px]">
									{page.officeSectionTitle ?? 'Our Office'}
								</h2>
								<div className="space-y-2 pl-2">
									<div className="flex items-start gap-3">
										<svg
											width="12"
											height="12"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-foreground mt-1 shrink-0"
										>
											<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
											<circle cx="12" cy="10" r="3"></circle>
										</svg>
										<div>
											{page.officeCity && (
												<p className="text-foreground/90 text-[13px] font-bold tracking-wide">
													{page.officeCity}
												</p>
											)}
										</div>
									</div>
									{page.officeAddress && (
										<p className="text-foreground/70 ml-[24px] max-w-[280px] text-[13px] leading-relaxed tracking-wide">
											{page.officeAddress}
										</p>
									)}
								</div>
							</div>
						)}

						{/* Follow Us Block */}
						{(site?.facebookUrl ||
							site?.instagramUrl ||
							site?.linkedinUrl ||
							site?.youtubeUrl) && (
							<div>
								<h2 className="font-stories text-foreground mb-4 text-[40px] leading-none tracking-wide min-[821px]:mb-6 min-[821px]:text-[56px]">
									{page.followUsSectionTitle ?? 'Follow Us'}
								</h2>
								<div className="pl-2">
									<SocialLinks
										size={16}
										instagram={site?.instagramUrl}
										facebook={site?.facebookUrl}
										linkedin={site?.linkedinUrl}
										youtube={site?.youtubeUrl}
									/>
								</div>
							</div>
						)}
					</div>

					{/* Right: contact form */}
					<div className="relative flex h-full w-full justify-end min-[821px]:-mt-[120px]">
						<div className="relative z-20 mb-[10%] h-fit w-full max-w-[550px] bg-[var(--color-white)] px-6 py-12 shadow-none min-[821px]:mr-[80px] min-[821px]:bg-[var(--color-white)]/95 min-[821px]:py-[80px] min-[821px]:pr-[120px] min-[821px]:pl-[80px] min-[821px]:shadow-sm">
							<h2 className="font-stories text-foreground mb-8 text-[40px] leading-none tracking-wide min-[821px]:text-[56px]">
								{page.formCardHeading || 'Write To Us'}
							</h2>
							<ContactForm />
						</div>
					</div>
				</section>
			</div>
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
