import { getProperty, getSite } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from 'next-sanity'

type Props = {
	params: Promise<{ slug: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
	const { slug } = await params
	const property = await getProperty(slug)
	
	if (!property) notFound()

	return (
		<main className="flex-1">
			{/* Hero */}
			<section className="relative h-[60vh] min-h-[400px]">
				{property.heroImage && (
					<img
						src={urlFor(property.heroImage).width(1920).url()}
						alt={property.heroImage.alt || property.title || ''}
						className="absolute inset-0 w-full h-full object-cover"
					/>
				)}
				<div className="absolute inset-0 bg-black/30 flex items-center justify-center">
					<h1 className="text-white text-5xl font-bold">{property.title}</h1>
				</div>
			</section>

			{/* Content Placeholder */}
			<section className="container py-20">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
					<div className="lg:col-span-2 space-y-12">
						{property.description && (
							<div className="prose max-w-none">
								<PortableText value={property.description as any} />
							</div>
						)}
						
						{/* Specs Strip */}
						<div className="flex gap-8 py-6 border-y border-gray-200">
							{property.maxGuests && <div><strong>Guests:</strong> {property.maxGuests}</div>}
							{property.bedrooms && <div><strong>Bedrooms:</strong> {property.bedrooms}</div>}
							{property.bathrooms && <div><strong>Bathrooms:</strong> {property.bathrooms}</div>}
						</div>
					</div>

					{/* Booking Widget Placeholder */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
							<h3 className="text-xl font-bold mb-4">Book Your Stay</h3>
							<div id="rw-widget-placeholder" className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded">
								<p className="text-gray-500 italic">RentalWise Widget Coming Soon</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params
	const [property, site] = await Promise.all([getProperty(slug), getSite()])
	
	const { metaTitle, metaDescription, ogImage } = property?.seo ?? {}
	const title = metaTitle || `${property?.title || 'Property'} | AltHomes`
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
