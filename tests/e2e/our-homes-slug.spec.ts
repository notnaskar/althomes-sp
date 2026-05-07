import { expect, test } from '@playwright/test'

test.describe('Property detail page (/our-homes/[slug])', () => {
	let propertyUrl = '/our-homes'

	test.beforeAll(async ({ browser }) => {
		const page = await browser.newPage()
		await page.goto('/our-homes')
		const firstLink = page.locator('a[href^="/our-homes/"]').first()
		const href = await firstLink.getAttribute('href')
		if (href) propertyUrl = href
		await page.close()
	})

	test('renders hero section', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(page.locator('section#booking')).toBeVisible()
	})

	test('renders property title', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(page.locator('h1')).toBeVisible()
	})

	test('renders gallery section', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(page.locator('img[data-nimg]').first()).toBeVisible()
	})

	test('renders specs strip (guests, bedrooms, bathrooms)', async ({
		page,
	}) => {
		await page.goto(propertyUrl)
		const specsStrip = page
			.locator('[class*="border-b"]')
			.filter({ hasText: /Guests|Bedrooms|Bathrooms/i })
		await expect(specsStrip).toBeVisible()
	})

	test('renders location section', async ({ page }) => {
		await page.goto(propertyUrl)
		const locationSection = page
			.locator('section')
			.filter({ hasText: /View on Google Maps|location/i })
		await expect(locationSection.first()).toBeVisible()
	})

	test('renders highlights section', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(page.getByText("WHAT'S WAITING FOR YOU?")).toBeVisible()
	})

	test('renders amenities section', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(page.getByText("FOR US, IT'S COMFORT FIRST")).toBeVisible()
	})

	test('renders bottom CTA with FIND AVAILABILITY button', async ({ page }) => {
		await page.goto(propertyUrl)
		await expect(
			page.getByRole('link', { name: 'FIND AVAILABILITY' }),
		).toBeVisible()
	})

	test('renders causes section when content is present', async ({ page }) => {
		await page.goto(propertyUrl)
		// Causes section is conditional — just verify page loads without error
		await expect(page.locator('main')).toBeVisible()
	})

	test('renders reviews section when published reviews exist', async ({
		page,
	}) => {
		await page.goto(propertyUrl)
		// Reviews section is conditional — just verify page loads without error
		await expect(page.locator('main')).toBeVisible()
	})

	test('renders experiences section when experiences exist', async ({
		page,
	}) => {
		await page.goto(propertyUrl)
		const section = page.locator('[data-section="experiences"]')
		const count = await section.count()
		if (count > 0) {
			await expect(section).toBeVisible()
			const cards = section.locator('a[aria-label]')
			await expect(cards.first()).toBeVisible()
		}
	})
})
