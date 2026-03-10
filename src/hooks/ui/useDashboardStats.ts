import type { ManuscriptRow } from "@/lib/repository/manuscriptRepository"
import type { Character } from "@/types"
import type { ChapterRow } from "@/lib/repository/chaptersRepository"
import type { NoteRow } from "@/lib/repository/notesRepository"
import type { StatsRow } from "@/lib/repository/statsRepository"
import { formatNumber } from "@/utils/formatters"
import { BookOpen, FileText, Users, StickyNote } from "lucide-react"
import { useMemo } from "react"

interface Stat {
  title: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bgColor: string
  formatValue?: (value: number) => string
}

export const useDashboardStats = (
  manuscripts: ManuscriptRow[] | undefined,
  characters: Character[] | undefined,
  chapters: ChapterRow[] | undefined,
  notes: NoteRow[] | undefined,
  cachedStats?: StatsRow | null
): Stat[] => {
  return useMemo(() => {
    const totalWords = cachedStats?.total_words ?? (() => {
      const mw = manuscripts?.reduce((acc, m) => acc + (m.word_count || 0), 0) || 0
      const cw = chapters?.reduce((acc, c) => acc + (c.word_count || 0), 0) || 0
      return mw + cw
    })()

    const manuscriptsCount = manuscripts?.length ?? 0
    const charactersCount = cachedStats?.total_characters ?? characters?.length ?? 0
    const chaptersCount = cachedStats?.total_chapters ?? chapters?.length ?? 0
    const notesCount = notes?.length ?? 0

    return [
      {
        title: 'Manuscripts',
        value: manuscriptsCount,
        icon: BookOpen,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/10'
      },
      {
        title: 'Characters',
        value: charactersCount,
        icon: Users,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-500/10'
      },
      {
        title: 'Chapters',
        value: chaptersCount,
        icon: FileText,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-500/10'
      },
      {
        title: 'Notes',
        value: notesCount,
        icon: StickyNote,
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'bg-cyan-500/10'
      },
      {
        title: 'Total Words',
        value: totalWords,
        icon: FileText,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-500/10',
        formatValue: formatNumber
      }
    ]
  }, [manuscripts, characters, chapters, notes, cachedStats])
}