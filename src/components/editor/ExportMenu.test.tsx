import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExportMenu } from './ExportMenu'

const exportToText = vi.fn(() => Promise.resolve())
const exportToMarkdown = vi.fn(() => Promise.resolve())
const exportToPDF = vi.fn(() => Promise.resolve())
const exportToHTML = vi.fn(() => Promise.resolve())

vi.mock('@/hooks/editor/useExport', () => ({
  useExport: () => ({
    exportToText,
    exportToMarkdown,
    exportToPDF,
    exportToHTML,
  }),
}))

describe('ExportMenu', () => {
  it('abre el menú y ejecuta exportToText cerrándolo después', async () => {
    const user = userEvent.setup()

    render(<ExportMenu content="<p>Hi</p>" chapterTitle="My Chapter" />)

    const trigger = screen.getByTitle('Export chapter')
    await user.click(trigger)

    expect(screen.getByText('Export as Text (.txt)')).toBeInTheDocument()

    await user.click(screen.getByText('Export as Text (.txt)'))

    await waitFor(() => {
      expect(exportToText).toHaveBeenCalledTimes(1)
    })

    // El menú debería cerrarse tras el export
    await waitFor(() => {
      expect(screen.queryByText('Export as Text (.txt)')).not.toBeInTheDocument()
    })
  })

  it('ejecuta exportToMarkdown al seleccionar la opción', async () => {
    const user = userEvent.setup()

    render(<ExportMenu content="<p>Hi</p>" chapterTitle="My Chapter" />)

    await user.click(screen.getByTitle('Export chapter'))
    await user.click(screen.getByText('Export as Markdown (.md)'))

    await waitFor(() => {
      expect(exportToMarkdown).toHaveBeenCalledTimes(1)
    })
  })
})

