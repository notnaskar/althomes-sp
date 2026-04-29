import { headers } from 'next/headers'

export function isAllowedOrigin(source: string | null): boolean {
	const base = process.env.NEXT_PUBLIC_BASE_URL
	if (!base) return true
	if (!source) return false
	return source.startsWith(base)
}

export async function checkOrigin(): Promise<boolean> {
	const h = await headers()
	const source = h.get('origin') ?? h.get('referer')
	return isAllowedOrigin(source)
}

export async function getClientIp(): Promise<string> {
	const h = await headers()
	return h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
}
