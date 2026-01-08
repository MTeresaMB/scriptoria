import React, { memo, useState } from "react"
import type { Chapter } from "@/types"
import { DeleteConfirmModal } from "@/components/common/deleteConfirmModal/DeleteConfirmModal"
import { CardMenu } from "@/components/common/cardMenu/CardMenu"
import { BaseCard } from "@/components/common/baseCard/BaseCard"
import { StatusBadge } from "@/components/common/statusBadge/StatusBadge"
import { formatWordCountNumber, formatDate } from "@/utils/formatters"

interface ChapterCardProps {
  chapter: Chapter
  onEdit?: (id: number) => void
  onDelete?: (id: number) => Promise<void>
  onView?: (id: number) => void
  manuscriptTitle?: string
}

export const ChapterCard: React.FC<ChapterCardProps> = memo(({
  chapter,
  onEdit,
  onDelete,
  onView,
  manuscriptTitle,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete?.(chapter.id_chapter)
      setShowConfirmDelete(false)
    } catch (error) {
      console.error('Error deleting chapter:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const chapterLabel = chapter.chapter_number != null
    ? `Chapter ${chapter.chapter_number}`
    : 'Chapter'

  return (
    <>
      <BaseCard
        onClick={() => onView?.(chapter.id_chapter)}
        ariaLabel={`View chapter: ${chapter.name_chapter}`}
        className="flex items-start justify-between p-4 relative hover:border-purple-500"
      >
        <div className="flex-1 min-w-0 pr-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-purple-300 uppercase tracking-wide">
              {chapterLabel}
            </span>
            {chapter.status && (
              <StatusBadge status={chapter.status} size="sm" />
            )}
          </div>
          <h3 className="text-white font-semibold text-base leading-tight line-clamp-2">
            {chapter.name_chapter}
          </h3>
          {manuscriptTitle && (
            <p className="text-slate-500 text-xs mt-1 line-clamp-1">
              {manuscriptTitle}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 flex-wrap">
            {chapter.word_count != null && (
              <span>{formatWordCountNumber(chapter.word_count)} words</span>
            )}
            {chapter.date_created && (
              <span>
                • Created {formatDate(chapter.date_created)}
              </span>
            )}
            {chapter.last_edit && (
              <span>
                • Last edit {formatDate(chapter.last_edit)}
              </span>
            )}
          </div>

          {chapter.summary && (
            <p className="text-slate-400 text-xs mt-3 line-clamp-2">
              {chapter.summary}
            </p>
          )}
        </div>

        <div className="shrink-0 ml-2 absolute top-3 right-3">
          <CardMenu
            onView={onView ? () => onView(chapter.id_chapter) : undefined}
            onEdit={onEdit ? () => onEdit(chapter.id_chapter) : undefined}
            onDelete={onDelete ? () => setShowConfirmDelete(true) : undefined}
            itemType="chapter"
          />
        </div>
      </BaseCard>

      <DeleteConfirmModal
        itemTitle={chapter.name_chapter}
        itemType="chapter"
        isOpen={showConfirmDelete}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmDelete(false)}
        message="This action cannot be undone. This chapter will be deleted permanently."
      />
    </>
  )
})

ChapterCard.displayName = 'ChapterCard'


