import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChaptersList } from '@/components/chapters/ChaptersList'

export const ChaptersPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateChapter = () => {
    navigate('/chapters/new?from=chapters')
  }

  return (
    <div className="p-6">
      <ChaptersList onCreateNewChapter={handleCreateChapter} />
    </div>
  )
}


