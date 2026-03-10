import { useState, useEffect, Suspense } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/auth/useAuth"
import { Sidebar } from "./Sidebar"
import { TopBar } from "./TopBar"
import { GlobalSearchModal } from "../search/GlobalSearchModal"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // false = collapsed on mobile; desktop ignores

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="flex h-screen bg-slate-900">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMobileToggle={true}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500" />
            </div>
          }>
            {children}
          </Suspense>
        </main>
      </div>
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  )
}