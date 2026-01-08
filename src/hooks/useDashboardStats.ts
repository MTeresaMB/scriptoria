import type { ManuscriptRow } from "@/lib/respository/manuscriptRepository"
import type { Character } from "@/types"
import type { ChapterRow } from "@/lib/respository/chaptersRepository"
import type { NoteRow } from "@/lib/respository/notesRepository"
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
  notes: NoteRow[] | undefined
): Stat[] => {
  return useMemo(() => {
    const totalWords = manuscripts?.reduce((acc, m) => acc + (m.word_count || 0), 0) || 0
    const chaptersWords = chapters?.reduce((acc, c) => acc + (c.word_count || 0), 0) || 0
    const totalAllWords = totalWords + chaptersWords

    return [
      {
        title: 'Manuscripts',
        value: manuscripts?.length || 0,
        icon: BookOpen,
        color: 'from-blue-500 to-blue-600',
        bgColor: 'bg-blue-500/10'
      },
      {
        title: 'Characters',
        value: characters?.length || 0,
        icon: Users,
        color: 'from-green-500 to-green-600',
        bgColor: 'bg-green-500/10'
      },
      {
        title: 'Chapters',
        value: chapters?.length || 0,
        icon: FileText,
        color: 'from-purple-500 to-purple-600',
        bgColor: 'bg-purple-500/10'
      },
      {
        title: 'Notes',
        value: notes?.length || 0,
        icon: StickyNote,
        color: 'from-cyan-500 to-cyan-600',
        bgColor: 'bg-cyan-500/10'
      },
      {
        title: 'Total Words',
        value: totalAllWords,
        icon: FileText,
        color: 'from-orange-500 to-orange-600',
        bgColor: 'bg-orange-500/10',
        formatValue: formatNumber
      }
    ]
  }, [manuscripts, characters, chapters, notes])
}