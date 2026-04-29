import { vi } from 'vitest'

export const sanityFetch = vi.fn(async (_args: unknown) => ({ data: {} }))

export const SanityLive = vi.fn(() => null)

export async function sanityFetchLive<T>(
	args: any,
) {
	const { data } = await sanityFetch({
		...args,
	})
	return data as T
}
