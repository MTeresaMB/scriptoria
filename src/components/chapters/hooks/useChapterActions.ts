import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { useChapters } from '@/hooks/useChapters'

interface UseChapterActionsProps {
  onCreateNewChapter?: () => void
}

export const useChapterActions = ({ onCreateNewChapter }: UseChapterActionsProps = {}) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { remove } = useChapters()

  const handleCreateChapter = useCallback(() => {
    if (onCreateNewChapter) return onCreateNewChapter()
    navigate('/chapters/new?from=chapters')
  }, [navigate, onCreateNewChapter])

  const handleEditChapter = useCallback((id: number) => {
    navigate(`/chapters/edit/${id}?from=chapters`)
  }, [navigate])

  const handleViewChapter = useCallback((id: number) => {
    navigate(`/chapters/${id}?from=chapters`)
  }, [navigate])

  const handleDeleteChapter = useCallback(async (id: number) => {
    try {
      await remove(id)
      toast.success('Chapter deleted successfully')
    } catch {
      toast.error('Error deleting chapter')
    }
  }, [remove, toast])

  return {
    handleCreateChapter,
    handleEditChapter,
    handleViewChapter,
    handleDeleteChapter,
  }
}
