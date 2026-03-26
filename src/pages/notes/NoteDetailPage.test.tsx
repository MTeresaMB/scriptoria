import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NoteDetailPage } from './NoteDetailPage'
import { createNote } from '@/test/factories'
import type { NoteRow } from '@/lib/repository/notesRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

const mockFetchNoteById = vi.hoisted(() => vi.fn())
const notesState = vi.hoisted(() => ({
  notes: [] as NoteRow[],
  isLoading: true,
  error: null as string | null,
  remove: vi.fn(),
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

vi.mock('@/hooks/data/useNotes', () => ({
  useNotes: () => ({
    notes: notesState.notes,
    isLoading: notesState.isLoading,
    error: notesState.error,
    remove: notesState.remove,
    fetchNoteById: mockFetchNoteById,
  }),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    manuscripts: mockManuscriptsState.manuscripts,
  }),
}))

describe('NoteDetailPage', () => {
  it('muestra “Note not found” cuando el fetch devuelve null', async () => {
    notesState.isLoading = false
    notesState.error = null
    notesState.notes = []

    mockFetchNoteById.mockResolvedValue(null)
    mockManuscriptsState.manuscripts = []

    render(
      <MemoryRouter initialEntries={['/notes/1']}>
        <Routes>
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Note not found')).toBeInTheDocument()
    expect(
      screen.getByText(
        "The note you're looking for doesn't exist or has been deleted.",
      ),
    ).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error al cargar', () => {
    notesState.isLoading = false
    notesState.error = 'boom'
    notesState.notes = []

    mockFetchNoteById.mockResolvedValue(null)

    render(
      <MemoryRouter initialEntries={['/notes/1']}>
        <Routes>
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Error loading note' })).toBeInTheDocument()
    expect(screen.getByText('boom')).toBeInTheDocument()
  })

  it('renderiza nota y muestra related manuscript cuando existen datos', async () => {
    const note = createNote({
      id_note: 1,
      id_manuscript: 5,
      title: 'My Note Title',
      content: 'Note content body',
      category: 'Category A',
      priority: 'High',
      date_created: '2024-01-02T00:00:00.000Z',
    })

    const manuscript = {
      id_manuscript: 5,
      title: 'Manuscript Title',
    } as unknown as ManuscriptRow

    notesState.isLoading = true
    notesState.error = null
    notesState.notes = []
    mockManuscriptsState.manuscripts = [manuscript]

    mockFetchNoteById.mockResolvedValue(note)

    render(
      <MemoryRouter initialEntries={['/notes/1']}>
        <Routes>
          <Route path="/notes/:id" element={<NoteDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(screen.getByText('My Note Title')).toBeInTheDocument()
    })

    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Note content body')).toBeInTheDocument()
    expect(screen.getByText('Related Manuscript')).toBeInTheDocument()
    expect(screen.getByText('Manuscript Title')).toBeInTheDocument()

    // Smoke interaction: menú abrir/cerrar
    const user = userEvent.setup()
    const menuTrigger = screen.getByRole('button', { name: /note menu/i })
    await user.click(menuTrigger)
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument()
    })
  })
})

