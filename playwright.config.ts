import path from 'node:path'
import { defineConfig, devices } from '@playwright/test'
import type { Project } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 5173)
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`

/**
 * No inyectar VITE_* placeholder en webServer.env: Vite da prioridad a process.env sobre `.env`.
 * Eso provocaba "Failed to fetch" en login E2E aunque existiera `.env` con el proyecto real.
 * Local: Vite lee `.env` en la raíz. CI: el workflow define VITE_* en el paso (heredado al hijo).
 */

const hasE2eAuth = Boolean(
  process.env.E2E_EMAIL?.trim() && process.env.E2E_PASSWORD,
)

const authStatePath = path.join(process.cwd(), 'playwright/.auth/user.json')

const desktopChrome = {
  ...devices['Desktop Chrome'],
  viewport: { width: 1280, height: 720 },
}

const projects: Project[] = [
  {
    name: 'chromium-public',
    testMatch: /smoke\.spec\.ts$/,
    use: desktopChrome,
  },
]

if (hasE2eAuth) {
  projects.push({
    name: 'setup',
    testMatch: /auth\.setup\.ts$/,
    /** Login + sesión Supabase + primer paint del dashboard pueden superar 30s por defecto */
    timeout: 120_000,
  })
  projects.push({
    name: 'chromium-authenticated',
    dependencies: ['setup'],
    testMatch:
      /(app|flows|dashboard|manuscript-flow|character-flow|chapter-flow|shortcuts|session)\.spec\.ts$/,
    use: {
      ...desktopChrome,
      storageState: authStatePath,
    },
  })
}

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects,
  webServer: {
    command: `npm run dev -- --port ${PORT} --host 127.0.0.1`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})
