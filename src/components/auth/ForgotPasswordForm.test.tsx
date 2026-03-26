import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ForgotPasswordForm } from './ForgotPasswordForm'

const mockResetPassword = vi.hoisted(() => vi.fn())

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      resetPasswordForEmail: (...args: unknown[]) => mockResetPassword(...args),
    },
  },
}))

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockResetPassword.mockReset()
  })

  it('muestra mensaje de éxito tras enviar el email', async () => {
    const user = userEvent.setup()
    mockResetPassword.mockResolvedValue({ error: null })

    render(
      <MemoryRouter initialEntries={['/forgot']}>
        <Routes>
          <Route path="/forgot" element={<ForgotPasswordForm />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/^email$/i), 'user@test.com')
    await user.click(screen.getByRole('button', { name: /send reset link/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/we have sent you an email with instructions/i),
      ).toBeInTheDocument()
    })
    expect(mockResetPassword).toHaveBeenCalled()
  })
})
