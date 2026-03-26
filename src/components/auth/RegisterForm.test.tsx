import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RegisterForm } from './RegisterForm'

const mockSignUp = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: (...args: unknown[]) => mockSignUp(...args),
    },
  },
}))

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUp.mockReset()
  })

  it('muestra error si las contraseñas no coinciden', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/^email$/i), 'nuevo@test.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'abc12345')
    await user.type(screen.getByLabelText(/confirm password/i), 'distinta')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    expect(mockSignUp).not.toHaveBeenCalled()
  })

  it('navega a / si signUp devuelve sesión', async () => {
    const user = userEvent.setup()
    mockSignUp.mockResolvedValue({
      data: { user: { id: '1' }, session: {} },
      error: null,
    })

    render(
      <MemoryRouter initialEntries={['/register']}>
        <Routes>
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/" element={<div data-testid="home">inicio</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/^email$/i), 'ok@test.com')
    await user.type(screen.getByLabelText(/contraseña/i), 'samepass1')
    await user.type(screen.getByLabelText(/confirm password/i), 'samepass1')
    await user.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByTestId('home')).toBeInTheDocument()
    })
  })
})
