'use client'

import { useState, useEffect } from 'react'
import { LinkResponse } from '@/features/bookmarks/schemas/bookmark-schemas'

interface BookmarkModalProps {
  mode: 'add' | 'edit'
  bookmark?: LinkResponse
  onClose: () => void
}

export function BookmarkModal({ mode, bookmark, onClose }: BookmarkModalProps) {
  const [formData, setFormData] = useState({
    title: bookmark?.title || '',
    url: bookmark?.url || '',
    description: bookmark?.description || '',
    isFavorite: bookmark?.isFavorite || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const url = mode === 'add' ? '/api/links' : `/api/links/${bookmark?.id}`
      const method = mode === 'add' ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${mode} bookmark`)
      }

      onClose()
      window.location.reload()
    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'creating' : 'updating'} bookmark:`, error)
      setError(error instanceof Error ? error.message : `Failed to ${mode} bookmark`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div 
      className="modal-overlay"
      onClick={onClose}
    >
      <div 
        className="modal-content"
        style={{ padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {mode === 'add' ? 'Add Bookmark' : 'Edit Bookmark'}
          </h2>
          <button
            onClick={onClose}
            className="btn btn-icon btn-ghost"
          >
            <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div style={{ 
              padding: '0.75rem', 
              background: '#fef2f2', 
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#dc3545'
            }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., React Documentation"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="url" className="label">
              URL
            </label>
            <input
              id="url"
              name="url"
              type="url"
              required
              value={formData.url}
              onChange={handleChange}
              className="input"
              placeholder="https://..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="label">
              Description <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              placeholder="Brief description..."
              rows={3}
            />
          </div>

          <div className="checkbox-wrapper">
            <input
              id="isFavorite"
              name="isFavorite"
              type="checkbox"
              checked={formData.isFavorite}
              onChange={handleChange}
            />
            <label htmlFor="isFavorite" className="flex items-center gap-2 cursor-pointer flex-1">
              <span className="text-sm font-medium">Mark as favorite</span>
              <svg className="icon-sm" style={{ color: '#fbbf24' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </label>
          </div>

          <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <svg className="icon-sm animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{mode === 'add' ? 'Adding...' : 'Updating...'}</span>
                </>
              ) : (
                mode === 'add' ? 'Add Bookmark' : 'Update Bookmark'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

