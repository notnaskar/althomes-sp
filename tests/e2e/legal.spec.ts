import { expect, test } from '@playwright/test'

test.describe('Legal page (/[slug])', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/privacy-policy')
	})

	test('renders displayTitle', async ({ page }) => {
		await expect(page.locator('h1')).toBeVisible()
	})

	test('renders body content', async ({ page }) => {
		await expect(
			page.locator('.prose, article, [class*="prose"]').first(),
		).toBeVisible()
	})
})
