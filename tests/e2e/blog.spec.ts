import { test, expect } from '@playwright/test'

test.describe('Blog index page (/blog)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('renders post cards grid with at least one card', async ({ page }) => {
    await expect(page.locator('article, [class*="card"], a[href*="/blog/"]').first()).toBeVisible()
  })

  test('no raw <img> tags — all images use next/image', async ({ page }) => {
    const rawImgs = await page.locator('img:not([data-nimg])').count()
    expect(rawImgs).toBe(0)
  })
})
