/**
 * Shared utility functions for the Glyphix app.
 */

/**
 * Format a UNIX timestamp (ms) as a HH:MM string.
 */
export function formatTime(timestamp: number): string {
  const d = new Date(timestamp)
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

/**
 * Format a UNIX timestamp (ms) as a YYYY-MM-DD string.
 */
export function formatDate(timestamp: number): string {
  const d = new Date(timestamp)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Clamp a number within [min, max].
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Truncate a string to at most `maxLen` characters, appending '…' if trimmed.
 */
export function truncate(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen - 1) + '…'
}

/**
 * Sleep for `ms` milliseconds (useful in async methods).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
