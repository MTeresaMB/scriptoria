import { useMemo, useState } from 'react'
import { filterBySearch, filterByField, sortItems, type SortOption } from '@/utils/filters'
import type { ChapterRow } from '@/lib/respository/chaptersRepository'

export const useChapterFilters = (chapters: ChapterRow[] | undefined) => {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('recent')

  const filteredAndSortedChapters = useMemo(() => {
    let filtered = chapters || []

    // Búsqueda
    filtered = filterBySearch(filtered, searchText, ['name_chapter', 'summary'])

    // Filtro por estado
    filtered = filterByField(filtered, 'status', statusFilter)

    // Ordenación
    filtered = sortItems(
      filtered,
      sortOption,
      'date_created',
      'name_chapter',
      'status',
      'word_count'
    )

    return filtered
  }, [chapters, searchText, statusFilter, sortOption])

  return {
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    sortOption,
    setSortOption,
    filteredAndSortedChapters,
  }
}
