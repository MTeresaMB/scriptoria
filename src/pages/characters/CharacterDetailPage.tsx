import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, BookOpen, ExternalLink } from 'lucide-react'
import { useReturnNavigation } from '@/hooks/useReturnNavigation'
import { useToast } from '@/hooks/useToast'
import { useCharacters } from '@/hooks/useCharacters'
import { useManuscripts } from '@/hooks/useManuscripts'
import type { CharactersRow } from '@/lib/respository/charactersRepository'
import { SkeletonLoader } from '@/components/common/skeletonLoader/SkeletonLoader'
import { ErrorState } from '@/components/common/errorState/ErrorState'
import { DeleteConfirmModal } from '@/components/common/deleteConfirmModal/DeleteConfirmModal'
import { CardMenu } from '@/components/common/cardMenu/CardMenu'
import { getInitials } from '@/utils/formatters'

export const CharacterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const returnTo = useReturnNavigation('/characters')
  const { toast } = useToast()

  const {
    characters,
    isLoading,
    error,
    remove,
    fetchCharacterById,
  } = useCharacters()

  const { manuscripts } = useManuscripts()

  const [character, setCharacter] = useState<CharactersRow | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    if (!id) {
      navigate(returnTo)
      return
    }

    const characterId = parseInt(id, 10)
    if (isNaN(characterId)) {
      console.error('Invalid character ID:', id)
      navigate(returnTo)
      return
    }

    const loadCharacter = async () => {
      const data = await fetchCharacterById(characterId)
      if (data) {
        setCharacter(data)
      }
    }

    void loadCharacter()
  }, [id, navigate, returnTo, fetchCharacterById])

  const handleEdit = () => {
    if (!id) return
    navigate(`/characters/edit/${id}?from=detail`)
  }

  const handleDelete = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!character) return

    setIsDeleting(true)
    try {
      await remove(character.id_character)
      toast.success('Character deleted successfully')
      navigate(returnTo)
    } catch (err) {
      console.error('Error deleting character:', err)
      toast.error('Failed to delete character')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const handleCancelDelete = () => {
    setShowDeleteModal(false)
  }

  const handleRetry = () => {
    if (!id) return
    const characterId = parseInt(id, 10)
    if (!isNaN(characterId)) {
      void fetchCharacterById(characterId).then((data) => {
        if (data) {
          setCharacter(data)
        }
      })
    }
  }

  if (isLoading && !character && !characters.length) {
    return (
      <div className="p-6">
        <SkeletonLoader count={4} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState
          error={error}
          onRetry={handleRetry}
          itemType="character"
          title="Error loading character"
          defaultMessage="An error occurred while trying to load the character. Please try again."
        />
      </div>
    )
  }

  if (!character) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800 rounded-xl border border-slate-700 p-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Character not found
          </h3>
          <p className="text-slate-400 text-sm text-center mb-4">
            The character you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate(returnTo)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const initials = getInitials(character.name)

  return (
    <>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(returnTo)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-3xl font-bold text-white">{character.name}</h1>
          </div>
          <CardMenu
            onEdit={handleEdit}
            onDelete={handleDelete}
            itemType="character"
          />
        </div>

        {/* Main info */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center text-2xl font-bold text-white border-2 border-slate-600 shrink-0">
              {character.picture ? (
                <img
                  src={character.picture}
                  alt={character.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {character.role && (
                <div>
                  <p className="text-slate-400 text-sm">Role</p>
                  <p className="text-white font-medium">{character.role}</p>
                </div>
              )}
              {character.age !== null && character.age !== undefined && (
                <div>
                  <p className="text-slate-400 text-sm">Age</p>
                  <p className="text-white font-medium">{character.age}</p>
                </div>
              )}
              {character.occupation && (
                <div>
                  <p className="text-slate-400 text-sm">Occupation</p>
                  <p className="text-white font-medium">
                    {character.occupation}
                  </p>
                </div>
              )}
              {character.relationship_status && (
                <div>
                  <p className="text-slate-400 text-sm">Relationship status</p>
                  <p className="text-white font-medium">
                    {character.relationship_status}
                  </p>
                </div>
              )}
              {character.birth && (
                <div className="md:col-span-2">
                  <p className="text-slate-400 text-sm">Birth</p>
                  <p className="text-white font-medium">{character.birth}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Physical description */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Physical Description
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.height && (
              <div>
                <p className="text-slate-400 text-sm">Height</p>
                <p className="text-white">{character.height}</p>
              </div>
            )}
            {character.weight && (
              <div>
                <p className="text-slate-400 text-sm">Weight</p>
                <p className="text-white">{character.weight}</p>
              </div>
            )}
            {character.build && (
              <div>
                <p className="text-slate-400 text-sm">Build</p>
                <p className="text-white">{character.build}</p>
              </div>
            )}
            {character.hair_color && (
              <div>
                <p className="text-slate-400 text-sm">Hair color</p>
                <p className="text-white">{character.hair_color}</p>
              </div>
            )}
            {character.hair_style && (
              <div>
                <p className="text-slate-400 text-sm">Hair style</p>
                <p className="text-white">{character.hair_style}</p>
              </div>
            )}
            {character.eye_color && (
              <div>
                <p className="text-slate-400 text-sm">Eye color</p>
                <p className="text-white">{character.eye_color}</p>
              </div>
            )}
            {character.eye_shape && (
              <div>
                <p className="text-slate-400 text-sm">Eye shape</p>
                <p className="text-white">{character.eye_shape}</p>
              </div>
            )}
            {character.scars && (
              <div className="md:col-span-2">
                <p className="text-slate-400 text-sm">Scars / Marks</p>
                <p className="text-white">{character.scars}</p>
              </div>
            )}
          </div>
        </div>

        {/* Personality & traits */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Personality & Traits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.positive_traits && (
              <div>
                <p className="text-slate-400 text-sm">Positive traits</p>
                <p className="text-white">{character.positive_traits}</p>
              </div>
            )}
            {character.negative_traits && (
              <div>
                <p className="text-slate-400 text-sm">Negative traits</p>
                <p className="text-white">{character.negative_traits}</p>
              </div>
            )}
            {character.personality_type && (
              <div>
                <p className="text-slate-400 text-sm">Personality type</p>
                <p className="text-white">{character.personality_type}</p>
              </div>
            )}
            {character.quirks_mannerisms && (
              <div className="md:col-span-2">
                <p className="text-slate-400 text-sm">Quirks & mannerisms</p>
                <p className="text-white whitespace-pre-wrap">
                  {character.quirks_mannerisms}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivations & flaws */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Motivations & Flaws
          </h2>
          <div className="space-y-4">
            {character.external_motivation && (
              <div>
                <p className="text-slate-400 text-sm">External motivation</p>
                <p className="text-white whitespace-pre-wrap">
                  {character.external_motivation}
                </p>
              </div>
            )}
            {character.internal_motivation && (
              <div>
                <p className="text-slate-400 text-sm">Internal motivation</p>
                <p className="text-white whitespace-pre-wrap">
                  {character.internal_motivation}
                </p>
              </div>
            )}
            {character.flaw && (
              <div>
                <p className="text-slate-400 text-sm">Fatal flaw</p>
                <p className="text-white whitespace-pre-wrap">
                  {character.flaw}
                </p>
              </div>
            )}
            {character.fears_phobias && (
              <div>
                <p className="text-slate-400 text-sm">Fears & phobias</p>
                <p className="text-white whitespace-pre-wrap">
                  {character.fears_phobias}
                </p>
              </div>
            )}
            {character.motto && (
              <div>
                <p className="text-slate-400 text-sm">Motto / Catchphrase</p>
                <p className="text-white">{character.motto}</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Manuscript */}
        {character.id_manuscript && (
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Related Manuscript</h2>
            {(() => {
              const relatedManuscript = manuscripts?.find((m) => m.id_manuscript === character.id_manuscript);
              if (!relatedManuscript) {
                return <p className="text-slate-500 text-sm">Manuscript not found.</p>;
              }
              return (
                <button
                  onClick={() => navigate(`/manuscripts/${relatedManuscript.id_manuscript}?from=character-detail`)}
                  className="flex items-center gap-3 p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors w-full text-left group"
                >
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold group-hover:text-purple-400 transition-colors truncate">
                      {relatedManuscript.title}
                    </h3>
                    {relatedManuscript.genre && (
                      <p className="text-slate-400 text-sm mt-1">{relatedManuscript.genre}</p>
                    )}
                  </div>
                  <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors shrink-0" />
                </button>
              );
            })()}
          </div>
        )}

        {/* Biography */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Biography</h2>
          {character.biography ? (
            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
              {character.biography}
            </p>
          ) : (
            <p className="text-slate-500 italic">No biography available</p>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        itemTitle={character.name}
        itemType="character"
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message='This action cannot be undone. This character will be deleted permanently.'
      />
    </>
  )
}


