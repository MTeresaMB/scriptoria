import React, { useCallback, useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import { Minimize2 } from 'lucide-react'
import { EditorHeader } from './EditorHeader'
import { EditorToolbar } from './EditorToolbar'
import { FloatingToolbar } from './FloatingToolbar'
import { SearchReplace } from './SearchReplace'
import { EditorSidebar } from './EditorSidebar'
import { EditorFooter } from './EditorFooter'
import { useEditorHistory } from '@/hooks/editor/useEditorHistory'
import { useEditorPreferences } from '@/hooks/editor/useEditorPreferences'
import { useTheme } from '@/contexts/theme'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import { sanitizeEditorHtml } from '@/utils/sanitizeEditorHtml'

interface ChapterEditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => Promise<boolean>
  isSaving: boolean
  hasUnsavedChanges: boolean
  chapterTitle?: string
  manuscriptTitle?: string
  chapter?: ChapterRow | null
  previousChapterId?: number | null
  nextChapterId?: number | null
  onNavigateToChapter?: (id: number) => void
  onUpdateChapter?: (updates: Partial<ChapterRow>) => Promise<void>
  onSaveComplete?: () => void
}

export const ChapterEditor: React.FC<ChapterEditorProps> = ({
  content,
  onChange,
  onSave,
  isSaving,
  hasUnsavedChanges,
  chapterTitle,
  manuscriptTitle,
  chapter,
  previousChapterId,
  nextChapterId,
  onNavigateToChapter,
  onUpdateChapter,
  onSaveComplete,
}) => {
  const { theme: appTheme } = useTheme()
  const [isDistractionFree, setIsDistractionFree] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  const { preferences, updatePreference } = useEditorPreferences()
  const { snapshots, createSnapshot } = useEditorHistory()

  useEffect(() => {
    if (!isSaving && !hasUnsavedChanges && lastSaved === null) {
      setLastSaved(new Date())
    }
  }, [isSaving, hasUnsavedChanges, lastSaved])

  const handleSave = useCallback(async () => {
    const result = await onSave()
    if (result) {
      setLastSaved(new Date())
      onSaveComplete?.()
    }
  }, [onSave, onSaveComplete])

  useEffect(() => {
    if (preferences.autoSaveInterval > 0 && hasUnsavedChanges && !isSaving) {
      const interval = setInterval(() => {
        void handleSave()
      }, preferences.autoSaveInterval * 1000)

      return () => clearInterval(interval)
    }
  }, [preferences.autoSaveInterval, hasUnsavedChanges, isSaving, handleSave])

  const getThemeClasses = () => {
    const baseClasses = 'h-full'
    // Con la app en oscuro, el cromo del editor debe ser oscuro; el “papel” lo pinta el lienzo interior.
    if (appTheme === 'dark') {
      return `${baseClasses} bg-slate-900 text-slate-100`
    }
    switch (preferences.theme) {
      case 'light':
        return `${baseClasses} bg-gray-50 text-gray-900`
      case 'sepia':
        return `${baseClasses} bg-amber-50 text-amber-900`
      default:
        return `${baseClasses} bg-slate-900 text-slate-100`
    }
  }

  const getFontFamily = () => {
    switch (preferences.font) {
      case 'serif':
        return 'font-serif'
      case 'monospace':
        return 'font-mono'
      default:
        return 'font-sans'
    }
  }

  const getFontWeight = () => {
    switch (preferences.fontWeight) {
      case 'medium':
        return 'font-medium'
      case 'semibold':
        return 'font-semibold'
      case 'bold':
        return 'font-bold'
      default:
        return 'font-normal'
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Avoid duplicate extension registration warning.
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-400 hover:text-purple-300 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your chapter content here...',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: `prose ${preferences.theme === 'dark' ? 'prose-invert' : ''} focus:outline-none min-h-[500px] px-4 py-3 ${getFontFamily()} ${getFontWeight()} ${
          preferences.columnWidth === 'narrow' ? 'max-w-[600px] mx-auto' :
          preferences.columnWidth === 'medium' ? 'max-w-[800px] mx-auto' :
          preferences.columnWidth === 'wide' ? 'max-w-[1000px] mx-auto' :
          'max-w-none'
        } ${preferences.wordWrap ? '' : 'whitespace-nowrap overflow-x-auto'} ${
          preferences.typewriterMode ? 'typewriter-mode' : ''
        } editor-theme-${preferences.theme}`,
        style: `font-size: ${preferences.fontSize}px; line-height: ${preferences.lineHeight}; ${
          preferences.paragraphSpacing ? `--paragraph-spacing: ${preferences.paragraphSpacing}em;` : ''
        }`,
      },
    },
    editable: !isPreviewMode,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      createSnapshot(html)
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  useEffect(() => {
    if (editor) {
      const editorElement = editor.view.dom
      if (editorElement) {
        editorElement.style.fontSize = `${preferences.fontSize}px`
        editorElement.style.lineHeight = `${preferences.lineHeight}`
        if (preferences.wordWrap) {
          editorElement.style.whiteSpace = 'pre-wrap'
          editorElement.style.wordWrap = 'break-word'
        } else {
          editorElement.style.whiteSpace = 'pre'
          editorElement.style.wordWrap = 'normal'
        }
        if (preferences.paragraphSpacing) {
          const proseElement = editorElement.querySelector('.ProseMirror')
          if (proseElement) {
            ;(proseElement as HTMLElement).style.setProperty('--paragraph-spacing', `${preferences.paragraphSpacing}em`)
          }
        }
        if (preferences.typewriterMode) {
          editorElement.classList.add('typewriter-mode')
        } else {
          editorElement.classList.remove('typewriter-mode')
        }
        if (preferences.focusMode) {
          editorElement.classList.add('focus-mode')
        } else {
          editorElement.classList.remove('focus-mode')
        }
        if (preferences.guideLine) {
          editorElement.classList.add('editor-guide-line')
        } else {
          editorElement.classList.remove('editor-guide-line')
        }
        const proseElement = editorElement.querySelector('.ProseMirror')
        if (proseElement) {
          proseElement.classList.remove('editor-theme-dark', 'editor-theme-light', 'editor-theme-sepia')
          proseElement.classList.add(`editor-theme-${preferences.theme}`)
        }
      }
    }
  }, [editor, preferences.fontSize, preferences.lineHeight, preferences.wordWrap, preferences.paragraphSpacing, preferences.typewriterMode, preferences.focusMode, preferences.guideLine, preferences.theme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        void handleSave()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false)
        } else if (isDistractionFree) {
          setIsDistractionFree(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, isDistractionFree, handleSave])

  if (!editor) {
    return null
  }

  const isFocusMode = preferences.focusMode
  const showToolbar = !isDistractionFree && !isFocusMode

  return (
    <div className={`flex flex-col h-full min-h-0 ${getThemeClasses()} ${isDistractionFree ? 'fixed inset-0 z-50' : ''}`}>
      {!isDistractionFree && (
        <EditorHeader
          manuscriptTitle={manuscriptTitle}
          chapterTitle={chapterTitle}
          chapter={chapter}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
          lastSaved={lastSaved}
          onSave={handleSave}
          onSearch={() => setIsSearchOpen(!isSearchOpen)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
          isSearchOpen={isSearchOpen}
          onToggleDistractionFree={() => setIsDistractionFree(true)}
          onNavigateToChapter={onNavigateToChapter}
          previousChapterId={previousChapterId}
          nextChapterId={nextChapterId}
          content={content}
          fontSize={preferences.fontSize}
          columnWidth={preferences.columnWidth}
          onFontSizeChange={(size) => updatePreference('fontSize', size)}
          onColumnWidthChange={(width) => updatePreference('columnWidth', width)}
          onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
          isPreviewMode={isPreviewMode}
          theme={preferences.theme}
          onThemeChange={(theme) => updatePreference('theme', theme)}
          font={preferences.font}
          onFontChange={(font) => updatePreference('font', font)}
          lineHeight={preferences.lineHeight}
          onLineHeightChange={(height) => updatePreference('lineHeight', height)}
          wordWrap={preferences.wordWrap}
          onWordWrapChange={(enabled) => updatePreference('wordWrap', enabled)}
          lineNumbers={preferences.lineNumbers}
          onLineNumbersChange={(enabled) => updatePreference('lineNumbers', enabled)}
          typewriterMode={preferences.typewriterMode}
          onTypewriterModeChange={(enabled) => updatePreference('typewriterMode', enabled)}
          paragraphSpacing={preferences.paragraphSpacing}
          onParagraphSpacingChange={(spacing) => updatePreference('paragraphSpacing', spacing)}
          fontWeight={preferences.fontWeight}
          onFontWeightChange={(weight) => updatePreference('fontWeight', weight)}
          autoSaveInterval={preferences.autoSaveInterval}
          onAutoSaveIntervalChange={(interval) => updatePreference('autoSaveInterval', interval)}
          wordCountGoal={preferences.wordCountGoal}
          onWordCountGoalChange={(goal) => updatePreference('wordCountGoal', goal)}
          focusMode={preferences.focusMode}
          onFocusModeChange={(enabled) => updatePreference('focusMode', enabled)}
          guideLine={preferences.guideLine}
          onGuideLineChange={(enabled) => updatePreference('guideLine', enabled)}
        />
      )}

      {isDistractionFree && (
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
          <div className="flex items-center gap-4">
            {chapterTitle && (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {chapterTitle}
              </h2>
            )}
            {hasUnsavedChanges && (
              <span className="text-xs text-yellow-400">Unsaved changes</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors text-sm"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsDistractionFree(false)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-medium rounded-lg transition-colors text-sm"
              title="Exit distraction-free mode"
            >
              <Minimize2 className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      )}

      {!isDistractionFree && (
        <SearchReplace
          editor={editor}
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {showToolbar && <EditorToolbar editor={editor} />}
      {!isDistractionFree && <FloatingToolbar editor={editor} />}

      <div className="flex-1 relative min-h-0 overflow-hidden flex">
        <div className={`flex-1 relative min-h-0 overflow-auto ${isSidebarOpen ? '' : ''}`}>
          <div
            data-editor-surface={appTheme === 'dark' ? 'dark' : 'light'}
            className={`h-full border rounded-none ${isPreviewMode ? 'p-8' : ''} editor-theme-${preferences.theme} ${
              preferences.theme === 'light'
                ? 'bg-white border-gray-300 dark:bg-slate-900 dark:border-slate-600'
                : preferences.theme === 'sepia'
                  ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/50'
                  : appTheme === 'dark'
                    ? 'bg-slate-900 border-slate-600'
                    : 'bg-slate-50 border-slate-200 dark:border-slate-600'
            } ${preferences.lineNumbers ? 'editor-line-numbers' : ''}`}
          >
            {isPreviewMode ? (
              <div 
                className="preview-mode mx-auto"
                style={{ 
                  fontSize: `${preferences.fontSize}px`,
                  lineHeight: preferences.lineHeight,
                  maxWidth: preferences.columnWidth === 'narrow' ? '600px' :
                           preferences.columnWidth === 'medium' ? '800px' :
                           preferences.columnWidth === 'wide' ? '1000px' :
                           '100%'
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeEditorHtml(content) }}
              />
            ) : (
              <EditorContent editor={editor} className="h-full min-h-0 bg-transparent" />
            )}
          </div>
        </div>

        {!isDistractionFree && chapter && (
          <EditorSidebar
            chapter={chapter}
            content={content}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            snapshots={snapshots}
            onRestoreSnapshot={(snapshotId) => {
              const snapshot = snapshots.find((s) => s.id === snapshotId)
              if (snapshot) {
                editor.commands.setContent(snapshot.content, { emitUpdate: true })
              }
            }}
            onNavigateToChapter={onNavigateToChapter}
            previousChapterId={previousChapterId}
            nextChapterId={nextChapterId}
            onUpdateChapter={onUpdateChapter}
          />
        )}
      </div>

      {!isDistractionFree && (
        <EditorFooter
          content={content}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}
