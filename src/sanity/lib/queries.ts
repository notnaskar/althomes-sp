import { groq } from 'next-sanity'

export const SITE_QUERY = groq`*[_type == 'site'][0]`

export const HOME_PAGE_QUERY = groq`*[_type == 'homePage'][0]{
	...,
	navLabels[]{
		...,
		target->{ _type, "slug": slug.current }
	}
}`

export const OUR_HOMES_PAGE_QUERY = groq`*[_type == 'ourHomesPage'][0]`
export const ALT_WAY_PAGE_QUERY = groq`*[_type == 'altWayPage'][0]`
export const EXPERIENCES_PAGE_QUERY = groq`*[_type == 'experiencesPage'][0]`
export const JOIN_US_PAGE_QUERY = groq`*[_type == 'joinUsPage'][0]`
export const CONTACT_PAGE_QUERY = groq`*[_type == 'contactPage'][0]`

export const LEGAL_PAGE_QUERY = groq`*[_type == 'legalPage' && slug.current == $slug][0]`
export const ALL_LEGAL_PAGES_QUERY = groq`*[_type == 'legalPage' && defined(slug.current)].slug.current`

export const ALL_PROPERTIES_QUERY = groq`*[_type == 'property' && status != 'hidden'] | order(displayOrder asc)`
export const PROPERTY_QUERY = groq`*[_type == 'property' && slug.current == $slug][0]`
export const ALL_PROPERTY_SLUGS_QUERY = groq`*[_type == 'property' && defined(slug.current)].slug.current`

export const ALL_POSTS_QUERY = groq`*[_type == 'blog.post'] | order(publishDate desc)`
export const POST_BY_SLUG_QUERY = groq`*[_type == 'blog.post' && metadata.slug.current == $slug][0]`
