import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useChapterFilters } from './useChapterFilters'
import { createChapterRow } from '@/test/factories'

describe('useChapterFilters', () => {
  const chapters = [
    createChapterRow({
      id_chapter: 1,
      name_chapter: 'Alpha',
      status: 'Draft',
      word_count: 100,
      date_created: '2024-01-02T00:00:00.000Z',
    }),
    createChapterRow({
      id_chapter: 2,
      name_chapter: 'Beta Scene',
      summary: 'beta summary text',
      status: 'Completed',
      word_count: 500,
      date_created: '2024-01-03T00:00:00.000Z',
    }),
    createChapterRow({
      id_chapter: 3,
      name_chapter: 'Gamma',
      status: 'In Progress',
      word_count: 200,
      date_created: '2024-01-01T00:00:00.000Z',
    }),
  ]

  it('returns empty list when chapters is undefined', () => {
    const { result } = renderHook(() => useChapterFilters(undefined))
    expect(result.current.filteredAndSortedChapters).toEqual([])
  })

  it('defaults to recent sort (newest date_created first)', () => {
    const { result } = renderHook(() => useChapterFilters(chapters))
    expect(result.current.filteredAndSortedChapters.map((c) => c.id_chapter)).toEqual([2, 1, 3])
  })

  it('filters by search on name_chapter and summary', () => {
    const { result } = renderHook(() => useChapterFilters(chapters))

    act(() => {
      result.current.setSearchText('beta')
    })

    expect(result.current.filteredAndSortedChapters).toHaveLength(1)
    expect(result.current.filteredAndSortedChapters[0].id_chapter).toBe(2)
  })

  it('filters by exact status', () => {
    const { result } = renderHook(() => useChapterFilters(chapters))

    act(() => {
      result.current.setStatusFilter('Draft')
    })

    expect(result.current.filteredAndSortedChapters.map((c) => c.id_chapter)).toEqual([1])
  })

  it('updates sort option to alphabetical', () => {
    const { result } = renderHook(() => useChapterFilters(chapters))

    act(() => {
      result.current.setSortOption('alphabetical')
    })

    expect(result.current.filteredAndSortedChapters.map((c) => c.name_chapter)).toEqual([
      'Alpha',
      'Beta Scene',
      'Gamma',
    ])
  })
})
