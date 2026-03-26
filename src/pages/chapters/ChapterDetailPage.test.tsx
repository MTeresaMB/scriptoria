import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ChapterDetailPage } from './ChapterDetailPage'
import { createChapterRow } from '@/test/factories'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

const mockFetchChapterById = vi.hoisted(() => vi.fn())
const chaptersState = vi.hoisted(() => ({
  chapters: [] as ChapterRow[],
  isLoading: true,
  error: null as string | null,
  remove: vi.fn(),
}))

const mockFetchCharactersByManuscriptId = vi.hoisted(() => vi.fn())
const charactersState = vi.hoisted(() => ({
  characters: [],
  fetchCharactersByManuscriptId: mockFetchCharactersByManuscriptId,
}))

const mockManuscriptsState = vi.hoisted(() => ({
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

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => ({
    chapters: chaptersState.chapters,
    isLoading: chaptersState.isLoading,
    error: chaptersState.error,
    remove: chaptersState.remove,
    fetchChapterById: mockFetchChapterById,
  }),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    manuscripts: mockManuscriptsState.manuscripts,
  }),
}))

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => ({
    characters: charactersState.characters,
    fetchCharactersByManuscriptId: charactersState.fetchCharactersByManuscriptId,
  }),
}))

vi.mock('@/components/chapters/ChapterCharactersSection', () => ({
  ChapterCharactersSection: () => <div data-testid="chapter-characters-section" />,
}))

describe('ChapterDetailPage', () => {
  it('muestra “Chapter not found” cuando el fetch devuelve null', async () => {
    chaptersState.isLoading = false
    chaptersState.error = null
    chaptersState.chapters = []

    mockFetchChapterById.mockResolvedValue(null)
    mockManuscriptsState.manuscripts = []

    render(
      <MemoryRouter initialEntries={['/chapters/1']}>
        <Routes>
          <Route path="/chapters/:id" element={<ChapterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Chapter not found')).toBeInTheDocument()
    expect(
      screen.getByText(
        "The chapter you're looking for doesn't exist or has been deleted.",
      ),
    ).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error al cargar', () => {
    chaptersState.isLoading = false
    chaptersState.error = 'boom'
    chaptersState.chapters = []

    mockFetchChapterById.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/chapters/1']}>
        <Routes>
          <Route path="/chapters/:id" element={<ChapterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Error loading chapter' })).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renderiza capítulo y muestra Related Manuscript cuando existen datos', async () => {
    const chapter = createChapterRow({
      id_chapter: 1,
      id_manuscript: 2,
      name_chapter: 'My Chapter',
      chapter_number: 3,
      status: 'Draft',
      summary: 'My chapter summary',
      word_count: 1000,
      date_created: '2024-01-02T00:00:00.000Z',
      last_edit: '2024-01-03T00:00:00.000Z',
    })

    const manuscript = {
      id_manuscript: 2,
      title: 'My Manuscript Title',
    } as unknown as ManuscriptRow

    chaptersState.isLoading = true
    chaptersState.error = null
    chaptersState.chapters = []
    mockManuscriptsState.manuscripts = [manuscript]

    mockFetchChapterById.mockResolvedValue(chapter)
    mockFetchCharactersByManuscriptId.mockResolvedValue([])

    render(
      <MemoryRouter initialEntries={['/chapters/1']}>
        <Routes>
          <Route path="/chapters/:id" element={<ChapterDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByText('My Chapter')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('My Chapter')).toBeInTheDocument()
    })

    expect(screen.getByText('Related Manuscript')).toBeInTheDocument()
    expect(screen.getByText('My Manuscript Title')).toBeInTheDocument()
    expect(screen.getByText('My chapter summary')).toBeInTheDocument()

    const user = userEvent.setup()
    // Smoke: abrir menú (no verificamos acciones, solo que no crashea)
    const menuTrigger = screen.getByRole('button', { name: /chapter menu/i })
    await user.click(menuTrigger)
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})

