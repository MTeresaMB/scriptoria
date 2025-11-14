import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Manuscript } from '../types'


export const useManuscripts = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    refetch()
  }, [])

  const refetch = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('manuscript')
        .select('*')
        .order('date_created', { ascending: false })

      if (error) throw error
      setManuscripts(data || [])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return { manuscripts, isLoading, error, refetch }
}