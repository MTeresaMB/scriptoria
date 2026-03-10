import React, { useState, useRef, useEffect } from 'react'
import { Settings, Type, Columns, Eye, Palette, WrapText, Hash, FileText, Minus, Bold, Save, Target, Focus } from 'lucide-react'
import type { EditorTheme, EditorFont } from '@/hooks/editor/useEditorPreferences'

interface EditorSettingsProps {
  fontSize: number
  onFontSizeChange: (size: number) => void
  columnWidth: 'narrow' | 'medium' | 'wide' | 'full'
  onColumnWidthChange: (width: 'narrow' | 'medium' | 'wide' | 'full') => void
  onTogglePreview: () => void
  isPreviewMode: boolean
  theme?: EditorTheme
  onThemeChange?: (theme: EditorTheme) => void
  font?: EditorFont
  onFontChange?: (font: EditorFont) => void
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

export const EditorSettings: React.FC<EditorSettingsProps> = ({
  fontSize,
  onFontSizeChange,
  columnWidth,
  onColumnWidthChange,
  onTogglePreview,
  isPreviewMode,
  theme = 'dark',
  onThemeChange,
  font = 'sans-serif',
  onFontChange,
  lineHeight = 1.75,
  onLineHeightChange,
  wordWrap = true,
  onWordWrapChange,
  lineNumbers = false,
  onLineNumbersChange,
  typewriterMode = false,
  onTypewriterModeChange,
  paragraphSpacing = 1.5,
  onParagraphSpacingChange,
  fontWeight = 'normal',
  onFontWeightChange,
  autoSaveInterval = 30,
  onAutoSaveIntervalChange,
  wordCountGoal = 0,
  onWordCountGoalChange,
  focusMode = false,
  onFocusModeChange,
  guideLine = false,
  onGuideLineChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const columnWidthOptions = [
    { value: 'narrow' as const, label: 'Narrow (600px)', width: 'max-w-[600px]' },
    { value: 'medium' as const, label: 'Medium (800px)', width: 'max-w-[800px]' },
    { value: 'wide' as const, label: 'Wide (1000px)', width: 'max-w-[1000px]' },
    { value: 'full' as const, label: 'Full Width', width: 'max-w-none' },
  ]

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors"
        title="Editor Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Settings Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-sm font-semibold text-white mb-4">Editor Settings</h3>

            {/* Font Size */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                <Type className="w-4 h-4" />
                Font Size
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => onFontSizeChange(Number(e.target.value))}
                  className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <span className="text-sm text-white font-medium w-8">{fontSize}px</span>
              </div>
            </div>

            {/* Column Width */}
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                <Columns className="w-4 h-4" />
                Column Width
              </label>
              <div className="space-y-2">
                {columnWidthOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      onColumnWidthChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                      columnWidth === option.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme */}
            {onThemeChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Palette className="w-4 h-4" />
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['dark', 'light', 'sepia'] as EditorTheme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        onThemeChange(t)
                        setIsOpen(false)
                      }}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors capitalize ${
                        theme === t
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Font Family */}
            {onFontChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Type className="w-4 h-4" />
                  Font Family
                </label>
                <div className="space-y-2">
                  {(['sans-serif', 'serif', 'monospace'] as EditorFont[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        onFontChange(f)
                        setIsOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors capitalize ${
                        font === f
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {f === 'sans-serif' ? 'Sans Serif' : f === 'serif' ? 'Serif' : 'Monospace'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Line Height */}
            {onLineHeightChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Minus className="w-4 h-4" />
                  Line Height
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1.2"
                    max="2.5"
                    step="0.05"
                    value={lineHeight}
                    onChange={(e) => onLineHeightChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-sm text-white font-medium w-12">{lineHeight.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Word Wrap */}
            {onWordWrapChange && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    onWordWrapChange(!wordWrap)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    wordWrap
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <WrapText className="w-4 h-4" />
                  <span>Word Wrap</span>
                </button>
              </div>
            )}

            {/* Line Numbers */}
            {onLineNumbersChange && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    onLineNumbersChange(!lineNumbers)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    lineNumbers
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span>Line Numbers</span>
                </button>
              </div>
            )}

            {/* Typewriter Mode */}
            {onTypewriterModeChange && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    onTypewriterModeChange(!typewriterMode)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    typewriterMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Typewriter Mode</span>
                </button>
              </div>
            )}

            {/* Paragraph Spacing */}
            {onParagraphSpacingChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Minus className="w-4 h-4" />
                  Paragraph Spacing
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={paragraphSpacing}
                    onChange={(e) => onParagraphSpacingChange(Number(e.target.value))}
                    className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-purple-600"
                  />
                  <span className="text-sm text-white font-medium w-12">{paragraphSpacing.toFixed(1)}</span>
                </div>
              </div>
            )}

            {/* Font Weight */}
            {onFontWeightChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Bold className="w-4 h-4" />
                  Font Weight
                </label>
                <div className="space-y-2">
                  {(['normal', 'medium', 'semibold', 'bold'] as const).map((weight) => (
                    <button
                      key={weight}
                      onClick={() => {
                        onFontWeightChange(weight)
                        setIsOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors capitalize ${
                        fontWeight === weight
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {weight === 'semibold' ? 'Semi Bold' : weight}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Auto-save Interval */}
            {onAutoSaveIntervalChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Save className="w-4 h-4" />
                  Auto-save Interval
                </label>
                <div className="space-y-2">
                  {[
                    { value: 0, label: 'Manual only' },
                    { value: 10, label: '10 seconds' },
                    { value: 30, label: '30 seconds' },
                    { value: 60, label: '1 minute' },
                    { value: 300, label: '5 minutes' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onAutoSaveIntervalChange(option.value)
                        setIsOpen(false)
                      }}
                      className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors ${
                        autoSaveInterval === option.value
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Word Count Goal */}
            {onWordCountGoalChange && (
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs text-slate-300 mb-2">
                  <Target className="w-4 h-4" />
                  Word Count Goal
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={wordCountGoal}
                    onChange={(e) => onWordCountGoalChange(Number(e.target.value))}
                    placeholder="0 = disabled"
                    className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {wordCountGoal > 0 && (
                    <button
                      onClick={() => onWordCountGoalChange(0)}
                      className="px-2 py-2 bg-slate-600 hover:bg-slate-500 text-slate-300 rounded-lg text-xs transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Focus Mode */}
            {onFocusModeChange && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    onFocusModeChange(!focusMode)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    focusMode
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Focus className="w-4 h-4" />
                  <span>Focus Mode (Highlight Current Line)</span>
                </button>
              </div>
            )}
            {/* Guide Line */}
            {onGuideLineChange && (
              <div className="mb-4">
                <button
                  onClick={() => {
                    onGuideLineChange(!guideLine)
                    setIsOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                    guideLine
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Minus className="w-4 h-4" />
                  <span>Writing Guide Line</span>
                </button>
              </div>
            )}
            {/* Preview Mode */}
            <div>
              <button
                onClick={() => {
                  onTogglePreview()
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  isPreviewMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>Preview Mode</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
