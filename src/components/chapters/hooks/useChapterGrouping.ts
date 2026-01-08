import { useMemo } from 'react'
import type { ChapterRow } from '@/lib/respository/chaptersRepository'

export interface GroupColor {
  bg: string
  border: string
  icon: string
}

const GROUP_COLORS: GroupColor[] = [
  { bg: 'bg-purple-500/20', border: 'border-purple-500/30', icon: 'text-purple-400' },
  { bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: 'text-blue-400' },
  { bg: 'bg-green-500/20', border: 'border-green-500/30', icon: 'text-green-400' },
  { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: 'text-yellow-400' },
  { bg: 'bg-pink-500/20', border: 'border-pink-500/30', icon: 'text-pink-400' },
  { bg: 'bg-indigo-500/20', border: 'border-indigo-500/30', icon: 'text-indigo-400' },
  { bg: 'bg-orange-500/20', border: 'border-orange-500/30', icon: 'text-orange-400' },
  { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', icon: 'text-cyan-400' },
]

export const useChapterGrouping = (chapters: ChapterRow[]) => {
  // Agrupar capítulos por manuscript
  const groupedChapters = useMemo(() => {
    const groups: Map<number | 'no-manuscript', ChapterRow[]> = new Map()

    chapters.forEach((chapter) => {
      const key = chapter.id_manuscript ?? 'no-manuscript'
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(chapter)
    })

    return groups
  }, [chapters])

  // Función para obtener el color de un grupo basado en su ID
  const getGroupColor = (manuscriptId: number | 'no-manuscript'): GroupColor => {
    if (manuscriptId === 'no-manuscript') {
      return GROUP_COLORS[GROUP_COLORS.length - 1] // Último color para "No Manuscript"
    }
    // Usar el ID del manuscript para asignar un color consistente
    return GROUP_COLORS[(manuscriptId as number) % (GROUP_COLORS.length - 1)]
  }

  return {
    groupedChapters,
    getGroupColor,
  }
}
