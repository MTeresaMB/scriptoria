import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ManuscriptNewPage, ManuscriptEditPage } from './ManuscriptsRoutes'
import { CharacterNewPage, CharacterEditPage } from './CharactersRoutes'
import { ChapterNewPage, ChapterEditPage } from './ChaptersRoutes'
import { NoteNewPage, NoteEditPage } from './NotesRoutes'
import { createManuscriptRow, createCharacterRow, createChapterRow, createNote } from '@/test/factories'

const mockGetUser = vi.hoisted(() => vi.fn())
const mockFetchManuscriptById = vi.hoisted(() => vi.fn())
const mockFetchCharacterById = vi.hoisted(() => vi.fn())
const mockFetchChapterById = vi.hoisted(() => vi.fn())
const mockFetchNoteById = vi.hoisted(() => vi.fn())

vi.mock('@/components/manuscripts/hooks/useGenres', () => ({
  useGenres: () => ({ genres: [], isLoading: false, error: null }),
}))

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: () => mockGetUser() },
    storage: {
      from: () => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: '' } })),
      }),
    },
  },
}))

vi.mock('@lib/repository/manuscriptRepository', () => ({
  insertManuscript: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateManuscript: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@lib/repository/charactersRepository', () => ({
  insertCharacter: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateCharacter: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@lib/repository/chaptersRepository', () => ({
  insertChapter: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateChapter: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@lib/repository/notesRepository', () => ({
  insertNote: vi.fn().mockResolvedValue({ data: {}, error: null }),
  updateNote: vi.fn().mockResolvedValue({ error: null }),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    manuscripts: [],
    isLoading: false,
    error: null,
    getManuscripts: vi.fn(),
    remove: vi.fn(),
    fetchManuscriptById: mockFetchManuscriptById,
  }),
}))

vi.mock('@/hooks/data/useCharacters', () => ({
  useCharacters: () => ({
    characters: [],
    isLoading: false,
    error: null,
    getCharacters: vi.fn(),
    remove: vi.fn(),
    fetchCharacterById: mockFetchCharacterById,
  }),
}))

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => ({
    chapters: [],
    isLoading: false,
    error: null,
    getChapters: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    reorder: vi.fn(),
    fetchChapterById: mockFetchChapterById,
    fetchChaptersByManuscriptId: vi.fn(),
  }),
}))

vi.mock('@/hooks/data/useNotes', () => ({
  useNotes: () => ({
    notes: [],
    isLoading: false,
    error: null,
    getNotes: vi.fn(),
    remove: vi.fn(),
    fetchNoteById: mockFetchNoteById,
  }),
}))

describe('Páginas de formulario (rutas)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
    mockFetchManuscriptById.mockResolvedValue(null)
    mockFetchCharacterById.mockResolvedValue(null)
    mockFetchChapterById.mockResolvedValue(null)
    mockFetchNoteById.mockResolvedValue(null)
  })

  it('ManuscriptNewPage muestra Nuevo Manuscrito', () => {
    render(
      <MemoryRouter initialEntries={['/manuscripts/new']}>
        <Routes>
          <Route path="/manuscripts/new" element={<ManuscriptNewPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'Nuevo Manuscrito' })).toBeInTheDocument()
  })

  it('ManuscriptEditPage carga datos y muestra Editar Manuscrito', async () => {
    mockFetchManuscriptById.mockResolvedValue(createManuscriptRow({ id_manuscript: 1, title: 'T1' }))
    render(
      <MemoryRouter initialEntries={['/manuscripts/edit/1']}>
        <Routes>
          <Route path="/manuscripts/edit/:id" element={<ManuscriptEditPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Editar Manuscrito' })).toBeInTheDocument()
    })
  })

  it('ManuscriptEditPage muestra error si el manuscrito no existe', async () => {
    mockFetchManuscriptById.mockResolvedValue(null)
    render(
      <MemoryRouter initialEntries={['/manuscripts/edit/99']}>
        <Routes>
          <Route path="/manuscripts/edit/:id" element={<ManuscriptEditPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Error loading manuscript' })).toBeInTheDocument()
    })
  })

  it('CharacterNewPage muestra New Character', () => {
    render(
      <MemoryRouter initialEntries={['/characters/new']}>
        <Routes>
          <Route path="/characters/new" element={<CharacterNewPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'New Character' })).toBeInTheDocument()
  })

  it('CharacterEditPage carga y muestra Edit Character', async () => {
    mockFetchCharacterById.mockResolvedValue(createCharacterRow({ id_character: 2, name: 'X' }))
    render(
      <MemoryRouter initialEntries={['/characters/edit/2']}>
        <Routes>
          <Route path="/characters/edit/:id" element={<CharacterEditPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Character' })).toBeInTheDocument()
    })
  })

  it('ChapterNewPage muestra New Chapter', () => {
    render(
      <MemoryRouter initialEntries={['/chapters/new']}>
        <Routes>
          <Route path="/chapters/new" element={<ChapterNewPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'New Chapter' })).toBeInTheDocument()
  })

  it('ChapterEditPage carga y muestra Edit Chapter', async () => {
    mockFetchChapterById.mockResolvedValue(
      createChapterRow({ id_chapter: 3, name_chapter: 'Cap' }),
    )
    render(
      <MemoryRouter initialEntries={['/chapters/edit/3']}>
        <Routes>
          <Route path="/chapters/edit/:id" element={<ChapterEditPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Chapter' })).toBeInTheDocument()
    })
  })

  it('NoteNewPage muestra New Note', () => {
    render(
      <MemoryRouter initialEntries={['/notes/new']}>
        <Routes>
          <Route path="/notes/new" element={<NoteNewPage />} />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { name: 'New Note' })).toBeInTheDocument()
  })

  it('NoteEditPage carga y muestra Edit Note', async () => {
    mockFetchNoteById.mockResolvedValue(createNote({ id_note: 4, title: 'N' }))
    render(
      <MemoryRouter initialEntries={['/notes/edit/4']}>
        <Routes>
          <Route path="/notes/edit/:id" element={<NoteEditPage />} />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit Note' })).toBeInTheDocument()
    })
  })
})
