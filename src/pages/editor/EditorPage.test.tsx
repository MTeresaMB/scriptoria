import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { EditorPage } from './EditorPage'
import { createChapterRow, createManuscriptRow } from '@/test/factories'
import type { ChapterRow } from '@/lib/repository/chaptersRepository'
import type { ManuscriptRow } from '@/lib/repository/manuscriptRepository'

const mockToastSuccess = vi.fn()
const mockToastError = vi.fn()

const mockInsertChapter = vi.hoisted(() => vi.fn())

const manuscriptsState = vi.hoisted(() => ({
  manuscripts: [] as ManuscriptRow[],
  isLoading: false,
  error: null as string | null,
  getManuscripts: vi.fn(),
}))

const chaptersState = vi.hoisted(() => ({
  chapters: [] as ChapterRow[],
  isLoading: false,
  error: null as string | null,
  fetchChaptersByManuscriptId: vi.fn(),
  getChapters: vi.fn(),
  update: vi.fn(),
}))

const chapterEditorState = vi.hoisted(() => ({
  chapter: null as ChapterRow | null,
  content: '',
  isLoadingChapter: false,
  isSaving: false,
  error: null as string | null,
  hasUnsavedChanges: false,
  handleContentChange: vi.fn(),
  handleSave: vi.fn().mockResolvedValue(true),
}))

const mockGetUser = vi.hoisted(() =>
  vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }),
)

vi.mock('@/lib/repository/chaptersRepository', () => ({
  insertChapter: (...args: unknown[]) => mockInsertChapter(...args),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: () => mockGetUser(),
    },
  },
}))

vi.mock('@/utils/localStorage', () => ({
  readLocalStorageJson: vi.fn(() => null),
  writeLocalStorageJson: vi.fn(),
}))

vi.mock('@/hooks/ui/useToast', () => ({
  useToast: () => ({
    toast: {
      success: mockToastSuccess,
      error: mockToastError,
      warning: vi.fn(),
      info: vi.fn(),
    },
  }),
}))

vi.mock('@/hooks/data/useManuscripts', () => ({
  useManuscripts: () => ({
    manuscripts: manuscriptsState.manuscripts,
    isLoading: manuscriptsState.isLoading,
    error: manuscriptsState.error,
    getManuscripts: manuscriptsState.getManuscripts,
  }),
}))

vi.mock('@/hooks/data/useChapters', () => ({
  useChapters: () => ({
    chapters: chaptersState.chapters,
    isLoading: chaptersState.isLoading,
    error: chaptersState.error,
    fetchChaptersByManuscriptId: chaptersState.fetchChaptersByManuscriptId,
    getChapters: chaptersState.getChapters,
    update: chaptersState.update,
  }),
}))

vi.mock('@/hooks/editor/useChapterEditor', () => ({
  useChapterEditor: () => ({
    chapter: chapterEditorState.chapter,
    content: chapterEditorState.content,
    isLoading: chapterEditorState.isLoadingChapter,
    isSaving: chapterEditorState.isSaving,
    error: chapterEditorState.error,
    hasUnsavedChanges: chapterEditorState.hasUnsavedChanges,
    handleContentChange: chapterEditorState.handleContentChange,
    handleSave: chapterEditorState.handleSave,
  }),
}))

vi.mock('@/components/editor/ChapterEditor', () => ({
  ChapterEditor: ({
    chapterTitle,
    manuscriptTitle,
  }: {
    chapterTitle?: string
    manuscriptTitle?: string
  }) => (
    <div data-testid="chapter-editor-mock">
      <span data-testid="mock-chapter-title">{chapterTitle}</span>
      <span data-testid="mock-manuscript-title">{manuscriptTitle}</span>
    </div>
  ),
}))

