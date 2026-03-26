import { describe, it, expect, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EditorToolbar } from './EditorToolbar'

type Chain = {
  focus: () => Chain
  toggleBold: () => Chain
  toggleItalic: () => Chain
  toggleHeading: (opts?: unknown) => Chain
  toggleBulletList: () => Chain
  toggleOrderedList: () => Chain
  setTextAlign: (align: string) => Chain
  undo: () => Chain
  redo: () => Chain
  run: () => unknown
}

type EditorLike = {
  can: () => { chain: () => Chain }
  chain: () => Chain
  isActive: (...args: unknown[]) => boolean
  getAttributes: (name: string) => { href: string }
}

const createChain = (runImpl: () => unknown): Chain => {
  const chain = {} as Chain

  chain.focus = () => chain
  chain.toggleBold = () => chain
  chain.toggleItalic = () => chain
  chain.toggleHeading = () => chain
  chain.toggleBulletList = () => chain
  chain.toggleOrderedList = () => chain
  chain.setTextAlign = () => chain
  chain.undo = () => chain
  chain.redo = () => chain
  chain.run = runImpl

  return chain
}

describe('EditorToolbar', () => {
  it('renderiza null cuando editor es null', () => {
    const { container } = render(<EditorToolbar editor={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('dispara toggleBold al pulsar el botón Bold (Ctrl+B)', async () => {
    const commandRun = vi.fn()
    const canRun = vi.fn(() => true)

    const canChain = createChain(canRun)
    const commandChain = createChain(commandRun)

    const editor: EditorLike = {
      can: () => ({ chain: () => canChain }),
      chain: () => commandChain,
      isActive: vi.fn(() => false),
      getAttributes: vi.fn(() => ({ href: '' })),
    }

    const user = userEvent.setup()
    render(
      <EditorToolbar
        editor={editor as unknown as NonNullable<ComponentProps<typeof EditorToolbar>['editor']>}
      />,
    )

    const boldBtn = screen.getByTitle('Bold (Ctrl+B)')
    await user.click(boldBtn)

    expect(commandRun).toHaveBeenCalledTimes(1)
  })
})

