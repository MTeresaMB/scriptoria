import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'

const mockUseAuth = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock('@/components/search/GlobalSearchModal', () => ({
  GlobalSearchModal: () => null,
}))

vi.mock('./Sidebar', () => ({
  Sidebar: () => <aside data-testid="sidebar">sidebar</aside>,
}))

vi.mock('./TopBar', () => ({
  TopBar: () => <div data-testid="topbar">top</div>,
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mockUseAuth.mockReset()
  })

  it('muestra loading mientras useAuth carga', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: true })

    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <div data-testid="child">privado</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('redirige a /login si no hay usuario', () => {
    mockUseAuth.mockReturnValue({ user: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route path="/login" element={<div>login-screen</div>} />
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <div data-testid="child">privado</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('login-screen')).toBeInTheDocument()
    expect(screen.queryByTestId('child')).not.toBeInTheDocument()
  })

  it('renderiza layout y children cuando hay usuario', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1', email: 'a@b.c' },
      loading: false,
    })

    render(
      <MemoryRouter initialEntries={['/app']}>
        <Routes>
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <div data-testid="child">privado</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
    expect(screen.getByTestId('topbar')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toHaveTextContent('privado')
  })
})