function renderEditor(initialPath = '/editor') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('EditorPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    manuscriptsState.manuscripts = []
    manuscriptsState.isLoading = false
    manuscriptsState.error = null
    chaptersState.chapters = []
    chaptersState.isLoading = false
    chaptersState.error = null
    chapterEditorState.chapter = null
    chapterEditorState.content = ''
    chapterEditorState.isLoadingChapter = false
    chapterEditorState.isSaving = false
    chapterEditorState.error = null
    chapterEditorState.hasUnsavedChanges = false
    chapterEditorState.handleSave.mockResolvedValue(true)
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockInsertChapter.mockResolvedValue({
      data: { id_chapter: 42, name_chapter: 'Chapter 1' },
      error: null,
    })
  })

  it('muestra skeleton mientras cargan manuscritos o capítulos', () => {
    manuscriptsState.isLoading = true
    manuscriptsState.manuscripts = [createManuscriptRow()]

    const { container } = renderEditor()
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('muestra ErrorState cuando falla la carga de manuscritos o capítulos', () => {
    manuscriptsState.error = 'network down'

    renderEditor()

    expect(screen.getByRole('heading', { name: 'Error loading data' })).toBeInTheDocument()
    expect(screen.getByText('network down')).toBeInTheDocument()
  })

  it('muestra EmptyState si no hay manuscritos', () => {
    renderEditor()

    expect(screen.getByText('No manuscripts available')).toBeInTheDocument()
    expect(
      screen.getByText('Create a manuscript first to start writing chapters.'),
    ).toBeInTheDocument()
  })

  it('pide elegir manuscrito cuando hay datos pero ninguno seleccionado', () => {
    manuscriptsState.manuscripts = [createManuscriptRow({ id_manuscript: 1, title: 'Book A' })]

    renderEditor()

    expect(screen.getByText('Select a manuscript to start editing')).toBeInTheDocument()
    expect(screen.getByLabelText(/manuscript/i)).toBeInTheDocument()
  })

  it('con manuscrito sin capítulos muestra empty y permite crear el primero', async () => {
    const user = userEvent.setup()
    manuscriptsState.manuscripts = [createManuscriptRow({ id_manuscript: 5, title: 'Solo' })]

    renderEditor('/editor?manuscript=5')

    await screen.findByText('No chapters yet')
    expect(
      screen.getByText("This manuscript doesn't have any chapters yet. Create one to start writing."),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /create first chapter/i }))

    await waitFor(() => {
      expect(mockInsertChapter).toHaveBeenCalled()
    })
    expect(mockInsertChapter).toHaveBeenCalledWith(
      expect.objectContaining({
        id_manuscript: 5,
        id_user: 'user-1',
        status: 'Draft',
      }),
    )
    expect(chaptersState.fetchChaptersByManuscriptId).toHaveBeenCalledWith(5)
    expect(mockToastSuccess).toHaveBeenCalledWith('Chapter created successfully')
  })

  it('al crear capítulo sin usuario muestra error', async () => {
    const user = userEvent.setup()
    mockGetUser.mockResolvedValue({ data: { user: null } })
    manuscriptsState.manuscripts = [createManuscriptRow({ id_manuscript: 5, title: 'Solo' })]

    renderEditor('/editor?manuscript=5')

    await screen.findByText('No chapters yet')
    await user.click(screen.getByRole('button', { name: /create first chapter/i }))

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('You must be logged in to create a chapter')
    })
    expect(mockInsertChapter).not.toHaveBeenCalled()
  })

  it('con ?chapter= muestra el editor mockeado cuando el capítulo está cargado', async () => {
    const manuscript = createManuscriptRow({ id_manuscript: 10, title: 'Mi libro' })
    const chapter = createChapterRow({
      id_chapter: 7,
      id_manuscript: 10,
      name_chapter: 'Opening',
      chapter_number: 1,
    })

    manuscriptsState.manuscripts = [manuscript]
    chaptersState.chapters = [chapter]
    chapterEditorState.chapter = chapter
    chapterEditorState.content = '<p>Hola</p>'

    renderEditor('/editor?chapter=7')

    await waitFor(() => {
      expect(screen.getByTestId('chapter-editor-mock')).toBeInTheDocument()
    })
    expect(screen.getByTestId('mock-chapter-title')).toHaveTextContent('Opening')
    expect(screen.getByTestId('mock-manuscript-title')).toHaveTextContent('Mi libro')
  })

  it('muestra skeleton del capítulo mientras useChapterEditor carga', async () => {
    const manuscript = createManuscriptRow({ id_manuscript: 10 })
    const chapter = createChapterRow({ id_chapter: 3, id_manuscript: 10 })

    manuscriptsState.manuscripts = [manuscript]
    chaptersState.chapters = [chapter]
    chapterEditorState.isLoadingChapter = true
    chapterEditorState.chapter = null

    const { container } = renderEditor('/editor?chapter=3')

    await waitFor(() => {
      const main = screen.getByText('Chapter:').closest('.max-w-7xl')?.parentElement?.parentElement
      expect(main).toBeTruthy()
    })
    const pulseBlocks = container.querySelectorAll('.animate-pulse')
    expect(pulseBlocks.length).toBeGreaterThan(0)
  })

  it('muestra ErrorState del editor cuando el hook reporta error', async () => {
    const manuscript = createManuscriptRow({ id_manuscript: 10 })
    const chapter = createChapterRow({ id_chapter: 2, id_manuscript: 10 })

    manuscriptsState.manuscripts = [manuscript]
    chaptersState.chapters = [chapter]
    chapterEditorState.error = 'Capítulo no disponible'
    chapterEditorState.chapter = null

    renderEditor('/editor?chapter=2')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Error loading chapter' })).toBeInTheDocument()
    })
    expect(screen.getByText('Capítulo no disponible')).toBeInTheDocument()
  })

  it('con manuscrito elegido y capítulos pero sin capítulo seleccionado pide elegir capítulo', async () => {
    manuscriptsState.manuscripts = [createManuscriptRow({ id_manuscript: 8, title: 'WIP' })]
    chaptersState.chapters = [
      createChapterRow({ id_chapter: 1, id_manuscript: 8, name_chapter: 'One' }),
    ]

    const user = userEvent.setup()
    renderEditor()

    const manuscriptSelect = screen.getByLabelText(/manuscript/i)
    await user.selectOptions(manuscriptSelect, '8')

    await screen.findByLabelText(/chapter/i)
    expect(screen.getByText('Select a chapter to start editing')).toBeInTheDocument()
  })

  it('el selector de capítulo lista el nombre y número cuando existen', async () => {
    manuscriptsState.manuscripts = [createManuscriptRow({ id_manuscript: 3, title: 'T' })]
    chaptersState.chapters = [
      createChapterRow({
        id_chapter: 9,
        id_manuscript: 3,
        chapter_number: 2,
        name_chapter: 'Twist',
      }),
    ]

    const user = userEvent.setup()
    renderEditor()

    await user.selectOptions(screen.getByLabelText(/manuscript/i), '3')

    const chapterSelect = await screen.findByLabelText(/chapter/i)
    const option = within(chapterSelect as HTMLElement).getByRole('option', {
      name: /chapter 2: twist/i,
    })
    expect(option).toBeInTheDocument()
  })
})
