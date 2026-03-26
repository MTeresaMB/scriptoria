import { test, expect } from '@playwright/test'

test('crea manuscrito y aparece en el listado', async ({ page }) => {
  const title = `e2e-ms-${Date.now()}`

  await page.goto('/manuscripts/new?from=manuscripts')
  await expect(page.getByRole('heading', { name: 'Nuevo Manuscrito' })).toBeVisible({
    timeout: 15_000,
  })

  await page.getByLabel(/^title \*$/i).fill(title)
  await page.locator('#status').selectOption('Draft')
  await page.getByRole('button', { name: /^save$/i }).click()

  await expect(page).toHaveURL(/\/manuscripts$/, { timeout: 25_000 })
  await expect(page.getByText(title, { exact: true })).toBeVisible({ timeout: 15_000 })
})
