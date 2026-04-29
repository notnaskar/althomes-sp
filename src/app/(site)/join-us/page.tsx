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
		? urlFor(page.heroImage.asset).width(1440).url()
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
		<main className="bg-background">

			{/* Hero ── Frame 59 ─────────────────────────────────── */}
			<section className="relative h-[470px] overflow-hidden bg-background">
				{coverUrl && (
					<Image
						src={coverUrl}
						alt={page.heroImage?.alt ?? ''}
						fill
						priority
						className="object-cover"
						sizes="1440px"
					/>
				)}

				{flowerUrl && (
					<div className="pointer-events-none absolute -left-[204px] top-0 h-[614px] w-[365px] z-10">
						<Image src={flowerUrl} alt="" fill className="object-cover" sizes="365px" />
					</div>
				)}

				<div className="absolute inset-0 flex items-start gap-[90px] pl-[194px] pr-[90px] pt-[30px]">
					<div className="w-[292px] shrink-0">
						<h1 className="font-heading italic text-[72px] leading-[70px] tracking-[0.1em] text-foreground">
							{page.heroHeadline || 'Partner With Us'}
						</h1>
					</div>
					{page.pullQuote && (
						<p className="max-w-[672px] font-heading text-[30px] leading-[40px] tracking-[0.07em] text-foreground">
							{page.pullQuote}
						</p>
					)}
				</div>
			</section>

			{/* Content ── Frame 60 ──────────────────────────────── */}
			<section className="relative overflow-hidden bg-background px-[90px] py-[72px]">
				<div className="flex items-start gap-12">
					<div className="w-[384px] shrink-0 space-y-5">
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
						<div className="relative -mt-6 h-[480px] w-[624px] shrink-0 overflow-hidden rounded-[5px]">
							<Image
								src={propertyUrl}
								alt={page.propertyImage?.alt ?? ''}
								fill
								className="object-cover"
								sizes="624px"
							/>
						</div>
					)}
				</div>
				{contentDecorUrl && (
					<div className="pointer-events-none absolute right-[94px] top-[264px] h-[554px] w-[228px]">
						<Image src={contentDecorUrl} alt="" fill className="object-cover" sizes="228px" />
					</div>
				)}
			</section>

			{/* Form ── Frame 61 ─────────────────────────────────── */}
			<section className="relative bg-background pb-[72px]">
				{formDecorUrl && (
					<div className="pointer-events-none absolute left-0 top-[279px] h-[462px] w-[847px]">
						<Image src={formDecorUrl} alt="" fill className="object-cover" sizes="847px" />
					</div>
				)}
				<div className="relative mx-[192px] bg-white px-[51px] pb-[48px] pt-[37px]">
					<h2 className="mb-[75px] text-center font-heading text-[30px] leading-[40px] tracking-[0.1em] text-foreground">
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
