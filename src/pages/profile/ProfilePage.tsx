import React, { useState } from 'react'
import { useAuth } from '@/hooks/auth/useAuth'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/ui/useToast'
import { User, Mail, Lock, Loader2, UserCircle } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState((user?.user_metadata?.display_name as string) || '')
  const [isUpdating, setIsUpdating] = useState(false)

  React.useEffect(() => {
    setDisplayName((user?.user_metadata?.display_name as string) || '')
  }, [user?.user_metadata?.display_name])

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) return
    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({ data: { display_name: displayName.trim() } })
      if (error) throw error
      toast.success('Display name updated')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsUpdating(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      toast.success('Password updated successfully')
      setPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <User className="w-6 h-6" />
        Profile
      </h1>

      <div className="space-y-6">
        {/* Display name & Avatar */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
            <UserCircle className="w-4 h-4" />
            Profile
          </h2>
          <form onSubmit={handleUpdateDisplayName} className="space-y-2">
            <label htmlFor="displayName" className="block text-xs text-slate-600 dark:text-slate-400">
              Display name
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-purple-600 to-blue-600 flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white">
                  {(displayName || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </div>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 min-w-0 px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Your name"
                disabled={isUpdating}
              />
              <button
                type="submit"
                disabled={isUpdating || !displayName.trim()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors shrink-0"
              >
                Save
              </button>
            </div>
          </form>
        </div>

        {/* Email */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6">
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </h2>
          <p className="text-slate-900 dark:text-white text-lg">{user?.email ?? '—'}</p>
        </div>

        {/* Change Password */}
        <form
          onSubmit={handleChangePassword}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-4"
        >
          <h2 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Change Password
          </h2>
          <div>
            <label htmlFor="password" className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
              New Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              minLength={6}
              disabled={isUpdating}
            />
          </div>
          <div>
            <label htmlFor="confirm" className="block text-xs text-slate-600 dark:text-slate-400 mb-1">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="••••••••"
              minLength={6}
              disabled={isUpdating}
            />
          </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
