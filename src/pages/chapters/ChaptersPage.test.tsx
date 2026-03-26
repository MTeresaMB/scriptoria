import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ChaptersPage } from './ChaptersPage'
import { createChapterRow } from '@/test/factories'

const mockUseChapters = vi.hoisted(() => vi.fn())
const mockUseManuscripts = vi.hoisted(() => vi.fn())
const mockUseToast = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => mockUseChapters(),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => mockUseManuscripts(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => mockUseToast(),
}))

describe('ChaptersPage', () => {
  beforeEach(() => {
    mockUseChapters.mockReset()
    mockUseManuscripts.mockReset()
    mockUseToast.mockReset()

    mockUseManuscripts.mockReturnValue({ manuscripts: [] })
    mockUseToast.mockReturnValue({ toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() } })
  })

  it('renderiza el título y las cards cuando hay capítulos', () => {
    mockUseChapters.mockReturnValue({
      chapters: [
        createChapterRow({ id_chapter: 1, name_chapter: 'Chapter Alpha', chapter_number: 1 }),
        createChapterRow({ id_chapter: 2, name_chapter: 'Chapter Beta', chapter_number: 2 }),
      ],
      isLoading: false,
      error: null,
      getChapters: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      reorder: vi.fn(),
      fetchChapterById: vi.fn(),
      fetchChaptersByManuscriptId: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/chapters']}>
        <Routes>
          <Route path="/chapters" element={<ChaptersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Your Chapters')).toBeInTheDocument()

    const chapterAlpha = screen.getByText('Chapter Alpha') as HTMLElement
    const chapterBeta = screen.getByText('Chapter Beta') as HTMLElement

    expect(chapterAlpha).toHaveClass('text-slate-900')
    expect(chapterBeta).toHaveClass('text-slate-900')
  })

  it('renderiza empty state cuando no hay capítulos', () => {
    mockUseChapters.mockReturnValue({
      chapters: [],
      isLoading: false,
      error: null,
      getChapters: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      reorder: vi.fn(),
      fetchChapterById: vi.fn(),
      fetchChaptersByManuscriptId: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/chapters']}>
        <Routes>
          <Route path="/chapters" element={<ChaptersPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('No chapters yet')).toBeInTheDocument()
  })
})

