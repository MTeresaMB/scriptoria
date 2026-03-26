import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BaseCard } from './BaseCard'

describe('BaseCard', () => {
  it('renders children', () => {
    render(
      <BaseCard>
        <span>Inner</span>
      </BaseCard>,
    )
    expect(screen.getByText('Inner')).toBeInTheDocument()
  })

  it('calls onClick and handles keyboard activation when clickable', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(
      <BaseCard onClick={onClick} ariaLabel="Test card">
        <span>Clickable</span>
      </BaseCard>,
    )

    const card = screen.getByRole('button', { name: 'Test card' })
    await user.click(card)
    expect(onClick).toHaveBeenCalledTimes(1)

    card.focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(2)
  })
})
