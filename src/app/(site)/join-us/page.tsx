import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getJoinUsPage, getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import PartnerForm from '@/ui/forms/partner-form'

export default async function JoinUsPage() {
	const page = await getJoinUsPage()
	if (!page) notFound()

	const coverUrl = page.heroImage?.asset
		? urlFor(page.heroImage.asset).width(1440).quality(85).url()
		: null

	const propertyUrl = page.propertyImage?.asset
		? urlFor(page.propertyImage.asset).width(624).height(480).url()
		: null

	const flowerUrl = page.heroDecorFlower?.asset
		? urlFor(page.heroDecorFlower.asset).width(365).url()
		: null

	const contentDecorUrl = page.contentDecorImage?.asset
		? urlFor(page.contentDecorImage.asset).width(228).url()
		: null

	const formDecorUrl = page.formDecorBg?.asset
		? urlFor(page.formDecorBg.asset).width(847).url()
		: null

	return (
		<main className="bg-background overflow-x-hidden">
			{/* Hero ── Frame 59 ─────────────────────────────────── */}
			<section className="bg-background relative h-auto w-full overflow-hidden pt-[100px] pb-[160px] lg:h-[600px] lg:pt-[80px] lg:pb-0">
				{coverUrl && (
					<Image
						src={coverUrl}
						alt={page.heroImage?.alt ?? ''}
						fill
						priority
						className="object-cover object-bottom"
						sizes="100vw"
					/>
				)}

				{flowerUrl && (
					<div className="pointer-events-none absolute top-0 -left-[204px] z-10 h-[614px] w-[365px] max-lg:hidden">
						<Image
							src={flowerUrl}
							alt=""
							fill
							className="object-cover"
							sizes="365px"
						/>
					</div>
				)}

				<div className="relative z-10 mx-auto flex max-w-[1200px] flex-col items-start justify-center gap-[24px] px-[24px] lg:flex-row lg:gap-[90px] lg:px-[90px]">
					<div className="w-full shrink-0 lg:w-[292px]">
						<h1 className="font-stories text-foreground text-[48px] leading-[1] tracking-[0.1em] lg:text-[72px] lg:leading-[70px]">
							{page.heroHeadline || 'Partner With Us'}
						</h1>
					</div>
					{page.pullQuote && (
						<p className="font-heading text-foreground w-full max-w-[672px] text-[20px] leading-[1.3] tracking-[0.07em] lg:text-[30px] lg:leading-[40px]">
							{page.pullQuote}
						</p>
					)}
				</div>
			</section>

			{/* Content ── Frame 60 ──────────────────────────────── */}
			<section className="bg-background relative z-[11] overflow-visible px-[18px] pb-[72px] lg:px-[90px]">
				<div className="mx-auto flex max-w-[1100px] flex-col-reverse items-center justify-between gap-[40px] lg:flex-row lg:items-start lg:gap-[80px]">
					<div className="w-full shrink-0 space-y-5 lg:w-[400px] lg:pt-[60px]">
						{page.bodyParagraph && (
							<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
								{page.bodyParagraph}
							</p>
						)}
						{page.bulletPoints?.map((point, i) => (
							<p
								key={i}
								className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]"
							>
								– {point}
							</p>
						))}
						{page.formCTAText && (
							<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
								{page.formCTAText}
							</p>
						)}
					</div>

					{propertyUrl && (
						<div className="relative z-20 -mt-[80px] h-[300px] w-full lg:-mt-[120px] lg:h-[480px] lg:max-w-[624px] lg:flex-1">
							<div className="absolute inset-0 overflow-hidden rounded-[5px]">
								<Image
									src={propertyUrl}
									alt={page.propertyImage?.alt ?? ''}
									fill
									className="object-cover"
									sizes="(max-width: 1024px) 100vw, 624px"
								/>
							</div>
							{contentDecorUrl && (
								<div className="pointer-events-none absolute top-[50%] right-0 z-10 aspect-[228/554] w-[35%] translate-x-[20%] lg:top-[60%] lg:w-[228px] lg:translate-x-[40%]">
									<Image
										src={contentDecorUrl}
										alt=""
										fill
										className="object-cover"
										sizes="(max-width: 1024px) 35vw, 228px"
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			{/* Form ── Frame 61 ─────────────────────────────────── */}
			<section className="bg-background relative px-[18px] pb-[40px] lg:px-[90px] lg:pb-[72px]">
				{formDecorUrl && (
					<div className="pointer-events-none absolute bottom-0 -left-[100px] left-0 z-0 h-[300px] w-[100%] lg:left-0 lg:h-[462px] lg:w-[847px]">
						<Image
							src={formDecorUrl}
							alt=""
							fill
							className="object-cover"
							sizes="(max-width: 1024px) 550px, 847px"
						/>
					</div>
				)}
				<div className="relative z-10 mx-auto max-w-[100%] bg-[var(--color-white)] px-[24px] pt-[37px] pb-[48px] shadow-sm lg:px-[51px] lg:shadow-none">
					<h2 className="font-heading text-foreground mb-[40px] text-center text-[24px] leading-[1.3] tracking-[0.1em] lg:mb-[75px] lg:text-[30px] lg:leading-[40px]">
						{page.formHeadline || 'TELL US MORE ABOUT YOUR HOME'}
					</h2>
					<PartnerForm />
				</div>
			</section>
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getJoinUsPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}
	return {
		title: metaTitle || 'Join Us | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
