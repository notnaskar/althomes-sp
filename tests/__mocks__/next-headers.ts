import { vi } from 'vitest'

const mockHeadersInstance = {
	get: vi.fn().mockReturnValue(null),
}

export const headers = vi.fn().mockResolvedValue(mockHeadersInstance)
export const cookies = vi.fn().mockResolvedValue({
	get: vi.fn().mockReturnValue(null),
})
