import { newPmsClient } from '@onemineral/pms-js-sdk'

let _client: ReturnType<typeof newPmsClient> | null = null

export function getPmsClient() {
  if (!_client) {
    _client = newPmsClient({
      baseURL: process.env.RENTALWISE_API_HOST!,
      tokenProvider: { get: () => process.env.RENTALWISE_API_TOKEN! },
    })
  }
  return _client
}
