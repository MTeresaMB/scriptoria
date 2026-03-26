import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChapterCard } from './ChapterCard'
import { createChapterRow } from '@/test/factories'

describe('ChapterCard', () => {
  it('renders chapter title, label and manuscript title', () => {
    const chapter = createChapterRow({
      name_chapter: 'The Gate',
      chapter_number: 3,
      status: 'Draft',
    })

    render(
      <ChapterCard
        chapter={chapter}
        manuscriptTitle="My Novel"
      />,
    )

    expect(screen.getByText('The Gate')).toBeInTheDocument()
    expect(screen.getByText('Chapter 3')).toBeInTheDocument()
    expect(screen.getByText('My Novel')).toBeInTheDocument()
    expect(screen.getByText(/DRAFT/i)).toBeInTheDocument()
  })

  it('calls onView with chapter id when the card is activated', async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const chapter = createChapterRow({ id_chapter: 42, name_chapter: 'Click me' })

    render(<ChapterCard chapter={chapter} onView={onView} />)

    await user.click(screen.getByRole('button', { name: /View chapter: Click me/i }))
    expect(onView).toHaveBeenCalledTimes(1)
    expect(onView).toHaveBeenCalledWith(42)
  })

  it('renders summary when present', () => {
    const chapter = createChapterRow({
      summary: 'Only visible summary line.',
    })

    render(<ChapterCard chapter={chapter} />)
    expect(screen.getByText('Only visible summary line.')).toBeInTheDocument()
  })

  it('shows generic Chapter label when chapter_number is null', () => {
    const chapter = createChapterRow({ chapter_number: null })
    render(<ChapterCard chapter={chapter} />)
    expect(screen.getByText(/^Chapter$/)).toBeInTheDocument()
  })
})
