/**
 * Utility functions for form handling
 */

/**
 * Normalizes input value based on element type
 */
export const normalizeInputValue = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
): string | number | null => {
  const value = element.value;

  if (element instanceof HTMLInputElement) {
    if (element.type === 'number') {
      const numVal = Number(value);
      return value === '' || isNaN(numVal) ? null : numVal;
    }
    if (element.type === 'file') {
      return element.files?.[0]?.name ?? null;
    }
    return value;
  }

  if (element instanceof HTMLSelectElement) {
    return value === '' ? null : value;
  }

  // HTMLTextAreaElement
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

/**
 * Cleans optional string field - trims and converts empty strings to null
 */
export const cleanOptionalField = (value: unknown): string | null => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
};

/**
 * Validates and normalizes word count value
 */
export const validateWordCount = (value: unknown): number | null => {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') {
    return isNaN(value) ? null : Math.max(0, Math.floor(value));
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? null : Math.max(0, parsed);
  }
  return null;
};

/**
 * Validates and normalizes word count value (returns 0 instead of null for manuscripts)
 */
export const validateWordCountWithDefault = (value: unknown): number => {
  const result = validateWordCount(value);
  return result ?? 0;
};

/**
 * Removes a field from field errors object
 */
export const removeFieldError = (
  errors: Record<string, string>,
  fieldName: string
): Record<string, string> => {
  return Object.fromEntries(
    Object.entries(errors).filter(([key]) => key !== fieldName)
  );
};
