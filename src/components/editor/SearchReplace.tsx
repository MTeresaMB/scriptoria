import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Replace, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useEditor } from '@tiptap/react'

interface SearchReplaceProps {
  editor: ReturnType<typeof useEditor> | null
  isOpen: boolean
  onClose: () => void
}

export const SearchReplace: React.FC<SearchReplaceProps> = ({ editor, isOpen, onClose }) => {
  const [searchText, setSearchText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [matchCase, setMatchCase] = useState(false)
  const [currentMatch, setCurrentMatch] = useState(0)
  const [totalMatches, setTotalMatches] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = (text: string) => {
    if (!editor || !text) {
      setTotalMatches(0)
      setCurrentMatch(0)
      return
    }

    const content = editor.state.doc.textContent
    const flags = matchCase ? 'g' : 'gi'
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    const matches = content.match(regex)
    
    setTotalMatches(matches ? matches.length : 0)
    setCurrentMatch(1)
    if (matches && matches.length > 0) {
      const firstMatch = content.search(regex)
      if (firstMatch !== -1) {
        editor.commands.setTextSelection({ from: firstMatch, to: firstMatch + text.length })
        editor.commands.scrollIntoView()
      }
    }
  }

  const handleNext = useCallback(() => {
    if (!editor || !searchText || totalMatches === 0) return

    const content = editor.state.doc.textContent
    const flags = matchCase ? 'g' : 'gi'
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    const matches = Array.from(content.matchAll(regex))
    
    if (matches.length === 0) return

    const nextIndex = currentMatch < matches.length ? currentMatch : 0
    const match = matches[nextIndex]
    
    if (match.index !== undefined) {
      editor.commands.setTextSelection({ 
        from: match.index, 
        to: match.index + searchText.length 
      })
      editor.commands.scrollIntoView()
      setCurrentMatch(nextIndex + 1)
    }
  }, [editor, searchText, totalMatches, currentMatch, matchCase])

  const handlePrevious = useCallback(() => {
    if (!editor || !searchText || totalMatches === 0) return

    const content = editor.state.doc.textContent
    const flags = matchCase ? 'g' : 'gi'
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    const matches = Array.from(content.matchAll(regex))
    
    if (matches.length === 0) return

    const prevIndex = currentMatch > 1 ? currentMatch - 2 : matches.length - 1
    const match = matches[prevIndex]
    
    if (match.index !== undefined) {
      editor.commands.setTextSelection({ 
        from: match.index, 
        to: match.index + searchText.length 
      })
      editor.commands.scrollIntoView()
      setCurrentMatch(prevIndex + 1)
    }
  }, [editor, searchText, totalMatches, currentMatch, matchCase])

  const handleReplace = () => {
    if (!editor || !searchText) return

    const { from, to } = editor.state.selection
    const selectedText = editor.state.doc.textBetween(from, to)
    const flags = matchCase ? '' : 'i'
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    
    if (regex.test(selectedText)) {
      editor.commands.deleteSelection()
      editor.commands.insertContent(replaceText)
      handleSearch(searchText)
    }
  }

  const handleReplaceAll = () => {
    if (!editor || !searchText) return

    const html = editor.getHTML()
    const flags = matchCase ? 'g' : 'gi'
    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags)
    const newHtml = html.replace(regex, replaceText)
    
    editor.commands.setContent(newHtml)
    setTotalMatches(0)
    setCurrentMatch(0)
  }

  const handleSearchChange = (text: string) => {
    setSearchText(text)
    setCurrentMatch(0)
    if (text) {
      handleSearch(text)
    } else {
      setTotalMatches(0)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        handlePrevious()
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, searchText, currentMatch, totalMatches, matchCase, handleNext, handlePrevious, onClose])

  if (!isOpen) return null

  return (
    <div className="absolute top-0 left-0 right-0 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 z-50 shadow-lg">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <div className="flex-1 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {totalMatches > 0 && (
            <span className="text-xs text-slate-600 dark:text-slate-400 shrink-0">
              {currentMatch} / {totalMatches}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevious}
            disabled={totalMatches === 0}
            className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Previous (Shift+Enter)"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={totalMatches === 0}
            className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Next (Enter)"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Replace className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
          <input
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Replace..."
            className="w-48 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleReplace}
            disabled={!searchText || totalMatches === 0}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Replace
          </button>
          <button
            onClick={handleReplaceAll}
            disabled={!searchText || totalMatches === 0}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Replace All
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={matchCase}
            onChange={(e) => {
              setMatchCase(e.target.checked)
              if (searchText) {
                handleSearchChange(searchText)
              }
            }}
            className="w-4 h-4 rounded border-slate-400 dark:border-slate-600 bg-white dark:bg-slate-700 text-purple-600 focus:ring-purple-500"
          />
          <span>Match case</span>
        </label>

        <button
          onClick={onClose}
          className="p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
