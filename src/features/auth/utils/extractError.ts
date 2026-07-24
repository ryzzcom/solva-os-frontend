/**
 * Extracts human-readable backend validation and error messages.
 * Handles Zod backend validation errors array as well as custom AppError messages.
 */
export const extractAuthErrorMessage = (
  error: any,
  defaultMsg: string = 'An unexpected error occurred. Please try again.'
): string => {
  const data = error?.response?.data

  // 1. Check if backend returned Zod/validation error array
  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    const fieldErrors = data.errors
      .map((e: any) => e.message || e.msg || (e.field ? `${e.field} is invalid` : null))
      .filter(Boolean)
      .join('. ')

    if (fieldErrors) return fieldErrors
  }

  // 2. Check if backend returned specific operational error message
  if (data?.message && data.message !== 'Validation failed') {
    return data.message
  }

  // 3. Fallback to generic message or network error
  return data?.message || error?.message || defaultMsg
}
