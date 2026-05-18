import { defineQuery } from 'groq'

export const SITE_QUERY = defineQuery(`*[_type == 'site' && _id == 'site'][0]`)

export const HOME_PAGE_QUERY =
	defineQuery(`*[_type == 'homePage' && _id == 'homePage'][0]{
	...,
	heroImage { asset->, alt },
	navLabels[]{
		...,
		target->{ _type, "slug": slug.current }
	}
}`)

export const OUR_HOMES_PAGE_QUERY =
	defineQuery(`*[_type == 'ourHomesPage' && _id == 'ourHomesPage'][0]{
	heroHeadline,
	heroImage { asset->, alt },
	ctaQuestion,
	experiencesCtaLabel,
	ctaBackground { asset->, alt },
	seo
}`)

export const ALT_WAY_PAGE_QUERY =
	defineQuery(`*[_type == 'altWayPage' && _id == 'altWayPage'][0]{
	...,
	heroBackground { asset->, alt },
	missionImage { asset->, alt },
	missionDecorImage { asset->, alt },
	valuePropEditorialImage { asset->, alt },
	valuePropEditorialDecorLeft { asset->, alt },
	valuePropEditorialDecorRight { asset->, alt },
	valuePropSecondaryImage { asset->, alt },
	promiseBackground { asset->, alt },
	promiseCTADecorLeft { asset->, alt },
	promiseCTADecorRight { asset->, alt },
	bottomCTABackground { asset->, alt },
	statsBackground { asset->, alt },
	reviews[]->{
		guestName, rating, body, guestLocation, stayDate,
		guestPhoto { asset->, alt },
		"propertyTitle": property->title
	}
}`)

export const EXPERIENCES_PAGE_QUERY =
	defineQuery(`*[_type == 'experiencesPage' && _id == 'experiencesPage'][0]{
	...,
	heroBackground { asset->, alt },
	heroFlower { asset->, alt },
	decorBasket { asset->, alt },
	decorStars { asset->, alt },
	decorDaisy { asset->, alt },
	decorGalaxy { asset->, alt },
	ctaBackground { asset->, alt }
}`)

export const JOIN_US_PAGE_QUERY =
	defineQuery(`*[_type == 'joinUsPage' && _id == 'joinUsPage'][0]{
	...,
	heroImage { asset->, alt },
	propertyImage { asset->, alt },
	heroDecorFlower { asset-> },
	contentDecorImage { asset-> },
	formDecorBg { asset-> }
}`)

export const CONTACT_PAGE_QUERY =
	defineQuery(`*[_type == 'contactPage' && _id == 'contactPage'][0]{
	...,
	heroImage { asset->, alt },
	mobileHeroAsset { asset->, alt },
	backgroundCloudAsset { asset->, alt },
	sideFlowerAsset { asset->, alt }
}`)

export const LEGAL_PAGE_QUERY = defineQuery(
	`*[_type == 'legalPage' && slug.current == $slug][0] {
		...,
		ctaBackground { asset->, alt }
	}`,
)
export const ALL_LEGAL_PAGES_QUERY = defineQuery(
	`*[_type == 'legalPage' && defined(slug.current)].slug.current`,
)

export const ALL_PROPERTIES_QUERY =
	defineQuery(`*[_type == 'property' && status != 'hidden'] | order(displayOrder asc){
	_id,
	title,
	"slug": slug.current,
	tagline,
	shortDescription,
	cardThumbnail { asset->, alt },
	heroImage { asset->, alt },
	showcaseSecondaryImage { asset->, alt },
	showcaseDecorImage { asset->, alt },
	showcaseDecorTop,
	showcaseDecorRight,
	showcaseDecorBottom,
	showcaseDecorLeft,
	showcaseDecorWidth,
	showcaseDecorHeight,
	showcaseDecorRotation,
	showcaseSecondaryDecorImage { asset->, alt },
	showcaseSecondaryDecorTop,
	showcaseSecondaryDecorRight,
	showcaseSecondaryDecorBottom,
	showcaseSecondaryDecorLeft,
	showcaseSecondaryDecorWidth,
	showcaseSecondaryDecorHeight,
	showcaseSecondaryDecorRotation,
	pullQuote,
	locationHeadline,
	cardAmenities,
	propertyType,
	priceFrom,
	maxGuests,
	bedrooms,
	bathrooms,
	status,
	displayOrder,
	rentalwisePropertyId
}`)

export const PROPERTY_QUERY =
	defineQuery(`*[_type == 'property' && slug.current == $slug][0]{
	...,
	heroImage { asset->, alt },
	detailCoverImage { asset->, alt },
	gallery[]{ asset->, alt },
	cardThumbnail { asset->, alt },
	amenities[]->{ name, icon },
	amenitiesSectionImage { asset->, alt },
	experiences[]->{
		title,
		description,
		image { asset->, alt }
	},
	experiencesBgImage { asset->, alt, hotspot, crop },
	windDownHighlight{
		title,
		body,
		image { asset->, alt, hotspot, crop },
		decorImage { asset-> },
		secondaryDecorImage { asset-> }
	},
	wakeUpHighlight{
		title,
		body,
		image { asset->, alt, hotspot, crop }
	},
	hostedWithHeartHighlight{
		title,
		body
	},
	symphonyHighlight{
		title,
		body,
		image { asset->, alt, hotspot, crop }
	},
	causeImages[]{ asset->, alt },
	ctaBackground { asset->, alt },
	faqs[]{ question, answer },
	location,
	"reviews": *[_type=='review' && references(^._id) ] | order(stayDate desc) [0..20]{
		guestName, rating, body, guestLocation, stayDate,
		guestPhoto { asset->, alt },
		"propertyTitle": property->title
	}
}`)

export const ALL_PROPERTY_SLUGS_QUERY = defineQuery(
	`*[_type == 'property' && defined(slug.current)].slug.current`,
)

export const ALL_POSTS_QUERY = defineQuery(
	`*[_type == 'blog.post'] | order(publishDate desc)`,
)
export const POST_BY_SLUG_QUERY = defineQuery(
	`*[_type == 'blog.post' && metadata.slug.current == $slug][0]`,
)

export const ALL_EXPERIENCES_QUERY =
	defineQuery(`*[_type == 'experience'] | order(displayOrder asc){
	_id,
	title,
	description,
	image { asset->, alt },
	"propertyIds": properties[]->._id
}`)
