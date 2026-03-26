import React, { useState, useMemo, useEffect } from 'react'
import { FileText, Calendar, Edit3, Hash, BarChart3, Navigation, BookOpen, History, List } from 'lucide-react'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import { formatDate, formatWordCountNumber } from '@/utils/formatters'
import { StatusBadge } from '@/components/common/statusBadge/StatusBadge'
import { ReadabilityAnalysis } from './ReadabilityAnalysis'
import { sanitizeEditorHtml } from '@/utils/sanitizeEditorHtml'

interface EditorSidebarProps {
  chapter: ChapterRow | null
  content: string
  isOpen: boolean
  onClose: () => void
  snapshots?: {
    id: string
    timestamp: Date
    wordCount: number
  }[]
  onRestoreSnapshot?: (snapshotId: string) => void
  onNavigateToChapter?: (id: number) => void
  previousChapterId?: number | null
  nextChapterId?: number | null
  onUpdateChapter?: (updates: Partial<ChapterRow>) => Promise<void>
  onHeadingClick?: (index: number) => void
}

type SidebarTab = 'info' | 'stats' | 'analysis' | 'outline' | 'navigation' | 'history'

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  chapter,
  content,
  isOpen,
  onClose,
  snapshots,
  onRestoreSnapshot,
  onNavigateToChapter,
  previousChapterId,
  nextChapterId,
  onUpdateChapter,
  onHeadingClick,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('info')
  const [sidebarWidth, setSidebarWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)

  const headings = useMemo(() => {
    const div = document.createElement('div')
    div.innerHTML = sanitizeEditorHtml(content)
    const els = div.querySelectorAll('h1, h2, h3')
    return Array.from(els).map((el, i) => ({
      tag: el.tagName,
      text: (el.textContent || '').trim().slice(0, 60),
      index: i,
    })).filter((h) => h.text)
  }, [content])
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    if (!isResizing) return
    const onMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX
      if (newWidth >= 200 && newWidth <= 500) setSidebarWidth(newWidth)
    }
    const onMouseUp = () => setIsResizing(false)
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  if (!isOpen || !chapter) return null

  return (
    <div className="flex flex-col bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 relative shrink-0" style={{ width: sidebarWidth }}>
      {/* Resize handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-purple-500/50 transition-colors -ml-0.5"
        onMouseDown={() => setIsResizing(true)}
        role="separator"
        aria-orientation="vertical"
      />
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Chapter Info</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'info'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 mx-auto mb-1" />
          Info
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'stats'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 mx-auto mb-1" />
          Stats
        </button>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === 'analysis'
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 mx-auto mb-1" />
          Analysis
        </button>
        {headings.length > 0 && (
          <button
            onClick={() => setActiveTab('outline')}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'outline'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <List className="w-4 h-4 mx-auto mb-1" />
            Outline
          </button>
        )}
        {snapshots && snapshots.length > 0 && (
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <History className="w-4 h-4 mx-auto mb-1" />
            History
          </button>
        )}
        {(previousChapterId || nextChapterId) && (
          <button
            onClick={() => setActiveTab('navigation')}
            className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${
              activeTab === 'navigation'
                ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-b-2 border-purple-500'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Navigation className="w-4 h-4 mx-auto mb-1" />
            Nav
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Tab Content */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Basic Information
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Title</p>
                  <p className="text-slate-900 dark:text-white font-medium">{chapter.name_chapter}</p>
                </div>
                
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    Chapter Number
                  </p>
                  {isEditing === 'chapter_number' ? (
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1 px-2 py-1 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white text-sm"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const num = parseInt(editValue, 10)
                            if (!isNaN(num)) {
                              onUpdateChapter?.({ chapter_number: num })
                              setIsEditing(null)
                            }
                          } else if (e.key === 'Escape') setIsEditing(null)
                        }}
                      />
                      <button
                        onClick={() => {
                          const num = parseInt(editValue, 10)
                          if (!isNaN(num)) {
                            onUpdateChapter?.({ chapter_number: num })
                            setIsEditing(null)
                          }
                        }}
                        className="px-2 py-1 bg-purple-600 text-white text-xs rounded"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditValue(String(chapter.chapter_number ?? ''))
                        setIsEditing('chapter_number')
                      }}
                      className="text-slate-900 dark:text-white font-medium hover:underline"
                    >
                      {chapter.chapter_number != null ? `Chapter ${chapter.chapter_number}` : 'Set number'}
                    </button>
                  )}
                </div>

                <div>
                  <p className="text-xs text-slate-400 mb-1">Status</p>
                  {isEditing === 'status' ? (
                    <div className="flex gap-2 flex-wrap">
                      {['Draft', 'In Progress', 'Completed'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            onUpdateChapter?.({ status: s })
                            setIsEditing(null)
                          }}
                          className="px-2 py-1 bg-slate-200 dark:bg-slate-700 hover:bg-purple-600 text-slate-900 dark:text-white text-xs rounded"
                        >
                          {s}
                        </button>
                      ))}
                      <button
                        onClick={() => setIsEditing(null)}
                        className="px-2 py-1 text-slate-400 text-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onUpdateChapter && setIsEditing('status')}
                      className="text-left"
                    >
                      <StatusBadge status={chapter.status ?? 'Draft'} size="sm" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Dates
              </h4>
              <div className="space-y-3">
                {chapter.date_created && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Created</p>
                    <p className="text-slate-900 dark:text-white text-sm">{formatDate(chapter.date_created)}</p>
                  </div>
                )}
                {chapter.last_edit && (
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                      <Edit3 className="w-3 h-3" />
                      Last Edit
                    </p>
                    <p className="text-slate-900 dark:text-white text-sm">{formatDate(chapter.last_edit)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Summary</h4>
              {isEditing === 'summary' ? (
                <div className="space-y-2">
                  <textarea
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-2 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white text-sm min-h-[80px]"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        onUpdateChapter?.({ summary: editValue || null })
                        setIsEditing(null)
                      }}
                      className="px-2 py-1 bg-purple-600 text-white text-xs rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(null)}
                      className="px-2 py-1 text-slate-400 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditValue(chapter.summary ?? '')
                    setIsEditing('summary')
                  }}
                  className="text-left w-full"
                >
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {chapter.summary || 'Add a summary...'}
                  </p>
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Statistics
              </h4>
              <div className="space-y-3">
                {chapter.word_count != null && (
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Word Count</p>
                    <p className="text-slate-900 dark:text-white font-medium">{formatWordCountNumber(chapter.word_count)} words</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate-400 mb-1">Current Content</p>
                  <p className="text-slate-900 dark:text-white text-sm">
                    {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length} words
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div>
            <ReadabilityAnalysis content={content} />
          </div>
        )}

        {activeTab === 'outline' && headings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <List className="w-4 h-4" />
              Document Outline
            </h4>
            <div className="space-y-1">
              {headings.map((h, i) => (
                <button
                  key={`${h.tag}-${i}`}
                  onClick={() => onHeadingClick?.(i)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm transition-colors ${
                    h.tag === 'H1' ? 'font-semibold' : h.tag === 'H2' ? 'pl-5' : 'pl-7 text-xs'
                  }`}
                >
                  {h.text || '(empty)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && snapshots && snapshots.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <History className="w-4 h-4" />
              Version History
            </h4>
            <p className="text-xs text-slate-400 mb-2">
              Snapshots are created automatically while you edit. Select one to restore its content in the editor.
            </p>
            <div className="space-y-2">
              {snapshots
                .slice()
                .reverse()
                .map((snapshot) => (
                  <button
                    key={snapshot.id}
                    type="button"
                    onClick={() => onRestoreSnapshot?.(snapshot.id)}
                    className="w-full text-left px-3 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span className="flex flex-col">
                      <span>
                        {snapshot.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {formatWordCountNumber(snapshot.wordCount)} words
                      </span>
                    </span>
                  </button>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'navigation' && (previousChapterId || nextChapterId) && onNavigateToChapter && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Navigation className="w-4 h-4" />
              Navigation
            </h4>
            <div className="space-y-2">
              {previousChapterId && (
                <button
                  onClick={() => onNavigateToChapter(previousChapterId)}
                  className="w-full px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors text-left"
                >
                  ← Previous Chapter
                </button>
              )}
              {nextChapterId && (
                <button
                  onClick={() => onNavigateToChapter(nextChapterId)}
                  className="w-full px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white text-sm font-medium rounded-lg transition-colors text-left"
                >
                  Next Chapter →
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
