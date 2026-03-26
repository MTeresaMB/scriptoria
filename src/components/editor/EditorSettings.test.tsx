import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorSettings } from './EditorSettings'

describe('EditorSettings', () => {
  it('abre el panel y dispara callbacks al cambiar opciones', async () => {
    const user = userEvent.setup()

    const onFontSizeChange = vi.fn()
    const onColumnWidthChange = vi.fn()
    const onTogglePreview = vi.fn()

    render(
      <EditorSettings
        fontSize={16}
        onFontSizeChange={onFontSizeChange}
        columnWidth="medium"
        onColumnWidthChange={onColumnWidthChange}
        onTogglePreview={onTogglePreview}
        isPreviewMode={false}
      />,
    )

    // Panel cerrado al inicio
    expect(screen.queryByText('Editor Settings')).not.toBeInTheDocument()

    // Abrir
    await user.click(screen.getByTitle('Editor Settings'))
    expect(screen.getByText('Editor Settings')).toBeInTheDocument()
    expect(screen.getByText('Font Size')).toBeInTheDocument()
    expect(screen.getByText('Column Width')).toBeInTheDocument()

    // Cambiar slider (range)
    const range = screen.getByRole('slider') as HTMLInputElement
    fireEvent.change(range, { target: { value: '20' } })
    expect(onFontSizeChange).toHaveBeenCalledWith(20)

    // Cambiar opción column width
    const fullWidthBtn = screen.getByRole('button', { name: 'Full Width' })
    await user.click(fullWidthBtn)
    expect(onColumnWidthChange).toHaveBeenCalledWith('full')

    // Panel se cierra tras seleccionar una opción
    expect(screen.queryByText('Column Width')).not.toBeInTheDocument()
  })
})

