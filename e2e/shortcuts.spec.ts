import { platform } from 'node:os'
import { test, expect } from '@playwright/test'

test('atajo de teclado abre el modal de búsqueda global', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 15_000,
  })

  const mod = platform() === 'darwin' ? 'Meta' : 'Control'
  await page.keyboard.press(`${mod}+KeyK`)
  await expect(
    page.getByPlaceholder(/search manuscripts, chapters, characters, notes/i),
  ).toBeVisible()
})
