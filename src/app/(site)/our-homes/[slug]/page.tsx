import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { buildLodgingSchema } from '@/lib/schema-org'
import { getProperty, getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import ReactIcon from '@/ui/atoms/react-icon'
import Img from '@/ui/img'
import ReviewsSection from '@/ui/molecules/reviews-section'
import OurHomesCta from '@/ui/pages/our-homes/our-homes-cta'
import PropertyAmenitiesSection from '@/ui/pages/our-homes/property-amenities-section'
import PropertyExperiencesSection from '@/ui/pages/our-homes/property-experiences-section'
import PropertyFaqSection from '@/ui/pages/our-homes/property-faq-section'
import PropertyGallerySection from '@/ui/pages/our-homes/property-gallery-section'
import PropertyHighlightsSection from '@/ui/pages/our-homes/property-highlights-section'
import RentalwiseWidget from '@/ui/pages/our-homes/rentalwise-widget'

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

	const coverAsset =
		property.detailCoverImage?.asset ?? property.heroImage?.asset
	const coverAlt =
		property.detailCoverImage?.alt ?? property.heroImage?.alt ?? ''
	const heroUrl = coverAsset
		? urlFor(coverAsset).width(1440).quality(85).url()
		: null

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
			<main className="flex-1 overflow-x-clip">
				{/* 1. Hero */}
				<section className="bg-background relative -z-1 h-[50vh] overflow-hidden lg:h-[70vh]">
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
						{property.tagline && (
							<p className="font-sans text-[12px] tracking-[0.1em] text-white uppercase">
								{property.tagline}
							</p>
						)}
						{property.title && (
							<h1 className="font-heading px-6 text-center text-[47px] leading-[1.1] tracking-[0.05em] text-white lg:text-[57px]">
								{property.title}
							</h1>
						)}
					</div>
				</section>

				{/* 2. Booking bar */}
				{property.rentalwiseIdentifier &&
				property.rentalwiseWidgetPropertyId ? (
					<div className="mx-[18px] mt-[-4%] lg:mx-[90px] lg:-mt-10">
						<RentalwiseWidget
							instance={
								process.env.NEXT_PUBLIC_RENTALWISE_INSTANCE_URL ??
								'https://althomes.rentalwise.io'
							}
							identifier={property.rentalwiseIdentifier}
							propertyId={property.rentalwiseWidgetPropertyId}
						/>
					</div>
				) : (
					<div className="bg-background mx-[18px] flex flex-col gap-4 px-[48px] py-[12px] lg:mx-[90px] lg:flex-row lg:items-center lg:justify-center lg:gap-[40px]">
						<p className="font-heading text-foreground text-center text-sm tracking-wider uppercase lg:hidden">
							READY TO ESCAPE?
						</p>
						<div className="flex flex-col gap-[5px]">
							<p className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								Check In &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Check Out
							</p>
							<div className="bg-muted h-px w-full lg:w-[289px]" />
						</div>
						<div className="flex flex-col gap-[8px]">
							<p className="text-foreground font-sans text-[15px] tracking-[0.1em]">
								Guests
							</p>
							<div className="bg-muted h-px w-full lg:w-[289px]" />
						</div>
						<div className="flex items-center gap-[32px]">
							<div className="text-right">
								<p className="text-foreground font-sans text-[9px] leading-[23px] tracking-[0.1em]">
									TAXES INCLUDED
								</p>
								{property.priceFrom != null && (
									<p className="text-foreground font-sans text-[15px] leading-[16px] font-semibold tracking-[0.1em]">
										INR {property.priceFrom.toLocaleString()}
									</p>
								)}
							</div>
							<a
								href="#booking"
								className="bg-accent text-accent-foreground flex h-auto w-full items-center justify-center rounded-[5px] py-[5px] font-sans text-[12px] font-semibold tracking-[0.3em] lg:w-[208px]"
							>
								BOOK NOW
							</a>
						</div>
					</div>
				)}

				{/* 3. Intro — subtitle + specs strip */}
				<section
					id="booking"
					className="bg-background px-[18px] py-[48px] lg:justify-items-center lg:px-[90px]"
				>
					<div className="flex flex-col gap-8 lg:max-w-[1000px] lg:flex-row lg:gap-[26px]">
						{/* Left: subtitle (Playfair 30px) */}
						{property.detailIntroHeading && (
							<div className="w-full shrink-0 lg:w-[527px]">
								<p className="font-heading text-foreground text-[19px] leading-[30px] tracking-[0.1em] lg:text-[30px] lg:leading-[40px]">
									{property.detailIntroHeading}
								</p>
							</div>
						)}

						{/* Right: short description + specs strip */}
						<div className="flex flex-1 flex-col gap-[28px]">
							{property.detailIntroBody && (
								<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
									{property.detailIntroBody}
								</p>
							)}

							{/* Specs strip */}
							<div className="grid grid-cols-5 items-center justify-items-center gap-[14px] lg:flex lg:flex-row">
								{property.amenities?.map((amenity, i) => (
									<div
										key={i}
										className="flex w-[82px] flex-col items-center gap-[3px]"
									>
										<div className="text-foreground flex h-[46px] w-[46px] items-center justify-center">
											<ReactIcon name={amenity.icon} size={36} />
										</div>
										<p className="text-foreground text-center font-sans text-[15px] leading-[23px] font-medium tracking-[0.1em]">
											{amenity.name}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* 4. Image collage + description */}
				<section className="bg-background flex max-w-[1000px] flex-col items-center gap-8 justify-self-center overflow-visible lg:h-[490px] lg:flex-row lg:justify-center lg:gap-[48px]">
					{/* Left: collage — desktop dimensions scaled down on mobile */}
					<div className="h-[319px] w-[374px] shrink-0 overflow-hidden lg:h-full lg:w-[575px]">
						<div className="relative h-[490px] w-[575px] origin-top-left scale-[0.65] lg:scale-100">
							{property.posterImages?.[3] && (
								<div className="absolute top-[128px] -left-[11px] h-[159px] w-[238px] overflow-hidden rounded-[5px]">
									<Img
										image={property.posterImages[3]}
										width={238}
										alt={property.posterImages[3].alt ?? ''}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							{property.posterImages?.[0] && (
								<div className="absolute top-0 left-[142px] h-[364px] w-[433px] overflow-hidden rounded-[5px]">
									<Img
										image={property.posterImages[0]}
										width={433}
										alt={property.posterImages[0].alt ?? ''}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							{property.posterImages?.[1] && (
								<div className="absolute top-[265px] left-[46px] h-[216px] w-[288px] overflow-hidden rounded-[5px]">
									<Img
										image={property.posterImages[1]}
										width={288}
										alt={property.posterImages[1].alt ?? ''}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
							{property.posterImages?.[2] && (
								<div className="absolute top-[310px] right-30 h-[147px] w-fit overflow-hidden rounded-[5px]">
									<Img
										image={property.posterImages[2]}
										quality={100}
										width={470}
										alt={property.posterImages[2].alt ?? ''}
										className="h-full w-full object-cover"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Right: description */}
					<div className="w-full shrink-0 lg:w-[479px]">
						{property.description && (
							<div className="text-foreground px-4 font-sans text-[15px] leading-[23px] tracking-[0.1em] [&_p]:mb-4 [&_p:last-child]:mb-0">
								<PortableText value={property.description} />
							</div>
						)}
					</div>
				</section>

				{/* 5. Gallery carousel */}
				{property.sliderGallery && property.sliderGallery.length > 0 && (
					<PropertyGallerySection
						gallery={property.sliderGallery}
						quote={property.gallerySectionQuote}
						decorImage={property.galleryDecorImage}
					/>
				)}

				{/* 3. Location — Getting Here */}
				{(property.locationBody || property.locationCta) && (
					<section className="bg-background flex flex-col gap-8 px-4 py-[48px] lg:flex-row lg:items-center lg:justify-center lg:gap-[45px]">
						{property.locationImage?.asset && (
							<div className="order-2 h-[310px] w-full shrink-0 overflow-hidden lg:order-none lg:w-[576px]">
								<Img
									image={property.locationImage}
									width={576}
									sizes="(max-width: 1023px) 100vw, 576px"
									alt=""
									className="h-full w-full object-contain"
								/>
							</div>
						)}
						<div className="contents lg:flex lg:w-[435px] lg:shrink-0 lg:flex-col lg:gap-[44px]">
							{property.locationBody && (
								<div className="text-foreground order-1 font-sans text-[15px] leading-[23px] tracking-[0.1em] lg:order-none [&_p]:mb-[8px] [&_p:last-child]:mb-0 [&_strong]:font-bold">
									<PortableText value={property.locationBody} />
								</div>
							)}
							{property.locationCta?.url && (
								<a
									href={property.locationCta.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-foreground order-3 mx-auto w-fit font-sans text-[12px] font-semibold tracking-[0.3em] underline underline-offset-2 hover:opacity-70 lg:order-none lg:mx-0"
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
					<PropertyFaqSection
						faqs={property.faqs}
						badgeText={property.faqBadgeText}
					/>
				)}

				{/* 7. Causes */}
				{!property.hideCausesSection &&
					(property.causeHeadline ||
						property.causeBody ||
						(property.causeImages && property.causeImages.length >= 1)) && (
						<section className="bg-background text-foreground flex min-h-0 flex-col justify-center px-[18px] py-16 md:px-[90px] md:py-24 lg:min-h-[80vh]">
							<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 md:justify-between md:gap-[60px] lg:grid-cols-[45fr_50fr]">
								{/* Left: images */}
								<div className="relative w-[90%] sm:w-full">
									{property.causeImages?.[0] && (
										<div className="relative w-full">
											<Img
												image={property.causeImages[0]}
												width={624}
												height={497}
												sizes="(max-width: 767px) calc(100vw - 36px), 624px"
												alt={property.causeImages[0].alt ?? ''}
												className="h-auto w-full rounded-[8px] object-cover"
											/>
										</div>
									)}
									{property.causeImages?.[1] && (
										<div className="absolute right-[-40px] bottom-0 z-10 w-[140px] md:w-[200px]">
											<Img
												image={property.causeImages[1]}
												width={200}
												height={280}
												alt={property.causeImages[1].alt ?? ''}
												className="h-auto w-full object-contain"
											/>
										</div>
									)}
								</div>

								{/* Right: text */}
								<div className="text-star flex flex-col items-start md:items-start md:text-left lg:items-start">
									{property.causeHeadline && (
										<h2 className="font-heading text-foreground mb-5 max-w-[515px] text-[19px] leading-[29px] tracking-[0.1em] md:text-[30px] md:leading-[40px]">
											{property.causeHeadline}
										</h2>
									)}
									{property.causeBody && (
										<div className="text-foreground max-w-[100%] space-y-4 text-[15px] leading-[1.6] md:text-[16px] md:leading-[1.8]">
											<PortableText value={property.causeBody} />
										</div>
									)}
								</div>
							</div>
						</section>
					)}

				{/* 8. Reviews */}
				{cappedReviews.length > 0 && <ReviewsSection reviews={cappedReviews} />}

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
	const description = metaDescription || site?.seo?.metaDescription
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
