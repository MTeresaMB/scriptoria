import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useEditorHistory } from './useEditorHistory'

describe('useEditorHistory', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('createSnapshot añade entrada con wordCount', () => {
    const { result } = renderHook(() => useEditorHistory())

    act(() => {
      result.current.createSnapshot('<p>one two</p>')
    })

    expect(result.current.snapshots).toHaveLength(1)
    expect(result.current.snapshots[0].content).toBe('<p>one two</p>')
    expect(result.current.snapshots[0].wordCount).toBe(2)
    expect(result.current.getLatestSnapshot()?.wordCount).toBe(2)
  })

  it('respeta maxSnapshots', () => {
    const { result } = renderHook(() => useEditorHistory({ maxSnapshots: 2 }))

    act(() => {
      result.current.createSnapshot('a')
      result.current.createSnapshot('b')
      result.current.createSnapshot('c')
    })

    expect(result.current.snapshots).toHaveLength(2)
    expect(result.current.snapshots.map((s) => s.content)).toEqual(['b', 'c'])
  })

  it('clearSnapshots vacía la lista', () => {
    const { result } = renderHook(() => useEditorHistory())

    act(() => {
      result.current.createSnapshot('x')
      result.current.clearSnapshots()
    })

    expect(result.current.snapshots).toHaveLength(0)
    expect(result.current.getLatestSnapshot()).toBeNull()
  })

  it('startAutoSnapshot y stopAutoSnapshot controlan el intervalo', () => {
    const { result } = renderHook(() => useEditorHistory({ maxSnapshots: 10 }))

    act(() => {
      result.current.startAutoSnapshot('initial', 1000)
    })
    expect(result.current.snapshots).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current.snapshots.length).toBeGreaterThanOrEqual(2)

    act(() => {
      result.current.stopAutoSnapshot()
    })

    const lenAfterStop = result.current.snapshots.length
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(result.current.snapshots.length).toBe(lenAfterStop)
  })
})
