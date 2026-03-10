import { useCallback, useState, useEffect, useRef } from 'react'
import { updateChapter, getChapterById } from '@/lib/repository/chaptersRepository'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import { recalculateManuscriptWordCount } from '@/lib/repository/manuscriptRepository'
import { useToast } from '@/hooks/ui/useToast'

interface UseChapterEditorProps {
  chapterId: number | null
  onContentChange?: (hasChanges: boolean) => void
}

export const useChapterEditor = ({ chapterId, onContentChange }: UseChapterEditorProps) => {
  const { toast } = useToast()
  const [chapter, setChapter] = useState<ChapterRow | null>(null)
  const [content, setContent] = useState<string>('')
  const [originalContent, setOriginalContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedContentRef = useRef<string>('')

  const loadChapter = useCallback(async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const { data, error: fetchError } = await getChapterById(id)
      if (fetchError) {
        setError(fetchError.message || 'Error loading chapter')
        return
      }
      if (data) {
        let chapterData = data
        const chapterContent = data.content || ''
        const plainText = chapterContent.replace(/<[^>]*>/g, ' ')
        const computedWordCount = plainText
          .split(/\s+/)
          .filter((w: string) => w.length > 0).length

        if (
          (data.word_count == null || data.word_count === 0) &&
          computedWordCount > 0
        ) {
          const { error: updateErr } = await updateChapter(id, {
            word_count: computedWordCount,
          })
          if (!updateErr) {
            chapterData = { ...data, word_count: computedWordCount }
            if (data.id_manuscript) {
              void recalculateManuscriptWordCount(data.id_manuscript)
            }
          }
        }

        setChapter(chapterData)
        setContent(chapterContent)
        setOriginalContent(chapterContent)
        lastSavedContentRef.current = chapterContent
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading chapter')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const saveContent = useCallback(async (contentToSave: string) => {
    if (!chapterId) return

    setIsSaving(true)
    try {
      const plainText = contentToSave.replace(/<[^>]*>/g, ' ')
      const wordCount = plainText
        .split(/\s+/)
        .filter((w) => w.length > 0).length

      const { error: updateError } = await updateChapter(chapterId, {
        content: contentToSave || null,
        word_count: wordCount,
      })

      if (updateError) {
        throw updateError
      }

      lastSavedContentRef.current = contentToSave
      setOriginalContent(contentToSave)
      setLastSaved(new Date())

      setChapter((prev) =>
        prev
          ? {
              ...prev,
              content: contentToSave || null,
              word_count: wordCount,
            }
          : prev,
      )

      if (chapter?.id_manuscript) {
        void recalculateManuscriptWordCount(chapter.id_manuscript)
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error saving content'
      toast.error(errorMessage)
      return false
    } finally {
      setIsSaving(false)
    }
  }, [chapterId, chapter, toast])

  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent)
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    const hasChanges = newContent !== originalContent
    onContentChange?.(hasChanges)
    autoSaveTimeoutRef.current = setTimeout(() => {
      if (newContent !== lastSavedContentRef.current && chapterId) {
        void saveContent(newContent)
      }
    }, 2000)
  }, [originalContent, chapterId, saveContent, onContentChange])

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    const result = await saveContent(content)
    return result ?? false
  }, [content, saveContent])

  useEffect(() => {
    if (chapterId) {
      void loadChapter(chapterId)
    } else {
      setChapter(null)
      setContent('')
      setOriginalContent('')
      lastSavedContentRef.current = ''
    }
  }, [chapterId, loadChapter])

  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [])

  const hasUnsavedChanges = content !== originalContent

  return {
    chapter,
    content,
    isLoading,
    isSaving,
    error,
    hasUnsavedChanges,
    lastSaved,
    handleContentChange,
    handleSave,
    loadChapter,
  }
}
