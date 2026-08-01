/**
 * Formats a Date object or date string into YYYY-MM-DD format.
 */
export const formatDateToISO = (dateInput?: Date | string | null): string => {
  if (!dateInput) return ''
  const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(dateObj.getTime())) return ''
  return dateObj.toISOString().split('T')[0]
}

/**
 * Formats a date string into human readable display string (e.g. "Thu, Apr 09, 2026").
 */
export const formatDateToReadable = (dateInput?: Date | string | null): string => {
  if (!dateInput) return 'N/A'
  const dateObj = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(dateObj.getTime())) return 'N/A'

  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}
