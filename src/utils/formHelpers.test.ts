import { describe, it, expect } from 'vitest'
import { cleanOptionalField, normalizeInputValue, validateWordCount, validateWordCountWithDefault } from './formHelpers'

const createInput = (type: string, value = ''): HTMLInputElement => {
  const input = document.createElement('input')
  input.type = type
  input.value = value
  return input
}

const createTextarea = (value: string): HTMLTextAreaElement => {
  const textarea = document.createElement('textarea') as HTMLTextAreaElement
  textarea.value = value
  return textarea
}

describe('normalizeInputValue', () => {
  it('normalizes number inputs to numbers or null', () => {
    const input = createInput('number', '42')
    expect(normalizeInputValue(input)).toBe(42)

    input.value = ''
    expect(normalizeInputValue(input)).toBeNull()
  })

  it('returns file name for file inputs', () => {
    const input = createInput('file')
    const file = new File(['content'], 'test.txt', { type: 'text/plain' })
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
    })

    expect(normalizeInputValue(input)).toBe('test.txt')
  })

  it('trims textarea values and converts empty to null', () => {
    const textarea = createTextarea('  hello  ')
    expect(normalizeInputValue(textarea)).toBe('hello')

    textarea.value = '   '
    expect(normalizeInputValue(textarea)).toBeNull()
  })
})

describe('cleanOptionalField', () => {
  it('returns null for non-string or empty/whitespace', () => {
    expect(cleanOptionalField(undefined)).toBeNull()
    expect(cleanOptionalField(123 as unknown as string)).toBeNull()
    expect(cleanOptionalField('   ')).toBeNull()
  })

  it('returns trimmed string for valid input', () => {
    expect(cleanOptionalField('  hello  ')).toBe('hello')
  })
})

describe('validateWordCount', () => {
  it('returns null for invalid values', () => {
    expect(validateWordCount(undefined)).toBeNull()
    expect(validateWordCount('abc')).toBeNull()
  })

  it('normalizes numbers and strings to non-negative integers', () => {
    expect(validateWordCount(10.7)).toBe(10)
    expect(validateWordCount(-5)).toBe(0)
    expect(validateWordCount('15')).toBe(15)
  })
})

describe('validateWordCountWithDefault', () => {
  it('returns 0 when validateWordCount would return null', () => {
    expect(validateWordCountWithDefault(undefined)).toBe(0)
  })

  it('returns normalized word count otherwise', () => {
    expect(validateWordCountWithDefault(5)).toBe(5)
  })
})

