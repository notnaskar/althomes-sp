import { getOurHomesPage, getSite, getAllProperties } from '@/sanity/lib/data'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'

export default async function OurHomesPage() {
	const [page, properties] = await Promise.all([getOurHomesPage(), getAllProperties()])
	if (!page) notFound()

	return (
		<main className="flex-1">
			<section className="container py-20">
				<h1 className="text-4xl font-bold mb-12 text-center">{page.heroHeadline || 'Our Homes'}</h1>
				
				<div className="grid grid-cols-1 gap-12">
					{properties?.map((property) => (
						<Link 
							key={property._id} 
							href={`/our-homes/${property.slug}`}
							className="group grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
						>
							<div className="overflow-hidden rounded-2xl aspect-[4/3]">
								{property.cardThumbnail && (
									<Image
										src={urlFor(property.cardThumbnail).width(1200).url()}
										alt={property.cardThumbnail.alt || property.title || ''}
										width={1200}
										height={900}
										className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
									/>
								)}
							</div>
							<div className="space-y-4">
								<h2 className="text-3xl font-bold">{property.title}</h2>
								<p className="text-lg text-gray-600">{property.shortDescription}</p>
								<div className="flex gap-4 text-sm font-medium">
									{property.bedrooms && <span>{property.bedrooms} Bedrooms</span>}
									{property.maxGuests && <span>Up to {property.maxGuests} Guests</span>}
								</div>
								<div className="pt-4">
									<span className="inline-block px-6 py-3 bg-black text-white rounded-full font-bold group-hover:bg-yellow-600 transition">
										Explore Property
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</section>
		</main>
	)
}

export async function generateMetadata(): Promise<Metadata> {
	const [page, site] = await Promise.all([getOurHomesPage(), getSite()])
	const { metaTitle, metaDescription } = page?.seo ?? {}

	return {
		title: metaTitle || 'Our Homes | AltHomes',
		description: metaDescription || site?.seo?.metaDescription,
	}
}
