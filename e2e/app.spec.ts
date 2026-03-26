import { test, expect } from '@playwright/test'

test.describe('navegación autenticada', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('sidebar: Manuscripts', async ({ page }) => {
    await page.getByRole('link', { name: /manuscripts/i }).click()
    await expect(page).toHaveURL(/\/manuscripts$/)
    await expect(
      page.getByRole('heading', { name: /your manuscripts|no manuscripts yet/i }),
    ).toBeVisible()
  })

  test('sidebar: Characters', async ({ page }) => {
    await page.getByRole('link', { name: /characters/i }).click()
    await expect(page).toHaveURL(/\/characters$/)
    await expect(
      page.getByRole('heading', { name: /your characters|no characters yet/i }),
    ).toBeVisible()
  })

  test('sidebar: Chapters', async ({ page }) => {
    await page.getByRole('link', { name: /chapters/i }).click()
    await expect(page).toHaveURL(/\/chapters$/)
    await expect(
      page.getByRole('heading', { name: /your chapters|no chapters yet/i }),
    ).toBeVisible()
  })

  test('sidebar: Notes', async ({ page }) => {
    await page.getByRole('link', { name: /^notes$/i }).click()
    await expect(page).toHaveURL(/\/notes$/)
    await expect(
      page.getByRole('heading', { name: /your notes|no notes yet/i }),
    ).toBeVisible()
  })

  test('sidebar: Editor', async ({ page }) => {
    await page.getByRole('link', { name: /editor/i }).click()
    await expect(page).toHaveURL(/\/editor/)
    await expect(
      page.getByText(/select a manuscript|select a chapter|dashboard/i).first(),
    ).toBeVisible({ timeout: 15_000 })
  })

  test('sidebar: Profile', async ({ page }) => {
    await page.getByRole('link', { name: /^profile$/i }).click()
    await expect(page).toHaveURL(/\/profile$/)
    await expect(
      page.getByRole('heading', { level: 1, name: /^profile$/i }),
    ).toBeVisible()
  })
})
