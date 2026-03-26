import React, { useLayoutEffect, useState } from 'react'
import { readLocalStorage, writeLocalStorage } from '@/utils/localStorage'
import { ThemeContext, type Theme } from './theme'

const STORAGE_KEY = 'scriptoria_theme'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const stored = readLocalStorage(STORAGE_KEY)
    return stored === 'light' ? 'light' : 'dark'
  })

  useLayoutEffect(() => {
    void writeLocalStorage(STORAGE_KEY, theme)
    // Tailwind `dark:` variants apply when `.dark` is on an ancestor (typically <html>)
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = (t: Theme) => setThemeState(t)
  const toggleTheme = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
