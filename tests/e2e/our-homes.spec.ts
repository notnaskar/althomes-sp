import { test, expect } from '@playwright/test'

test.describe('Our Homes page (/our-homes)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/our-homes')
  })

  test('renders heroHeadline', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('renders at least one property card', async ({ page }) => {
    await expect(page.locator('a[href^="/our-homes/"]').first()).toBeVisible()
  })

  test('availability search form has checkIn input', async ({ page }) => {
    await expect(page.locator('#av-checkIn')).toBeVisible()
  })

  test('availability search form has checkOut input', async ({ page }) => {
    await expect(page.locator('#av-checkOut')).toBeVisible()
  })

  test('availability search form has guests input', async ({ page }) => {
    await expect(page.locator('#av-guests')).toBeVisible()
  })

  test('submitting availability form with no dates shows validation error', async ({ page }) => {
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('p.text-red-600').first()).toBeVisible()
  })
})
