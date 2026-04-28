import type { Metadata } from 'next'
import { PortableText } from 'next-sanity'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildLodgingSchema } from '@/lib/schema-org'
import { getProperty, getSite } from '@/sanity/lib/data'
import { urlFor } from '@/sanity/lib/image'
import Img from '@/ui/img'

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
				<section
					id="booking"
					className="relative w-full overflow-hidden bg-gray-900"
				>
					{property.heroImage && (
						<Img
							image={property.heroImage}
							width={1440}
							loading="eager"
							alt={property.heroImage.alt ?? ''}
							className="h-[70vh] w-full object-cover opacity-70"
						/>
					)}
					<div className="absolute inset-0 flex flex-col items-end justify-end p-8 md:p-16">
						<div className="w-full rounded-2xl bg-white p-6 shadow-xl md:max-w-sm">
							<h2 className="mb-2 text-xl font-bold">{property.title}</h2>
							{property.tagline && (
								<p className="mb-4 text-sm text-gray-500">{property.tagline}</p>
							)}
							<div className="flex min-h-[200px] items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50">
								<p className="px-4 text-center text-xs text-gray-400">
									BOOKING WIDGET — RentalWise
								</p>
							</div>
						</div>
					</div>
					<div className="absolute top-8 left-8 md:left-16">
						{property.title && (
							<h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
								{property.title}
							</h1>
						)}
					</div>
				</section>

				{/* 2. Intro */}
				<section className="container space-y-10 py-16">
					{/* Property type + specs strip */}
					<div className="flex flex-wrap items-center gap-6 border-b border-gray-200 py-4">
						{property.propertyType && (
							<span className="rounded-full bg-black px-4 py-1 text-sm font-semibold text-white">
								{property.propertyType}
							</span>
						)}
						{property.maxGuests != null && (
							<span className="text-sm font-medium text-gray-700">
								{property.maxGuests} Guests
							</span>
						)}
						{property.bedrooms != null && (
							<span className="text-sm font-medium text-gray-700">
								{property.bedrooms} Bedrooms
							</span>
						)}
						{property.bathrooms != null && (
							<span className="text-sm font-medium text-gray-700">
								{property.bathrooms} Bathrooms
							</span>
						)}
					</div>

					{/* Description */}
					{property.description && (
						<div className="prose prose-lg max-w-none">
							<PortableText value={property.description} />
						</div>
					)}

					{/* Amenity icon strip */}
					{property.amenities && property.amenities.length > 0 && (
						<div className="flex flex-wrap gap-3">
							{property.amenities.map((amenity, i) => (
								<span
									key={i}
									className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium"
								>
									{amenity.icon && <span>{amenity.icon}</span>}
									{amenity.name}
								</span>
							))}
						</div>
					)}

					{/* Pull quote */}
					{property.pullQuote && (
						<blockquote className="border-l-4 border-black pl-6 text-2xl font-semibold text-gray-700 italic">
							&ldquo;{property.pullQuote}&rdquo;
						</blockquote>
					)}

					{/* Gallery */}
					{property.gallery && property.gallery.length > 0 && (
						<div className="overflow-x-auto">
							<div className="flex gap-4 pb-2">
								{property.gallery.map((img, i) => (
									<div
										key={i}
										className="flex-shrink-0 overflow-hidden rounded-xl"
									>
										<Img
											image={img}
											width={500}
											alt={img.alt ?? ''}
											className="h-64 w-auto object-cover"
										/>
									</div>
								))}
							</div>
						</div>
					)}
				</section>

				{/* 3. Location */}
				{(property.locationHeadline ||
					property.locationDescription ||
					property.location?.googleMapsUrl) && (
					<section className="bg-gray-50 py-16">
						<div className="container space-y-6">
							{property.locationHeadline && (
								<h2 className="text-3xl font-bold">
									{property.locationHeadline}
								</h2>
							)}
							{property.locationDescription && (
								<p className="max-w-2xl text-lg text-gray-700">
									{property.locationDescription}
								</p>
							)}
							{property.location?.googleMapsUrl && (
								<a
									href={property.location.googleMapsUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
								>
									View on Google Maps
								</a>
							)}
						</div>
					</section>
				)}

				{/* 4. Highlights */}
				{property.highlights && property.highlights.length > 0 && (
					<section className="container py-16">
						<h2 className="mb-10 text-3xl font-bold">
							WHAT&rsquo;S WAITING FOR YOU?
						</h2>
						<div className="space-y-10">
							{property.highlights.map((highlight, i) => (
								<div key={i} className="grid items-center gap-8 md:grid-cols-2">
									<div>
										{highlight.title && (
											<h3 className="mb-3 text-2xl font-bold">
												{highlight.title}
											</h3>
										)}
										{highlight.body && (
											<p className="leading-relaxed text-gray-700">
												{highlight.body}
											</p>
										)}
									</div>
									{highlight.image && (
										<div className="overflow-hidden rounded-xl">
											<Img
												image={highlight.image}
												width={600}
												alt={highlight.image.alt ?? ''}
												className="h-auto w-full object-cover"
											/>
										</div>
									)}
								</div>
							))}
						</div>
					</section>
				)}

				{/* 5. Experiences */}
				{cappedExperiences.length > 0 && (
					<section className="bg-gray-50 py-16">
						<div className="container">
							<h2 className="mb-10 text-3xl font-bold">
								EXPERIENCES NEAR {property.title?.toUpperCase()}
							</h2>
							<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
								{cappedExperiences.map((exp) => (
									<Link
										key={exp.slug ?? exp.title ?? ''}
										href={`/experiences/${exp.slug ?? ''}`}
										className="group block overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
									>
										{exp.image && (
											<div className="overflow-hidden">
												<Img
													image={exp.image}
													width={500}
													alt={exp.image.alt ?? ''}
													className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
												/>
											</div>
										)}
										<div className="p-5">
											{exp.title && (
												<h3 className="text-lg font-bold">{exp.title}</h3>
											)}
											{exp.description && (
												<p className="mt-2 line-clamp-2 text-sm text-gray-600">
													{exp.description}
												</p>
											)}
										</div>
									</Link>
								))}
							</div>
							<div className="mt-8 text-center">
								<Link
									href="/experiences"
									className="inline-block rounded-full border-2 border-black px-8 py-3 font-bold text-black transition hover:bg-black hover:text-white"
								>
									View All Experiences
								</Link>
							</div>
						</div>
					</section>
				)}

				{/* 6. Amenities + House Rules */}
				{((property.amenities && property.amenities.length > 0) ||
					property.houseRulesTeaser ||
					property.houseRules) && (
					<section className="container py-16">
						<h2 className="mb-10 text-3xl font-bold">
							FOR US, IT&rsquo;S COMFORT FIRST
						</h2>
						{property.amenities && property.amenities.length > 0 && (
							<div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
								{property.amenities.map((amenity, i) => (
									<div
										key={i}
										className="flex items-center gap-3 rounded-xl border p-4"
									>
										{amenity.icon && (
											<span className="text-xl">{amenity.icon}</span>
										)}
										{amenity.name && (
											<span className="font-medium">{amenity.name}</span>
										)}
									</div>
								))}
							</div>
						)}
						{(property.houseRulesTeaser || property.houseRules) && (
							<details className="overflow-hidden rounded-xl border">
								<summary className="cursor-pointer px-6 py-4 text-lg font-bold transition hover:bg-gray-50">
									{property.houseRulesTeaser ?? 'House Rules'}
								</summary>
								{property.houseRules && (
									<div className="prose max-w-none border-t px-6 py-4">
										<PortableText value={property.houseRules} />
									</div>
								)}
							</details>
						)}
					</section>
				)}

				{/* 7. Causes */}
				{(property.causeHeadline ||
					property.causeBody ||
					(property.causeImages && property.causeImages.length > 0)) && (
					<section className="bg-gray-900 py-16 text-white">
						<div className="container">
							{property.causeHeadline && (
								<h2 className="mb-6 text-3xl font-bold">
									{property.causeHeadline}
								</h2>
							)}
							{property.causeBody && (
								<div className="prose prose-invert mb-10 max-w-2xl">
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
					<section className="container py-16">
						<h2 className="mb-10 text-3xl font-bold">What Our Guests Say</h2>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{cappedReviews.map((review, i) => (
								<div key={i} className="space-y-3 rounded-2xl border p-6">
									{review.rating != null && (
										<div className="flex gap-1">
											{Array.from({ length: review.rating }).map((_, j) => (
												<span key={j} className="text-yellow-400">
													★
												</span>
											))}
										</div>
									)}
									{review.body && (
										<p className="leading-relaxed text-gray-700 italic">
											&ldquo;{review.body}&rdquo;
										</p>
									)}
									<div className="text-sm text-gray-500">
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
				<section className="bg-black py-20 text-center text-white">
					{property.ctaHeadline && (
						<h2 className="mb-8 text-3xl font-bold md:text-4xl">
							{property.ctaHeadline}
						</h2>
					)}
					<a
						href="#booking"
						className="inline-block rounded-full bg-white px-10 py-4 font-bold text-black transition hover:bg-gray-100"
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
