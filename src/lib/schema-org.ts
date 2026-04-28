import type { PROPERTY_QUERY_RESULT, SITE_QUERY_RESULT } from '@/sanity/types'

interface GeoCoordinates {
  '@type': 'GeoCoordinates'
  latitude: number
  longitude: number
}

interface PostalAddress {
  '@type': 'PostalAddress'
  streetAddress: string | null | undefined
  addressLocality: string | null | undefined
  addressRegion: string | null | undefined
  postalCode: string | null | undefined
  addressCountry: string
}

interface LocationFeatureSpecification {
  '@type': 'LocationFeatureSpecification'
  name: string | null
  value: true
}

interface AggregateRating {
  '@type': 'AggregateRating'
  ratingValue: string
  reviewCount: number
  bestRating: number
  worstRating: number
}

interface LodgingBusinessSchema {
  '@context': 'https://schema.org'
  '@type': 'LodgingBusiness'
  name: string | null | undefined
  url: string
  telephone: string | null | undefined
  priceRange: string | null | undefined
  numberOfRooms: number | null | undefined
  petsAllowed: true
  checkinTime: string | null | undefined
  checkoutTime: string | null | undefined
  amenityFeature: LocationFeatureSpecification[]
  address?: PostalAddress
  geo?: GeoCoordinates
  aggregateRating?: AggregateRating
}

export function buildLodgingSchema(
  property: NonNullable<PROPERTY_QUERY_RESULT>,
  site: NonNullable<SITE_QUERY_RESULT>,
  baseUrl: string,
): LodgingBusinessSchema {
  const reviews = property.reviews ?? []
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null

  const schema: LodgingBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.title,
    url: `${baseUrl}/our-homes/${property.slug?.current}#booking`,
    telephone: site.contactPhone ?? undefined,
    priceRange: property.priceFrom ?? undefined,
    numberOfRooms: property.bedrooms ?? undefined,
    petsAllowed: true,
    checkinTime: site.checkinTime ?? undefined,
    checkoutTime: site.checkoutTime ?? undefined,
    amenityFeature: (property.amenities ?? []).map((a) => ({
      '@type': 'LocationFeatureSpecification' as const,
      name: a.name,
      value: true as const,
    })),
  }

  if (property.location) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: property.location.streetAddress ?? property.location.displayLocation,
      addressLocality: property.location.addressLocality ?? undefined,
      addressRegion: property.location.addressRegion ?? undefined,
      postalCode: property.location.postalCode ?? undefined,
      addressCountry: property.location.addressCountry ?? 'IN',
    }

    if (property.location.lat && property.location.lng) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: property.location.lat,
        longitude: property.location.lng,
      }
    }
  }

  if (avgRating !== null && reviews.length > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}
