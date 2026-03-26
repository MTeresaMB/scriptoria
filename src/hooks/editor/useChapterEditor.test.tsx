import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useChapterEditor } from './useChapterEditor'
import { createChapterRow } from '@/test/factories'

const mockToastError = vi.fn()

const mockGetChapterById = vi.hoisted(() => vi.fn())
const mockUpdateChapter = vi.hoisted(() => vi.fn())
const mockRecalculate = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      error: mockToastError,
      success: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

vi.mock('@/lib/repository/chaptersRepository', () => ({
  getChapterById: (...args: unknown[]) => mockGetChapterById(...args),
  updateChapter: (...args: unknown[]) => mockUpdateChapter(...args),
}))

vi.mock('@/lib/repository/manuscriptRepository', () => ({
  recalculateManuscriptWordCount: (...args: unknown[]) => mockRecalculate(...args),
}))

describe('useChapterEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetChapterById.mockResolvedValue({ data: null, error: null })
    mockUpdateChapter.mockResolvedValue({ error: null })
  })

  it('con chapterId null deja capítulo y contenido vacíos', () => {
    const { result } = renderHook(() =>
      useChapterEditor({ chapterId: null }),
    )

    expect(result.current.chapter).toBeNull()
    expect(result.current.content).toBe('')
    expect(result.current.error).toBeNull()
    expect(result.current.hasUnsavedChanges).toBe(false)
  })

  it('carga capítulo y contenido cuando chapterId está definido', async () => {
    const row = createChapterRow({
      id_chapter: 5,
      content: '<p>Hello</p>',
      word_count: 10,
    })
    mockGetChapterById.mockResolvedValue({ data: row, error: null })

    const { result } = renderHook(() => useChapterEditor({ chapterId: 5 }))

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.chapter).toEqual(row)
    expect(result.current.content).toBe('<p>Hello</p>')
    expect(result.current.error).toBeNull()
  })

  it('expone error cuando getChapterById falla', async () => {
    mockGetChapterById.mockResolvedValue({
      data: null,
      error: { message: 'not found' } as Error,
    })

    const { result } = renderHook(() => useChapterEditor({ chapterId: 1 }))

    await waitFor(() => {
      expect(result.current.error).toBe('not found')
    })
    expect(result.current.chapter).toBeNull()
  })

  it('handleSave persiste contenido y devuelve true', async () => {
    const row = createChapterRow({
      id_chapter: 8,
      id_manuscript: 2,
      content: '<p>Old</p>',
      word_count: 1,
    })
    mockGetChapterById.mockResolvedValue({ data: row, error: null })

    const { result } = renderHook(() => useChapterEditor({ chapterId: 8 }))

    await waitFor(() => {
      expect(result.current.chapter).not.toBeNull()
    })

    act(() => {
      result.current.handleContentChange('<p>New words here</p>')
    })

    expect(result.current.hasUnsavedChanges).toBe(true)

    let ok = false
    await act(async () => {
      ok = await result.current.handleSave()
    })

    expect(ok).toBe(true)
    expect(mockUpdateChapter).toHaveBeenCalledWith(
      8,
      expect.objectContaining({
        content: '<p>New words here</p>',
        word_count: expect.any(Number) as number,
      }),
    )
    expect(mockRecalculate).toHaveBeenCalledWith(2)
  })

  it('handleSave devuelve false y muestra toast si updateChapter falla', async () => {
    const row = createChapterRow({
      id_chapter: 9,
      content: '<p>x</p>',
      word_count: 1,
    })
    mockGetChapterById.mockResolvedValue({ data: row, error: null })
    mockUpdateChapter.mockResolvedValue({
      error: new Error('write failed'),
    })

    const { result } = renderHook(() => useChapterEditor({ chapterId: 9 }))

    await waitFor(() => {
      expect(result.current.chapter).not.toBeNull()
    })

    let ok = true
    await act(async () => {
      ok = await result.current.handleSave()
    })

    expect(ok).toBe(false)
    expect(mockToastError).toHaveBeenCalledWith('write failed')
  })
})
