import React from 'react'
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Chapter } from '@/types'

const mockGetUser = vi.fn()
const mockInsertChapter = vi.fn()
const mockUpdateChapter = vi.fn()

const toastError = vi.fn()
const toastSuccess = vi.fn()

vi.mock('@lib/supabase', () => ({
  supabase: {
    auth: { getUser: mockGetUser },
  },
}))

vi.mock('@lib/repository/chaptersRepository', () => ({
  insertChapter: mockInsertChapter,
  updateChapter: mockUpdateChapter,
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

describe('useChapterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockReset()
    mockInsertChapter.mockReset()
    mockUpdateChapter.mockReset()
  })

  it('does not submit when chapter title is too short', async () => {
    const { useChapterForm } = await import('./useChapterForm')

    const onSuccess = vi.fn()
    const { result } = renderHook(() => useChapterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name_chapter'
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
    expect(mockInsertChapter).not.toHaveBeenCalled()
    expect(result.current.fieldErrors.name_chapter).toBe('Title must be at least 2 characters')
  })

  it('inserts chapter when form is valid', async () => {
    const { useChapterForm } = await import('./useChapterForm')

    const onSuccess = vi.fn()
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertChapter.mockResolvedValue({
      data: { id_chapter: 10, name_chapter: 'Chapter 1' },
      error: null,
    })

    const { result } = renderHook(() => useChapterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name_chapter'
    input.value = 'Chapter 1'

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

    await waitFor(() => expect(mockInsertChapter).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Chapter created successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('updates chapter when initialData is provided', async () => {
    const { useChapterForm } = await import('./useChapterForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockUpdateChapter.mockResolvedValue({
      data: { id_chapter: 1, name_chapter: 'Updated chapter' },
      error: null,
    })

    const initialData = {
      id_chapter: 1,
      name_chapter: 'Old chapter',
      chapter_number: 1,
      id_manuscript: 1,
      id_user: 'user-1',
      date_created: new Date().toISOString(),
      last_edit: null,
      status: null,
      summary: null,
      word_count: 10,
      content: null,
    } as unknown as Chapter

    const { result } = renderHook(() => useChapterForm({ initialData, onSuccess }))

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as unknown as React.FormEvent<HTMLFormElement>,
      )
    })

    await waitFor(() => expect(mockUpdateChapter).toHaveBeenCalled())
    expect(toastSuccess).toHaveBeenCalledWith('Chapter updated successfully')
    expect(onSuccess).toHaveBeenCalled()
  })

  it('shows an error toast when getUser fails', async () => {
    const { useChapterForm } = await import('./useChapterForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useChapterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name_chapter'
    input.value = 'Chapter 1'

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

    await waitFor(() => expect(toastError).toHaveBeenCalledWith('No user authenticated'))
    expect(mockInsertChapter).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('shows an error toast when insertChapter fails', async () => {
    const { useChapterForm } = await import('./useChapterForm')

    const onSuccess = vi.fn()

    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-1' } },
      error: null,
    })

    mockInsertChapter.mockResolvedValue({
      data: null,
      error: new Error('DB insert failed'),
    })

    const { result } = renderHook(() => useChapterForm({ onSuccess }))

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'name_chapter'
    input.value = 'Chapter 1'

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
    expect(mockInsertChapter).toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
  })
})

