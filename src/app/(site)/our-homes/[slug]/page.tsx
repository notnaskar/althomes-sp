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
			<main className="flex-1">
				{/* 1. Hero */}
				<section className="bg-background relative h-[480px] overflow-hidden lg:h-screen">
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
							<h1 className="font-stories px-6 text-center text-[56px] leading-[1.1] tracking-[0.05em] text-white">
								{property.title}
							</h1>
						)}
						{property.tagline && (
							<p className="font-sans text-[12px] tracking-[0.1em] text-white uppercase">
								{property.tagline}
							</p>
						)}
					</div>
				</section>

				{/* 2. Booking bar */}
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

				{/* 3. Intro — subtitle + specs strip */}
				<section
					id="booking"
					className="bg-background px-[18px] py-[48px] lg:px-[90px]"
				>
					<div className="flex flex-col gap-8 lg:flex-row lg:gap-[26px]">
						{/* Left: subtitle (Playfair 30px) */}
						{property.detailIntroHeading && (
							<div className="w-full shrink-0 lg:w-[527px]">
								<p className="font-heading text-foreground text-[30px] leading-[40px] tracking-[0.1em]">
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
							<div className="grid grid-cols-2 items-center justify-items-center gap-[14px] lg:flex lg:flex-row">
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
				<section className="bg-background flex flex-col items-center gap-8 overflow-hidden lg:h-[490px] lg:flex-row lg:justify-center lg:gap-[48px]">
					{/* Left: collage */}
					<div className="relative h-[360px] w-full shrink-0 overflow-hidden lg:h-full lg:w-[575px]">
						{property.showcaseDecorImage?.asset && (
							<div className="pointer-events-none absolute top-[128px] -left-[11px] h-[159px] w-[55%] lg:w-[238px]">
								<Img
									image={property.showcaseDecorImage}
									width={238}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						{property.gallery?.[0] && (
							<div className="absolute top-0 left-[142px] h-[364px] w-[55%] overflow-hidden rounded-[5px] lg:w-[433px]">
								<Img
									image={property.gallery[0]}
									width={433}
									alt={property.gallery[0].alt ?? ''}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						{property.gallery?.[1] && (
							<div className="absolute top-[265px] left-[46px] h-[216px] w-[55%] overflow-hidden rounded-[5px] lg:w-[288px]">
								<Img
									image={property.gallery[1]}
									width={288}
									alt={property.gallery[1].alt ?? ''}
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						{property.gallery?.[2] && (
							<div className="pointer-events-none absolute top-[310px] -right-[10px] h-[30%] w-[470px]">
								<Img
									image={property.gallery[2]}
									quality={100}
									width={470}
									alt={property.gallery[2].alt ?? ''}
									className="h-full w-full object-contain"
								/>
							</div>
						)}
					</div>

					{/* Right: description */}
					<div className="w-full shrink-0 lg:w-[479px]">
						{property.description && (
							<div className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em] [&_p]:mb-4 [&_p:last-child]:mb-0">
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
					<section className="bg-background flex flex-col gap-8 py-[48px] lg:flex-row lg:items-center lg:justify-center lg:gap-[45px]">
						{property.locationImage?.asset && (
							<div className="h-[310px] w-full shrink-0 overflow-hidden lg:w-[576px]">
								<Img
									image={property.locationImage}
									width={576}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<div className="flex w-full shrink-0 flex-col gap-[44px] lg:w-[435px]">
							{property.locationBody && (
								<div className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em] [&_p]:mb-[8px] [&_p:last-child]:mb-0 [&_strong]:font-bold">
									<PortableText value={property.locationBody} />
								</div>
							)}
							{property.locationCta?.url && (
								<a
									href={property.locationCta.url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-foreground w-fit font-sans text-[12px] font-semibold tracking-[0.3em] underline underline-offset-2 hover:opacity-70"
								>
									{property.locationCta.label || 'FIND US ON THE MAP'}
								</a>
							)}
						</div>
					</section>
				)}

				{/* 4. Highlights — What's Waiting For You? */}
				{property.highlights && property.highlights.length > 0 && (
					<section className="bg-background w-full overflow-hidden py-[72px]">
						{/* Heading */}
						<h2 className="font-heading text-foreground mb-16 px-[18px] text-center text-[30px] leading-[40px] font-normal tracking-[0.3em] lg:px-[90px]">
							WHAT&rsquo;S WAITING FOR YOU?
						</h2>

						<div className="flex w-full flex-col gap-6">
							{/* Row 1: text right-aligned + image collage (highlights[0]) */}
							{property.highlights[0] && (
								<div className="flex flex-col gap-6 px-[18px] lg:flex-row lg:items-end lg:justify-end lg:gap-12 lg:px-[90px]">
									<div className="w-full text-right lg:w-96">
										{property.highlights[0].title && (
											<h3 className="font-heading text-foreground mb-3 text-[20px] leading-[28px] tracking-[0.2em]">
												{property.highlights[0].title}
											</h3>
										)}
										{property.highlights[0].body && (
											<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
												{property.highlights[0].body}
											</p>
										)}
									</div>
									<div className="relative h-96 w-full shrink-0 lg:w-[576px]">
										{property.highlights[0].image?.asset && (
											<div className="absolute top-0 left-0 h-96 w-full overflow-hidden rounded-[5px] lg:w-[576px]">
												<Img
													image={property.highlights[0].image}
													width={576}
													alt={property.highlights[0].image.alt ?? ''}
													className="h-full w-full object-cover"
												/>
											</div>
										)}
										{property.highlights[0].decorImage?.asset && (
											<div className="pointer-events-none absolute -top-[32px] -left-[72px] h-[192px] w-[120px] -rotate-[21deg]">
												<Img
													image={property.highlights[0].decorImage}
													width={120}
													alt=""
													className="h-full w-full object-cover"
												/>
											</div>
										)}
										{property.highlights[0].secondaryImage?.asset && (
											<div className="absolute top-[121px] left-0 h-80 w-48 overflow-hidden rounded-[5px]">
												<Img
													image={property.highlights[0].secondaryImage}
													width={192}
													alt={property.highlights[0].secondaryImage.alt ?? ''}
													className="h-full w-full object-cover"
												/>
											</div>
										)}
									</div>
								</div>
							)}

							{/* Row 2: highlights[1] — image left, text right */}
							{property.highlights[1] && (
								<div className="flex flex-col gap-6 px-[18px] lg:flex-row lg:items-center lg:gap-12 lg:px-[90px]">
									{property.highlights[1].image?.asset && (
										<div className="relative h-80 w-full shrink-0 overflow-hidden rounded-[5px] lg:w-[494px]">
											<Img
												image={property.highlights[1].image}
												width={494}
												alt={property.highlights[1].image.alt ?? ''}
												className="h-full w-full object-cover"
											/>
										</div>
									)}
									<div className="flex-1">
										{property.highlights[1].title && (
											<h3 className="font-heading text-foreground mb-3 text-[20px] leading-[28px] tracking-[0.2em]">
												{property.highlights[1].title}
											</h3>
										)}
										{property.highlights[1].body && (
											<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
												{property.highlights[1].body}
											</p>
										)}
									</div>
								</div>
							)}

							{/* Row 3: highlights[2] — text left, image right */}
							{property.highlights[2] && (
								<div className="flex flex-col gap-6 px-[18px] lg:flex-row lg:items-center lg:justify-end lg:gap-12 lg:px-[90px]">
									<div className="flex-1">
										{property.highlights[2].title && (
											<h3 className="font-heading text-foreground mb-3 text-[20px] leading-[28px] tracking-[0.2em]">
												{property.highlights[2].title}
											</h3>
										)}
										{property.highlights[2].body && (
											<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
												{property.highlights[2].body}
											</p>
										)}
									</div>
									{property.highlights[2].image?.asset && (
										<div className="relative h-80 w-full shrink-0 overflow-hidden rounded-[5px] lg:w-[494px]">
											<Img
												image={property.highlights[2].image}
												width={494}
												alt={property.highlights[2].image.alt ?? ''}
												className="h-full w-full object-cover"
											/>
										</div>
									)}
								</div>
							)}

							{/* Row 3: text + CTA left, image right (highlights[3]) */}
							{property.highlights[3] && (
								<div className="flex flex-col gap-6 px-[18px] lg:flex-row lg:items-center lg:justify-end lg:gap-12 lg:px-[90px]">
									<div className="flex w-full shrink-0 flex-col gap-12 lg:w-96">
										<div>
											{property.highlights[3].title && (
												<h3 className="font-heading text-foreground mb-3 text-[20px] leading-[28px] tracking-[0.2em]">
													{property.highlights[3].title}
												</h3>
											)}
											{property.highlights[3].body && (
												<p className="text-foreground font-sans text-[15px] leading-[23px] tracking-[0.1em]">
													{property.highlights[3].body}
												</p>
											)}
										</div>
										{property.menuCta?.url && (
											<a
												href={property.menuCta.url}
												target="_blank"
												rel="noopener noreferrer"
												className="text-foreground font-sans text-[12px] font-semibold tracking-[0.3em] underline underline-offset-2 hover:opacity-70"
											>
												{property.menuCta.label || "WHAT'S ON THE MENU?"}
											</a>
										)}
									</div>
									<div className="relative h-80 w-full shrink-0 overflow-hidden rounded-tl-[5px] rounded-bl-[5px] lg:w-[788px]">
										{property.highlights[3].image?.asset && (
											<div className="absolute top-0 left-0 h-80 w-full overflow-hidden">
												<Img
													image={property.highlights[3].image}
													width={788}
													alt={property.highlights[3].image.alt ?? ''}
													className="h-full w-full object-cover"
												/>
											</div>
										)}
									</div>
								</div>
							)}
						</div>
					</section>
				)}

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
					<section className="bg-background text-foreground flex min-h-0 flex-col justify-center px-[18px] py-16 md:px-[90px] md:py-24 lg:min-h-[80vh]">
						<div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start gap-12 md:grid-cols-[45fr_50fr] md:justify-between md:gap-[60px]">
							{/* Left: images */}
							<div className="relative w-full">
								{property.causeImages?.[0] && (
									<div className="relative w-full">
										<Img
											image={property.causeImages[0]}
											width={624}
											height={497}
											alt={property.causeImages[0].alt ?? ''}
											className="h-auto w-full rounded-[8px] object-cover"
										/>
									</div>
								)}
								{property.causeImages?.[1] && (
									<div className="absolute right-0 bottom-0 z-10 w-[120px] md:w-[160px]">
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
							<div className="flex flex-col items-center text-center md:items-start md:text-left">
								{property.causeHeadline && (
									<h2 className="font-heading text-foreground mb-5 max-w-[515px] text-[32px] leading-[1.1] tracking-[0.1em] italic md:text-[40px]">
										{property.causeHeadline}
									</h2>
								)}
								{property.causeBody && (
									<div className="text-foreground max-w-[480px] space-y-4 text-[15px] leading-[1.6] md:text-[16px] md:leading-[1.8]">
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
