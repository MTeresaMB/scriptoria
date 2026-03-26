import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ManuscriptsPage } from './ManuscriptsPage'
import { createManuscriptRow } from '@/test/factories'

const mockUseManuscripts = vi.hoisted(() => vi.fn())
const mockUseToast = vi.hoisted(() => vi.fn())

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => mockUseManuscripts(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => mockUseToast(),
}))

describe('ManuscriptsPage', () => {
  beforeEach(() => {
    mockUseManuscripts.mockReset()
    mockUseToast.mockReset()
    mockUseToast.mockReturnValue({
      toast: { success: vi.fn(), error: vi.fn(), warning: vi.fn(), info: vi.fn() },
    })
  })

  it('renderiza lista y títulos cuando hay manuscritos', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [
        createManuscriptRow({ id_manuscript: 1, title: 'Novela Alpha' }),
        createManuscriptRow({ id_manuscript: 2, title: 'Novela Beta' }),
      ],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getManuscripts: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/manuscripts']}>
        <Routes>
          <Route path="/manuscripts" element={<ManuscriptsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Your Manuscripts')).toBeInTheDocument()
    expect(screen.getByText('Novela Alpha')).toBeInTheDocument()
    expect(screen.getByText('Novela Beta')).toBeInTheDocument()
  })

  it('renderiza empty state cuando no hay manuscritos', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [],
      isLoading: false,
      error: null,
      remove: vi.fn(),
      getManuscripts: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/manuscripts']}>
        <Routes>
          <Route path="/manuscripts" element={<ManuscriptsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('No manuscripts yet')).toBeInTheDocument()
  })

  it('muestra spinner mientras carga', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [],
      isLoading: true,
      error: null,
      remove: vi.fn(),
      getManuscripts: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/manuscripts']}>
        <Routes>
          <Route path="/manuscripts" element={<ManuscriptsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('muestra ErrorState cuando hay error', () => {
    mockUseManuscripts.mockReturnValue({
      manuscripts: [],
      isLoading: false,
      error: 'fallo red',
      remove: vi.fn(),
      getManuscripts: vi.fn(),
    })

    render(
      <MemoryRouter initialEntries={['/manuscripts']}>
        <Routes>
          <Route path="/manuscripts" element={<ManuscriptsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: /error to load manuscripts/i })).toBeInTheDocument()
    expect(screen.getByText('fallo red')).toBeInTheDocument()
  })
})
