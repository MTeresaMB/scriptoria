import React, { useState, useEffect } from 'react'
import { 
  Save, Loader2, ChevronLeft, ChevronRight, Search, Info, 
  Maximize2, CheckCircle2, AlertCircle
} from 'lucide-react'
import { EditorStats } from './EditorStats'
import { ExportMenu } from './ExportMenu'
import { EditorSettings } from './EditorSettings'
import { WordCountGoal } from './WordCountGoal'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'

interface EditorHeaderProps {
  manuscriptTitle?: string
  chapterTitle?: string
  chapter?: ChapterRow | null
  hasUnsavedChanges: boolean
  isSaving: boolean
  lastSaved?: Date | null
  onSave: () => void
  onSearch: () => void
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  isSearchOpen: boolean
  onToggleDistractionFree: () => void
  onNavigateToChapter?: (id: number) => void
  previousChapterId?: number | null
  nextChapterId?: number | null
  content: string
  fontSize: number
  columnWidth: 'narrow' | 'medium' | 'wide' | 'full'
  onFontSizeChange: (size: number) => void
  onColumnWidthChange: (width: 'narrow' | 'medium' | 'wide' | 'full') => void
  onTogglePreview: () => void
  isPreviewMode: boolean
  theme?: 'dark' | 'light' | 'sepia'
  onThemeChange?: (theme: 'dark' | 'light' | 'sepia') => void
  font?: 'sans-serif' | 'serif' | 'monospace'
  onFontChange?: (font: 'sans-serif' | 'serif' | 'monospace') => void
  lineHeight?: number
  onLineHeightChange?: (height: number) => void
  wordWrap?: boolean
  onWordWrapChange?: (enabled: boolean) => void
  lineNumbers?: boolean
  onLineNumbersChange?: (enabled: boolean) => void
  typewriterMode?: boolean
  onTypewriterModeChange?: (enabled: boolean) => void
  paragraphSpacing?: number
  onParagraphSpacingChange?: (spacing: number) => void
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  onFontWeightChange?: (weight: 'normal' | 'medium' | 'semibold' | 'bold') => void
  autoSaveInterval?: number
  onAutoSaveIntervalChange?: (interval: number) => void
  wordCountGoal?: number
  onWordCountGoalChange?: (goal: number) => void
  focusMode?: boolean
  onFocusModeChange?: (enabled: boolean) => void
  guideLine?: boolean
  onGuideLineChange?: (enabled: boolean) => void
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  manuscriptTitle,
  chapterTitle,
  chapter,
  hasUnsavedChanges,
  isSaving,
  lastSaved,
  onSave,
  onSearch,
  onToggleSidebar,
  isSidebarOpen,
  isSearchOpen,
  onToggleDistractionFree,
  onNavigateToChapter,
  previousChapterId,
  nextChapterId,
  content,
  fontSize,
  columnWidth,
  onFontSizeChange,
  onColumnWidthChange,
  onTogglePreview,
  isPreviewMode,
  theme,
  onThemeChange,
  font,
  onFontChange,
  lineHeight,
  onLineHeightChange,
  wordWrap,
  onWordWrapChange,
  lineNumbers,
  onLineNumbersChange,
  typewriterMode,
  onTypewriterModeChange,
  paragraphSpacing,
  onParagraphSpacingChange,
  fontWeight,
  onFontWeightChange,
  autoSaveInterval,
  onAutoSaveIntervalChange,
  wordCountGoal,
  onWordCountGoalChange,
  focusMode,
  onFocusModeChange,
  guideLine,
  onGuideLineChange,
}) => {
  const [timeSinceSave, setTimeSinceSave] = useState<string>('')

  useEffect(() => {
    if (!lastSaved) return

    const updateTime = () => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000)
      
      if (diff < 60) {
        setTimeSinceSave('just now')
      } else if (diff < 3600) {
        const minutes = Math.floor(diff / 60)
        setTimeSinceSave(`${minutes}m ago`)
      } else {
        const hours = Math.floor(diff / 3600)
        setTimeSinceSave(`${hours}h ago`)
      }
    }

    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [lastSaved])

  const getSaveStatus = () => {
    if (isSaving) {
      return { icon: Loader2, text: 'Saving...', color: 'text-blue-400', animate: true }
    }
    if (hasUnsavedChanges) {
      return { icon: AlertCircle, text: 'Unsaved changes', color: 'text-yellow-400', animate: true }
    }
    return { icon: CheckCircle2, text: `Saved ${timeSinceSave}`, color: 'text-green-400', animate: false }
  }

  const saveStatus = getSaveStatus()
  const StatusIcon = saveStatus.icon

  return (
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Navigation & Title */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Chapter Navigation */}
          {(previousChapterId || nextChapterId) && onNavigateToChapter && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => previousChapterId && onNavigateToChapter(previousChapterId)}
                disabled={!previousChapterId}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous Chapter"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => nextChapterId && onNavigateToChapter(nextChapterId)}
                disabled={!nextChapterId}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next Chapter"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title / Breadcrumb */}
          <div className="flex-1 min-w-0">
            {(manuscriptTitle || chapterTitle) && (
              <div className="flex items-center gap-2 text-sm text-slate-400 truncate">
                {manuscriptTitle && (
                  <>
                    <span className="font-medium text-slate-300">{manuscriptTitle}</span>
                    {chapterTitle && <span>›</span>}
                  </>
                )}
                {chapterTitle && (
                  <h2 className="text-lg font-semibold text-white truncate">
                    {chapterTitle}
                  </h2>
                )}
              </div>
            )}
            {chapter?.status && (
              <div className="mt-1 flex items-center gap-2">
                {chapter.status && (
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-300 text-xs rounded">
                    {chapter.status}
                  </span>
                )}
                {isPreviewMode && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                    Preview Mode
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Save Status */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${saveStatus.color}`}>
            <StatusIcon className={`w-4 h-4 ${saveStatus.animate ? 'animate-spin' : ''}`} />
            <span className="text-xs">{saveStatus.text}</span>
          </div>

          {/* Word Count Goal */}
          {wordCountGoal && wordCountGoal > 0 && (
            <div className="hidden md:block">
              <WordCountGoal content={content} goal={wordCountGoal} />
            </div>
          )}

          {/* Stats */}
          <div className="hidden lg:block">
            <EditorStats content={content} />
          </div>

          {/* Actions */}
          <button
            onClick={onSearch}
            className={`p-2 rounded-lg transition-colors ${
              isSearchOpen
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title="Search (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors ${
              isSidebarOpen
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
            }`}
            title="Chapter Info"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* Always visible options */}
          <ExportMenu content={content} chapterTitle={chapterTitle} />
          <EditorSettings
            fontSize={fontSize}
            onFontSizeChange={onFontSizeChange}
            columnWidth={columnWidth}
            onColumnWidthChange={onColumnWidthChange}
            onTogglePreview={onTogglePreview}
            isPreviewMode={isPreviewMode}
            theme={theme}
            onThemeChange={onThemeChange}
            font={font}
            onFontChange={onFontChange}
            lineHeight={lineHeight}
            onLineHeightChange={onLineHeightChange}
            wordWrap={wordWrap}
            onWordWrapChange={onWordWrapChange}
            lineNumbers={lineNumbers}
            onLineNumbersChange={onLineNumbersChange}
            typewriterMode={typewriterMode}
            onTypewriterModeChange={onTypewriterModeChange}
            paragraphSpacing={paragraphSpacing}
            onParagraphSpacingChange={onParagraphSpacingChange}
            fontWeight={fontWeight}
            onFontWeightChange={onFontWeightChange}
            autoSaveInterval={autoSaveInterval}
            onAutoSaveIntervalChange={onAutoSaveIntervalChange}
            wordCountGoal={wordCountGoal}
            onWordCountGoalChange={onWordCountGoalChange}
            focusMode={focusMode}
            onFocusModeChange={onFocusModeChange}
            guideLine={guideLine}
            onGuideLineChange={onGuideLineChange}
          />

          <button
            onClick={onToggleDistractionFree}
            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
            title="Distraction-free mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={onSave}
            disabled={isSaving || !hasUnsavedChanges}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
            title="Save (Ctrl+S)"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
