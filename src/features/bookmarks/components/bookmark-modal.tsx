'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { X, Star, Loader2 } from 'lucide-react'
import { LinkResponse } from '@/features/bookmarks/schemas/bookmark-schemas'

interface BookmarkModalProps {
  mode: 'add' | 'edit'
  bookmark?: LinkResponse
  onClose: () => void
}

export function BookmarkModal({ mode, bookmark, onClose }: BookmarkModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: bookmark?.title || '',
    url: bookmark?.url || '',
    description: bookmark?.description || '',
    isFavorite: bookmark?.isFavorite || false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // 🔧 OPTIMIZATION: useCallback prevents function recreation on every render
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

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
      // 🚀 OPTIMIZATION: Use router.refresh() instead of window.location.reload()
      // This is MUCH faster - only revalidates server data, doesn't reload entire page
      router.refresh()
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
            <X className="icon-md" />
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
              <Star className="icon-sm" style={{ color: '#fbbf24' }} fill="currentColor" />
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
                  <Loader2 className="icon-sm animate-spin" />
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

