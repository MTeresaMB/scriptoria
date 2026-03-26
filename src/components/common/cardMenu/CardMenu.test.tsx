import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CardMenu } from './CardMenu'

describe('CardMenu', () => {
  it('does not render when no actions are provided', () => {
    const { container } = render(<CardMenu itemType="note" />)
    expect(container.firstChild).toBeNull()
  })

  it('opens and renders only provided actions', async () => {
    const user = userEvent.setup()
    const onView = vi.fn()
    const onDelete = vi.fn()

    render(<CardMenu itemType="chapter" onView={onView} onDelete={onDelete} />)

    const trigger = screen.getByRole('button', { name: 'chapter menu' })
    await user.click(trigger)

    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Edit in Editor' })).not.toBeInTheDocument()
  })

  it('calls action and closes menu', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(<CardMenu itemType="item" onEdit={onEdit} />)

    await user.click(screen.getByRole('button', { name: 'item menu' }))
    const editBtn = screen.getByRole('button', { name: 'Edit' })
    await user.click(editBtn)

    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('closes when clicking outside backdrop', async () => {
    const user = userEvent.setup()
    render(<CardMenu itemType="note" onView={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'note menu' }))
    expect(screen.getByRole('button', { name: 'View' })).toBeInTheDocument()

    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)

    expect(screen.queryByRole('button', { name: 'View' })).not.toBeInTheDocument()
  })
})
