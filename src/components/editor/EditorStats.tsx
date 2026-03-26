import React from 'react'
import { FileText, Clock, Type } from 'lucide-react'
import { useEditorStats } from '@/hooks/editor/useEditorStats'

interface EditorStatsProps {
  content: string
  className?: string
  compact?: boolean
}

export const EditorStats: React.FC<EditorStatsProps> = ({ content, className = '', compact = false }) => {
  const stats = useEditorStats(content)

  if (compact) {
    return (
      <div className={`flex items-center gap-3 text-xs ${className}`}>
        <span className="text-slate-600 dark:text-slate-400">{stats.wordCount.toLocaleString()} words</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className="text-slate-600 dark:text-slate-400">{stats.characterCount.toLocaleString()} chars</span>
        <span className="text-slate-400 dark:text-slate-500">•</span>
        <span className="text-slate-600 dark:text-slate-400">~{stats.readingTime} min</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <FileText className="w-4 h-4" />
        <span>{stats.wordCount.toLocaleString()} words</span>
      </div>
      
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Type className="w-4 h-4" />
        <span>{stats.characterCount.toLocaleString()} chars</span>
      </div>
      
      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
        <Clock className="w-4 h-4" />
        <span>~{stats.readingTime} min read</span>
      </div>
    </div>
  )
}
