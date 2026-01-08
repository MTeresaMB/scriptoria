import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useDashboardNavigation = () => {
  const navigate = useNavigate()

  const handleViewAllManuscripts = useCallback(() => {
    navigate('/manuscripts')
  }, [navigate])

  const handleViewAllCharacters = useCallback(() => {
    navigate('/characters')
  }, [navigate])

  const handleViewAllNotes = useCallback(() => {
    navigate('/notes')
  }, [navigate])

  const handleCreateManuscript = useCallback(() => {
    navigate('/manuscripts/new?from=dashboard')
  }, [navigate])

  const handleCreateCharacter = useCallback(() => {
    navigate('/characters/new?from=dashboard')
  }, [navigate])

  const handleCreateNote = useCallback(() => {
    navigate('/notes/new')
  }, [navigate])

  const handleEditManuscript = useCallback((id: number) => {
    navigate(`/manuscripts/edit/${id}?from=dashboard`)
  }, [navigate])

  const handleEditCharacter = useCallback((id: number) => {
    navigate(`/characters/edit/${id}?from=dashboard`)
  }, [navigate])

  const handleViewManuscript = useCallback((id: number) => {
    navigate(`/manuscripts/${id}?from=dashboard`)
  }, [navigate])

  const handleViewCharacter = useCallback((id: number) => {
    navigate(`/characters/${id}?from=dashboard`)
  }, [navigate])

  const handleViewAllChapters = useCallback(() => {
    navigate('/chapters')
  }, [navigate])

  const handleViewChapter = useCallback((id: number) => {
    navigate(`/chapters/${id}?from=dashboard`)
  }, [navigate])

  const handleCreateChapter = useCallback(() => {
    navigate('/chapters/new?from=dashboard')
  }, [navigate])

  const handleEditChapter = useCallback((id: number) => {
    navigate(`/chapters/edit/${id}?from=dashboard`)
  }, [navigate])

  const handleViewNote = useCallback((id: number) => {
    navigate(`/notes/${id}?from=dashboard`)
  }, [navigate])

  return {
    handleViewAllManuscripts,
    handleViewAllCharacters,
    handleViewAllNotes,
    handleViewAllChapters,
    handleCreateManuscript,
    handleCreateCharacter,
    handleCreateNote,
    handleCreateChapter,
    handleEditManuscript,
    handleEditCharacter,
    handleEditChapter,
    handleViewManuscript,
    handleViewCharacter,
    handleViewChapter,
    handleViewNote,
  }
}

