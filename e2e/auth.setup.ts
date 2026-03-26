import path from 'node:path'
import fs from 'node:fs'
import { test as setup, expect } from '@playwright/test'

const authDir = path.join(process.cwd(), 'playwright/.auth')
const authFile = path.join(authDir, 'user.json')

function isRootPath(url: string): boolean {
  try {
    const { pathname } = new URL(url)
    return pathname === '/' || pathname === ''
  } catch {
    return false
  }
}

setup('autenticar y guardar sesión', async ({ page }) => {
  setup.setTimeout(120_000)

  const email = process.env.E2E_EMAIL?.trim()
  const password = process.env.E2E_PASSWORD
  if (!email || !password) {
    throw new Error('Definir E2E_EMAIL y E2E_PASSWORD para el proyecto setup')
  }

  const viteUrl = process.env.VITE_SUPABASE_URL ?? ''
  if (
    viteUrl.includes('placeholder') ||
    viteUrl === 'https://placeholder.supabase.co'
  ) {
    throw new Error(
      'VITE_SUPABASE_URL apunta al placeholder: el login irá al proyecto equivocado. ' +
        'Exporta VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (o usa un .env que Vite lea) ' +
        'antes de npm run test:e2e, igual que para npm run dev.',
    )
  }

  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: /^Login$/ }).click()

  try {
    await page.waitForURL((url: URL) => isRootPath(url.toString()), { timeout: 90_000 })
  } catch {
    let hint = ''
    let urlNote = 'URL desconocida (contexto cerrado por timeout)'
    try {
      urlNote = page.url()
      const stillOnLogin = urlNote.includes('/login')
      const redMsg = page.locator('form p.text-red-400').first()
      if ((await redMsg.count()) > 0) {
        hint = (await redMsg.textContent())?.trim() ?? ''
      }
      if (!hint && stillOnLogin) {
        hint =
          'Sin mensaje rojo en el formulario: revisa email/contraseña, confirmación de email en Supabase (Auth) ' +
          'y que Vite use el mismo proyecto (.env con VITE_SUPABASE_URL) que esa cuenta.'
      }
      if (!hint) {
        hint =
          'Si el test moría a los 30s antes: era el timeout global del test, no el login. ' +
          'Ahora el setup tiene 120s. Si sigue fallando, mira red/CORS o que el dev server use tu .env real.'
      }
    } catch {
      hint =
        'No se pudo leer la página (probablemente el test llegó al timeout y Playwright cerró el navegador).'
    }
    throw new Error(`Login E2E no redirigió a la raíz a tiempo. Última URL: ${urlNote}. ${hint}`)
  }

  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({
    timeout: 20_000,
  })

  fs.mkdirSync(authDir, { recursive: true })
  await page.context().storageState({ path: authFile })
})
