import 'server-only'
import { newPmsClient } from '@onemineral/pms-js-sdk'

let _client: ReturnType<typeof newPmsClient> | null = null

export function getPmsClient() {
	if (!_client) {
		const token = process.env.RENTALWISE_API_TOKEN!
		_client = newPmsClient({
			baseURL: `${process.env.RENTALWISE_API_HOST}/rest`,
			tokenProvider: { get: () => token },
		})
	}
	return _client
}
