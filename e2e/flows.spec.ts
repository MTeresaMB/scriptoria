import { test, expect } from '@playwright/test'

test.describe('flujo crear nota', () => {
  test('crea nota y aparece en el listado', async ({ page }) => {
    const title = `e2e-note-${Date.now()}`

    await page.goto('/notes/new?from=notes')
    await expect(page.getByRole('heading', { name: 'New Note' })).toBeVisible({
      timeout: 15_000,
    })

    await page.getByLabel(/^title \*$/i).fill(title)
    await page.locator('#content').fill('Contenido generado por E2E.')
    await page.getByRole('button', { name: /^save$/i }).click()

    await expect(page).toHaveURL(/\/notes$/, { timeout: 20_000 })
    await expect(page.getByText(title, { exact: true })).toBeVisible({ timeout: 15_000 })
  })
})
