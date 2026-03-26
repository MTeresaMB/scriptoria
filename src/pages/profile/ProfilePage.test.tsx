import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProfilePage } from './ProfilePage'

const { mockUpdateUser, toastSuccess, toastError } = vi.hoisted(() => ({
  mockUpdateUser: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      updateUser: mockUpdateUser,
    },
  },
}))

vi.mock('@/hooks/auth/useAuth', () => ({
  useAuth: () => ({
    user: {
      email: 'maria@example.com',
      user_metadata: { display_name: 'Maria' },
    },
  }),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: toastSuccess,
      error: toastError,
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdateUser.mockResolvedValue({ error: null })
  })

  it('renders user email and display name', () => {
    render(<ProfilePage />)

    expect(screen.getByText('maria@example.com')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Maria')).toBeInTheDocument()
  })

  it('updates display name and shows success toast', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    const displayNameInput = screen.getByLabelText('Display name')
    await user.clear(displayNameInput)
    await user.type(displayNameInput, 'Maria Teresa')

    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ data: { display_name: 'Maria Teresa' } })
    })
    expect(toastSuccess).toHaveBeenCalledWith('Display name updated')
  })

  it('validates password minimum length before calling supabase', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.type(screen.getByLabelText('New Password'), '12345')
    await user.type(screen.getByLabelText('Confirm Password'), '12345')
    await user.click(screen.getByRole('button', { name: 'Update Password' }))

    expect(toastError).toHaveBeenCalledWith('Password must be at least 6 characters')
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('validates password confirmation match', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    await user.type(screen.getByLabelText('New Password'), '123456')
    await user.type(screen.getByLabelText('Confirm Password'), '654321')
    await user.click(screen.getByRole('button', { name: 'Update Password' }))

    expect(toastError).toHaveBeenCalledWith('Passwords do not match')
    expect(mockUpdateUser).not.toHaveBeenCalled()
  })

  it('updates password and clears inputs', async () => {
    const user = userEvent.setup()
    render(<ProfilePage />)

    const pwd = screen.getByLabelText('New Password') as HTMLInputElement
    const confirm = screen.getByLabelText('Confirm Password') as HTMLInputElement

    await user.type(pwd, '123456')
    await user.type(confirm, '123456')
    await user.click(screen.getByRole('button', { name: 'Update Password' }))

    await waitFor(() => {
      expect(mockUpdateUser).toHaveBeenCalledWith({ password: '123456' })
    })
    expect(toastSuccess).toHaveBeenCalledWith('Password updated successfully')
    expect(pwd.value).toBe('')
    expect(confirm.value).toBe('')
  })
})
