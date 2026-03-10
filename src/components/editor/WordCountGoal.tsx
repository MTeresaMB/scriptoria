import React from 'react'
import { Target } from 'lucide-react'
import { useEditorStats } from '@/hooks/editor/useEditorStats'

interface WordCountGoalProps {
  content: string
  goal: number
  className?: string
}

export const WordCountGoal: React.FC<WordCountGoalProps> = ({ content, goal, className = '' }) => {
  const stats = useEditorStats(content)
  
  if (goal === 0) return null

  const percentage = Math.min((stats.wordCount / goal) * 100, 100)
  const remaining = Math.max(goal - stats.wordCount, 0)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Target className="w-4 h-4 text-purple-400" />
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              percentage >= 100
                ? 'bg-green-500'
                : percentage >= 75
                ? 'bg-purple-500'
                : percentage >= 50
                ? 'bg-blue-500'
                : 'bg-yellow-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-xs text-slate-300 whitespace-nowrap">
          {stats.wordCount.toLocaleString()} / {goal.toLocaleString()}
        </span>
      </div>
      {remaining > 0 && (
        <span className="text-xs text-slate-400 hidden lg:inline">
          {remaining.toLocaleString()} left
        </span>
      )}
    </div>
  )
}
