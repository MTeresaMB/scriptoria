import React from 'react'
import { Keyboard, Save, Search } from 'lucide-react'
import { EditorStats } from './EditorStats'

interface EditorFooterProps {
  content: string
  hasUnsavedChanges: boolean
  isSaving: boolean
  showShortcuts?: boolean
}

export const EditorFooter: React.FC<EditorFooterProps> = ({
  content,
  hasUnsavedChanges,
  isSaving,
  showShortcuts = true,
}) => {
  const kbdClass =
    'inline-block px-1.5 py-0.5 rounded text-xs font-medium border border-slate-300 bg-slate-200 text-slate-800 dark:border-slate-500 dark:bg-slate-600 dark:text-slate-100'

  return (
    <div className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-4 py-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
      {/* Left: Stats */}
      <div className="flex items-center gap-4">
        <EditorStats content={content} compact />
        {hasUnsavedChanges && !isSaving && (
          <span className="text-yellow-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Unsaved changes
          </span>
        )}
        {isSaving && (
          <span className="text-blue-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Saving...
          </span>
        )}
      </div>

      {/* Right: Shortcuts */}
      {showShortcuts && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" />
            <span className="hidden sm:inline">Shortcuts:</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <kbd className={kbdClass}>Ctrl</kbd>
              <span>+</span>
              <kbd className={kbdClass}>S</kbd>
              <Save className="w-3 h-3 ml-1" />
            </div>
            <div className="flex items-center gap-1">
              <kbd className={kbdClass}>Ctrl</kbd>
              <span>+</span>
              <kbd className={kbdClass}>F</kbd>
              <Search className="w-3 h-3 ml-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
