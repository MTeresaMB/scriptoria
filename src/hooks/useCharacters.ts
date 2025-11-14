import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Character } from '../types'

export const useCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadingCharacters()
  }, [])

  const loadingCharacters = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('date_created', { ascending: false })

      if (error) throw error
      setCharacters(data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return { characters, isLoading, error, loadingCharacters: loadingCharacters }
}