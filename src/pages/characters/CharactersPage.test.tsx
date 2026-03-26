import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { CharactersPage } from './CharactersPage'
import { createCharacterRow } from '@/test/factories'

const mockUseCharacters = vi.hoisted(() => vi.fn())
const mockUseToast = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => mockUseCharacters(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => mockUseToast(),
}))

describe('CharactersPage', () => {
  beforeEach(() => {
    mockUseCharacters.mockReset()
    mockUseToast.mockReset()
    mockUseToast.mockReturnValue({
      toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
    })
  })

  it('renderiza lista y nombres cuando hay personajes', () => {
    mockUseCharacters.mockReturnValue({
      characters: [
        createCharacterRow({ id_character: 1, name: 'Aria' }),
        createCharacterRow({ id_character: 2, name: 'Bruno' }),
      ],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getCharacters: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Routes>
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Your Characters')).toBeInTheDocument()
    expect(screen.getByText('Aria')).toBeInTheDocument()
    expect(screen.getByText('Bruno')).toBeInTheDocument()
  })

  it('renderiza empty state cuando no hay personajes', () => {
    mockUseCharacters.mockReturnValue({
      characters: [],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getCharacters: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Routes>
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('No characters yet')).toBeInTheDocument()
  })

  it('muestra spinner mientras carga', () => {
    mockUseCharacters.mockReturnValue({
      characters: [],
      isLoading: true,
      error: null,
      remove: vi.fn(),
      getCharacters: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Routes>
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error', () => {
    mockUseCharacters.mockReturnValue({
      characters: [],
      isLoading: false,
      error: 'timeout',
      remove: vi.fn(),
      getCharacters: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/characters']}>
        <Routes>
          <Route path="/characters" element={<CharactersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /error to load characters/i })).toBeInTheDocument()
    expect(screen.getByText('timeout')).toBeInTheDocument()
  })
})
