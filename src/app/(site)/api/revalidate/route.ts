import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

const ALLOWED_TYPES = new Set([
	'site',
	'homePage',
	'ourHomesPage',
	'altWayPage',
	'experiencesPage',
	'joinUsPage',
	'contactPage',
	'legalPage',
	'property',
	'experience',
	'review',
	'amenity',
	'blog.post',
	'redirect',
])

type WebhookPayload = {
	_type: string
	_id?: string
	slug?: string | null
}

export async function POST(req: NextRequest) {
	const secret = process.env.REVALIDATE_SECRET
	if (!secret) {
		return NextResponse.json(
			{ message: 'REVALIDATE_SECRET is not configured' },
			{ status: 500 },
		)
	}

	let parsed
	try {
		parsed = await parseBody<WebhookPayload>(req, secret, true)
	} catch (err) {
		return NextResponse.json(
			{ message: 'Invalid webhook payload', error: String(err) },
			{ status: 400 },
		)
	}

	const { isValidSignature, body } = parsed
	if (isValidSignature === false) {
		return NextResponse.json(
			{ message: 'Invalid signature' },
			{ status: 401 },
		)
	}

	if (!body?._type) {
		return NextResponse.json(
			{ message: 'Bad payload: missing _type' },
			{ status: 400 },
		)
	}

	if (!ALLOWED_TYPES.has(body._type)) {
		return NextResponse.json(
			{ message: 'Ignored: type not in allowlist', type: body._type },
			{ status: 200 },
		)
	}

	const tags = [body._type]
	if (body.slug) tags.push(`${body._type}:${body.slug}`)

	for (const tag of tags) revalidateTag(tag, 'default')

	return NextResponse.json({
		revalidated: true,
		tags,
		now: Date.now(),
	})
}
