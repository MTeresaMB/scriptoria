import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Dashboard } from './Dashboard'
import { createManuscriptRow, createCharacterRow } from '@/test/factories'

const mockUseManuscripts = vi.hoisted(() => vi.fn())
const mockUseCharacters = vi.hoisted(() => vi.fn())
const mockUseChapters = vi.hoisted(() => vi.fn())
const mockUseNotes = vi.hoisted(() => vi.fn())
const mockUseStats = vi.hoisted(() => vi.fn())
const mockUseToast = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => mockUseManuscripts(),
}))

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => mockUseCharacters(),
}))

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => mockUseChapters(),
}))

vi.mock('@/hooks/data/useNotes', () => ({
  useNotes: () => mockUseNotes(),
}))

vi.mock('@/hooks/data/useStats', () => ({
  useStats: () => mockUseStats(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => mockUseToast(),
}))

function defaultDashboardMocks() {
  mockUseManuscripts.mockReturnValue({
    manuscripts: [],
    isLoading: false,
    error: null,
    getManuscripts: vi.fn(),
    remove: vi.fn(),
    fetchManuscriptById: vi.fn(),
  })
  mockUseCharacters.mockReturnValue({
    characters: [],
    isLoading: false,
    error: null,
    getCharacters: vi.fn(),
    remove: vi.fn(),
    fetchCharacterById: vi.fn(),
    fetchCharactersByManuscriptId: vi.fn(),
  })
  mockUseChapters.mockReturnValue({
    chapters: [],
    isLoading: false,
    error: null,
    getChapters: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    reorder: vi.fn(),
    fetchChapterById: vi.fn(),
    fetchChaptersByManuscriptId: vi.fn(),
  })
  mockUseNotes.mockReturnValue({
    notes: [],
    isLoading: false,
    error: null,
    getNotes: vi.fn(),
    remove: vi.fn(),
    fetchNoteById: vi.fn(),
  })
  mockUseStats.mockReturnValue({
    stats: null,
    isLoading: false,
    error: null,
    fetchStats: vi.fn(),
    refreshStats: vi.fn(),
  })
  mockUseToast.mockReturnValue({
    toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
  })
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    defaultDashboardMocks()
  })

  it('renderiza cabecera y acciones rápidas', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
    expect(screen.getByText('Resume of your writing activity')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new manuscript/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new character/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new chapter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new note/i })).toBeInTheDocument()
  })

  it('muestra tarjetas de estadísticas con ceros sin datos', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Manuscripts')).toBeInTheDocument()
    expect(screen.getByText('Characters')).toBeInTheDocument()
    expect(screen.getByText('Chapters')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Total Words')).toBeInTheDocument()
  })

  it('muestra manuscrito reciente cuando hay datos', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [createManuscriptRow({ id_manuscript: 3, title: 'Mi obra' })],
      isLoading: false,
      error: null,
      getManuscripts: vi.fn(),
      remove: vi.fn(),
      fetchManuscriptById: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Recent Manuscripts')).toBeInTheDocument()
    expect(screen.getByText('Mi obra')).toBeInTheDocument()
  })

  it('muestra personaje en la sección principal cuando hay datos', () => {
    mockUseCharacters.mockReturnValue({
      characters: [createCharacterRow({ id_character: 9, name: 'Lena' })],
      isLoading: false,
      error: null,
      getCharacters: vi.fn(),
      remove: vi.fn(),
      fetchCharacterById: vi.fn(),
      fetchCharactersByManuscriptId: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Main Characters')).toBeInTheDocument()
    expect(screen.getByText('Lena')).toBeInTheDocument()
  })

  it('muestra skeleton en estadísticas mientras cargan manuscritos', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [],
      isLoading: true,
      error: null,
      getManuscripts: vi.fn(),
      remove: vi.fn(),
      fetchManuscriptById: vi.fn(),
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
