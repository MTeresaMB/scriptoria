import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorHeader } from './EditorHeader'

// Evitamos renderizar componentes pesados que no son el objetivo del test
vi.mock('./EditorStats', () => ({ EditorStats: () => null }))
vi.mock('./ExportMenu', () => ({ ExportMenu: () => null }))
vi.mock('./EditorSettings', () => ({ EditorSettings: () => null }))
vi.mock('./WordCountGoal', () => ({ WordCountGoal: () => null }))

describe('EditorHeader', () => {
  it('dispara onSearch y onToggleSidebar al hacer click en los botones', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onToggleSidebar = vi.fn()

    render(
      <EditorHeader
        hasUnsavedChanges={false}
        isSaving={false}
        lastSaved={null}
        onSave={vi.fn()}
        onSearch={onSearch}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={false}
        isSearchOpen={false}
        onToggleDistractionFree={vi.fn()}
        content="Hello world"
        fontSize={16}
        columnWidth="medium"
        onFontSizeChange={vi.fn()}
        onColumnWidthChange={vi.fn()}
        onTogglePreview={vi.fn()}
        isPreviewMode={false}
      />,
    )

    await user.click(screen.getByTitle('Search (Ctrl+F)'))
    expect(onSearch).toHaveBeenCalledTimes(1)

    await user.click(screen.getByTitle('Chapter Info'))
    expect(onToggleSidebar).toHaveBeenCalledTimes(1)
  })

  it('aplica clases correctas al abrir search y sidebar', () => {
    const onSearch = vi.fn()
    const onToggleSidebar = vi.fn()

    render(
      <EditorHeader
        hasUnsavedChanges={false}
        isSaving={false}
        lastSaved={null}
        onSave={vi.fn()}
        onSearch={onSearch}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={true}
        isSearchOpen={true}
        onToggleDistractionFree={vi.fn()}
        content="Hello world"
        fontSize={16}
        columnWidth="medium"
        onFontSizeChange={vi.fn()}
        onColumnWidthChange={vi.fn()}
        onTogglePreview={vi.fn()}
        isPreviewMode={false}
      />,
    )

    const searchBtn = screen.getByTitle('Search (Ctrl+F)') as HTMLButtonElement
    const infoBtn = screen.getByTitle('Chapter Info') as HTMLButtonElement

    expect(searchBtn.className).toContain('bg-purple-600')
    expect(infoBtn.className).toContain('bg-purple-600')
  })
})

