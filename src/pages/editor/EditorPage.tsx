import React, { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useChapters } from '@/hooks/data/useChapters'
import { useManuscripts } from '@/hooks/data/useManuscripts'
import { useChapterEditor } from '@/hooks/editor/useChapterEditor'
import { ChapterEditor } from '@/components/editor/ChapterEditor'
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader'
import { ErrorState } from '@/components/common/errorState/ErrorState'
import { EmptyState } from '@/components/common/emptyState/EmptyState'
import { BookOpen, Plus } from 'lucide-react'
import { insertChapter } from '@/lib/repository/chaptersRepository'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/ui/useToast'
import { readLocalStorageJson, writeLocalStorageJson } from '@/utils/localStorage'

export const EditorPage: React.FC = () => {
  type EditorSession = {
    manuscriptId: number | null
    chapterId: number | null
  }

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { manuscripts, isLoading: isLoadingManuscripts, error: manuscriptsError, getManuscripts } = useManuscripts()
  const { chapters, isLoading: isLoadingChapters, error: chaptersError, fetchChaptersByManuscriptId, getChapters, update: updateChapter } = useChapters()
  const [selectedManuscriptId, setSelectedManuscriptId] = useState<number | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    if (selectedManuscriptId) {
      void fetchChaptersByManuscriptId(selectedManuscriptId)
    } else {
      void getChapters()
    }
  }, [selectedManuscriptId, fetchChaptersByManuscriptId, getChapters])

  const filteredChapters = useMemo(() => {
    if (!selectedManuscriptId) return chapters
    return chapters.filter(ch => ch.id_manuscript === selectedManuscriptId)
  }, [chapters, selectedManuscriptId])

  const { previousChapterId, nextChapterId } = useMemo(() => {
    if (!selectedChapterId || !filteredChapters || filteredChapters.length === 0) {
      return { previousChapterId: null, nextChapterId: null }
    }

    const sortedChapters = [...filteredChapters].sort((a, b) => {
      if (a.chapter_number !== null && b.chapter_number !== null) {
        return a.chapter_number - b.chapter_number
      }
      if (a.chapter_number !== null) return -1
      if (b.chapter_number !== null) return 1
      return a.id_chapter - b.id_chapter
    })

    const currentIndex = sortedChapters.findIndex(
      (ch) => ch.id_chapter === selectedChapterId
    )

    if (currentIndex === -1) {
      return { previousChapterId: null, nextChapterId: null }
    }

    const previousChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null
    const nextChapter =
      currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null

    return {
      previousChapterId: previousChapter?.id_chapter ?? null,
      nextChapterId: nextChapter?.id_chapter ?? null,
    }
  }, [selectedChapterId, filteredChapters])

  const handleNavigateToChapter = (id: number) => {
    if (hasUnsavedChanges && selectedChapterId) {
      const confirmSwitch = window.confirm(
        'You have unsaved changes. Are you sure you want to switch chapters?'
      )
      if (!confirmSwitch) {
        return
      }
    }
    setSelectedChapterId(id)
    setHasUnsavedChanges(false)
    navigate(`/editor?chapter=${id}`)
  }

  const EDITOR_STORAGE_KEY = 'editor_last_session'

  useEffect(() => {
    const chapterParam = searchParams.get('chapter')
    const manuscriptParam = searchParams.get('manuscript')

    if (chapterParam) {
      const chapterId = parseInt(chapterParam, 10)
      if (!isNaN(chapterId)) {
        setSelectedChapterId(chapterId)
        const ch = chapters.find(c => c.id_chapter === chapterId)
        if (ch?.id_manuscript) setSelectedManuscriptId(ch.id_manuscript)
      }
    } else if (manuscriptParam) {
      const manuscriptId = parseInt(manuscriptParam, 10)
      if (!isNaN(manuscriptId)) setSelectedManuscriptId(manuscriptId)
    } else {
      const storedSession = readLocalStorageJson<EditorSession>(EDITOR_STORAGE_KEY)

      if (storedSession?.manuscriptId && manuscripts.some(m => m.id_manuscript === storedSession.manuscriptId)) {
        setSelectedManuscriptId(storedSession.manuscriptId)

        if (storedSession.chapterId && chapters.some(c => c.id_chapter === storedSession.chapterId)) {
          setSelectedChapterId(storedSession.chapterId)
          navigate(`/editor?chapter=${storedSession.chapterId}`, { replace: true })
        }
      }
    }
  }, [searchParams, chapters, manuscripts, navigate])

  useEffect(() => {
    if (!selectedManuscriptId && !selectedChapterId) return

    void writeLocalStorageJson(EDITOR_STORAGE_KEY, {
      manuscriptId: selectedManuscriptId,
      chapterId: selectedChapterId,
    })
  }, [selectedManuscriptId, selectedChapterId])

  useEffect(() => {
    if (selectedChapterId && chapters.length > 0) {
      const chapter = chapters.find(ch => ch.id_chapter === selectedChapterId)
      if (chapter?.id_manuscript && chapter.id_manuscript !== selectedManuscriptId) {
        setSelectedManuscriptId(chapter.id_manuscript)
      }
    }
  }, [selectedChapterId, chapters, selectedManuscriptId])

  const {
    chapter,
    content,
    isLoading: isLoadingChapter,
    isSaving,
    error: editorError,
    hasUnsavedChanges: editorHasUnsavedChanges,
    handleContentChange,
    handleSave: handleSaveRaw,
  } = useChapterEditor({
    chapterId: selectedChapterId,
    onContentChange: setHasUnsavedChanges,
  })

  const displayChapter = useMemo(() => {
    if (!chapter) return null
    const fromList = chapters.find((c) => c.id_chapter === selectedChapterId)
    if (!fromList) return chapter
    return { ...chapter, status: fromList.status, summary: fromList.summary, chapter_number: fromList.chapter_number }
  }, [chapter, chapters, selectedChapterId])

  const handleSave = React.useCallback(async () => {
    const ok = await handleSaveRaw()
    if (ok) {
      if (selectedManuscriptId) void fetchChaptersByManuscriptId(selectedManuscriptId)
      void getChapters()
      void getManuscripts()
    }
    return ok
  }, [handleSaveRaw, selectedManuscriptId, fetchChaptersByManuscriptId, getChapters, getManuscripts])

  const handleManuscriptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const manuscriptId = e.target.value ? parseInt(e.target.value, 10) : null
    if (hasUnsavedChanges && selectedChapterId) {
      const confirmSwitch = window.confirm(
        'You have unsaved changes. Are you sure you want to switch manuscripts?'
      )
      if (!confirmSwitch) {
        return
      }
    }
    
    setSelectedManuscriptId(manuscriptId)
    setSelectedChapterId(null)
    setHasUnsavedChanges(false)
  }

  const handleChapterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chapterId = e.target.value ? parseInt(e.target.value, 10) : null
    if (hasUnsavedChanges && selectedChapterId) {
      const confirmSwitch = window.confirm(
        'You have unsaved changes. Are you sure you want to switch chapters?'
      )
      if (!confirmSwitch) {
        return
      }
    }
    
    setSelectedChapterId(chapterId)
    setHasUnsavedChanges(false)
    if (chapterId) {
      navigate(`/editor?chapter=${chapterId}`)
    }
  }

  const handleCreateChapter = async () => {
    if (!selectedManuscriptId) {
      toast.error('Please select a manuscript first')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('You must be logged in to create a chapter')
        return
      }

      const chapterName = `Chapter ${(filteredChapters.length + 1)}`
      const { data, error } = await insertChapter({
        name_chapter: chapterName,
        id_manuscript: selectedManuscriptId,
        id_user: user.id,
        status: 'Draft',
      })

      if (error) {
        toast.error(error.message || 'Error creating chapter')
        return
      }

      const newChapter = Array.isArray(data) ? data[0] : data
      if (newChapter?.id_chapter) {
        toast.success('Chapter created successfully')
        await fetchChaptersByManuscriptId(selectedManuscriptId)
        setSelectedChapterId(newChapter.id_chapter)
        navigate(`/editor?chapter=${newChapter.id_chapter}`)
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error creating chapter')
    }
  }

  if (isLoadingManuscripts || isLoadingChapters) {
    return (
      <div className="p-6">
        <SkeletonLoader count={3} />
      </div>
    )
  }

  if (manuscriptsError || chaptersError) {
    return (
      <div className="p-6">
        <ErrorState
          error={manuscriptsError || chaptersError || 'Unknown error'}
          onRetry={() => window.location.reload()}
          itemType="chapters"
          title="Error loading data"
          defaultMessage="An error occurred while trying to load data. Please try again."
        />
      </div>
    )
  }

  if (!manuscripts || manuscripts.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={BookOpen}
          title="No manuscripts available"
          description="Create a manuscript first to start writing chapters."
          actionLabel="Go to Manuscripts"
          onAction={() => navigate('/manuscripts')}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-full">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label htmlFor="manuscript-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Manuscript:
              </label>
              <select
                id="manuscript-select"
                value={selectedManuscriptId ?? ''}
                onChange={handleManuscriptSelect}
                className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[200px]"
              >
                <option value="">-- Select a manuscript --</option>
                {manuscripts.map((manuscript) => (
                  <option key={manuscript.id_manuscript} value={manuscript.id_manuscript}>
                    {manuscript.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedManuscriptId && (
              <div className="flex items-center gap-2">
                <label htmlFor="chapter-select" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Chapter:
                </label>
                <select
                  id="chapter-select"
                  value={selectedChapterId ?? ''}
                  onChange={handleChapterSelect}
                  className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[250px]"
                >
                  <option value="">-- Select a chapter --</option>
                  {filteredChapters.map((chapter) => (
                    <option key={chapter.id_chapter} value={chapter.id_chapter}>
                      {chapter.chapter_number
                        ? `Chapter ${chapter.chapter_number}: ${chapter.name_chapter}`
                        : chapter.name_chapter}
                    </option>
                  ))}
                </select>
                {filteredChapters.length === 0 && (
                  <button
                    onClick={handleCreateChapter}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Chapter</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 min-h-0">
        <div className="max-w-7xl mx-auto h-full flex flex-col">
          {!selectedManuscriptId ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Select a manuscript to start editing
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a manuscript from the dropdown above to view and edit its chapters.
                </p>
              </div>
            </div>
          ) : selectedManuscriptId && filteredChapters.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No chapters yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  This manuscript doesn't have any chapters yet. Create one to start writing.
                </p>
                <button
                  onClick={handleCreateChapter}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors mx-auto"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create First Chapter</span>
                </button>
              </div>
            </div>
          ) : isLoadingChapter ? (
            <div className="flex-1 flex items-center justify-center">
              <SkeletonLoader count={5} />
            </div>
          ) : editorError ? (
            <ErrorState
              error={editorError}
              onRetry={() => selectedChapterId && void handleSave()}
              itemType="chapter"
              title="Error loading chapter"
              defaultMessage="An error occurred while trying to load the chapter. Please try again."
            />
          ) : selectedChapterId && displayChapter ? (
            <div className="bg-white dark:bg-slate-800 rounded-none border border-slate-200 dark:border-slate-700 p-6 h-full flex flex-col">
              <ChapterEditor
                content={content}
                onChange={handleContentChange}
                onSave={handleSave}
                isSaving={isSaving}
                hasUnsavedChanges={editorHasUnsavedChanges}
                chapterTitle={displayChapter.name_chapter}
                manuscriptTitle={manuscripts.find(m => m.id_manuscript === selectedManuscriptId)?.title}
                chapter={displayChapter}
                previousChapterId={previousChapterId}
                nextChapterId={nextChapterId}
                onNavigateToChapter={handleNavigateToChapter}
                onUpdateChapter={selectedChapterId ? async (updates) => {
                  try {
                    await updateChapter(selectedChapterId, updates)
                    toast.success('Metadata updated')
                  } catch {
                    toast.error('Failed to update metadata')
                  }
                } : undefined}
                onSaveComplete={() => toast.success('Saved', 2000)}
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Select a chapter to start editing
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose a chapter from the dropdown above to begin writing.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
