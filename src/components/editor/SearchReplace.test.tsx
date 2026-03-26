import { describe, it, expect, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchReplace } from './SearchReplace'

type EditorInstance = NonNullable<ComponentProps<typeof SearchReplace>['editor']>

describe('SearchReplace', () => {
  const text = 'hello world hello'

  it('busca, selecciona la primera coincidencia y muestra el contador', async () => {
    const setTextSelection = vi.fn(({ from, to }) => {
      ;(mockEditor as { state: { selection: { from: number; to: number } } }).state.selection = {
        from,
        to,
      }
    })
    const scrollIntoView = vi.fn()
    const deleteSelection = vi.fn()
    const insertContent = vi.fn()
    const setContent = vi.fn()
    const getHTML = vi.fn(() => text)

    const mockEditor = {
      state: {
        doc: {
          textContent: text,
          textBetween: (from: number, to: number) => text.slice(from, to),
        },
        selection: { from: 0, to: 0 },
      },
      commands: {
        setTextSelection,
        scrollIntoView,
        deleteSelection,
        insertContent,
        setContent,
      },
      getHTML,
    } as unknown as EditorInstance

    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<SearchReplace editor={mockEditor} isOpen onClose={onClose} />)

    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement
    await user.clear(searchInput)
    await user.type(searchInput, 'hello')

    // 2 ocurrencias => "1 / 2"
    expect(screen.getByText('1 / 2')).toBeInTheDocument()
    expect(setTextSelection).toHaveBeenCalledWith({ from: 0, to: 5 })
  })

  it('navega a la siguiente coincidencia con Enter', async () => {
    const setTextSelection = vi.fn(({ from, to }) => {
      ;(mockEditor as { state: { selection: { from: number; to: number } } }).state.selection = {
        from,
        to,
      }
    })
    const scrollIntoView = vi.fn()
    const mockEditor = {
      state: {
        doc: {
          textContent: text,
          textBetween: (from: number, to: number) => text.slice(from, to),
        },
        selection: { from: 0, to: 0 },
      },
      commands: {
        setTextSelection,
        scrollIntoView,
      },
      getHTML: vi.fn(() => text),
    } as unknown as EditorInstance

    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<SearchReplace editor={mockEditor} isOpen onClose={onClose} />)

    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement
    await user.type(searchInput, 'hello')

    setTextSelection.mockClear()
    scrollIntoView.mockClear()

    fireEvent.keyDown(window, { key: 'Enter' })

    // La segunda coincidencia empieza en índice 12 y termina en 17
    expect(setTextSelection).toHaveBeenCalledWith({ from: 12, to: 17 })
    expect(scrollIntoView).toHaveBeenCalledTimes(1)
  })

  it('cierra con Escape', async () => {
    const onClose = vi.fn()
    const mockEditor = {
      state: { doc: { textContent: '' }, selection: { from: 0, to: 0 } },
      commands: { setTextSelection: vi.fn(), scrollIntoView: vi.fn() },
      getHTML: vi.fn(() => text),
    } as unknown as EditorInstance

    render(<SearchReplace editor={mockEditor} isOpen onClose={onClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('reemplaza una coincidencia con el botón Replace', async () => {
    const deleteSelection = vi.fn()
    const insertContent = vi.fn()
    const scrollIntoView = vi.fn()
    const setTextSelection = vi.fn(({ from, to }) => {
      ;(mockEditor as { state: { selection: { from: number; to: number } } }).state.selection = {
        from,
        to,
      }
    })

    const mockEditor = {
      state: {
        doc: {
          textContent: text,
          textBetween: (from: number, to: number) => text.slice(from, to),
        },
        selection: { from: 0, to: 0 },
      },
      commands: {
        setTextSelection,
        scrollIntoView,
        deleteSelection,
        insertContent,
        setContent: vi.fn(),
      },
      getHTML: vi.fn(() => text),
    } as unknown as EditorInstance

    const onClose = vi.fn()
    const user = userEvent.setup()

    render(<SearchReplace editor={mockEditor} isOpen onClose={onClose} />)

    const searchInput = screen.getByPlaceholderText('Search...') as HTMLInputElement
    const replaceInput = screen.getByPlaceholderText('Replace...') as HTMLInputElement

    await user.type(searchInput, 'hello')
    await user.type(replaceInput, 'bye')

    await user.click(screen.getByRole('button', { name: 'Replace' }))

    expect(deleteSelection).toHaveBeenCalledTimes(1)
    expect(insertContent).toHaveBeenCalledWith('bye')
  })
})

