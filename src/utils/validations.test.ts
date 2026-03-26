import { describe, it, expect } from 'vitest'
import {
  composeValidators,
  type ValidationResult,
  validateEmail,
  validateMaxLength,
  validateMinLength,
  validateMultiple,
  validateNumberRange,
  validatePositiveNumber,
  validateRequired,
} from './validations'

describe('validateRequired', () => {
  it('returns error when value is empty', () => {
    const result = validateRequired('', 'Title')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Title is required')
  })

  it('returns valid for non-empty value', () => {
    const result = validateRequired('Hello', 'Title')
    expect(result.isValid).toBe(true)
  })
})

describe('validateMinLength', () => {
  it('ignores undefined/nullable values (optional field)', () => {
    const result = validateMinLength(undefined, 3, 'Field')
    expect(result.isValid).toBe(true)
  })

  it('enforces minimum length', () => {
    const tooShort = validateMinLength('ab', 3, 'Field')
    const ok = validateMinLength('abc', 3, 'Field')
    expect(tooShort.isValid).toBe(false)
    expect(ok.isValid).toBe(true)
  })
})

describe('validateMaxLength', () => {
  it('passes when value is under max length', () => {
    const result = validateMaxLength('abc', 5, 'Field')
    expect(result.isValid).toBe(true)
  })

  it('fails when value exceeds max length', () => {
    const result = validateMaxLength('abcdef', 5, 'Field')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Field must be at most 5 characters')
  })
})

describe('number validations', () => {
  it('validatePositiveNumber allows null/undefined', () => {
    expect(validatePositiveNumber(null, 'Count').isValid).toBe(true)
    expect(validatePositiveNumber(undefined, 'Count').isValid).toBe(true)
  })

  it('validatePositiveNumber rejects negatives and NaN', () => {
    expect(validatePositiveNumber(-1, 'Count').isValid).toBe(false)
    expect(validatePositiveNumber(Number.NaN, 'Count').isValid).toBe(false)
  })

  it('validateNumberRange enforces inclusive range', () => {
    const ok = validateNumberRange(5, 0, 10, 'Age')
    const low = validateNumberRange(-1, 0, 10, 'Age')
    const high = validateNumberRange(11, 0, 10, 'Age')
    expect(ok.isValid).toBe(true)
    expect(low.isValid).toBe(false)
    expect(high.isValid).toBe(false)
  })
})

describe('validateEmail', () => {
  it('accepts empty/whitespace when optional', () => {
    expect(validateEmail(null).isValid).toBe(true)
    expect(validateEmail(undefined).isValid).toBe(true)
    expect(validateEmail('   ').isValid).toBe(true)
  })

  it('validates basic email format', () => {
    expect(validateEmail('user@example.com').isValid).toBe(true)
    const bad = validateEmail('not-an-email')
    expect(bad.isValid).toBe(false)
    expect(bad.error).toBe('Invalid email format')
  })
})

describe('validateMultiple', () => {
  const isNonEmpty: (value: string) => ValidationResult = (value) =>
    value.trim() === ''
      ? { isValid: false, error: 'Empty' }
      : { isValid: true }

  const hasX: (value: string) => ValidationResult = (value) =>
    value.includes('x')
      ? { isValid: true }
      : { isValid: false, error: 'Missing x' }

  it('returns first failing validation', () => {
    const result = validateMultiple('', [isNonEmpty, hasX])
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('Empty')
  })

  it('passes when all validators pass', () => {
    const result = validateMultiple('x value', [isNonEmpty, hasX])
    expect(result.isValid).toBe(true)
  })
})

describe('composeValidators', () => {
  it('composes multiple validators into one', () => {
    const validator = composeValidators<string>(
      (v) => validateMinLength(v, 2, 'Field'),
      (v) => validateMaxLength(v, 5, 'Field'),
    )

    expect(validator('a').isValid).toBe(false)
    expect(validator('abcdef').isValid).toBe(false)
    expect(validator('abc').isValid).toBe(true)
  })
})

