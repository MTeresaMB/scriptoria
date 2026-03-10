import { lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthPage } from "../components/layout/AuthPage"
import { ProtectedRoute } from "../components/layout/ProtectedRoute"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { ForgotPasswordForm } from "../components/auth/ForgotPasswordForm"
import { ResetPasswordForm } from "../components/auth/ResetPasswordForm"
const Dashboard = lazy(() => import("../pages/dashboard/Dashboard").then(m => ({ default: m.Dashboard })))
const ManuscriptsPage = lazy(() => import("../pages/manuscripts/ManuscriptsPage").then(m => ({ default: m.ManuscriptsPage })))
const CharactersPage = lazy(() => import("../pages/characters/CharactersPage").then(m => ({ default: m.CharactersPage })))
const NotesPage = lazy(() => import("../pages/notes/NotesPage").then(m => ({ default: m.NotesPage })))
const ChaptersPage = lazy(() => import("../pages/chapters/ChaptersPage").then(m => ({ default: m.ChaptersPage })))
import { ManuscriptEditPage, ManuscriptNewPage } from "./ManuscriptsRoutes"
import { CharacterEditPage, CharacterNewPage } from "./CharactersRoutes"
import { ChapterEditPage, ChapterNewPage } from "./ChaptersRoutes"
import { NoteEditPage, NoteNewPage } from "./NotesRoutes"
const ManuscriptDetailPage = lazy(() => import("@/pages/manuscripts/ManuscriptDetailPage").then(m => ({ default: m.ManuscriptDetailPage })))
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage").then(m => ({ default: m.ProfilePage })))
const CharacterDetailPage = lazy(() => import("@/pages/characters/CharacterDetailPage").then(m => ({ default: m.CharacterDetailPage })))
const NoteDetailPage = lazy(() => import("@/pages/notes/NoteDetailPage").then(m => ({ default: m.NoteDetailPage })))
const ChapterDetailPage = lazy(() => import("@/pages/chapters/ChapterDetailPage").then(m => ({ default: m.ChapterDetailPage })))
const EditorPage = lazy(() => import("@/pages/editor/EditorPage").then(m => ({ default: m.EditorPage })))

export function AppRoutes() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/login" element={<AuthPage><LoginForm /></AuthPage>} />
      <Route path="/register" element={<AuthPage><RegisterForm /></AuthPage>} />
      <Route path="/forgot-password" element={<AuthPage><ForgotPasswordForm /></AuthPage>} />
      <Route path="/reset-password" element={<AuthPage><ResetPasswordForm /></AuthPage>} />

      {/* privadas */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      {/* Secciones principales */}
      <Route path="/manuscripts/:id" element={<ProtectedRoute><ManuscriptDetailPage /></ProtectedRoute>} />
      <Route path="/manuscripts" element={<ProtectedRoute><ManuscriptsPage /></ProtectedRoute>} />
      <Route path="/characters/:id" element={<ProtectedRoute><CharacterDetailPage /></ProtectedRoute>} />
      <Route path="/characters" element={<ProtectedRoute><CharactersPage /></ProtectedRoute>} />
      <Route path="/notes/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><NotesPage /></ProtectedRoute>} />
      <Route path="/chapters/:id" element={<ProtectedRoute><ChapterDetailPage /></ProtectedRoute>} />
      <Route path="/chapters" element={<ProtectedRoute><ChaptersPage /></ProtectedRoute>} />
      <Route path="/editor" element={<ProtectedRoute><EditorPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      {/* Formularios de creación/edición */}
      <Route
        path="/manuscripts/new"
        element={<ProtectedRoute><ManuscriptNewPage /></ProtectedRoute>}
      />
      <Route path="/manuscripts/edit/:id" element={<ProtectedRoute><ManuscriptEditPage /></ProtectedRoute>} />

      <Route path="/characters/new" element={<ProtectedRoute><CharacterNewPage /></ProtectedRoute>} />
      <Route path="/characters/edit/:id" element={<ProtectedRoute><CharacterEditPage /></ProtectedRoute>} />

      <Route path="/chapters/new" element={<ProtectedRoute><ChapterNewPage /></ProtectedRoute>} />
      <Route path="/chapters/edit/:id" element={<ProtectedRoute><ChapterEditPage /></ProtectedRoute>} />

      <Route path="/notes/new" element={<ProtectedRoute><NoteNewPage /></ProtectedRoute>} />
      <Route path="/notes/edit/:id" element={<ProtectedRoute><NoteEditPage /></ProtectedRoute>} />
      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}