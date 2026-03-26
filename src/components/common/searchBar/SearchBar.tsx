import React from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <div
        className="flex items-center w-full rounded-lg border border-slate-300 bg-slate-100 dark:border-slate-600 dark:bg-slate-700/50 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-shadow"
      >
        <Search className="w-5 h-5 text-slate-500 dark:text-slate-400 ml-3 shrink-0 pointer-events-none" aria-hidden />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-w-0 bg-transparent py-2 pl-2 pr-2 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none"
        />
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="mr-2 p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
