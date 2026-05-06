import type { Metadata } from 'next'
import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { notFound } from 'next/navigation'
import { buildLodgingSchema } from '@/lib/schema-org'
import { getProperty, getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import Img from '@/ui/img'
import PropertyGallerySection from '@/ui/pages/our-homes/property-gallery-section'
import PropertyExperiencesSection from '@/ui/pages/our-homes/property-experiences-section'
import PropertyAmenitiesSection from '@/ui/pages/our-homes/property-amenities-section'
import PropertyFaqSection from '@/ui/pages/our-homes/property-faq-section'
import ReactIcon from '@/ui/atoms/react-icon'
import ReviewsSection from '@/ui/molecules/reviews-section'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'
import RentalwiseWidget from '@/ui/pages/our-homes/rentalwise-widget'
import PropertyHighlightsSection from '@/ui/pages/our-homes/property-highlights-section'

type Props = {
	params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
	const { slug } = await params
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	if (!property) notFound()

	const cappedExperiences =
		property.experiences?.slice(0, property.experiencesMaxShown ?? 6) ?? []
	const cappedReviews = property.reviews ?? []

	const coverAsset = property.detailCoverImage?.asset ?? property.heroImage?.asset
	const coverAlt = property.detailCoverImage?.alt ?? property.heroImage?.alt ?? ''
	const heroUrl = coverAsset ? urlFor(coverAsset).width(1440).quality(85).url() : null

	const amenitiesImageUrl = property.amenitiesSectionImage?.asset
		? urlFor(property.amenitiesSectionImage.asset).width(800).quality(80).url()
		: null

	const schemaJson = site
		? JSON.stringify(
				buildLodgingSchema(
					property,
					site,
					process.env.NEXT_PUBLIC_BASE_URL ?? '',
				),
			).replace(/</g, '\\u003c')
		: null

	return (
		<>
			{schemaJson && (
				<script
					type="application/ld+json"
					// eslint-disable-next-line react/no-danger
					dangerouslySetInnerHTML={{ __html: schemaJson }}
				/>
			)}
			<main className="flex-1">
				{/* 1. Hero */}
				<section className="relative h-[480px] lg:h-screen overflow-hidden bg-background">
					{heroUrl && (
						<Image
							src={heroUrl}
							alt={coverAlt}
							fill
							priority
							className="object-cover"
							sizes="100vw"
						/>
					)}
					<div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/20">
						{property.title && (
							<h1 className="font-stories text-[56px] leading-[1.1] tracking-[0.05em] text-white text-center px-6">
								{property.title}
							</h1>
						)}
						{property.tagline && (
							<p className="font-sans text-[12px] uppercase tracking-[0.1em] text-white">
								{property.tagline}
							</p>
						)}
					</div>
				</section>

				{/* 2. Booking bar */}
				{property.rentalwiseIdentifier && property.rentalwiseWidgetPropertyId ? (
					<div className="mx-[18px] lg:mx-[90px]">
						<RentalwiseWidget
							instance={process.env.NEXT_PUBLIC_RENTALWISE_INSTANCE_URL ?? 'https://althomes.rentalwise.io'}
							identifier={property.rentalwiseIdentifier}
							propertyId={property.rentalwiseWidgetPropertyId}
						/>
					</div>
				) : (
					<div className="mx-[18px] lg:mx-[90px] flex flex-col lg:flex-row lg:items-center lg:justify-center gap-4 lg:gap-[40px] bg-background px-[48px] py-[12px]">
						<p className="lg:hidden text-center font-heading uppercase tracking-wider text-sm text-foreground">READY TO ESCAPE?</p>
						<div className="flex flex-col gap-[5px]">
							<p className="font-sans text-[15px] tracking-[0.1em] text-foreground">
								Check In &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Check Out
							</p>
							<div className="h-px w-full lg:w-[289px] bg-muted" />
						</div>
						<div className="flex flex-col gap-[8px]">
							<p className="font-sans text-[15px] tracking-[0.1em] text-foreground">Guests</p>
							<div className="h-px w-full lg:w-[289px] bg-muted" />
						</div>
						<div className="flex items-center gap-[32px]">
							<div className="text-right">
								<p className="font-sans text-[9px] leading-[23px] tracking-[0.1em] text-foreground">
									TAXES INCLUDED
								</p>
								{property.priceFrom != null && (
									<p className="font-sans text-[15px] font-semibold leading-[16px] tracking-[0.1em] text-foreground">
										INR {property.priceFrom.toLocaleString()}
									</p>
								)}
							</div>
							<a
								href="#booking"
								className="flex h-auto w-full lg:w-[208px] items-center justify-center rounded-[5px] bg-accent py-[5px] font-sans text-[12px] font-semibold tracking-[0.3em] text-accent-foreground"
							>
								BOOK NOW
							</a>
						</div>
					</div>
				)}

				{/* 3. Intro — subtitle + specs strip */}
				<section
					id="booking"
					className="bg-background py-[48px] px-[18px] lg:px-[90px] lg:justify-items-center"
				>
					<div className="flex flex-col lg:max-w-[1000px] lg:flex-row gap-8 lg:gap-[26px]">
						{/* Left: subtitle (Playfair 30px) */}
						{property.detailIntroHeading && (
							<div className="w-full lg:w-[527px] shrink-0">
								<p className="font-heading text-[30px] leading-[40px] tracking-[0.1em] text-foreground">
									{property.detailIntroHeading}
								</p>
							</div>
						)}

						{/* Right: short description + specs strip */}
						<div className="flex flex-1 flex-col gap-[28px]">
							{property.detailIntroBody && (
								<p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
									{property.detailIntroBody}
								</p>
							)}

							{/* Specs strip */}
							<div className="grid grid-cols-2 lg:flex lg:flex-row items-center justify-items-center gap-[14px]">
								{property.amenities?.map((amenity, i) => (
									<div key={i} className="flex w-[82px] flex-col items-center gap-[3px]">
										<div className="flex h-[46px] w-[46px] items-center justify-center text-foreground">
											<ReactIcon name={amenity.icon} size={36} />
										</div>
										<p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
											{amenity.name}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* 4. Image collage + description */}
				<section className="flex flex-col max-w-[1000px] justify-self-center lg:flex-row lg:h-[490px] items-center lg:justify-center gap-8 lg:gap-[48px] bg-background overflow-visible">
					{/* Left: collage */}
					<div className="relative w-full overflow-visible lg:w-[575px] h-[360px] lg:h-full shrink-0 overflow-hidden">
						{property.showcaseDecorImage?.asset && (
							<div className="pointer-events-none absolute -left-[11px] top-[128px] h-[159px] w-[55%] lg:w-[238px]">
								<Img image={property.showcaseDecorImage} width={238} alt="" className="h-full w-full object-cover" />
							</div>
						)}
						{property.gallery?.[0] && (
							<div className="absolute left-[142px] top-0 h-[364px] w-[55%] lg:w-[433px] overflow-hidden rounded-[5px]">
								<Img image={property.gallery[0]} width={433} alt={property.gallery[0].alt ?? ''} className="h-full w-full object-cover" />
							</div>
						)}
						{property.gallery?.[1] && (
							<div className="absolute left-[46px] top-[265px] h-[216px] w-[55%] lg:w-[288px] overflow-hidden rounded-[5px]">
								<Img image={property.gallery[1]} width={288} alt={property.gallery[1].alt ?? ''} className="h-full w-full object-cover" />
							</div>
						)}
						{property.gallery?.[2] && (
							<div className="pointer-events-none absolute -right-[10px] top-[310px] h-[30%] w-[470px]">
								<Img image={property.gallery[2]} quality={100} width={470} alt={property.gallery[2].alt ?? ''} className="h-full w-full object-contain" />
							</div>
						)}
					</div>

					{/* Right: description */}
					<div className="w-full lg:w-[479px] shrink-0">
						{property.description && (
							<div className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground [&_p]:mb-4 [&_p:last-child]:mb-0">
								<PortableText value={property.description} />
							</div>
						)}
					</div>
				</section>

				{/* 5. Gallery carousel */}
				{property.gallery && property.gallery.length > 0 && (
					<PropertyGallerySection
						gallery={property.gallery}
						quote={property.gallerySectionQuote}
						decorImage={property.galleryDecorImage}
					/>
				)}

				{/* 3. Location — Getting Here */}
				{(property.locationBody || property.locationCta) && (
					<section className="flex flex-col lg:flex-row gap-8 lg:gap-[45px] lg:items-center lg:justify-center bg-background py-[48px]">
						{property.locationImage?.asset && (
							<div className="h-[310px] w-full lg:w-[576px] shrink-0 overflow-hidden">
								<Img
									image={property.locationImage}
									width={576}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<div className="flex w-full lg:w-[435px] shrink-0 flex-col gap-[44px]">
							{property.locationBody && (
								<div className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground [&_strong]:font-bold [&_p]:mb-[8px] [&_p:last-child]:mb-0">
									<PortableText value={property.locationBody} />
								</div>
							)}
							{property.locationCta?.url && (
								<a
									href={property.locationCta.url}
									target="_blank"
									rel="noopener noreferrer"
									className="w-fit font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
								>
									{property.locationCta.label || 'FIND US ON THE MAP'}
								</a>
							)}
						</div>
					</section>
				)}

				{/* 4. Highlights — What's Waiting For You? */}
				<PropertyHighlightsSection
					windDown={property.windDownHighlight ?? null}
					wakeUp={property.wakeUpHighlight ?? null}
					hostedWithHeart={property.hostedWithHeartHighlight ?? null}
					symphony={property.symphonyHighlight ?? null}
					menuCta={property.menuCta ?? null}
				/>

				{/* 5. Experiences */}
				{cappedExperiences.length > 0 && (
					<PropertyExperiencesSection
						bgImage={property.experiencesBgImage}
						experiences={cappedExperiences}
						propertyTitle={property.title ?? ''}
					/>
				)}

				{/* 6. Amenities + House Rules */}
				{((property.amenities && property.amenities.length > 0) ||
					property.houseRulesTeaser ||
					property.houseRules) && (
					<PropertyAmenitiesSection
						imageUrl={amenitiesImageUrl}
						amenities={property.amenities ?? []}
						houseRulesTeaser={property.houseRulesTeaser}
						houseRules={property.houseRules}
					/>
				)}

				{/* 6b. FAQs */}
				{property.faqs && property.faqs.length > 0 && (
					<PropertyFaqSection faqs={property.faqs} />
				)}

				{/* 7. Causes */}
				{(property.causeHeadline ||
					property.causeBody ||
					(property.causeImages && property.causeImages.length >= 1)) && (
					<section className="bg-background text-foreground py-16 md:py-24 px-[18px] md:px-[90px] min-h-0 lg:min-h-[80vh] flex flex-col justify-center">
						<div className="mx-auto w-full max-w-7xl grid grid-cols-1 md:grid-cols-[45fr_50fr] gap-12 md:gap-[60px] items-start md:justify-between">
							{/* Left: images */}
							<div className="relative w-full">
								{property.causeImages?.[0] && (
									<div className="relative w-full">
										<Img
											image={property.causeImages[0]}
											width={624}
											height={497}
											alt={property.causeImages[0].alt ?? ''}
											className="w-full h-auto object-cover rounded-[8px]"
										/>
									</div>
								)}
								{property.causeImages?.[1] && (
									<div className="absolute bottom-0 right-0 z-10 w-[120px] md:w-[160px]">
										<Img
											image={property.causeImages[1]}
											width={200}
											height={280}
											alt={property.causeImages[1].alt ?? ''}
											className="w-full h-auto object-contain"
										/>
									</div>
								)}
							</div>

							{/* Right: text */}
							<div className="flex flex-col items-center text-center md:items-start md:text-left">
								{property.causeHeadline && (
									<h2 className="mb-5 font-heading italic text-[32px] md:text-[40px] tracking-[0.1em] text-foreground leading-[1.1] max-w-[515px]">
										{property.causeHeadline}
									</h2>
								)}
								{property.causeBody && (
									<div className="text-foreground text-[15px] md:text-[16px] leading-[1.6] md:leading-[1.8] space-y-4 max-w-[480px]">
										<PortableText value={property.causeBody} />
									</div>
								)}
							</div>
						</div>
					</section>
				)}

				{/* 8. Reviews */}
				{cappedReviews.length > 0 && (
					<ReviewsSection reviews={cappedReviews} />
				)}

				{/* 9. Bottom CTA */}
				<OurHomesCta
					ctaQuestion={property.ctaHeadline ?? null}
					ctaButtonLabel={property.ctaButtonLabel ?? null}
					ctaBackground={property.ctaBackground ?? null}
				/>
			</main>
		</>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	const { metaTitle, metaDescription, ogImage } = property?.seo ?? {}
	const title = metaTitle || `${property?.title ?? 'Property'} | AltHomes`
	const description =
		metaDescription || site?.seo?.metaDescription
	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: ogImage ? [urlFor(ogImage).width(1200).url()] : [],
		},
	}
}
