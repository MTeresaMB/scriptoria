import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NotesPage } from './NotesPage'
import { createNote } from '@/test/factories'

const mockUseNotes = vi.hoisted(() => vi.fn())
const mockUseManuscripts = vi.hoisted(() => vi.fn())
const mockUseToast = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/data/useNotes', () => ({
  useNotes: () => mockUseNotes(),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => mockUseManuscripts(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => mockUseToast(),
}))

describe('NotesPage', () => {
  beforeEach(() => {
    mockUseNotes.mockReset()
    mockUseManuscripts.mockReset()
    mockUseToast.mockReset()

    mockUseManuscripts.mockReturnValue({ manuscripts: [] })
    mockUseToast.mockReturnValue({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() } })
  })

  it('renderiza el título y las cards cuando hay notas', () => {
    mockUseNotes.mockReturnValue({
      notes: [createNote({ id_note: 1, title: 'Note One' }), createNote({ id_note: 2, title: 'Note Two' })],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getNotes: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/notes']}>
        <Routes>
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Your Notes')).toBeInTheDocument()

    const noteOne = screen.getByText('Note One') as HTMLElement
    const noteTwo = screen.getByText('Note Two') as HTMLElement

    expect(noteOne).toHaveClass('text-slate-900')
    expect(noteTwo).toHaveClass('text-slate-900')
  })

  it('renderiza empty state cuando no hay notas', () => {
    mockUseNotes.mockReturnValue({
      notes: [],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getNotes: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/notes']}>
        <Routes>
          <Route path="/notes" element={<NotesPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('No notes yet')).toBeInTheDocument()
  })
})

