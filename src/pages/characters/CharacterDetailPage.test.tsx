import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CharacterDetailPage } from './CharacterDetailPage'
import { createCharacterRow, createManuscriptRow } from '@/test/factories'
import type { CharactersRow } from '@/lib/repository/charactersRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

const mockFetchCharacterById = vi.hoisted(() => vi.fn())

const charactersState = vi.hoisted(() => ({
  characters: [] as CharactersRow[],
  isLoading: false,
  error: null as string | null,
}))

const manuscriptsState = vi.hoisted(() => ({
  manuscripts: [] as ManuscriptRow[],
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: mockToastSuccess,
      error: mockToastError,
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => ({
    characters: charactersState.characters,
    isLoading: charactersState.isLoading,
    error: charactersState.error,
    remove: vi.fn(),
    fetchCharacterById: mockFetchCharacterById,
  }),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    manuscripts: manuscriptsState.manuscripts,
  }),
}))

describe('CharacterDetailPage', () => {
  it('muestra “Character not found” cuando el fetch devuelve null', async () => {
    charactersState.isLoading = false
    charactersState.error = null
    charactersState.characters = []

    mockFetchCharacterById.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/characters/1']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Character not found')).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        "The character you're looking for doesn't exist or has been deleted.",
      ),
    ).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error al cargar', () => {
    charactersState.isLoading = false
    charactersState.error = 'boom'
    charactersState.characters = []

    mockFetchCharacterById.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/characters/1']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Error loading character' })).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renderiza personaje y manuscrito relacionado cuando existen datos', async () => {
    const character = createCharacterRow({
      id_character: 3,
      name: 'Aria Vale',
      id_manuscript: 9,
      role: 'Protagonist',
      biography: 'Born in the mist.',
    })

    const manuscript = createManuscriptRow({
      id_manuscript: 9,
      title: 'Linked Book',
      genre: 'Sci-Fi',
    })

    charactersState.isLoading = true
    charactersState.error = null
    charactersState.characters = []
    manuscriptsState.manuscripts = [manuscript]

    mockFetchCharacterById.mockResolvedValue(character)

    render(
      <MemoryRouter initialEntries={['/characters/3']}>
        <Routes>
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Aria Vale')).toBeInTheDocument()
    })

    expect(screen.getByText('Protagonist')).toBeInTheDocument()
    expect(screen.getByText('Biography')).toBeInTheDocument()
    expect(screen.getByText('Born in the mist.')).toBeInTheDocument()
    expect(screen.getByText('Related Manuscript')).toBeInTheDocument()
    expect(screen.getByText('Linked Book')).toBeInTheDocument()

    const user = userEvent.setup()
    const menuTrigger = screen.getByRole('button', { name: /character menu/i })
    await user.click(menuTrigger)
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})
