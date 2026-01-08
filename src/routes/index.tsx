import { Routes, Route, Navigate } from "react-router-dom"
import { AuthPage } from "../components/layout/AuthPage"
import { ProtectedRoute } from "../components/layout/ProtectedRoute"
import { LoginForm } from "../components/auth/LoginForm"
import { RegisterForm } from "../components/auth/RegisterForm"
import { Dashboard } from "../pages/dashboard/Dashboard"
import { ManuscriptsPage } from "../pages/manuscripts/ManuscriptsPage"
import { CharactersPage } from "../pages/characters/CharactersPage"
import { NotesPage } from "../pages/notes/NotesPage"
import { ChaptersPage } from "../pages/chapters/ChaptersPage"
import { ManuscriptEditPage, ManuscriptNewPage } from "./ManuscriptsRoutes"
import { CharacterEditPage, CharacterNewPage } from "./CharactersRoutes"
import { ChapterEditPage, ChapterNewPage } from "./ChaptersRoutes"
import { NoteEditPage, NoteNewPage } from "./NotesRoutes"
import { ManuscriptDetailPage } from "@/pages/manuscripts/ManuscriptDetailPage"
import { CharacterDetailPage } from "@/pages/characters/CharacterDetailPage"
import { NoteDetailPage } from "@/pages/notes/NoteDetailPage"
import { ChapterDetailPage } from "@/pages/chapters/ChapterDetailPage"

export function AppRoutes() {
  return (
    <Routes>
      {/* públicas */}
      <Route path="/login" element={<AuthPage><LoginForm /></AuthPage>} />
      <Route path="/register" element={<AuthPage><RegisterForm /></AuthPage>} />

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