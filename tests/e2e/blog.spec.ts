import { test } from '@playwright/test'

test.describe('Blog index page (/blog)', () => {
  test.skip('renders post cards grid with at least one card')
  test.skip('no raw <img> tags — all images use next/image')
})
