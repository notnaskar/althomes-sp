import { expect, test } from '@playwright/test'

test.describe('Join Us page (/join-us)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/join-us')
	})

	test('renders heroHeadline', async ({ page }) => {
		await expect(page.locator('h1')).toBeVisible()
	})

	test('renders pullQuote text', async ({ page }) => {
		await expect(page.locator('p.italic').first()).toBeVisible()
	})

	test('renders bullet points list', async ({ page }) => {
		await expect(page.locator('ul li').first()).toBeVisible()
	})

	test('renders body paragraph text', async ({ page }) => {
		await expect(page.locator('p.text-lg').first()).toBeVisible()
	})

	test('form has NAME input', async ({ page }) => {
		await expect(page.locator('#pf-name')).toBeVisible()
	})

	test('form has EMAIL input', async ({ page }) => {
		await expect(page.locator('#pf-email')).toBeVisible()
	})

	test('form has PHONE NUMBER input', async ({ page }) => {
		await expect(page.locator('#pf-phone')).toBeVisible()
	})

	test('form has LOCATION input', async ({ page }) => {
		await expect(page.locator('#pf-location')).toBeVisible()
	})

	test('form has TYPE OF PROPERTY input', async ({ page }) => {
		await expect(page.locator('#pf-propertyType')).toBeVisible()
	})

	test('form has STATUS input', async ({ page }) => {
		await expect(page.locator('#pf-status')).toBeVisible()
	})

	test('form has OPERATIONAL input', async ({ page }) => {
		await expect(page.locator('#pf-operational')).toBeVisible()
	})

	test('form has PHOTOS / WEBSITE LINK input', async ({ page }) => {
		await expect(page.locator('#pf-photosLink')).toBeVisible()
	})

	test('form has privacy consent checkbox', async ({ page }) => {
		await expect(page.locator('#pf-consent')).toBeVisible()
	})

	test('submitting empty form shows required field errors', async ({
		page,
	}) => {
		await page.locator('button[type="submit"]').click()
		await expect(page.locator('p.text-red-600').first()).toBeVisible()
	})

	test('submitting valid form shows success state', async ({ page }) => {
		await page.fill('#pf-name', 'Test Owner')
		await page.fill('#pf-email', 'owner@example.com')
		await page.fill('#pf-phone', '+44 7700 900001')
		await page.fill('#pf-location', 'London, UK')
		await page.fill('#pf-propertyType', 'Villa')
		await page.fill('#pf-status', 'Available')
		await page.fill('#pf-operational', 'Yes')
		await page.fill('#pf-photosLink', 'https://example.com/photos')
		await page.check('#pf-consent')
		await page.locator('button[type="submit"]').click()
		await expect(page.getByText(/thank you/i)).toBeVisible()
	})
})
