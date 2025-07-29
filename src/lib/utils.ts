/**
 * Utility functions for the application
 */

/**
 * Creates a proper image URL from Contentful image URLs
 * @param url - The image URL from Contentful (may start with //)
 * @returns Full HTTPS URL
 */
export const createImageUrl = (url: string): string => {
  return url.startsWith('//') ? `https:${url}` : url
}

/**
 * Extracts the year from a date string
 * @param dateString - Date string in any valid format
 * @returns Year as number
 */
export const getProjectYear = (dateString: string): number => {
  return new Date(dateString).getFullYear()
}

/**
 * Formats a date string to a readable format
 * @param dateString - Date string in any valid format
 * @param locale - Locale for formatting (default: 'en-GB')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale: string = 'en-GB'): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return new Date(dateString).toLocaleDateString(locale, options)
}