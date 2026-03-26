import { describe, it, expect } from 'vitest'
import { filterBySearch, filterByField, sortItems } from './filters'
import type { SortOption } from './filters'

type Row = { id: number; title: string; status?: string; words?: number; at?: string }

const rows: Row[] = [
  { id: 1, title: 'Alpha', status: 'Draft', words: 100, at: '2024-01-02T00:00:00Z' },
  { id: 2, title: 'beta', status: 'In Progress', words: 500, at: '2024-01-01T00:00:00Z' },
  { id: 3, title: 'Gamma', status: 'Completed', words: 200, at: '2024-01-03T00:00:00Z' },
]

describe('filterBySearch', () => {
  it('returns all items when search is empty or whitespace', () => {
    expect(filterBySearch(rows, '', ['title'])).toHaveLength(3)
    expect(filterBySearch(rows, '   ', ['title'])).toHaveLength(3)
  })

  it('matches any of the given fields case-insensitively', () => {
    expect(filterBySearch(rows, 'BETA', ['title'])).toEqual([rows[1]])
    expect(filterBySearch(rows, 'prog', ['title', 'status'])).toEqual([rows[1]])
  })

  it('skips falsy field values', () => {
    const sparse = [{ id: 1, title: '', note: 'hello' } as Row & { note: string }]
    expect(filterBySearch(sparse, 'hello', ['title', 'note'])).toEqual(sparse)
  })
})

describe('filterByField', () => {
  it('returns all items when value is empty', () => {
    expect(filterByField(rows, 'status', '')).toHaveLength(3)
    expect(filterByField(rows, 'status', null)).toHaveLength(3)
  })

  it('filters by exact string match on field', () => {
    expect(filterByField(rows, 'status', 'Draft')).toEqual([rows[0]])
  })
})

describe('sortItems', () => {
  const dateField = 'at' as keyof Row
  const textField = 'title' as keyof Row
  const statusField = 'status' as keyof Row
  const numberField = 'words' as keyof Row

  it('sorts by recent (date desc)', () => {
    const out = sortItems(rows, 'recent' as SortOption, dateField)
    expect(out.map((r) => r.id)).toEqual([3, 1, 2])
  })

  it('sorts by oldest (date asc)', () => {
    const out = sortItems(rows, 'oldest' as SortOption, dateField)
    expect(out.map((r) => r.id)).toEqual([2, 1, 3])
  })

  it('sorts alphabetically A-Z and Z-A', () => {
    const az = sortItems(rows, 'alphabetical' as SortOption, dateField, textField)
    expect(az.map((r) => r.title)).toEqual(['Alpha', 'beta', 'Gamma'])
    const za = sortItems(rows, 'alphabetical-desc' as SortOption, dateField, textField)
    expect(za.map((r) => r.title)).toEqual(['Gamma', 'beta', 'Alpha'])
  })

  it('sorts by status order: completed, in progress, draft', () => {
    const out = sortItems(rows, 'status' as SortOption, dateField, textField, statusField)
    expect(out.map((r) => r.status)).toEqual(['Completed', 'In Progress', 'Draft'])
  })

  it('sorts by word count descending', () => {
    const out = sortItems(rows, 'word-count' as SortOption, dateField, textField, statusField, numberField)
    expect(out.map((r) => r.words)).toEqual([500, 200, 100])
  })

  it('returns a shallow copy when sort option has no effect (missing field)', () => {
    const copy = sortItems(rows, 'recent' as SortOption)
    expect(copy).not.toBe(rows)
    expect(copy).toEqual(rows)
  })
})
