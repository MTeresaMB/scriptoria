import { useCallback, useEffect, useState } from 'react'
import type { CharactersRow } from '@/lib/respository/charactersRepository'
import {
  deleteCharacter,
  getAllCharacters,
  getCharacterById,
  getCharactersByManuscriptId,
} from '@/lib/respository/charactersRepository'

export const useCharacters = () => {
  const [characters, setCharacters] = useState<CharactersRow[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getCharacters = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getAllCharacters()
    if (error) {
      setError(error.message || 'Error loading characters')
      setCharacters([])
    } else {
      setCharacters(data || [])
    }
    setIsLoading(false)
  }, [])

  const remove = useCallback(
    async (id: number) => {
      const { error } = await deleteCharacter(id)
      if (error) throw error
      await getCharacters()
    },
    [getCharacters],
  )

  useEffect(() => {
    void getCharacters()
  }, [getCharacters])

  const fetchCharacterById = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getCharacterById(id)
    if (error) {
      setError(error.message || 'Error loading character')
      setCharacters([])
    } else {
      setCharacters(data || [])
    }
    setIsLoading(false)
    return data ?? null
  }, [])

  const fetchCharactersByManuscriptId = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getCharactersByManuscriptId(id)
    if (error) {
      setError(error.message || 'Error loading characters')
      setCharacters([])
    } else {
      setCharacters(data || [])
    }
    setIsLoading(false)
    return data ?? []
  }, [])

  return {
    characters,
    isLoading,
    error,
    getCharacters,
    remove,
    fetchCharacterById,
    fetchCharactersByManuscriptId,
  }
}