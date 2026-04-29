import { vi } from 'vitest'

// Set environment variables for tests
process.env.SANITY_API_READ_TOKEN = 'test-token'
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = '0uc19iuo'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'

// Mock server-only to prevent errors when imported from test environment
vi.mock('server-only', () => ({}))

// Mock next/headers to prevent server-only import errors in test environment
vi.mock('next/headers', () => ({
	headers: vi.fn().mockResolvedValue({
		get: vi.fn().mockReturnValue(null),
	}),
	cookies: vi.fn().mockResolvedValue({
		get: vi.fn().mockReturnValue(null),
	}),
}))

// Mock next-sanity/live to avoid server component errors
vi.mock('next-sanity/live', () => ({
	defineLive: vi.fn(() => ({
		sanityFetch: vi.fn(async (query: any) => ({ data: {} })),
		SanityLive: vi.fn(() => null),
	})),
}))
