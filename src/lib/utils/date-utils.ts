/**
 * Formats a date string into a human-readable relative time format
 * 
 * @param dateString - ISO date string to format
 * @returns Formatted date string (e.g., "Today", "Yesterday", "3 days ago", "Jan 15")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Formats a date string into a full date format
 * 
 * @param dateString - ISO date string to format
 * @returns Full date string (e.g., "January 15, 2024")
 */
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Formats a date string into a short date format
 * 
 * @param dateString - ISO date string to format
 * @returns Short date string (e.g., "01/15/2024")
 */
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
