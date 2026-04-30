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
import ReactIcon from '@/ui/atoms/react-icon'

type Props = {
	params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
	const { slug } = await params
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	if (!property) notFound()

	const cappedExperiences =
		property.experiences?.slice(0, property.experiencesMaxShown ?? 6) ?? []
	const cappedReviews =
		property.reviews?.slice(0, property.reviewsMaxShown ?? 20) ?? []

	const heroUrl = property.heroImage?.asset
		? urlFor(property.heroImage.asset).width(1440).url()
		: null

	const amenitiesImageUrl = property.amenitiesSectionImage?.asset
		? urlFor(property.amenitiesSectionImage.asset).width(800).url()
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
				<section className="relative h-[672px] overflow-hidden bg-background">
					{heroUrl && (
						<Image
							src={heroUrl}
							alt={property.heroImage?.alt ?? ''}
							fill
							priority
							className="object-cover"
							sizes="1440px"
						/>
					)}
					{property.tagline && (
						<div className="absolute inset-0 flex items-center justify-center">
							<p className="font-sans text-[12px] uppercase tracking-[0.1em] text-primary-foreground">
								{property.tagline}
							</p>
						</div>
					)}
				</section>

				{/* 2. Booking bar */}
				<div className="mx-[90px] max-[820px]:mx-[18px] flex items-center justify-center gap-[40px] bg-background px-[48px] py-[12px]">
					<div className="flex flex-col gap-[5px]">
						<p className="font-sans text-[15px] tracking-[0.1em] text-foreground">
							Check In &emsp;&emsp;&emsp;&emsp;&emsp;&emsp; Check Out
						</p>
						<div className="h-px w-[289px] bg-muted" />
					</div>
					<div className="flex flex-col gap-[8px]">
						<p className="font-sans text-[15px] tracking-[0.1em] text-foreground">Guests</p>
						<div className="h-px w-[289px] bg-muted" />
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
							className="flex h-auto w-[208px] items-center justify-center rounded-[5px] bg-accent py-[5px] font-sans text-[12px] font-semibold tracking-[0.3em] text-accent-foreground"
						>
							BOOK NOW
						</a>
					</div>
				</div>

				{/* 3. Intro — subtitle + specs strip */}
				<section
					id="booking"
					className="bg-background py-[48px] px-[90px] max-[820px]:px-[18px]"
				>
					<div className="flex gap-[26px]">
						{/* Left: subtitle (Playfair 30px) */}
						{property.pullQuote && (
							<div className="w-[527px] shrink-0">
								<p className="font-heading text-[30px] leading-[40px] tracking-[0.1em] text-foreground">
									{property.pullQuote}
								</p>
							</div>
						)}

						{/* Right: short description + specs strip */}
						<div className="flex flex-1 flex-col gap-[28px]">
							{property.shortDescription && (
								<p className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
									{property.shortDescription}
								</p>
							)}

							{/* Specs strip */}
							<div className="flex items-center gap-[14px]">
								{property.propertyType && (
									<div className="flex w-[96px] flex-col items-center gap-[3px]">
										<div className="h-[46px] w-[46px]" />
										<p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
											{property.propertyType}
										</p>
									</div>
								)}
								{property.maxGuests != null && (
									<div className="flex w-[96px] flex-col items-center gap-[3px]">
										<div className="h-[46px] w-[46px]" />
										<p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
											Upto {property.maxGuests} Guests
										</p>
									</div>
								)}
								{property.bedrooms != null && property.bathrooms != null && (
									<div className="flex w-[96px] flex-col items-center gap-[3px]">
										<div className="h-[46px] w-[46px]" />
										<p className="text-center font-sans text-[15px] font-medium leading-[23px] tracking-[0.1em] text-foreground">
											{property.bedrooms} Rooms {property.bathrooms} Baths
										</p>
									</div>
								)}
								{property.amenities?.slice(0, 2).map((amenity, i) => (
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
				<section className="flex h-[490px] items-center justify-center gap-[48px] bg-background overflow-hidden">
					{/* Left: collage */}
					<div className="relative h-[490px] w-[575px] shrink-0">
						{property.showcaseDecorImage?.asset && (
							<div className="pointer-events-none absolute -left-[11px] top-[128px] h-[159px] w-[238px]">
								<Img image={property.showcaseDecorImage} width={238} alt="" className="h-full w-full object-cover" />
							</div>
						)}
						{property.gallery?.[0] && (
							<div className="absolute left-[142px] top-0 h-[364px] w-[433px] overflow-hidden rounded-[5px]">
								<Img image={property.gallery[0]} width={433} alt={property.gallery[0].alt ?? ''} className="h-full w-full object-cover" />
							</div>
						)}
						{property.gallery?.[1] && (
							<div className="absolute left-[46px] top-[265px] h-[216px] w-[288px] overflow-hidden rounded-[5px]">
								<Img image={property.gallery[1]} width={288} alt={property.gallery[1].alt ?? ''} className="h-full w-full object-cover" />
							</div>
						)}
					</div>

					{/* Right: description */}
					<div className="w-[479px] shrink-0">
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
					<section className="flex items-center justify-center gap-[45px] bg-background py-[48px]">
						{property.locationImage?.asset && (
							<div className="h-[310px] w-[576px] shrink-0 overflow-hidden">
								<Img
									image={property.locationImage}
									width={576}
									alt=""
									className="h-full w-full object-cover"
								/>
							</div>
						)}
						<div className="flex w-[435px] shrink-0 flex-col gap-[44px]">
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
				{property.highlights && property.highlights.length > 0 && (
					<section className="w-full overflow-hidden bg-background py-[72px]">
						{/* Heading */}
						<h2 className="mb-16 px-[90px] text-center font-heading text-[30px] font-normal leading-[40px] tracking-[0.3em] text-foreground">
							WHAT&rsquo;S WAITING FOR YOU?
						</h2>

						<div className="flex w-full flex-col gap-6">
							{/* Row 1: text right-aligned + image collage (highlights[0]) */}
							{property.highlights[0] && (
								<div className="flex items-end justify-end gap-12 px-[90px]">
									<div className="w-96 text-right">
										{property.highlights[0].title && (
											<span className="font-sans text-[15px] font-bold leading-[23px] tracking-[0.1em] text-foreground">
												{property.highlights[0].title}<br />
											</span>
										)}
										{property.highlights[0].body && (
											<span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
												<br />{property.highlights[0].body}
											</span>
										)}
									</div>
									<div className="relative h-96 w-[576px] shrink-0">
										{property.highlights[0].image?.asset && (
											<div className="absolute left-0 top-0 h-96 w-[576px] overflow-hidden rounded-[5px]">
												<Img image={property.highlights[0].image} width={576} alt={property.highlights[0].image.alt ?? ''} className="h-full w-full object-cover" />
											</div>
										)}
										{property.highlights[0].decorImage?.asset && (
											<div className="pointer-events-none absolute -left-[72px] -top-[32px] h-[192px] w-[120px] -rotate-[21deg]">
												<Img image={property.highlights[0].decorImage} width={120} alt="" className="h-full w-full object-cover" />
											</div>
										)}
										{property.highlights[0].secondaryImage?.asset && (
											<div className="absolute left-0 top-[121px] h-80 w-48 overflow-hidden rounded-[5px]">
												<Img image={property.highlights[0].secondaryImage} width={192} alt={property.highlights[0].secondaryImage.alt ?? ''} className="h-full w-full object-cover" />
											</div>
										)}
									</div>
								</div>
							)}

							{/* Row 2: left image pair + two text cols (fits 1440px full-width) */}
							{(property.highlights[1] || property.highlights[2]) && (
								<div className="flex items-center justify-start gap-8">
									{/* Left images: highlights[1].image + highlights[2].image overlapping */}
									<div className="relative h-80 w-[494px] shrink-0 overflow-hidden">
										{property.highlights[1]?.image?.asset && (
											<div className="absolute left-0 top-0 h-80 w-full overflow-hidden">
												<Img image={property.highlights[1].image} width={494} alt={property.highlights[1].image.alt ?? ''} className="h-full w-full object-cover" />
											</div>
										)}
										{property.highlights[2]?.image?.asset && (
											<div className="absolute left-0 top-[10px] h-72 w-full overflow-hidden opacity-80">
												<Img image={property.highlights[2].image} width={494} alt={property.highlights[2].image.alt ?? ''} className="h-full w-full object-cover" />
											</div>
										)}
									</div>
									{/* highlights[1]: What You'll Wake Up To */}
									{property.highlights[1] && (
										<div className="w-[336px] shrink-0">
											{property.highlights[1].title && (
												<span className="font-sans text-[15px] font-bold leading-[23px] tracking-[0.1em] text-foreground">
													{property.highlights[1].title}<br />
												</span>
											)}
											{property.highlights[1].body && (
												<span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
													<br />{property.highlights[1].body}
												</span>
											)}
										</div>
									)}
									{/* highlights[2]: Hosted With Heart */}
									{property.highlights[2] && (
										<div className="w-[336px] shrink-0">
											{property.highlights[2].title && (
												<span className="font-sans text-[15px] font-bold leading-[23px] tracking-[0.1em] text-foreground">
													{property.highlights[2].title}<br />
												</span>
											)}
											{property.highlights[2].body && (
												<span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
													<br />{property.highlights[2].body}
												</span>
											)}
										</div>
									)}
								</div>
							)}

							{/* Row 3: text + CTA left, image right (highlights[3]) */}
							{property.highlights[3] && (
								<div className="flex items-center justify-end gap-12 px-[90px]">
									<div className="flex w-96 shrink-0 flex-col gap-12">
										<div>
											{property.highlights[3].title && (
												<span className="font-sans text-[15px] font-bold leading-[23px] tracking-[0.1em] text-foreground">
													{property.highlights[3].title}<br />
												</span>
											)}
											{property.highlights[3].body && (
												<span className="font-sans text-[15px] leading-[23px] tracking-[0.1em] text-foreground">
													<br />{property.highlights[3].body}
												</span>
											)}
										</div>
										{property.menuCta?.url && (
											<a
												href={property.menuCta.url}
												target="_blank"
												rel="noopener noreferrer"
												className="font-sans text-[12px] font-semibold tracking-[0.3em] text-foreground underline underline-offset-2 hover:opacity-70"
											>
												{property.menuCta.label || "WHAT'S ON THE MENU?"}
											</a>
										)}
									</div>
									<div className="relative h-80 w-[788px] shrink-0 overflow-hidden rounded-tl-[5px] rounded-bl-[5px]">
										{property.highlights[3].image?.asset && (
											<div className="absolute left-0 top-0 h-80 w-full overflow-hidden">
												<Img image={property.highlights[3].image} width={788} alt={property.highlights[3].image.alt ?? ''} className="h-full w-full object-cover" />
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

				{/* 7. Causes */}
				{(property.causeHeadline ||
					property.causeBody ||
					(property.causeImages && property.causeImages.length > 0)) && (
					<section className="bg-primary py-16 text-primary-foreground">
						<div className="px-[90px] max-[820px]:px-[18px]">
							{property.causeHeadline && (
								<h2 className="mb-6 font-heading italic text-[30px] tracking-[0.3em] text-primary-foreground">
									{property.causeHeadline}
								</h2>
							)}
							{property.causeBody && (
								<div className="mb-10 max-w-2xl text-primary-foreground text-[15px] leading-[23px] tracking-[0.1em]">
									<PortableText value={property.causeBody} />
								</div>
							)}
							{property.causeImages && property.causeImages.length > 0 && (
								<div className="grid gap-6 md:grid-cols-2">
									{property.causeImages.slice(0, 2).map((img, i) => (
										<div key={i} className="overflow-hidden rounded-2xl">
											<Img
												image={img}
												width={700}
												alt={img.alt ?? ''}
												className="h-64 w-full object-cover"
											/>
										</div>
									))}
								</div>
							)}
						</div>
					</section>
				)}

				{/* 8. Reviews */}
				{cappedReviews.length > 0 && (
					<section className="px-[90px] max-[820px]:px-[18px] py-16">
						<h2 className="mb-10 font-heading italic text-[30px] tracking-[0.3em]">What Our Guests Say</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{cappedReviews.map((review, i) => (
								<div key={i} className="space-y-3 rounded-2xl border p-6">
									{review.rating != null && (
										<div className="flex gap-1">
											{Array.from({ length: review.rating }).map((_, j) => (
												<span key={j} className="text-accent">
													★
												</span>
											))}
										</div>
									)}
									{review.body && (
										<p className="leading-relaxed text-foreground italic">
											&ldquo;{review.body}&rdquo;
										</p>
									)}
									<div className="text-sm text-muted">
										{review.guestName && (
											<p className="font-semibold">{review.guestName}</p>
										)}
										{review.guestLocation && <p>{review.guestLocation}</p>}
										{review.stayDate && <p>{review.stayDate}</p>}
									</div>
								</div>
							))}
						</div>
					</section>
				)}

				{/* 9. Bottom CTA */}
				<section className="bg-primary py-20 text-center">
					{property.ctaHeadline && (
						<h2 className="mb-8 font-heading italic text-[30px] tracking-[0.3em] text-primary-foreground">
							{property.ctaHeadline}
						</h2>
					)}
					<a
						href="#booking"
						className="inline-block rounded-[5px] bg-accent px-10 py-4 font-bold text-accent-foreground tracking-[0.3em] uppercase transition hover:bg-accent/90"
					>
						FIND AVAILABILITY
					</a>
				</section>
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
		metaDescription || property?.shortDescription || site?.seo?.metaDescription
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
