/**
 * Utilidades de validación para formularios
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string | null | undefined, fieldName: string): ValidationResult => {
  if (!value || value.trim() === '') {
    return {
      isValid: false,
      error: `${fieldName} is required`,
    };
  }
  return { isValid: true };
};

/**
 * Valida la longitud mínima
 */
export const validateMinLength = (
  value: string | null | undefined,
  minLength: number,
  fieldName: string
): ValidationResult => {
  if (!value) return { isValid: true }; // Si es opcional, no validar
  if (value.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Valida la longitud máxima
 */
export const validateMaxLength = (
  value: string | null | undefined,
  maxLength: number,
  fieldName: string
): ValidationResult => {
  if (!value) return { isValid: true }; // Si es opcional, no validar
  if (value.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at most ${maxLength} characters`,
    };
  }
  return { isValid: true };
};

/**
 * Valida un número positivo
 */
export const validatePositiveNumber = (
  value: number | null | undefined,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined) return { isValid: true }; // Opcional
  if (isNaN(value) || value < 0) {
    return {
      isValid: false,
      error: `${fieldName} must be a positive number`,
    };
  }
  return { isValid: true };
};

/**
 * Valida un rango de número
 */
export const validateNumberRange = (
  value: number | null | undefined,
  min: number,
  max: number,
  fieldName: string
): ValidationResult => {
  if (value === null || value === undefined) return { isValid: true }; // Opcional
  if (isNaN(value) || value < min || value > max) {
    return {
      isValid: false,
      error: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return { isValid: true };
};

/**
 * Valida formato de email (si se necesita en el futuro)
 */
export const validateEmail = (value: string | null | undefined): ValidationResult => {
  if (!value) return { isValid: true }; // Opcional
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }
  return { isValid: true };
};

/**
 * Valida múltiples reglas
 */
export const validateMultiple = (
  value: unknown,
  validators: Array<(value: unknown) => ValidationResult>
): ValidationResult => {
  for (const validator of validators) {
    const result = validator(value);
    if (!result.isValid) {
      return result;
    }
  }
  return { isValid: true };
};

