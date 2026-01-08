import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, BookOpen, ExternalLink } from 'lucide-react'
import { useReturnNavigation } from '@/hooks/useReturnNavigation'
import { useToast } from '@/hooks/useToast'
import { useChapters } from '@/hooks/useChapters'
import { useManuscripts } from '@/hooks/useManuscripts'
import type { ChapterRow } from '@/lib/respository/chaptersRepository'
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader'
import { ErrorState } from '@/components/common/errorState/ErrorState'
import { DeleteConfirmModal } from '@/components/common/deleteConfirmModal/DeleteConfirmModal'
import { CardMenu } from '@/components/common/cardMenu/CardMenu'
import { formatDate, formatWordCount } from '@/utils/formatters'

export const ChapterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const returnTo = useReturnNavigation('/chapters')
  const { toast } = useToast()

  const {
    chapters,
    isLoading,
    error,
    remove,
    fetchChapterById,
  } = useChapters()

  const { manuscripts } = useManuscripts()

  const [chapter, setChapter] = useState<ChapterRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate(returnTo)
      return
    }

    const chapterId = parseInt(id, 10)
    if (isNaN(chapterId)) {
      console.error('Invalid chapter ID:', id)
      navigate(returnTo)
      return
    }

    const loadChapter = async () => {
      const data = await fetchChapterById(chapterId)
      if (data) {
        setChapter(data)
      }
    }

    void loadChapter()
  }, [id, navigate, returnTo, fetchChapterById])

  const handleEdit = () => {
    if (!id) return
    navigate(`/chapters/edit/${id}?from=detail`)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!chapter) return

    setIsDeleting(true)
    try {
      await remove(chapter.id_chapter)
      toast.success('Chapter deleted successfully')
      navigate(returnTo)
    } catch (err) {
      console.error('Error deleting chapter:', err)
      toast.error('Failed to delete chapter')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleRetry = () => {
    if (!id) return
    const chapterId = parseInt(id, 10)
    if (!isNaN(chapterId)) {
      void fetchChapterById(chapterId).then((data) => {
        if (data) {
          setChapter(data)
        }
      })
    }
  }

  if (isLoading && !chapter && !chapters.length) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          error={error}
          onRetry={handleRetry}
          itemType="chapter"
          title="Error loading chapter"
          defaultMessage="An error occurred while trying to load the chapter. Please try again."
        />
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Chapter not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The chapter you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate(returnTo)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const chapterLabel = chapter.chapter_number != null
    ? `Chapter ${chapter.chapter_number}`
    : 'Chapter'

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(returnTo)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wide">
                {chapterLabel}
              </p>
              <h1 className="text-3xl font-bold text-white">{chapter.name_chapter}</h1>
            </div>
          </div>
          <CardMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            itemType="chapter"
          />
        </div>

        {/* Main info */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-slate-700 flex items-center justify-center text-white shrink-0">
              <FileText className="w-8 h-8 text-white opacity-80" />
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {chapter.status && (
                <div>
                  <p className="text-slate-400 text-sm">Status</p>
                  <p className="text-white font-medium">{chapter.status}</p>
                </div>
              )}
              {chapter.word_count != null && (
                <div>
                  <p className="text-slate-400 text-sm">Word count</p>
                  <p className="text-white font-medium">
                    {formatWordCount(chapter.word_count)}
                  </p>
                </div>
              )}
              {chapter.date_created && (
                <div>
                  <p className="text-slate-400 text-sm">Created</p>
                  <p className="text-white font-medium">
                    {formatDate(chapter.date_created)}
                  </p>
                </div>
              )}
              {chapter.last_edit && (
                <div>
                  <p className="text-slate-400 text-sm">Last edit</p>
                  <p className="text-white font-medium">
                    {formatDate(chapter.last_edit)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Manuscript */}
        {chapter.id_manuscript && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Related Manuscript</h2>
            {(() => {
              const relatedManuscript = manuscripts?.find((m) => m.id_manuscript === chapter.id_manuscript);
              if (!relatedManuscript) {
                return <p className="text-slate-500 text-sm">Manuscript not found.</p>;
              }
              return (
                <button
                  onClick={() => navigate(`/manuscripts/${relatedManuscript.id_manuscript}?from=chapter-detail`)}
                  className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors w-full text-left group"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors truncate">
                      {relatedManuscript.title}
                    </h3>
                    {relatedManuscript.genre && (
                      <p className="text-slate-400 text-sm mt-1">{relatedManuscript.genre}</p>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors shrink-0" />
                </button>
              );
            })()}
          </div>
        )}

        {/* Summary */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          {chapter.summary ? (
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {chapter.summary}
            </p>
          ) : (
            <p className="text-slate-500 italic">No summary available</p>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        itemTitle={chapter.name_chapter}
        itemType="chapter"
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="This action cannot be undone. This chapter will be deleted permanently."
      />
    </>
  )
}


