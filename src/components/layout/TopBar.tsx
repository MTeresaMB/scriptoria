import React from 'react'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTheme } from '@/contexts/theme'
import { Search, Sun, Moon, Menu } from 'lucide-react'

interface TopBarProps {
  onOpenSearch?: () => void
  onOpenSidebar?: () => void
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenSearch, onOpenSidebar }) => {
  const { user } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="bg-white border-b border-slate-200 dark:bg-slate-800 dark:border-slate-700 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate">
            Welcome back, {(user?.user_metadata?.display_name as string) || user?.email?.split('@')[0] || 'Writer'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm truncate">
            Continue writing your manuscripts
          </p>
        </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {/* Search (Ctrl+K) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-100 border border-slate-300 dark:bg-slate-700 dark:border-slate-600 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-400 dark:hover:border-slate-500 w-40 md:w-64 text-left shrink-0"
          >
            <Search className="w-4 h-4 shrink-0" />
            <span>Search...</span>
            <kbd className="ml-auto text-xs px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-slate-700 dark:text-slate-300">⌘K</kbd>
          </button>

          {/* User Avatar */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}