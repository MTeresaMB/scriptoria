import { useCallback, useEffect, useState } from 'react'
import type { ChapterRow } from '@/lib/respository/chaptersRepository'
import {
  deleteChapter,
  getAllChapters,
  getChapterById,
  getChaptersByManuscriptId,
} from '@/lib/respository/chaptersRepository'

export const useChapters = () => {
  const [chapters, setChapters] = useState<ChapterRow[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const getChapters = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getAllChapters()
    if (error) {
      setError(error.message || 'Error loading chapters')
      setChapters([])
    } else {
      setChapters(data || [])
    }
    setIsLoading(false)
  }, [])

  const remove = useCallback(
    async (id: number) => {
      const { error } = await deleteChapter(id)
      if (error) throw error
      await getChapters()
    },
    [getChapters],
  )

  useEffect(() => {
    void getChapters()
  }, [getChapters])

  const fetchChapterById = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getChapterById(id)
    if (error) {
      setError(error.message || 'Error loading chapter')
      setChapters([])
    } else {
      setChapters(data ? [data] : [])
    }
    setIsLoading(false)
    return data ?? null
  }, [])

  const fetchChaptersByManuscriptId = useCallback(async (id_manuscript: number) => {
    setIsLoading(true)
    setError(null)
    const { data, error } = await getChaptersByManuscriptId(id_manuscript)
    if (error) {
      setError(error.message || 'Error loading chapters')
      setChapters([])
    } else {
      setChapters(data || [])
    }
    setIsLoading(false)
    return data ?? []
  }, [])

  return {
    chapters,
    isLoading,
    error,
    getChapters,
    remove,
    fetchChapterById,
    fetchChaptersByManuscriptId,
  }
}


