import { test, expect } from '@playwright/test'

test('crea manuscrito y capítulo vinculado', async ({ page }) => {
  const msTitle = `e2e-ch-ms-${Date.now()}`
  const chapterTitle = `e2e-ch-${Date.now()}`

  await page.goto('/manuscripts/new?from=manuscripts')
  await expect(page.getByRole('heading', { name: 'Nuevo Manuscrito' })).toBeVisible({
    timeout: 15_000,
  })
  await page.getByLabel(/^title \*$/i).fill(msTitle)
  await page.locator('#status').selectOption('Draft')
  await page.getByRole('button', { name: /^save$/i }).click()
  await expect(page).toHaveURL(/\/manuscripts$/, { timeout: 25_000 })

  await page.goto('/chapters/new?from=chapters')
  await expect(page.getByRole('heading', { name: 'New Chapter' })).toBeVisible({
    timeout: 15_000,
  })

  await page.locator('#name_chapter').fill(chapterTitle)
  // Las <option> de un <select> nativo suelen considerarse "hidden" en Playwright;
  // selectOption espera a que exista la opción.
  await page.locator('#id_manuscript').selectOption({ label: msTitle }, { timeout: 20_000 })

  await page.getByRole('button', { name: /^save$/i }).click()
  await expect(page).toHaveURL(/\/chapters$/, { timeout: 25_000 })
  await expect(page.getByText(chapterTitle, { exact: true })).toBeVisible({ timeout: 15_000 })
})
