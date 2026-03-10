import React, { useState } from 'react'
import type { Chapter } from '@/types'
import { ChapterCard } from './ChapterCard'
import { GripVertical } from 'lucide-react'

interface SortableChaptersGridProps {
  chapters: Chapter[]
  manuscriptTitle?: string
  onReorder: (chapterIds: number[]) => Promise<void>
  onView: (id: number) => void
  onEditInEditor: (id: number) => void
  onDelete: (id: number) => Promise<void>
}

export const SortableChaptersGrid: React.FC<SortableChaptersGridProps> = ({
  chapters,
  manuscriptTitle,
  onReorder,
  onView,
  onEditInEditor,
  onDelete,
}) => {
  const [draggedId, setDraggedId] = useState<number | null>(null)
  const [dragOverId, setDragOverId] = useState<number | null>(null)

  const sortedChapters = [...chapters].sort((a, b) => {
    const na = a.chapter_number ?? 999
    const nb = b.chapter_number ?? 999
    if (na !== nb) return na - nb
    return a.id_chapter - b.id_chapter
  })

  const handleDragStart = (e: React.DragEvent, chapterId: number) => {
    setDraggedId(chapterId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(chapterId))
    e.dataTransfer.setData('application/json', JSON.stringify({ chapterId }))
  }

  const handleDragOver = (e: React.DragEvent, chapterId: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedId !== chapterId) setDragOverId(chapterId)
  }

  const handleDragLeave = () => {
    setDragOverId(null)
  }

  const handleDrop = (e: React.DragEvent, targetChapterId: number) => {
    e.preventDefault()
    setDragOverId(null)
    setDraggedId(null)

    const dragged = Number(e.dataTransfer.getData('text/plain'))
    if (!dragged || dragged === targetChapterId || isNaN(dragged)) return

    const oldIndex = sortedChapters.findIndex((c) => c.id_chapter === dragged)
    const newIndex = sortedChapters.findIndex((c) => c.id_chapter === targetChapterId)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = [...sortedChapters]
    const [removed] = reordered.splice(oldIndex, 1)
    reordered.splice(newIndex, 0, removed)
    const chapterIds = reordered.map((c) => c.id_chapter)

    void onReorder(chapterIds)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
    setDragOverId(null)
  }

  return (
    <div className="flex flex-col gap-4">
      {sortedChapters.map((chapter) => (
        <div
          key={chapter.id_chapter}
          onDragOver={(e) => handleDragOver(e, chapter.id_chapter)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, chapter.id_chapter)}
          className={`flex items-stretch gap-3 rounded-lg transition-colors ${
            draggedId === chapter.id_chapter ? 'opacity-50' : ''
          } ${
            dragOverId === chapter.id_chapter ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-800 bg-slate-700/30' : ''
          }`}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, chapter.id_chapter)}
            onDragEnd={handleDragEnd}
            className="flex items-center justify-center w-10 shrink-0 rounded-l-lg bg-slate-700/50 hover:bg-slate-600 text-slate-400 hover:text-white cursor-grab active:cursor-grabbing touch-none border border-slate-600 border-r-0 select-none"
            title="Arrastra para reordenar"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <ChapterCard
              chapter={chapter}
              manuscriptTitle={manuscriptTitle}
              onView={onView}
              onEditInEditor={onEditInEditor}
              onDelete={onDelete}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
