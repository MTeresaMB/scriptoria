import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Note } from '@/types'

const mockGetUser = vi.fn()
const mockInsertNote = vi.fn()
const mockUpdateNote = vi.fn()

const toastError = vi.fn()
const toastSuccess = vi.fn()

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
  },
}))

vi.mock('@lib/repository/notesRepository', () => ({
  insertNote: mockInsertNote,
  updateNote: mockUpdateNote,
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: toastSuccess,
      error: toastError,
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

describe('useNoteForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockReset()
    mockInsertNote.mockReset()
    mockUpdateNote.mockReset()
  })

  it('does not submit when title is too short', async () => {
    const { useNoteForm } = await import('./useNoteForm')

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useNoteForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'A'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => {
      expect(toastError).toHaveBeenCalledWith('Please fix the errors before submitting')
    })

    expect(mockGetUser).not.toHaveBeenCalled()
    expect(mockInsertNote).not.toHaveBeenCalled()
    expect(result.current.fieldErrors.title).toBe('Title must be at least 2 characters')
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('inserts note and calls onSuccess when form is valid', async () => {
    const { useNoteForm } = await import('./useNoteForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    const inserted = { id_note: 1, title: 'My Note' }
    // Important: mirror the repository behavior (supabaseRepository.insert uses .single())
    mockInsertNote.mockResolvedValue({
      data: inserted,
      error: null,
    })

    const { result } = renderHook(() => useNoteForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'My Note'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockInsertNote).toHaveBeenCalled())
    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Note created successfully')

    // This is the expected shape: onSuccess(insertedNote)
    expect(onSuccess).toHaveBeenCalledWith(inserted)
  })

  it('updates note when initialData is provided', async () => {
    const { useNoteForm } = await import('./useNoteForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockUpdateNote.mockResolvedValue({
      data: { id_note: 1, title: 'Updated note' },
      error: null,
    })

    const initialData = {
      id_note: 1,
      id_manuscript: null,
      id_user: 'user-1',
      title: 'Old note',
      content: null,
      category: null,
      priority: null,
      date_created: new Date().toISOString(),
      date_updated: null,
    } as unknown as Note

    const { result } = renderHook(() =>
      useNoteForm({ initialData, onSuccess }),
    )

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockUpdateNote).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Note updated successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('shows an error toast when getUser fails (create mode)', async () => {
    const { useNoteForm } = await import('./useNoteForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useNoteForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'Valid Note Title'

    await act(async () => {
      await result.current.handleInputChange(
        { target: input } as unknown as React.ChangeEvent<HTMLInputElement>,
      )
    })

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith('You must be logged in to create a note'),
    )
    expect(mockInsertNote).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

