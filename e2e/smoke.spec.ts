import { test, expect } from '@playwright/test'

test.describe('smoke público', () => {
  test('la página de login muestra el formulario', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByRole('button', { name: /^Login$/ })).toBeVisible()
  })

  test('registro muestra el formulario', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('sin sesión, la raíz redirige al login', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible()
  })
})
