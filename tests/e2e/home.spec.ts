import { expect, test } from '@playwright/test'

test.describe('Home page (/)', () => {
	test('renders heroHeadline text', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('h1')).toBeVisible()
	})

	test('renders 6 navLabel buttons with correct links', async ({ page }) => {
		await page.goto('/')
		const navLinks = page.locator('nav a')
		await expect(navLinks).toHaveCount(6)
	})

	test('nav links navigate to correct pages', async ({ page }) => {
		await page.goto('/')
		const firstNavLink = page.locator('nav a').first()
		const href = await firstNavLink.getAttribute('href')
		expect(href).toBeTruthy()
		await firstNavLink.click()
		await expect(page).not.toHaveURL('/')
	})
})
