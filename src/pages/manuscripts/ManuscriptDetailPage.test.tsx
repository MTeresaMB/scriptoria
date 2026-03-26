import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ManuscriptDetailPage } from './ManuscriptDetailPage'
import { createManuscriptRow } from '@/test/factories'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import type { CharactersRow } from '@/lib/repository/charactersRepository'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

const mockFetchManuscriptById = vi.hoisted(() => vi.fn())
const mockFetchCharactersByManuscriptId = vi.hoisted(() => vi.fn())
const mockFetchChaptersByManuscriptId = vi.hoisted(() => vi.fn())

const manuscriptHookState = vi.hoisted(() => ({
  isLoading: false,
  error: null as string | null,
}))

const charactersState = vi.hoisted(() => ({
  characters: [] as CharactersRow[],
}))

const chaptersState = vi.hoisted(() => ({
  chapters: [] as ChapterRow[],
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

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    fetchManuscriptById: mockFetchManuscriptById,
    remove: vi.fn(),
    isLoading: manuscriptHookState.isLoading,
    error: manuscriptHookState.error,
  }),
}))

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => ({
    characters: charactersState.characters,
    fetchCharactersByManuscriptId: mockFetchCharactersByManuscriptId,
  }),
}))

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => ({
    chapters: chaptersState.chapters,
    fetchChaptersByManuscriptId: mockFetchChaptersByManuscriptId,
    remove: vi.fn(),
    reorder: vi.fn(),
  }),
}))

describe('ManuscriptDetailPage', () => {
  it('muestra “Manuscript not found” cuando el fetch devuelve null', async () => {
    manuscriptHookState.isLoading = false
    manuscriptHookState.error = null
    charactersState.characters = []
    chaptersState.chapters = []

    mockFetchManuscriptById.mockResolvedValue(null)
    mockFetchCharactersByManuscriptId.mockResolvedValue([])
    mockFetchChaptersByManuscriptId.mockResolvedValue([])

    render(
      <MemoryRouter initialEntries={['/manuscripts/1']}>
        <Routes>
          <Route path="/manuscripts/:id" element={<ManuscriptDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Manuscript not found')).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        "The manuscript you're looking for doesn't exist or has been deleted.",
      ),
    ).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error al cargar', () => {
    manuscriptHookState.isLoading = false
    manuscriptHookState.error = 'boom'

    mockFetchManuscriptById.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/manuscripts/1']}>
        <Routes>
          <Route path="/manuscripts/:id" element={<ManuscriptDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Error loading manuscript' })).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renderiza manuscrito, resumen y secciones relacionadas', async () => {
    const manuscript = createManuscriptRow({
      id_manuscript: 7,
      title: 'Epic Novel',
      summary: 'A long journey.',
      status: 'draft',
      word_count: 5000,
      genre: 'Fantasy',
      date_created: '2024-01-02T00:00:00.000Z',
    })

    manuscriptHookState.isLoading = false
    manuscriptHookState.error = null
    charactersState.characters = []
    chaptersState.chapters = []

    mockFetchManuscriptById.mockResolvedValue(manuscript)
    mockFetchCharactersByManuscriptId.mockResolvedValue([])
    mockFetchChaptersByManuscriptId.mockResolvedValue([])

    render(
      <MemoryRouter initialEntries={['/manuscripts/7']}>
        <Routes>
          <Route path="/manuscripts/:id" element={<ManuscriptDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('Epic Novel')).toBeInTheDocument()
    })

    expect(screen.getByText('Summary')).toBeInTheDocument()
    expect(screen.getByText('A long journey.')).toBeInTheDocument()
    expect(screen.getByText('Characters in this manuscript')).toBeInTheDocument()
    expect(
      screen.getByText('No characters linked to this manuscript yet.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Chapters in this manuscript')).toBeInTheDocument()
    expect(
      screen.getByText('No chapters created for this manuscript yet.'),
    ).toBeInTheDocument()

    const user = userEvent.setup()
    const menuTrigger = screen.getByRole('button', { name: /manuscript menu/i })
    await user.click(menuTrigger)
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})
