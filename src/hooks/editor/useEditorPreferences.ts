import { useState, useCallback } from 'react'
import {
  readLocalStorage,
  removeLocalStorage,
  writeLocalStorageJson,
} from '@/utils/localStorage'

export type EditorTheme = 'dark' | 'light' | 'sepia'
export type EditorFont = 'sans-serif' | 'serif' | 'monospace'
export type ColumnWidth = 'narrow' | 'medium' | 'wide' | 'full'

interface EditorPreferences {
  theme: EditorTheme
  font: EditorFont
  fontSize: number
  lineHeight: number
  columnWidth: ColumnWidth
  wordWrap: boolean
  lineNumbers: boolean
  typewriterMode: boolean
  paragraphSpacing: number
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold'
  autoSaveInterval: number // in seconds, 0 = manual only
  wordCountGoal: number // 0 = disabled
  focusMode: boolean // highlight current line
  guideLine: boolean // horizontal line under focused paragraph
}

const DEFAULT_PREFERENCES: EditorPreferences = {
  theme: 'dark',
  font: 'sans-serif',
  fontSize: 16,
  lineHeight: 1.75,
  columnWidth: 'medium',
  wordWrap: true,
  lineNumbers: false,
  typewriterMode: false,
  paragraphSpacing: 1.5,
  fontWeight: 'normal',
  autoSaveInterval: 30, // 30 seconds
  wordCountGoal: 0, // disabled by default
  focusMode: false,
  guideLine: false,
}

const STORAGE_KEY = 'editor_preferences'

export const useEditorPreferences = () => {
  const [preferences, setPreferences] = useState<EditorPreferences>(() => {
    const raw = readLocalStorage(STORAGE_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    try {
      const parsed = JSON.parse(raw) as Partial<EditorPreferences>
      return { ...DEFAULT_PREFERENCES, ...parsed }
    } catch (error) {
      console.error('Error loading editor preferences:', error)
      return DEFAULT_PREFERENCES
    }
  })

  const updatePreference = useCallback(<K extends keyof EditorPreferences>(
    key: K,
    value: EditorPreferences[K]
  ) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value }
      const ok = writeLocalStorageJson(STORAGE_KEY, updated)
      if (!ok) {
        console.error('Error saving editor preferences')
      }
      return updated
    })
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES)
    const ok = removeLocalStorage(STORAGE_KEY)
    if (!ok) {
      console.error('Error resetting editor preferences')
    }
  }, [])

  return {
    preferences,
    updatePreference,
    resetPreferences,
  }
}
