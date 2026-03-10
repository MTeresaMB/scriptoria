import React, { useEffect, useState } from 'react'
import { UserPlus, UserMinus } from 'lucide-react'
import type { CharactersRow } from '@/lib/repository/charactersRepository'
import {
  getCharactersByChapterId,
  setCharactersForChapter,
} from '@/lib/repository/chapterHasCharacterRepository'

interface ChapterCharactersSectionProps {
  chapterId: number
  manuscriptCharacters: CharactersRow[]
  onRefresh?: () => void
}

export const ChapterCharactersSection: React.FC<ChapterCharactersSectionProps> = ({
  chapterId,
  manuscriptCharacters,
  onRefresh,
}) => {
  const [linkedIds, setLinkedIds] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data } = await getCharactersByChapterId(chapterId)
      const ids = new Set<number>((data ?? []).map((r: { id_character: number }) => r.id_character))
      setLinkedIds(ids)
      setIsLoading(false)
    }
    void load()
  }, [chapterId])

  const handleToggle = async (id_character: number) => {
    setIsUpdating(true)
    const next = new Set(linkedIds)
    if (next.has(id_character)) {
      next.delete(id_character)
    } else {
      next.add(id_character)
    }
    const { error } = await setCharactersForChapter(chapterId, Array.from(next))
    if (error) {
      setIsUpdating(false)
      return
    }
    setLinkedIds(next)
    onRefresh?.()
    setIsUpdating(false)
  }

  if (manuscriptCharacters.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Characters in this chapter</h2>
        <p className="text-slate-500 text-sm">
          No characters in this manuscript. Add characters to the manuscript first to assign them to chapters.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Characters in this chapter</h2>
      {isLoading ? (
        <p className="text-slate-500 text-sm">Loading...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {manuscriptCharacters.map((char) => {
            const isLinked = linkedIds.has(char.id_character)
            return (
              <button
                key={char.id_character}
                onClick={() => handleToggle(char.id_character)}
                disabled={isUpdating}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isLinked
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-slate-700/50 text-slate-400 border border-slate-600 hover:border-slate-500'
                } disabled:opacity-50`}
              >
                {isLinked ? (
                  <UserMinus className="w-4 h-4" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {char.name}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
