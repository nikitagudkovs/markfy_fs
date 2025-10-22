'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { X, Star, Loader2 } from 'lucide-react'
import { LinkResponse } from '@/features/bookmarks/schemas/bookmark-schemas'
import { createBookmark, updateBookmark } from '@/features/bookmarks/actions/bookmark-actions'

interface BookmarkModalProps {
  mode: 'add' | 'edit'
  bookmark?: LinkResponse
  onClose: () => void
}

export function BookmarkModal({ mode, bookmark, onClose }: BookmarkModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [handleEscape])

  const handleSubmit = async (formData: FormData) => {
    setError('')
    
    startTransition(async () => {
      const result = mode === 'add' 
        ? await createBookmark(formData)
        : await updateBookmark(formData)
      
      if (!result.success) {
        setError(result.error || `Failed to ${mode} bookmark`)
        return
      }

      onClose()
    })
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

        <form action={handleSubmit} className="space-y-4">
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

          {/* Hidden field for bookmark ID in edit mode */}
          {mode === 'edit' && bookmark && (
            <input type="hidden" name="id" value={bookmark.id} />
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
              defaultValue={bookmark?.title || ''}
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
              defaultValue={bookmark?.url || ''}
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
              defaultValue={bookmark?.description || ''}
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
              defaultChecked={bookmark?.isFavorite || false}
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
              disabled={isPending}
              className="btn btn-primary flex-1"
            >
              {isPending ? (
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

