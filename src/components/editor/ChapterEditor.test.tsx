import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ChapterEditor } from './ChapterEditor'
import { createChapterRow } from '@/test/factories'

vi.mock('@/utils/localStorage', () => ({
  readLocalStorage: vi.fn(() => null),
  writeLocalStorageJson: vi.fn(() => true),
  removeLocalStorage: vi.fn(() => true),
}))

vi.mock('@/contexts/theme', () => ({
  useTheme: () => ({ theme: 'light' as const, setTheme: vi.fn(), toggleTheme: vi.fn() }),
}))

vi.mock('@/components/editor/EditorStats', () => ({ EditorStats: () => null }))
vi.mock('@/components/editor/ExportMenu', () => ({ ExportMenu: () => null }))
vi.mock('@/components/editor/WordCountGoal', () => ({ WordCountGoal: () => null }))

vi.mock('@/components/editor/EditorSettings', () => ({
  EditorSettings: (props: { onTogglePreview?: () => void }) => (
    <button type="button" data-testid="toggle-preview" onClick={() => props.onTogglePreview?.()}>
      Preview
    </button>
  ),
}))

vi.mock('@/components/editor/EditorToolbar', () => ({
  EditorToolbar: () => <div data-testid="toolbar-stub" />,
}))

vi.mock('@/components/editor/FloatingToolbar', () => ({
  FloatingToolbar: () => null,
}))

vi.mock('@/components/editor/EditorSidebar', () => ({
  EditorSidebar: () => null,
}))

vi.mock('@/components/editor/SearchReplace', () => ({
  SearchReplace: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="search-replace-open" /> : null,
}))

vi.mock('@tiptap/react', () => ({
  useEditor: (config: {
    content?: string
    onUpdate?: (p: { editor: MockEditor }) => void
  }) => {
    let html = config.content ?? ''
    const dom = document.createElement('div')
    const pm = document.createElement('div')
    pm.className = 'ProseMirror'
    dom.appendChild(pm)

    const mockEditor: MockEditor = {
      getHTML: () => html,
      commands: {
        setContent: (c: string, opts?: { emitUpdate?: boolean }) => {
          html = c
          if (opts?.emitUpdate !== false && config.onUpdate) {
            config.onUpdate({ editor: mockEditor })
          }
        },
      },
      on: vi.fn(),
      off: vi.fn(),
      view: { dom },
    }
    return mockEditor
  },
  EditorContent: ({ className }: { className?: string }) =>
    React.createElement('div', { 'data-testid': 'editor-content', className }),
}))

interface MockEditor {
  getHTML: () => string
  commands: { setContent: (c: string, opts?: { emitUpdate?: boolean }) => void }
  on: ReturnType<typeof vi.fn>
  off: ReturnType<typeof vi.fn>
  view: { dom: HTMLDivElement }
}

const defaultProps = {
  content: '<p>Initial</p>',
  onChange: vi.fn(),
  onSave: vi.fn().mockResolvedValue(true),
  isSaving: false,
  hasUnsavedChanges: false,
  chapterTitle: 'Capítulo 1',
  manuscriptTitle: 'Mi novela',
  chapter: createChapterRow({ name_chapter: 'Capítulo 1', status: 'Draft' }),
}

describe('ChapterEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    defaultProps.onSave.mockResolvedValue(true)
  })

  it('renderiza área de edición y títulos en la cabecera', () => {
    render(<ChapterEditor {...defaultProps} />)

    expect(screen.getByTestId('editor-content')).toBeInTheDocument()
    expect(screen.getByText('Mi novela')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Capítulo 1' })).toBeInTheDocument()
    expect(screen.getByTestId('toolbar-stub')).toBeInTheDocument()
  })

  it('dispara onSave al pulsar Ctrl+S', async () => {
    const onSave = vi.fn().mockResolvedValue(true)
    render(<ChapterEditor {...defaultProps} onSave={onSave} />)

    fireEvent.keyDown(window, { key: 's', ctrlKey: true })

    await vi.waitFor(() => {
      expect(onSave).toHaveBeenCalledTimes(1)
    })
  })

  it('abre búsqueda con Ctrl+F', async () => {
    render(<ChapterEditor {...defaultProps} />)

    expect(screen.queryByTestId('search-replace-open')).not.toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'f', ctrlKey: true })

    expect(screen.getByTestId('search-replace-open')).toBeInTheDocument()
  })

  it('modo sin distracciones: entra y sale con el botón Exit', async () => {
    const user = userEvent.setup()
    render(<ChapterEditor {...defaultProps} />)

    await user.click(screen.getByTitle('Distraction-free mode'))

    expect(screen.getByRole('button', { name: /exit/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Capítulo 1' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /exit/i }))

    expect(screen.queryByRole('button', { name: /exit/i })).not.toBeInTheDocument()
    expect(screen.getByTitle('Distraction-free mode')).toBeInTheDocument()
  })

  it('modo preview muestra HTML y la insignia Preview Mode', async () => {
    const user = userEvent.setup()
    const html = '<p><strong>Bold</strong></p>'
    render(<ChapterEditor {...defaultProps} content={html} />)

    await user.click(screen.getByTestId('toggle-preview'))

    expect(screen.getByText('Preview Mode')).toBeInTheDocument()
    expect(screen.getByText('Bold')).toBeInTheDocument()
    expect(screen.queryByTestId('editor-content')).not.toBeInTheDocument()
  })
})
