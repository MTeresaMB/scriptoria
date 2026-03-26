import { describe, it, expect } from 'vitest'
import { calculateProgress, formatDate, formatNumber, formatReadingTime, formatWordCount, formatWordCountNumber, getInitials } from './formatters'

describe('formatNumber', () => {
  it('formats thousands and millions', () => {
    expect(formatNumber(950)).toBe('950')
    expect(formatNumber(1500)).toBe('1.5K')
    expect(formatNumber(1_500_000)).toBe('1.5M')
  })
})

describe('formatWordCount', () => {
  it('handles zero or null as no words', () => {
    expect(formatWordCount(0)).toBe('No words yet')
    expect(formatWordCount(null)).toBe('No words yet')
  })

  it('pluralizes correctly', () => {
    expect(formatWordCount(1)).toBe('1 word')
    expect(formatWordCount(2)).toBe('2 words')
  })
})

describe('formatReadingTime', () => {
  it('returns em dash for empty or zero', () => {
    expect(formatReadingTime(0)).toBe('—')
  })

  it('shows minutes under an hour', () => {
    expect(formatReadingTime(400)).toBe('~2 min')
  })

  it('shows hours and minutes over an hour', () => {
    expect(formatReadingTime(12_000)).toBe('~1h')
    expect(formatReadingTime(13_000)).toBe('~1h 5m')
  })
})

describe('formatWordCountNumber', () => {
  it('formats with thousands separator', () => {
    const result = formatWordCountNumber(12345)
    expect(result === '12.345' || result === '12,345').toBe(true)
  })
})

describe('calculateProgress', () => {
  it('calculates percentage and clamps at 100', () => {
    expect(calculateProgress(25_000)).toBe(50)
    expect(calculateProgress(60_000)).toBe(100)
  })
})

describe('getInitials', () => {
  it('uses first letters of words, uppercased, max two chars', () => {
    expect(getInitials('John Doe')).toBe('JD')
    expect(getInitials('single')).toBe('S')
    expect(getInitials('Anna Maria Smith')).toBe('AM')
  })
})

describe('formatDate', () => {
  it('returns a localized date string', () => {
    const formatted = formatDate('2024-01-15T00:00:00.000Z')
    expect(typeof formatted).toBe('string')
    expect(formatted.length).toBeGreaterThan(0)
  })
})

