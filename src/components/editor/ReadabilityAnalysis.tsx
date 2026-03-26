import React from 'react'
import { MessageSquare, FileText, TrendingUp } from 'lucide-react'
import { calculateFleschReadingEase, getReadabilityLevel, analyzeDialogueVsNarration } from '@/utils/readability'

interface ReadabilityAnalysisProps {
  content: string
  className?: string
}

export const ReadabilityAnalysis: React.FC<ReadabilityAnalysisProps> = ({ content, className = '' }) => {
  const readabilityScore = calculateFleschReadingEase(content)
  const readabilityLevel = getReadabilityLevel(readabilityScore)
  const { dialoguePercentage, narrationPercentage, dialogueCount } = analyzeDialogueVsNarration(content)

  return (
    <div className={`space-y-4 ${className}`}>
      <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
        <TrendingUp className="w-4 h-4" />
        Writing Analysis
      </h4>

      {/* Readability Score */}
      <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-transparent">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-600 dark:text-slate-400">Readability Score</span>
          <span className={`text-sm font-semibold ${readabilityLevel.color}`}>
            {readabilityScore}/100
          </span>
        </div>
        <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              readabilityScore >= 70 ? 'bg-green-500' :
              readabilityScore >= 50 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${readabilityScore}%` }}
          />
        </div>
        <p className={`text-xs mt-1 ${readabilityLevel.color}`}>
          {readabilityLevel.level}
        </p>
      </div>

      {/* Dialogue vs Narration */}
      <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-transparent">
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs text-slate-600 dark:text-slate-400">Dialogue vs Narration</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3 text-purple-400" />
              <span className="text-xs text-slate-600 dark:text-slate-300">Dialogue</span>
            </div>
            <span className="text-xs text-slate-900 dark:text-white font-medium">
              {dialoguePercentage}% ({dialogueCount} quotes)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-slate-600 dark:text-slate-300">Narration</span>
            </div>
            <span className="text-xs text-slate-900 dark:text-white font-medium">{narrationPercentage}%</span>
          </div>
          <div className="w-full bg-slate-300 dark:bg-slate-600 rounded-full h-2 mt-2">
            <div className="flex h-2 rounded-full overflow-hidden">
              <div
                className="bg-purple-500 transition-all"
                style={{ width: `${dialoguePercentage}%` }}
              />
              <div
                className="bg-blue-500 transition-all"
                style={{ width: `${narrationPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
