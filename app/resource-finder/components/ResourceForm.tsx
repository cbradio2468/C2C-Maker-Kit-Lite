/**
 * RESOURCE FORM COMPONENT
 * 
 * This component handles creating and editing resources.
 * It includes form validation, error handling, and accessibility features.
 * 
 * LEARNING GOALS:
 * - Understand form handling patterns
 * - Learn client-side validation
 * - See error handling techniques
 * - Understand accessibility in forms
 * 
 * ACCESSIBILITY NOTES:
 * - Proper form labels and descriptions
 * - Error announcements for screen readers
 * - Keyboard navigation support
 * - Required field indicators
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { type Resource, type ResourceCategory, type ResourceInsert } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { validateResource } from '@/lib/utils'

interface ResourceFormProps {
  resource?: Resource
  categories: ResourceCategory[]
  mode: 'create' | 'edit'
}

export function ResourceForm({ resource, categories, mode }: ResourceFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState<ResourceInsert>({
    name: resource?.name || '',
    description: resource?.description || '',
    category_id: resource?.category_id || '',
    phone: resource?.phone || '',
    email: resource?.email || '',
    website: resource?.website || '',
    address: resource?.address || '',
    city: resource?.city || '',
    state: resource?.state || '',
    zip_code: resource?.zip_code || '',
    eligibility_criteria: resource?.eligibility_criteria || '',
    documents_required: resource?.documents_required || '',
    languages_spoken: resource?.languages_spoken || [],
    hours_of_operation: resource?.hours_of_operation || '',
    is_currently_accepting: resource?.is_currently_accepting ?? true,
    capacity_status: resource?.capacity_status || 'available',
    name_es: resource?.name_es || '',
    description_es: resource?.description_es || '',
  })

  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Handle form input changes
  const handleInputChange = (field: keyof ResourceInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  // Handle array field changes (like languages_spoken)
  const handleArrayChange = (field: keyof ResourceInsert, value: string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validationErrors = validateResource(formData)
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (mode === 'create') {
        // Create new resource
        const { data, error } = await supabase
          .from('resources')
          .insert([formData])
          .select()
          .single()

        if (error) {
          throw error
        }

        // Redirect to the new resource
        router.push(`/resource-finder/${data.id}`)
      } else {
        // Update existing resource
        const { error } = await supabase
          .from('resources')
          .update(formData)
          .eq('id', resource!.id)

        if (error) {
          throw error
        }

        // Redirect to the updated resource
        router.push(`/resource-finder/${resource!.id}`)
      }
    } catch (error) {
      console.error('Error saving resource:', error)
      setSubmitError('Failed to save resource. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
          <h3 className="text-sm font-medium text-red-800 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4" role="alert">
          <p className="text-sm text-red-700">{submitError}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="label">
              Resource Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input"
              placeholder="e.g., Downtown Food Bank"
              required
              aria-describedby="name-help"
            />
            <p id="name-help" className="text-xs text-gray-500 mt-1">
              The name of the organization or service
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input"
              rows={4}
              placeholder="Describe what this resource provides and who it serves..."
              required
              aria-describedby="description-help"
            />
            <p id="description-help" className="text-xs text-gray-500 mt-1">
              Provide a clear description of the services offered
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="label">
              Category *
            </label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => handleInputChange('category_id', e.target.value)}
              className="input"
              required
              aria-describedby="category-help"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
            <p id="category-help" className="text-xs text-gray-500 mt-1">
              Choose the most appropriate category for this resource
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="label">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="input"
              placeholder="(555) 123-4567"
              aria-describedby="phone-help"
            />
            <p id="phone-help" className="text-xs text-gray-500 mt-1">
              Include area code
            </p>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="input"
              placeholder="contact@example.org"
              aria-describedby="email-help"
            />
            <p id="email-help" className="text-xs text-gray-500 mt-1">
              Public contact email
            </p>
          </div>

          {/* Website */}
          <div className="md:col-span-2">
            <label htmlFor="website" className="label">
              Website
            </label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="input"
              placeholder="https://example.org"
              aria-describedby="website-help"
            />
            <p id="website-help" className="text-xs text-gray-500 mt-1">
              Include https://
            </p>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Information</h3>
        
        <div className="space-y-4">
          {/* Address */}
          <div>
            <label htmlFor="address" className="label">
              Street Address
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="input"
              placeholder="123 Main Street"
              aria-describedby="address-help"
            />
            <p id="address-help" className="text-xs text-gray-500 mt-1">
              Street address or building name
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label htmlFor="city" className="label">
                City
              </label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="input"
                placeholder="Springfield"
              />
            </div>

            {/* State */}
            <div>
              <label htmlFor="state" className="label">
                State
              </label>
              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="input"
                placeholder="IL"
                maxLength={2}
              />
            </div>

            {/* ZIP Code */}
            <div>
              <label htmlFor="zip_code" className="label">
                ZIP Code
              </label>
              <input
                id="zip_code"
                type="text"
                value={formData.zip_code}
                onChange={(e) => handleInputChange('zip_code', e.target.value)}
                className="input"
                placeholder="62701"
                maxLength={10}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          {/* Eligibility Criteria */}
          <div>
            <label htmlFor="eligibility" className="label">
              Eligibility Criteria
            </label>
            <textarea
              id="eligibility"
              value={formData.eligibility_criteria}
              onChange={(e) => handleInputChange('eligibility_criteria', e.target.value)}
              className="input"
              rows={3}
              placeholder="Who is eligible for this service?"
              aria-describedby="eligibility-help"
            />
            <p id="eligibility-help" className="text-xs text-gray-500 mt-1">
              Describe who can access this resource
            </p>
          </div>

          {/* Documents Required */}
          <div>
            <label htmlFor="documents" className="label">
              Documents Required
            </label>
            <textarea
              id="documents"
              value={formData.documents_required}
              onChange={(e) => handleInputChange('documents_required', e.target.value)}
              className="input"
              rows={2}
              placeholder="What documents do people need to bring?"
              aria-describedby="documents-help"
            />
            <p id="documents-help" className="text-xs text-gray-500 mt-1">
              List any required documents or identification
            </p>
          </div>

          {/* Hours of Operation */}
          <div>
            <label htmlFor="hours" className="label">
              Hours of Operation
            </label>
            <input
              id="hours"
              type="text"
              value={formData.hours_of_operation}
              onChange={(e) => handleInputChange('hours_of_operation', e.target.value)}
              className="input"
              placeholder="Monday-Friday 9:00 AM - 5:00 PM"
              aria-describedby="hours-help"
            />
            <p id="hours-help" className="text-xs text-gray-500 mt-1">
              When is this resource available?
            </p>
          </div>

          {/* Capacity Status */}
          <div>
            <label htmlFor="capacity" className="label">
              Current Capacity Status
            </label>
            <select
              id="capacity"
              value={formData.capacity_status}
              onChange={(e) => handleInputChange('capacity_status', e.target.value)}
              className="input"
              aria-describedby="capacity-help"
            >
              <option value="available">Available</option>
              <option value="limited">Limited Capacity</option>
              <option value="full">Currently Full</option>
            </select>
            <p id="capacity-help" className="text-xs text-gray-500 mt-1">
              Current availability status
            </p>
          </div>

          {/* Currently Accepting */}
          <div className="flex items-center">
            <input
              id="accepting"
              type="checkbox"
              checked={formData.is_currently_accepting}
              onChange={(e) => handleInputChange('is_currently_accepting', e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="accepting" className="ml-2 text-sm text-gray-700">
              Currently accepting new clients/participants
            </label>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Resource' : 'Update Resource'}
        </button>
      </div>
    </form>
  )
}

/**
 * USAGE EXAMPLES:
 * 
 * // Create new resource
 * <ResourceForm 
 *   categories={categories} 
 *   mode="create" 
 * />
 * 
 * // Edit existing resource
 * <ResourceForm 
 *   resource={resource} 
 *   categories={categories} 
 *   mode="edit" 
 * />
 * 
 * // In a page component
 * export default function CreateResourcePage() {
 *   const categories = await getCategories()
 *   
 *   return (
 *     <div>
 *       <h1>Add New Resource</h1>
 *       <ResourceForm 
 *         categories={categories} 
 *         mode="create" 
 *       />
 *     </div>
 *   )
 * }
 */
