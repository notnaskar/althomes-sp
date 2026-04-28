import { expect, test } from '@playwright/test'

test.describe('Contact page (/contact)', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/contact')
	})

	test('renders hero section', async ({ page }) => {
		await expect(page.locator('main section').first()).toBeVisible()
	})

	test('renders phone number as tel: link', async ({ page }) => {
		await expect(page.locator('a[href^="tel:"]')).toBeVisible()
	})

	test('renders email as mailto: link', async ({ page }) => {
		await expect(page.locator('a[href^="mailto:"]')).toBeVisible()
	})

	test('renders office address', async ({ page }) => {
		const officeSection = page.locator('span', { hasText: 'Office' })
		await expect(officeSection).toBeVisible()
	})

	test('renders social links (Facebook and Instagram) from site settings', async ({
		page,
	}) => {
		await expect(page.getByRole('link', { name: 'Facebook' })).toBeVisible()
		await expect(page.getByRole('link', { name: 'Instagram' })).toBeVisible()
	})

	test('form has Name input', async ({ page }) => {
		await expect(page.locator('#cf-name')).toBeVisible()
	})

	test('form has Email input', async ({ page }) => {
		await expect(page.locator('#cf-email')).toBeVisible()
	})

	test('form has Phone input', async ({ page }) => {
		await expect(page.locator('#cf-phone')).toBeVisible()
	})

	test('form has Message textarea', async ({ page }) => {
		await expect(page.locator('#cf-message')).toBeVisible()
	})

	test('form has privacy consent checkbox', async ({ page }) => {
		await expect(page.locator('#cf-consent')).toBeVisible()
	})

	test('submitting empty form shows required field errors', async ({
		page,
	}) => {
		await page.locator('button[type="submit"]').click()
		await expect(page.locator('p.text-red-600').first()).toBeVisible()
	})

	test('submitting valid form shows success state', async ({ page }) => {
		await page.fill('#cf-name', 'Test User')
		await page.fill('#cf-email', 'test@example.com')
		await page.fill('#cf-phone', '+44 7700 900000')
		await page.fill(
			'#cf-message',
			'Hello, I have a question about your properties.',
		)
		await page.check('#cf-consent')
		await page.locator('button[type="submit"]').click()
		await expect(page.getByText(/thanks for reaching out/i)).toBeVisible()
	})
})
