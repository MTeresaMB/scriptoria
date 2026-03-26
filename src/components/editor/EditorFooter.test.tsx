import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditorFooter } from './EditorFooter'

describe('EditorFooter', () => {
  it('muestra “Unsaved changes” cuando hay cambios sin guardar y muestra shortcuts', () => {
    render(
      <EditorFooter content="<p>hello world</p>" hasUnsavedChanges isSaving={false} />,
    )

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
    expect(screen.getByText('Shortcuts:')).toBeInTheDocument()
    expect(screen.getAllByText('Ctrl').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
    expect(screen.getByText(/words/i)).toBeInTheDocument()
  })

  it('muestra “Saving...” cuando isSaving es true', () => {
    render(
      <EditorFooter content="<p>hello world</p>" hasUnsavedChanges={false} isSaving />,
    )

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('no muestra shortcuts cuando showShortcuts=false', () => {
    render(
      <EditorFooter content="<p>hello world</p>" hasUnsavedChanges={false} isSaving={false} showShortcuts={false} />,
    )
    expect(screen.queryByText('Shortcuts:')).not.toBeInTheDocument()
  })
})

