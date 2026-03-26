import { describe, it, expect } from 'vitest'
import {
  getStatusColors,
  getStatusBadgeClasses,
  getStatusGradientClasses,
  getStatusProgressColor,
} from './statusColors'

describe('getStatusColors', () => {
  it('maps known statuses case-insensitively', () => {
    expect(getStatusColors('Completed').badge).toContain('green')
    expect(getStatusColors('completed').badge).toEqual(getStatusColors('COMPLETED').badge)
    expect(getStatusColors('Draft').badge).toContain('amber')
    expect(getStatusColors('In Progress').badge).toContain('blue')
  })

  it('defaults null/undefined to draft', () => {
    expect(getStatusColors(null).badge).toEqual(getStatusColors('draft').badge)
    expect(getStatusColors(undefined).badge).toEqual(getStatusColors('draft').badge)
  })

  it('falls back to draft for unknown status', () => {
    expect(getStatusColors('Archived').badge).toEqual(getStatusColors('draft').badge)
  })

  it('exposes gradient and progress keys', () => {
    const c = getStatusColors('completed')
    expect(c.gradient.from).toMatch(/^from-/)
    expect(c.gradient.to).toMatch(/^to-/)
    expect(c.progress).toMatch(/^bg-/)
  })
})

describe('getStatusBadgeClasses', () => {
  it('returns badge string from getStatusColors', () => {
    expect(getStatusBadgeClasses('in progress')).toBe(getStatusColors('in progress').badge)
  })

  it('includes light and dark text tokens for readability', () => {
    const badge = getStatusBadgeClasses('completed')
    expect(badge).toContain('dark:text-green-400')
    expect(badge).toContain('text-green-800')
  })
})

describe('getStatusGradientClasses', () => {
  it('concatenates from and to gradient classes', () => {
    const g = getStatusGradientClasses('draft')
    expect(g).toContain('from-')
    expect(g).toContain('to-')
  })
})

describe('getStatusProgressColor', () => {
  it('returns a bg-* utility per status', () => {
    expect(getStatusProgressColor('completed')).toBe('bg-purple-500')
    expect(getStatusProgressColor('draft')).toBe('bg-yellow-500')
    expect(getStatusProgressColor('in progress')).toBe('bg-blue-500')
  })
})
