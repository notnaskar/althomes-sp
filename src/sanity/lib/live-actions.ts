'use server'

import { draftMode } from 'next/headers'
import { sanityFetch } from './live'

export async function sanityFetchLive<T>(
	args: Parameters<typeof sanityFetch>[0],
) {
	const { data } = await sanityFetch({
		perspective: (await draftMode()).isEnabled ? 'previewDrafts' : 'published',
		...args,
	})

	return data as T
}
