import { useCallback, useEffect, useState } from 'react'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import {
  deleteChapter,
  getAllChapters,
  getChapterById,
  getChaptersByManuscriptId,
  updateChapter,
} from '@/lib/repository/chaptersRepository'

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

  const remove = useCallback(async (id: number) => {
    const { error } = await deleteChapter(id)
    if (error) throw error
    setChapters((prev) => prev.filter((ch) => ch.id_chapter !== id))
  }, [])

  const update = useCallback(async (id: number, values: Partial<ChapterRow>) => {
    const { error } = await updateChapter(id, values)
    if (error) throw error
    setChapters((prev) =>
      prev.map((ch) => (ch.id_chapter === id ? { ...ch, ...values } : ch))
    )
  }, [])

  const reorder = useCallback(async (chapterIds: number[], idManuscript: number) => {
    const results = await Promise.all(
      chapterIds.map((id, index) => updateChapter(id, { chapter_number: index + 1 }))
    )
    const hasError = results.some((r: { error: unknown }) => r.error)
    if (hasError) throw new Error('Failed to reorder')

    setChapters((prev) =>
      prev.map((ch) => {
        const idx = chapterIds.indexOf(ch.id_chapter)
        if (idx === -1 || ch.id_manuscript !== idManuscript) return ch
        return { ...ch, chapter_number: idx + 1 }
      })
    )
  }, [])

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
    update,
    reorder,
    fetchChapterById,
    fetchChaptersByManuscriptId,
  }
}


