import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom"
import { AuthPage } from "../components/layout/AuthPage"
import { ProtectedRoute } from "../components/layout/ProtectedRoute"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { Dashboard } from "../pages/Dashboard"
import { ManuscriptForm } from "../components/manuscripts/ManuscriptForm"
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import type { Manuscript } from "../types"

function ManuscriptNewPage() {
  const navigate = useNavigate()

  return (
    <div className="p-6">
      <ManuscriptForm
        onSubmit={() => navigate('/')}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}

function ManuscriptEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<Manuscript | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      return
    }

    const manuscriptId = parseInt(id, 10)
    if (isNaN(manuscriptId)) {
      console.error('Invalid manuscript ID:', id)
      setIsLoading(false)
      return
    }

    (async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase
          .from("manuscript")
          .select("*")
          .eq("id_manuscript", manuscriptId)
          .single()

        if (error) throw error
        setData(data ?? null)
      } catch (err) {
        console.error('Error loading manuscript:', err)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [id])

  if (isLoading) return <div className="p-6 text-white">Loading...</div>
  if (!data) return <div className="p-6 text-white">Manuscript not found</div>

  return (
    <div className="p-6">
      <ManuscriptForm
        initialDataForm={data}
        onSubmit={() => navigate('/')}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/login" element={<AuthPage><LoginForm /></AuthPage>} />
      <Route path="/register" element={<AuthPage><RegisterForm /></AuthPage>} />

      {/* privadas */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route
        path="/manuscripts/new"
        element={<ProtectedRoute><ManuscriptNewPage /></ProtectedRoute>}
      />
      <Route path="/manuscripts/edit/:id" element={<ProtectedRoute><ManuscriptEditPage /></ProtectedRoute>} />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}