/**
 * ITEM FORM COMPONENT
 * 
 * This component handles creating and editing items.
 * It includes form validation, error handling, and accessibility features.
 * 
 * LEARNING GOALS:
 * - Understand form handling patterns
 * - Learn client-side validation
 * - See error handling techniques
 * - Understand accessibility in forms
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { type Item, type ItemInsert } from '@/lib/types'

interface ItemFormProps {
  item?: Item
  mode: 'create' | 'edit'
}

export function ItemForm({ item, mode }: ItemFormProps) {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState<ItemInsert>({
    title: item?.title || '',
    description: item?.description || '',
    status: item?.status || 'active',
  })

  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Handle form input changes
  const handleInputChange = (field: keyof ItemInsert, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([])
    }
  }

  // Validate form data
  const validateForm = (): string[] => {
    const errors: string[] = []
    
    if (!formData.title.trim()) {
      errors.push('Title is required')
    }
    
    if (formData.title.length > 100) {
      errors.push('Title must be less than 100 characters')
    }
    
    if (formData.description && formData.description.length > 1000) {
      errors.push('Description must be less than 1000 characters')
    }
    
    return errors
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validationErrors = validateForm()
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      if (mode === 'create') {
        // Create new item
        const { data, error } = await supabase
          .from('items')
          .insert([formData])
          .select()
          .single()

        if (error) {
          throw error
        }

        // Redirect to the new item
        router.push(`/items/${data.id}`)
      } else {
        // Update existing item
        const { error } = await supabase
          .from('items')
          .update(formData)
          .eq('id', item!.id)

        if (error) {
          throw error
        }

        // Redirect to the updated item
        router.push(`/items/${item!.id}`)
      }
    } catch (error) {
      console.error('Error saving item:', error)
      setSubmitError('Failed to save item. Please try again.')
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

      {/* Form Fields */}
      <div className="card">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input"
              placeholder="Enter item title"
              required
              aria-describedby="title-help"
            />
            <p id="title-help" className="text-xs text-gray-500 mt-1">
              A brief, descriptive title for this item
            </p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="input"
              rows={4}
              placeholder="Enter item description"
              aria-describedby="description-help"
            />
            <p id="description-help" className="text-xs text-gray-500 mt-1">
              Optional detailed description of this item
            </p>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="input"
              aria-describedby="status-help"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
            <p id="status-help" className="text-xs text-gray-500 mt-1">
              Current status of this item
            </p>
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
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Item' : 'Update Item'}
        </button>
      </div>
    </form>
  )
}
