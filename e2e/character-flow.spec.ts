import { test, expect } from '@playwright/test'

test('crea personaje y aparece en el listado', async ({ page }) => {
  const msTitle = `e2e-char-ms-${Date.now()}`
  const name = `e2e-char-${Date.now()}`

  // getAllCharacters() solo lista personajes ligados a manuscritos del usuario;
  // sin manuscrito el alta en BD funciona pero el personaje no aparece en la UI.
  await page.goto('/manuscripts/new?from=manuscripts')
  await expect(page.getByRole('heading', { name: 'Nuevo Manuscrito' })).toBeVisible({
    timeout: 15_000,
  })
  await page.getByLabel(/^title \*$/i).fill(msTitle)
  await page.locator('#status').selectOption('Draft')
  await page.getByRole('button', { name: /^save$/i }).click()
  await expect(page).toHaveURL(/\/manuscripts$/, { timeout: 25_000 })

  await page.goto('/characters/new?from=characters')
  await expect(page.getByRole('heading', { name: 'New Character' })).toBeVisible({
    timeout: 15_000,
  })

  await page.locator('#name').fill(name)
  await page.locator('#id_manuscript').scrollIntoViewIfNeeded()
  await page.locator('#id_manuscript').selectOption({ label: msTitle }, { timeout: 20_000 })
  await page.getByRole('button', { name: /^save$/i }).click()

  await expect(page).toHaveURL(/\/characters$/, { timeout: 25_000 })
  await expect(page.getByRole('heading', { name: /your characters/i })).toBeVisible({
    timeout: 15_000,
  })
  await expect(
    page.getByRole('button', { name: `View character: ${name}` }),
  ).toBeVisible({ timeout: 20_000 })
})
