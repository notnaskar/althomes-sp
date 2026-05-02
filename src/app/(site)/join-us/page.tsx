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
			<section className="relative w-full h-auto lg:h-[600px] overflow-hidden bg-background pt-[100px] pb-[160px] lg:pt-[80px] lg:pb-0">
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
					<div className="pointer-events-none absolute -left-[204px] top-0 h-[614px] w-[365px] z-10 max-lg:hidden">
						<Image src={flowerUrl} alt="" fill className="object-cover" sizes="365px" />
					</div>
				)}

				<div className="relative z-10 mx-auto flex max-w-[1200px] flex-col lg:flex-row justify-center items-start gap-[24px] lg:gap-[90px] px-[24px] lg:px-[90px]">
					<div className="w-full lg:w-[292px] shrink-0">
						<h1 className="font-stories text-[48px] lg:text-[72px] leading-[1] lg:leading-[70px] tracking-[0.1em] text-foreground">
							{page.heroHeadline || 'Partner With Us'}
						</h1>
					</div>
					{page.pullQuote && (
						<p className="w-full max-w-[672px] font-heading text-[20px] lg:text-[30px] leading-[1.3] lg:leading-[40px] tracking-[0.07em] text-foreground">
							{page.pullQuote}
						</p>
					)}
				</div>
			</section>

			{/* Content ── Frame 60 ──────────────────────────────── */}
			<section className="relative overflow-visible bg-background px-[18px] lg:px-[90px] pb-[72px] z-[10]">
				<div className="mx-auto flex max-w-[1100px] flex-col-reverse lg:flex-row items-center lg:items-start gap-[40px] lg:gap-[80px] justify-between">
					<div className="w-full lg:w-[400px] shrink-0 space-y-5 lg:pt-[60px]">
						{page.bodyParagraph && (
							<p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
								{page.bodyParagraph}
							</p>
						)}
						{page.bulletPoints?.map((point, i) => (
							<p
								key={i}
								className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground"
							>
								– {point}
							</p>
						))}
						{page.formCTAText && (
							<p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
								{page.formCTAText}
							</p>
						)}
					</div>

					{propertyUrl && (
						<div className="relative z-20 -mt-[80px] lg:-mt-[120px] h-[300px] lg:h-[480px] w-full lg:flex-1 lg:max-w-[624px]">
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
								<div className="pointer-events-none absolute right-0 top-[50%] lg:top-[60%] z-10 w-[35%] lg:w-[228px] aspect-[228/554] translate-x-[20%] lg:translate-x-[40%]">
									<Image src={contentDecorUrl} alt="" fill className="object-cover" sizes="(max-width: 1024px) 35vw, 228px" />
								</div>
							)}
						</div>
					)}
				</div>
			</section>

			{/* Form ── Frame 61 ─────────────────────────────────── */}
			<section className="relative bg-background pb-[40px] lg:pb-[72px] px-[18px] lg:px-[90px]">
				{formDecorUrl && (
					<div className="pointer-events-none absolute left-0 bottom-0 z-0 h-[300px] lg:h-[462px] w-[100%] lg:w-[847px] -left-[100px] lg:left-0">
						<Image src={formDecorUrl} alt="" fill className="object-cover" sizes="(max-width: 1024px) 550px, 847px" />
					</div>
				)}
				<div className="relative z-10 mx-auto max-w-[800px] bg-[var(--color-white)] px-[24px] lg:px-[51px] pb-[48px] pt-[37px] shadow-sm lg:shadow-none">
					<h2 className="mb-[40px] lg:mb-[75px] text-center font-heading text-[24px] lg:text-[30px] leading-[1.3] lg:leading-[40px] tracking-[0.1em] text-foreground">
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
