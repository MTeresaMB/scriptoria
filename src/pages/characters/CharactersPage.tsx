import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CharactersList } from '@/components/characters/CharacterList'

export const CharactersPage: React.FC = () => {
  const navigate = useNavigate()

  const handleCreateCharacter = () => {
    navigate('/characters/new?from=characters')
  }

  return (
    <div className="p-6">
      <CharactersList onCreateNewCharacter={handleCreateCharacter} />
    </div>
  )
}


