import { expect, test } from '@playwright/test'

test.describe('Experiences page (/experiences)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/experiences')
	})

	test('renders heroHeadline', async ({ page }) => {
		await expect(page.locator('h1')).toBeVisible()
	})

	test('renders discount badge text', async ({ page }) => {
		const badge = page.locator('span.rounded-full.bg-yellow-400')
		await expect(badge).toBeVisible()
	})

	test('renders at least one experience card', async ({ page }) => {
		await expect(page.locator('a[href^="/experiences/"]').first()).toBeVisible()
	})

	test('renders property filter chips', async ({ page }) => {
		// Filter chips include at least the "All" button
		await expect(page.getByRole('button', { name: 'All' })).toBeVisible()
	})

	test('renders bottom CTA', async ({ page }) => {
		await expect(page.getByRole('link', { name: 'BOOK A STAY' })).toBeVisible()
	})
})
