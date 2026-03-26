import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useUnsavedChanges } from './useUnsavedChanges'

const TestComponent = ({ hasUnsavedChanges }: { hasUnsavedChanges: boolean }) => {
  useUnsavedChanges({ hasUnsavedChanges })
  return null
}

describe('useUnsavedChanges', () => {
  it('adds and removes beforeunload listener when hasUnsavedChanges is true', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount, rerender } = render(<TestComponent hasUnsavedChanges={true} />)

    expect(addSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

    rerender(<TestComponent hasUnsavedChanges={false} />)
    unmount()

    expect(removeSpy).toHaveBeenCalledWith('beforeunload', expect.any(Function))

    addSpy.mockRestore()
    removeSpy.mockRestore()
  })
})

