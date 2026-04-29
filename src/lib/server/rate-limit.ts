import 'server-only'

interface Entry {
	count: number
	resetAt: number
}

const stores = new Map<string, Map<string, Entry>>()

export function checkRateLimit(
	key: string,
	ip: string,
	limit = 3,
	windowMs = 15 * 60 * 1000,
): boolean {
	if (!stores.has(key)) stores.set(key, new Map())
	const store = stores.get(key)!
	const now = Date.now()
	const entry = store.get(ip)

	if (!entry || now > entry.resetAt) {
		store.set(ip, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (entry.count >= limit) return false

	entry.count++
	return true
}

export function _resetForTesting(): void {
	stores.clear()
}
