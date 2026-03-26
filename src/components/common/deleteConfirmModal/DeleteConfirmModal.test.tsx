import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteConfirmModal } from './DeleteConfirmModal'

describe('DeleteConfirmModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <DeleteConfirmModal
        itemTitle="X"
        itemType="note"
        isOpen={false}
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('shows title, default message and actions when open', () => {
    render(
      <DeleteConfirmModal
        itemTitle="My Note"
        itemType="note"
        isOpen
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: /Delete note\?/i })).toBeInTheDocument()
    expect(screen.getByText(/My Note/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument()
  })

  it('uses custom message when provided', () => {
    render(
      <DeleteConfirmModal
        itemTitle="T"
        itemType="chapter"
        isOpen
        isDeleting={false}
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
        message="Custom warning text."
      />,
    )
    expect(screen.getByText('Custom warning text.')).toBeInTheDocument()
  })

  it('calls onCancel and onConfirm', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(
      <DeleteConfirmModal
        itemTitle="A"
        itemType="item"
        isOpen
        isDeleting={false}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('shows deleting state and disables buttons', () => {
    render(
      <DeleteConfirmModal
        itemTitle="A"
        itemType="note"
        isOpen
        isDeleting
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: 'Deleting...' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })
})
