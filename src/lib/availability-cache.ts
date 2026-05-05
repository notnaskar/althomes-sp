import { unstable_cache } from 'next/cache'
import { getPmsClient } from './pms-client'

async function fetchAvailableIds(
  checkIn: string,
  checkOut: string,
  guests: number,
): Promise<string[]> {
  const res = await getPmsClient().property.search({
    daterange: { start: checkIn, end: checkOut },
    guests,
  })
  // PaginatedResponse shape: res.response.data is T[]
  return (res.response.data ?? [])
    .map((p: { external_id?: string | null }) => p.external_id)
    .filter((id): id is string => typeof id === 'string')
}

// unstable_cache includes JSON.stringify(args) in the invocation key —
// each unique (checkIn, checkOut, guests) tuple gets its own cache entry.
export const getCachedAvailableIds = unstable_cache(fetchAvailableIds, ['availability'], {
  revalidate: 120,
})
