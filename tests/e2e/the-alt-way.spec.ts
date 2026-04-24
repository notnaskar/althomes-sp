import { test, expect } from '@playwright/test'

test.describe('The Alt Way page (/the-alt-way)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/the-alt-way')
  })

  test('renders heroHeadline', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible()
  })

  test('renders mission section with missionText', async ({ page }) => {
    // Mission split: two-column section after hero
    const missionSection = page.locator('section').nth(1)
    await expect(missionSection).toBeVisible()
  })

  test('renders value props section with at least one item', async ({ page }) => {
    const valuePropCard = page.locator('div.rounded-2xl.bg-white.border').first()
    await expect(valuePropCard).toBeVisible()
  })

  test('renders promise CTA section', async ({ page }) => {
    const promiseCTALink = page.getByRole('link', { name: /our.homes/i })
    await expect(promiseCTALink.first()).toBeVisible()
  })

  test('renders stats bar with at least one stat', async ({ page }) => {
    const statValue = page.locator('p.text-5xl.font-bold').first()
    await expect(statValue).toBeVisible()
  })

  test('renders reviews carousel', async ({ page }) => {
    await expect(page.getByText('What Our Guests Say')).toBeVisible()
  })

  test('renders bottom CTA', async ({ page }) => {
    const bottomCTA = page.getByRole('link', { name: /experiences/i }).last()
    await expect(bottomCTA).toBeVisible()
  })
})
