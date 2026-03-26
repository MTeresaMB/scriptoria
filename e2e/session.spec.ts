import { test, expect } from '@playwright/test'

test('logout vuelve a la pantalla de login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 15_000,
  })

  await page.getByRole('button', { name: /^logout$/i }).click()

  await expect(page).toHaveURL(/\/login$/, { timeout: 15_000 })
  await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
})
