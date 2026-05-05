import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockQuery = vi.fn()

vi.mock('@/lib/pms-client', () => ({
  getPmsClient: () => ({ property: { query: mockQuery } }),
}))

const { getCachedAvailableIds } = await import('@/lib/availability-cache')

describe('getCachedAvailableIds', () => {
  beforeEach(() => mockQuery.mockReset())

  it('calls property.query with correct availability daterange and guests', async () => {
    mockQuery.mockResolvedValue({ response: { data: [] } })
    await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(mockQuery).toHaveBeenCalledWith({
      availability: {
        daterange: { start: '2030-06-01', end: '2030-06-07' },
        guests: 2,
        ignore: [],
      },
    })
  })

  it('returns external_id strings from response', async () => {
    mockQuery.mockResolvedValue({
      response: { data: [{ external_id: 'prop-1' }, { external_id: 'prop-2' }] },
    })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual(['prop-1', 'prop-2'])
  })

  it('filters out null and undefined external_ids', async () => {
    mockQuery.mockResolvedValue({
      response: {
        data: [
          { external_id: 'prop-1' },
          { external_id: null },
          { external_id: undefined },
          { external_id: 'prop-3' },
        ],
      },
    })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual(['prop-1', 'prop-3'])
  })

  it('returns empty array when response data is empty', async () => {
    mockQuery.mockResolvedValue({ response: { data: [] } })
    const ids = await getCachedAvailableIds('2030-06-01', '2030-06-07', 2)
    expect(ids).toEqual([])
  })
})
