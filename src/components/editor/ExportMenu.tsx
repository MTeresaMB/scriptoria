import React, { useState, useRef, useEffect } from 'react'
import { Download, FileText, FileCode, FileType, File, Loader2 } from 'lucide-react'
import { useExport } from '@/hooks/editor/useExport'

interface ExportMenuProps {
  content: string
  chapterTitle?: string
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ content, chapterTitle }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { exportToText, exportToMarkdown, exportToPDF, exportToHTML } = useExport({
    content,
    chapterTitle: chapterTitle || 'Chapter',
  })

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

  const handleExport = async (exportFn: () => void | Promise<void>) => {
    setIsExporting(true)
    try {
      await exportFn()
    } catch (error) {
      console.error('Export error:', error)
      alert('Error exporting file. Please try again.')
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
        title="Export chapter"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Exporting...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export</span>
          </>
        )}
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden bg-black/20"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 py-1">
            <button
              onClick={() => handleExport(exportToText)}
              disabled={isExporting}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-700 disabled:opacity-50"
            >
              <FileText className="w-4 h-4" />
              <span>Export as Text (.txt)</span>
            </button>

            <button
              onClick={() => handleExport(exportToMarkdown)}
              disabled={isExporting}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-700 disabled:opacity-50"
            >
              <FileCode className="w-4 h-4" />
              <span>Export as Markdown (.md)</span>
            </button>

            <button
              onClick={() => handleExport(exportToHTML)}
              disabled={isExporting}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-700 disabled:opacity-50"
            >
              <FileType className="w-4 h-4" />
              <span>Export as HTML (.html)</span>
            </button>

            <div className="border-t border-slate-700 my-1" />

            <button
              onClick={() => handleExport(exportToPDF)}
              disabled={isExporting}
              className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors flex items-center gap-2 focus:outline-none focus:bg-slate-700 disabled:opacity-50"
            >
              <File className="w-4 h-4" />
              <span>Export as PDF (.pdf)</span>
            </button>
          </div>
        </>
      )}
    </div>
  )
}
