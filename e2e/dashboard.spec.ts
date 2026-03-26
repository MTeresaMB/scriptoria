import { test, expect } from '@playwright/test'

test.describe('dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
      timeout: 15_000,
    })
  })

  test('muestra acciones rápidas y rejilla de estadísticas', async ({ page }) => {
    await expect(page.getByRole('button', { name: /new manuscript/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new character/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new chapter/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /new note/i })).toBeVisible()

    await expect(page.getByText('Manuscripts').first()).toBeVisible()
    await expect(page.getByText('Total Words').first()).toBeVisible()
  })

  test('New Manuscript del dashboard abre el formulario', async ({ page }) => {
    await page.getByRole('button', { name: /new manuscript/i }).first().click()
    await expect(page).toHaveURL(/\/manuscripts\/new/)
    await expect(page.getByRole('heading', { name: 'Nuevo Manuscrito' })).toBeVisible()
  })

  test('New Note del dashboard abre el formulario', async ({ page }) => {
    await page.getByRole('button', { name: /new note/i }).first().click()
    await expect(page).toHaveURL(/\/notes\/new/)
    await expect(page.getByRole('heading', { name: 'New Note' })).toBeVisible()
  })
})
