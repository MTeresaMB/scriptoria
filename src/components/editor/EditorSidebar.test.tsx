import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorSidebar } from './EditorSidebar'
import { createChapterRow } from '@/test/factories'

describe('EditorSidebar', () => {
  it('muestra contenido del tab info por defecto y cambia de tabs', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const onNavigateToChapter = vi.fn()
    const onHeadingClick = vi.fn()

    const chapter = createChapterRow({
      id_chapter: 10,
      name_chapter: 'My Chapter',
      chapter_number: 2,
      status: 'Draft',
      word_count: 1200,
      date_created: '2024-01-02T00:00:00.000Z',
      last_edit: '2024-01-03T00:00:00.000Z',
      summary: 'Summary text',
    })

    const content = `
      <h1>Heading One</h1>
      <p>Text</p>
      <h2>Subheading</h2>
    `

    render(
      <EditorSidebar
        chapter={chapter}
        content={content}
        isOpen
        onClose={onClose}
        snapshots={[
          { id: 's1', timestamp: new Date('2024-01-04T10:15:00.000Z'), wordCount: 42 },
        ]}
        onNavigateToChapter={onNavigateToChapter}
        previousChapterId={9}
        nextChapterId={null}
        onHeadingClick={onHeadingClick}
      />,
    )

    // Default tab
    expect(screen.getByText('Basic Information')).toBeInTheDocument()

    // Stats
    await user.click(screen.getByRole('button', { name: 'Stats' }))
    expect(screen.getByText('Statistics')).toBeInTheDocument()
    expect(screen.getByText('Current Content')).toBeInTheDocument()

    // Analysis
    await user.click(screen.getByRole('button', { name: 'Analysis' }))
    expect(screen.getByText('Writing Analysis')).toBeInTheDocument()

    // Outline
    await user.click(screen.getByRole('button', { name: 'Outline' }))
    expect(screen.getByText('Document Outline')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Heading One' })).toBeInTheDocument()

    // History
    await user.click(screen.getByRole('button', { name: 'History' }))
    expect(screen.getByText('Version History')).toBeInTheDocument()

    // Navigation
    await user.click(screen.getByRole('button', { name: 'Nav' }))
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    const prevBtn = screen.getByRole('button', { name: '← Previous Chapter' })
    await user.click(prevBtn)
    expect(onNavigateToChapter).toHaveBeenCalledWith(9)
  })

  it('no renderiza si isOpen es false', () => {
    const chapter = createChapterRow({ id_chapter: 1, name_chapter: 'C' })
    const { container } = render(
      <EditorSidebar chapter={chapter} content="" isOpen={false} onClose={vi.fn()} />,
    )
    expect(container.firstChild).toBeNull()
  })
})

