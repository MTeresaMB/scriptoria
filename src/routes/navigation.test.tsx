import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom'

function StartScreen() {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate('/target')}>
      Go next
    </button>
  )
}

describe('react-router navigation (MemoryRouter)', () => {
  it('navigates between routes', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/start']}>
        <Routes>
          <Route path="/start" element={<StartScreen />} />
          <Route path="/target" element={<p>Arrived</p>} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.queryByText('Arrived')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Go next' }))

    expect(screen.getByText('Arrived')).toBeInTheDocument()
  })
})
