/**
 * UTILITY FUNCTIONS - Helper Functions
 * 
 * This file contains utility functions used throughout the application.
 * These functions handle common tasks like formatting, validation, and data transformation.
 * 
 * LEARNING GOALS:
 * - Understand utility function patterns
 * - Learn data validation techniques
 * - See formatting and transformation functions
 * - Understand error handling patterns
 */

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combines class names using clsx and tailwind-merge
 * 
 * WHY: This allows conditional classes and prevents Tailwind conflicts
 * 
 * EXAMPLE:
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'text-white')
 * // Result: 'px-2 py-1 bg-blue-500 text-white'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a phone number for display
 * 
 * WHY: Phone numbers are stored as strings but need consistent formatting
 * 
 * EXAMPLE:
 * formatPhone('5551234567') // Returns: '(555) 123-4567'
 */
export function formatPhone(phone: string | null): string {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  // Return original if not 10 digits
  return phone
}

/**
 * Formats an address for display
 * 
 * WHY: Addresses need consistent formatting for better readability
 * 
 * EXAMPLE:
 * formatAddress('123 Main St', 'Springfield', 'IL', '62701')
 * // Returns: '123 Main St, Springfield, IL 62701'
 */
export function formatAddress(
  address: string | null,
  city: string | null,
  state: string | null,
  zipCode: string | null
): string {
  const parts = [address, city, state, zipCode].filter(Boolean)
  return parts.join(', ')
}

/**
 * Validates an email address
 * 
 * WHY: Client-side validation provides immediate feedback
 * 
 * EXAMPLE:
 * isValidEmail('user@example.com') // Returns: true
 * isValidEmail('invalid-email') // Returns: false
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a phone number
 * 
 * WHY: Ensures phone numbers are in a valid format
 * 
 * EXAMPLE:
 * isValidPhone('555-123-4567') // Returns: true
 * isValidPhone('123') // Returns: false
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Truncates text to a specified length
 * 
 * WHY: Prevents UI overflow and improves readability
 * 
 * EXAMPLE:
 * truncateText('This is a very long text', 20)
 * // Returns: 'This is a very long...'
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Formats a date for display
 * 
 * WHY: Dates need consistent formatting across the app
 * 
 * EXAMPLE:
 * formatDate('2024-01-15T10:30:00Z')
 * // Returns: 'January 15, 2024'
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Formats a date as relative time
 * 
 * WHY: Relative times are more user-friendly than absolute dates
 * 
 * EXAMPLE:
 * formatRelativeTime('2024-01-15T10:30:00Z')
 * // Returns: '2 days ago' or 'in 3 hours'
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateString)
}

/**
 * Generates a slug from a string
 * 
 * WHY: URLs need to be clean and SEO-friendly
 * 
 * EXAMPLE:
 * generateSlug('Food Assistance Program')
 * // Returns: 'food-assistance-program'
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Capitalizes the first letter of each word
 * 
 * WHY: Improves readability of user-generated content
 * 
 * EXAMPLE:
 * capitalizeWords('john doe')
 * // Returns: 'John Doe'
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

/**
 * Debounces a function call
 * 
 * WHY: Prevents excessive API calls during user input
 * 
 * EXAMPLE:
 * const debouncedSearch = debounce(searchFunction, 300)
 * // Call debouncedSearch multiple times rapidly
 * // Only the last call will execute after 300ms
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Safely parses JSON with error handling
 * 
 * WHY: JSON parsing can fail, so we need safe error handling
 * 
 * EXAMPLE:
 * const data = safeJsonParse('{"valid": "json"}')
 * // Returns: { valid: "json" }
 * 
 * const invalid = safeJsonParse('invalid json')
 * // Returns: null
 */
export function safeJsonParse<T>(jsonString: string): T | null {
  try {
    return JSON.parse(jsonString) as T
  } catch {
    return null
  }
}

/**
 * Generates a random ID
 * 
 * WHY: Sometimes you need a simple ID for temporary elements
 * 
 * EXAMPLE:
 * generateId() // Returns: 'id_1234567890'
 */
export function generateId(): string {
  return `id_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Checks if a value is empty (null, undefined, or empty string)
 * 
 * WHY: Consistent empty value checking across the app
 * 
 * EXAMPLE:
 * isEmpty('') // Returns: true
 * isEmpty(null) // Returns: true
 * isEmpty('hello') // Returns: false
 */
export function isEmpty(value: any): boolean {
  return value == null || value === ''
}

/**
 * Formats a number as currency
 * 
 * WHY: Consistent currency formatting
 * 
 * EXAMPLE:
 * formatCurrency(1234.56) // Returns: '$1,234.56'
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

/**
 * Calculates distance between two coordinates
 * 
 * WHY: Useful for location-based features
 * 
 * EXAMPLE:
 * calculateDistance(39.7817, -89.6501, 39.7917, -89.6401)
 * // Returns: distance in miles
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * ERROR HANDLING UTILITIES
 * 
 * These functions help with consistent error handling
 */

/**
 * Creates a standardized error response
 * 
 * WHY: Consistent error format across the application
 */
export function createErrorResponse(message: string, status: number = 400) {
  return {
    error: true,
    message,
    status,
  }
}

/**
 * Logs errors with context
 * 
 * WHY: Better debugging and monitoring
 */
export function logError(error: Error, context?: string) {
  console.error(`[${context || 'Unknown'}] ${error.message}`, error)
}

/**
 * VALIDATION UTILITIES
 * 
 * These functions help validate user input
 */

/**
 * Validates required fields
 * 
 * WHY: Ensures all required data is present
 */
export function validateRequired(
  data: Record<string, any>,
  requiredFields: string[]
): string[] {
  const errors: string[] = []
  
  for (const field of requiredFields) {
    if (isEmpty(data[field])) {
      errors.push(`${field} is required`)
    }
  }
  
  return errors
}

/**
 * Validates resource form data
 * 
 * WHY: Specific validation for resource creation/editing
 */
export function validateResource(data: any): string[] {
  const errors: string[] = []
  
  // Required fields
  if (isEmpty(data.name)) errors.push('Name is required')
  if (isEmpty(data.description)) errors.push('Description is required')
  
  // Length validation
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  if (data.description && data.description.length > 1000) {
    errors.push('Description must be less than 1000 characters')
  }
  
  // Email validation
  if (data.email && !isValidEmail(data.email)) {
    errors.push('Invalid email format')
  }
  
  // Phone validation
  if (data.phone && !isValidPhone(data.phone)) {
    errors.push('Invalid phone number format')
  }
  
  return errors
}
