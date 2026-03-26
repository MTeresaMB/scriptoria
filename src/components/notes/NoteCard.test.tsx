import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NoteCard } from './NoteCard'
import { createNote } from '@/test/factories'

describe('NoteCard', () => {
  it('renders title, content snippet, category and priority', () => {
    const note = createNote({
      title: 'Character voice',
      content: 'Keep dialect consistent.',
      category: 'Style',
      priority: 'Medium',
    })

    render(<NoteCard note={note} />)

    expect(screen.getByText('Character voice')).toBeInTheDocument()
    expect(screen.getByText('Keep dialect consistent.')).toBeInTheDocument()
    expect(screen.getByText('Style')).toBeInTheDocument()
    expect(screen.getByText('Medium')).toBeInTheDocument()
  })

  it('calls onView with note id when the card is clicked', async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const note = createNote({ id_note: 99, title: 'Open me' })

    render(<NoteCard note={note} onView={onView} />)

    await user.click(screen.getByRole('button', { name: /View note: Open me/i }))
    expect(onView).toHaveBeenCalledTimes(1)
    expect(onView).toHaveBeenCalledWith(99)
  })

  it('shows manuscript title when provided', () => {
    const note = createNote({ title: 'T' })
    render(<NoteCard note={note} manuscriptTitle="Book One" />)
    expect(screen.getByText('Book One')).toBeInTheDocument()
  })
})
