import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Manuscript } from '@/types'

const mockGetUser = vi.fn()
const mockInsertManuscript = vi.fn()
const mockUpdateManuscript = vi.fn()

const toastError = vi.fn()
const toastSuccess = vi.fn()

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
  },
}))

vi.mock('@lib/repository/manuscriptRepository', () => ({
  insertManuscript: mockInsertManuscript,
  updateManuscript: mockUpdateManuscript,
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

describe('useManuscriptForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockReset()
    mockInsertManuscript.mockReset()
    mockUpdateManuscript.mockReset()
  })

  it('does not submit when title is too short', async () => {
    const { useManuscriptForm } = await import('./useManuscriptForm')

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useManuscriptForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'ab'

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
    expect(mockInsertManuscript).not.toHaveBeenCalled()

    expect(result.current.fieldErrors.title).toBe('Title must be at least 3 characters')
  })

  it('inserts manuscript when form is valid', async () => {
    const { useManuscriptForm } = await import('./useManuscriptForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertManuscript.mockResolvedValue({
      data: { id_manuscript: 1, title: 'My Manuscript' },
      error: null,
    })

    const { result } = renderHook(() => useManuscriptForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'My Manuscript'

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

    await waitFor(() => expect(mockInsertManuscript).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Manuscript created successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('updates manuscript when initialData is provided', async () => {
    const { useManuscriptForm } = await import('./useManuscriptForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockUpdateManuscript.mockResolvedValue({
      data: { id_manuscript: 1, title: 'Updated title' },
      error: null,
    })

    const initialData = {
      id_manuscript: 1,
      title: 'Old Manuscript',
      summary: null,
      status: 'Draft',
      word_count: 10,
      picture: null,
      genre: null,
      target_audience: null,
      id_user: 'user-1',
      date_created: new Date().toISOString(),
    } as unknown as Manuscript

    const { result } = renderHook(() =>
      useManuscriptForm({ initialData, onSuccess }),
    )

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockUpdateManuscript).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Manuscript updated successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('shows an error toast when getUser fails', async () => {
    const { useManuscriptForm } = await import('./useManuscriptForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useManuscriptForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'Valid Manuscript'

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
      expect(toastError).toHaveBeenCalledWith('No user authenticated')
    })
    expect(mockInsertManuscript).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows an error toast when insertManuscript fails', async () => {
    const { useManuscriptForm } = await import('./useManuscriptForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertManuscript.mockResolvedValue({
      data: null,
      error: new Error('DB insert failed'),
    })

    const { result } = renderHook(() => useManuscriptForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'title'
    input.value = 'Valid Manuscript'

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
      expect(toastError).toHaveBeenCalledWith('DB insert failed')
    })
    expect(mockInsertManuscript).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

