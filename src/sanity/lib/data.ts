import { sanityFetchLive } from './live'
import {
	SITE_QUERY,
	HOME_PAGE_QUERY,
	OUR_HOMES_PAGE_QUERY,
	ALT_WAY_PAGE_QUERY,
	EXPERIENCES_PAGE_QUERY,
	JOIN_US_PAGE_QUERY,
	CONTACT_PAGE_QUERY,
	LEGAL_PAGE_QUERY,
	ALL_PROPERTIES_QUERY,
	PROPERTY_QUERY,
	ALL_POSTS_QUERY,
	POST_BY_SLUG_QUERY,
	ALL_EXPERIENCES_QUERY,
} from './queries'
import type {
	SITE_QUERY_RESULT,
	HOME_PAGE_QUERY_RESULT,
	OUR_HOMES_PAGE_QUERY_RESULT,
	ALT_WAY_PAGE_QUERY_RESULT,
	EXPERIENCES_PAGE_QUERY_RESULT,
	JOIN_US_PAGE_QUERY_RESULT,
	CONTACT_PAGE_QUERY_RESULT,
	LEGAL_PAGE_QUERY_RESULT,
	ALL_PROPERTIES_QUERY_RESULT,
	PROPERTY_QUERY_RESULT,
	ALL_POSTS_QUERY_RESULT,
	POST_BY_SLUG_QUERY_RESULT,
	ALL_EXPERIENCES_QUERY_RESULT,
} from '@/sanity/types'

export async function getSite() {
	return await sanityFetchLive<SITE_QUERY_RESULT>({
		query: SITE_QUERY,
	})
}

export async function getHomePage() {
	return await sanityFetchLive<HOME_PAGE_QUERY_RESULT>({
		query: HOME_PAGE_QUERY,
	})
}

export async function getOurHomesPage() {
	return await sanityFetchLive<OUR_HOMES_PAGE_QUERY_RESULT>({
		query: OUR_HOMES_PAGE_QUERY,
	})
}

export async function getAltWayPage() {
	return await sanityFetchLive<ALT_WAY_PAGE_QUERY_RESULT>({
		query: ALT_WAY_PAGE_QUERY,
	})
}

export async function getExperiencesPage() {
	return await sanityFetchLive<EXPERIENCES_PAGE_QUERY_RESULT>({
		query: EXPERIENCES_PAGE_QUERY,
	})
}

export async function getJoinUsPage() {
	return await sanityFetchLive<JOIN_US_PAGE_QUERY_RESULT>({
		query: JOIN_US_PAGE_QUERY,
	})
}

export async function getContactPage() {
	return await sanityFetchLive<CONTACT_PAGE_QUERY_RESULT>({
		query: CONTACT_PAGE_QUERY,
	})
}

export async function getLegalPage(slug: string) {
	return await sanityFetchLive<LEGAL_PAGE_QUERY_RESULT>({
		query: LEGAL_PAGE_QUERY,
		params: { slug },
	})
}

export async function getAllProperties() {
	return await sanityFetchLive<ALL_PROPERTIES_QUERY_RESULT>({
		query: ALL_PROPERTIES_QUERY,
	})
}

export async function getProperty(slug: string) {
	return await sanityFetchLive<PROPERTY_QUERY_RESULT>({
		query: PROPERTY_QUERY,
		params: { slug },
	})
}

export async function getAllPosts() {
	return await sanityFetchLive<ALL_POSTS_QUERY_RESULT>({
		query: ALL_POSTS_QUERY,
	})
}

export async function getPostBySlug(slug: string) {
	return await sanityFetchLive<POST_BY_SLUG_QUERY_RESULT>({
		query: POST_BY_SLUG_QUERY,
		params: { slug },
	})
}

export async function getAllExperiences() {
	return await sanityFetchLive<ALL_EXPERIENCES_QUERY_RESULT>({
		query: ALL_EXPERIENCES_QUERY,
	})
}
