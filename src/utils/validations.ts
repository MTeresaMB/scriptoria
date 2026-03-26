export interface ValidationResult {
  isValid: boolean
  error?: string
}

export type Validator<T> = (value: T) => ValidationResult

export const validateRequired = (value: string | null | undefined, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    }
  }
  return { isValid: true }
}

export const validateMinLength = (
  value: string | null | undefined,
  minLength: number,
  fieldName: string
): ValidationResult => {
  if (!value) return { isValid: true } // Optional fields should be validated with validateRequired
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    }
  }
  return { isValid: true }
}

export const validateMaxLength = (
  value: string | null | undefined,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (!value) return { isValid: true }
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at most ${maxLength} characters`,
    }
  }
  return { isValid: true }
}

export const validatePositiveNumber = (
  value: number | null | undefined,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined) return { isValid: true }
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      error: `${fieldName} must be a positive number`,
    }
  }
  return { isValid: true }
}

export const validateNumberRange = (
  value: number | null | undefined,
  min: number,
  max: number,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined) return { isValid: true }
  if (isNaN(value) || value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    }
  }
  return { isValid: true }
}

export const validateEmail = (value: string | null | undefined): ValidationResult => {
  if (!value) return { isValid: true }
  const trimmed = value.trim()
  if (trimmed === '') return { isValid: true }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    }
  }
  return { isValid: true }
}

export const composeValidators = <T>(...validators: Validator<T>[]): Validator<T> => {
  return (value: T) => validateMultiple(value, validators)
}

export const updateFieldErrors = <F extends string>(
  prev: Partial<Record<F, string>>,
  field: F,
  validation: ValidationResult,
): Partial<Record<F, string>> => {
  if (validation.isValid) {
    const next: Partial<Record<F, string>> = { ...prev }
    delete (next as Record<string, string>)[field]
    return next
  }
  return { ...prev, [field]: validation.error || 'Invalid value' }
}

/**
 * Run multiple validators and return the first error (if any).
 * Typed generically so that all validators operate on the same value type.
 */
export const validateMultiple = <T>(
  value: T,
  validators: Validator<T>[]
): ValidationResult => {
  for (const validator of validators) {
    const result = validator(value)
    if (!result.isValid) {
      return result
    }
  }
  return { isValid: true }
}

