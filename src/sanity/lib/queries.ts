import { defineQuery } from 'groq'

export const SITE_QUERY = defineQuery(`*[_type == 'site' && _id == 'site'][0]`)

export const HOME_PAGE_QUERY = defineQuery(`*[_type == 'homePage' && _id == 'homePage'][0]{
	...,
	heroImage { asset->, alt },
	navLabels[]{
		...,
		target->{ _type, "slug": slug.current }
	}
}`)

export const OUR_HOMES_PAGE_QUERY = defineQuery(`*[_type == 'ourHomesPage' && _id == 'ourHomesPage'][0]`)
export const ALT_WAY_PAGE_QUERY = defineQuery(`*[_type == 'altWayPage' && _id == 'altWayPage'][0]`)
export const EXPERIENCES_PAGE_QUERY = defineQuery(`*[_type == 'experiencesPage' && _id == 'experiencesPage'][0]`)
export const JOIN_US_PAGE_QUERY = defineQuery(`*[_type == 'joinUsPage' && _id == 'joinUsPage'][0]`)
export const CONTACT_PAGE_QUERY = defineQuery(`*[_type == 'contactPage' && _id == 'contactPage'][0]`)

export const LEGAL_PAGE_QUERY = defineQuery(`*[_type == 'legalPage' && slug.current == $slug][0]`)
export const ALL_LEGAL_PAGES_QUERY = defineQuery(`*[_type == 'legalPage' && defined(slug.current)].slug.current`)

export const ALL_PROPERTIES_QUERY = defineQuery(`*[_type == 'property' && status != 'hidden'] | order(displayOrder asc)`)
export const PROPERTY_QUERY = defineQuery(`*[_type == 'property' && slug.current == $slug][0]`)
export const ALL_PROPERTY_SLUGS_QUERY = defineQuery(`*[_type == 'property' && defined(slug.current)].slug.current`)

export const ALL_POSTS_QUERY = defineQuery(`*[_type == 'blog.post'] | order(publishDate desc)`)
export const POST_BY_SLUG_QUERY = defineQuery(`*[_type == 'blog.post' && metadata.slug.current == $slug][0]`)
