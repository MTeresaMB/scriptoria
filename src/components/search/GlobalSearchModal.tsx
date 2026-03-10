import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Book, ScrollText, User, FileText, X } from 'lucide-react'
import { getAllManuscripts } from '@/lib/repository/manuscriptRepository'
import { getAllChapters } from '@/lib/repository/chaptersRepository'
import { getAllCharacters } from '@/lib/repository/charactersRepository'
import { getAllNotes } from '@/lib/repository/notesRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import type { CharactersRow } from '@/lib/repository/charactersRepository'
import type { NoteRow } from '@/lib/repository/notesRepository'

type SearchItem =
  | { type: 'manuscript'; item: ManuscriptRow; id: number }
  | { type: 'chapter'; item: ChapterRow; manuscriptTitle?: string }
  | { type: 'character'; item: CharactersRow }
  | { type: 'note'; item: NoteRow }

interface GlobalSearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [manuscripts, setManuscripts] = useState<ManuscriptRow[]>([])
  const [chapters, setChapters] = useState<ChapterRow[]>([])
  const [characters, setCharacters] = useState<CharactersRow[]>([])
  const [notes, setNotes] = useState<NoteRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const fetchAll = useCallback(async () => {
    setIsLoading(true)
    const [m, c, ch, n] = await Promise.all([
      getAllManuscripts().then((r) => r.data ?? []),
      getAllChapters().then((r) => r.data ?? []),
      getAllCharacters().then((r) => r.data ?? []),
      getAllNotes().then((r) => r.data ?? []),
    ])
    setManuscripts(m as ManuscriptRow[])
    setChapters(c as ChapterRow[])
    setCharacters(ch as CharactersRow[])
    setNotes(n as NoteRow[])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isOpen) {
      void fetchAll()
      setQuery('')
      setSelectedIndex(0)
      inputRef.current?.focus()
    }
  }, [isOpen, fetchAll])

  const results = React.useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []

    const items: SearchItem[] = []

    manuscripts.forEach((m) => {
      if (m.title?.toLowerCase().includes(q)) {
        items.push({ type: 'manuscript', item: m, id: m.id_manuscript })
      }
    })

    chapters.forEach((ch) => {
      const plainContent = (ch.content || '').replace(/<[^>]*>/g, ' ').toLowerCase()
      const match =
        ch.name_chapter?.toLowerCase().includes(q) ||
        String(ch.chapter_number).includes(q) ||
        plainContent.includes(q)
      if (match) {
        const ms = manuscripts.find((m) => m.id_manuscript === ch.id_manuscript)
        items.push({ type: 'chapter', item: ch, manuscriptTitle: ms?.title })
      }
    })

    characters.forEach((c) => {
      if (c.name?.toLowerCase().includes(q)) {
        items.push({ type: 'character', item: c })
      }
    })

    notes.forEach((n) => {
      const plainContent = (n.content || '').replace(/<[^>]*>/g, ' ').toLowerCase()
      if (
        n.title?.toLowerCase().includes(q) ||
        plainContent.includes(q)
      ) {
        items.push({ type: 'note', item: n })
      }
    })

    return items.slice(0, 20)
  }, [query, manuscripts, chapters, characters, notes])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    }
  }

  const handleSelect = (r: SearchItem) => {
    switch (r.type) {
      case 'manuscript':
        navigate(`/manuscripts/${r.id}`)
        break
      case 'chapter':
        navigate(`/editor?chapter=${r.item.id_chapter}`)
        break
      case 'character':
        navigate(`/characters/${r.item.id_character}`)
        break
      case 'note':
        navigate(`/notes/${r.item.id_note}`)
        break
    }
    onClose()
  }

  const getLabel = (r: SearchItem) => {
    switch (r.type) {
      case 'manuscript':
        return r.item.title ?? ''
      case 'chapter':
        return r.item.name_chapter ?? `Chapter ${r.item.chapter_number ?? ''}`
      case 'character':
        return r.item.name ?? ''
      case 'note':
        return r.item.title ?? ''
    }
  }

  const getIcon = (r: SearchItem) => {
    switch (r.type) {
      case 'manuscript':
        return <Book className="w-4 h-4 text-purple-400 shrink-0" />
      case 'chapter':
        return <ScrollText className="w-4 h-4 text-blue-400 shrink-0" />
      case 'character':
        return <User className="w-4 h-4 text-amber-400 shrink-0" />
      case 'note':
        return <FileText className="w-4 h-4 text-green-400 shrink-0" />
    }
  }

  const getSubtitle = (r: SearchItem) => {
    switch (r.type) {
      case 'chapter':
        return r.manuscriptTitle
      default:
        return null
    }
  }

  const getItemId = (r: SearchItem) => {
    switch (r.type) {
      case 'manuscript':
        return `m-${r.id}`
      case 'chapter':
        return `c-${r.item.id_chapter}`
      case 'character':
        return `ch-${r.item.id_character}`
      case 'note':
        return `n-${r.item.id_note}`
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-4 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search manuscripts, chapters, characters, notes..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-auto py-2">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-slate-400">Loading...</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-400">
              {query.trim() ? 'No results found' : 'Type to search...'}
            </div>
          ) : (
            results.map((r, i) => (
              <button
                key={getItemId(r)}
                onClick={() => handleSelect(r)}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                  i === selectedIndex ? 'bg-purple-600/30' : 'hover:bg-slate-700'
                }`}
              >
                {getIcon(r)}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{getLabel(r)}</p>
                  {getSubtitle(r) && (
                    <p className="text-xs text-slate-400 truncate">{getSubtitle(r)}</p>
                  )}
                </div>
                <span className="text-xs text-slate-500 uppercase">{r.type}</span>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-slate-700 text-xs text-slate-500 flex gap-4">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
