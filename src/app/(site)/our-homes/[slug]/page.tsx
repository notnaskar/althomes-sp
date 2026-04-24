import { getProperty, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { PortableText } from 'next-sanity'
import Img from '@/ui/img'
import { urlFor } from '@/sanity/lib/image'

type Props = {
	params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
	const { slug } = await params
	const property = await getProperty(slug)
	if (!property) notFound()

	const cappedExperiences = property.experiences?.slice(0, property.experiencesMaxShown ?? 6) ?? []
	const cappedReviews = property.reviews?.slice(0, property.reviewsMaxShown ?? 20) ?? []

	return (
		<main className="flex-1">
			{/* 1. Hero */}
			<section id="booking" className="relative w-full overflow-hidden bg-gray-900">
				{property.heroImage && (
					<Img
						image={property.heroImage}
						width={1440}
						loading="eager"
						alt={property.heroImage.alt ?? ''}
						className="w-full h-[70vh] object-cover opacity-70"
					/>
				)}
				<div className="absolute inset-0 flex flex-col items-end justify-end p-8 md:p-16">
					<div className="w-full md:max-w-sm bg-white rounded-2xl p-6 shadow-xl">
						<h2 className="text-xl font-bold mb-2">{property.title}</h2>
						{property.tagline && (
							<p className="text-sm text-gray-500 mb-4">{property.tagline}</p>
						)}
						<div className="min-h-[200px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
							<p className="text-xs text-gray-400 text-center px-4">
								BOOKING WIDGET — RentalWise
							</p>
						</div>
					</div>
				</div>
				<div className="absolute top-8 left-8 md:left-16">
					{property.title && (
						<h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
							{property.title}
						</h1>
					)}
				</div>
			</section>

			{/* 2. Intro */}
			<section className="container py-16 space-y-10">
				{/* Property type + specs strip */}
				<div className="flex flex-wrap items-center gap-6 py-4 border-b border-gray-200">
					{property.propertyType && (
						<span className="rounded-full bg-black text-white px-4 py-1 text-sm font-semibold">
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
					<blockquote className="border-l-4 border-black pl-6 text-2xl font-semibold italic text-gray-700">
						&ldquo;{property.pullQuote}&rdquo;
					</blockquote>
				)}

				{/* Gallery */}
				{property.gallery && property.gallery.length > 0 && (
					<div className="overflow-x-auto">
						<div className="flex gap-4 pb-2">
							{property.gallery.map((img, i) => (
								<div key={i} className="flex-shrink-0 overflow-hidden rounded-xl">
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
			{(property.locationHeadline || property.locationDescription || property.location?.googleMapsUrl) && (
				<section className="bg-gray-50 py-16">
					<div className="container space-y-6">
						{property.locationHeadline && (
							<h2 className="text-3xl font-bold">{property.locationHeadline}</h2>
						)}
						{property.locationDescription && (
							<p className="text-lg text-gray-700 max-w-2xl">{property.locationDescription}</p>
						)}
						{property.location?.googleMapsUrl && (
							<a
								href={property.location.googleMapsUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="inline-block px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition"
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
					<h2 className="text-3xl font-bold mb-10">WHAT&rsquo;S WAITING FOR YOU?</h2>
					<div className="space-y-10">
						{property.highlights.map((highlight, i) => (
							<div key={i} className="grid gap-8 md:grid-cols-2 items-center">
								<div>
									{highlight.title && (
										<h3 className="text-2xl font-bold mb-3">{highlight.title}</h3>
									)}
									{highlight.body && (
										<p className="text-gray-700 leading-relaxed">{highlight.body}</p>
									)}
								</div>
								{highlight.image && (
									<div className="overflow-hidden rounded-xl">
										<Img
											image={highlight.image}
											width={600}
											alt={highlight.image.alt ?? ''}
											className="w-full h-auto object-cover"
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
						<h2 className="text-3xl font-bold mb-10">
							EXPERIENCES NEAR {property.title?.toUpperCase()}
						</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
							{cappedExperiences.map((exp) => (
								<Link
									key={exp.slug ?? exp.title ?? ''}
									href={`/experiences/${exp.slug ?? ''}`}
									className="group block overflow-hidden rounded-xl border bg-white hover:shadow-md transition"
								>
									{exp.image && (
										<div className="overflow-hidden">
											<Img
												image={exp.image}
												width={500}
												alt={exp.image.alt ?? ''}
												className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
											/>
										</div>
									)}
									<div className="p-5">
										{exp.title && (
											<h3 className="font-bold text-lg">{exp.title}</h3>
										)}
										{exp.description && (
											<p className="mt-2 text-sm text-gray-600 line-clamp-2">
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
								className="inline-block px-8 py-3 border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition"
							>
								View All Experiences
							</Link>
						</div>
					</div>
				</section>
			)}

			{/* 6. Amenities + House Rules */}
			{(property.amenities && property.amenities.length > 0 || property.houseRulesTeaser || property.houseRules) && (
				<section className="container py-16">
					<h2 className="text-3xl font-bold mb-10">FOR US, IT&rsquo;S COMFORT FIRST</h2>
					{property.amenities && property.amenities.length > 0 && (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
							{property.amenities.map((amenity, i) => (
								<div key={i} className="flex items-center gap-3 p-4 rounded-xl border">
									{amenity.icon && <span className="text-xl">{amenity.icon}</span>}
									{amenity.name && <span className="font-medium">{amenity.name}</span>}
								</div>
							))}
						</div>
					)}
					{(property.houseRulesTeaser || property.houseRules) && (
						<details className="border rounded-xl overflow-hidden">
							<summary className="px-6 py-4 font-bold text-lg cursor-pointer hover:bg-gray-50 transition">
								{property.houseRulesTeaser ?? 'House Rules'}
							</summary>
							{property.houseRules && (
								<div className="px-6 py-4 border-t prose max-w-none">
									<PortableText value={property.houseRules} />
								</div>
							)}
						</details>
					)}
				</section>
			)}

			{/* 7. Causes */}
			{(property.causeHeadline || property.causeBody || (property.causeImages && property.causeImages.length > 0)) && (
				<section className="bg-gray-900 text-white py-16">
					<div className="container">
						{property.causeHeadline && (
							<h2 className="text-3xl font-bold mb-6">{property.causeHeadline}</h2>
						)}
						{property.causeBody && (
							<div className="prose prose-invert max-w-2xl mb-10">
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
											className="w-full h-64 object-cover"
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
					<h2 className="text-3xl font-bold mb-10">What Our Guests Say</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						{cappedReviews.map((review, i) => (
							<div key={i} className="rounded-2xl border p-6 space-y-3">
								{review.rating != null && (
									<div className="flex gap-1">
										{Array.from({ length: review.rating }).map((_, j) => (
											<span key={j} className="text-yellow-400">★</span>
										))}
									</div>
								)}
								{review.body && (
									<p className="text-gray-700 italic leading-relaxed">
										&ldquo;{review.body}&rdquo;
									</p>
								)}
								<div className="text-sm text-gray-500">
									{review.guestName && <p className="font-semibold">{review.guestName}</p>}
									{review.guestLocation && <p>{review.guestLocation}</p>}
									{review.stayDate && <p>{review.stayDate}</p>}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			{/* 9. Bottom CTA */}
			<section className="bg-black text-white py-20 text-center">
				{property.ctaHeadline && (
					<h2 className="text-3xl md:text-4xl font-bold mb-8">{property.ctaHeadline}</h2>
				)}
				<a
					href="#booking"
					className="inline-block px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition"
				>
					FIND AVAILABILITY
				</a>
			</section>
		</main>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	const { metaTitle, metaDescription, ogImage } = property?.seo ?? {}
	const title = metaTitle || `${property?.title ?? 'Property'} | AltHomes`
	const description = metaDescription || property?.shortDescription || site?.seo?.metaDescription
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
