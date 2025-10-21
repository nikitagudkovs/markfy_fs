'use client'

import React, { useState, useTransition } from 'react'
import { createBookmark } from '@/features/bookmarks/actions/bookmark-actions'

export function AddBookmarkForm() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setError('')
    
    startTransition(async () => {
      const result = await createBookmark(formData)
      
      if (!result.success) {
        setError(result.error || 'Failed to create bookmark')
        return
      }

      // Reset form by clearing the form
      const form = document.getElementById('add-bookmark-form') as HTMLFormElement
      if (form) {
        form.reset()
      }
    })
  }

  return (
    <form id="add-bookmark-form" action={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl" style={{ backgroundColor: '#fef2f2', border: '2px solid #fecaca' }}>
          <div className="flex items-start gap-3">
            <svg className="icon-sm flex-shrink-0 mt-0.5" style={{ color: 'var(--destructive)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium" style={{ color: 'var(--destructive)' }}>{error}</p>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="label">
          Title <span style={{ color: 'var(--destructive)' }}>*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="input"
          placeholder="Enter bookmark title"
        />
      </div>

      <div>
        <label htmlFor="url" className="label">
          URL <span style={{ color: 'var(--destructive)' }}>*</span>
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          className="input"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="input"
          placeholder="Optional description"
        />
      </div>

      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: 'var(--accent)', border: '1px solid var(--border)' }}>
        <input
          id="isFavorite"
          name="isFavorite"
          type="checkbox"
          className="w-5 h-5 rounded cursor-pointer"
          style={{ accentColor: 'var(--primary)' }}
        />
        <label htmlFor="isFavorite" className="text-sm font-semibold cursor-pointer flex items-center gap-2 flex-1" style={{ color: 'var(--foreground)' }}>
          <span>Mark as favorite</span>
          <svg className="icon-sm" style={{ color: '#d4af37' }} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </label>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full"
        style={{ height: '3.25rem', fontSize: '1rem' }}
      >
        {isPending ? (
          <>
            <svg className="icon-md animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Adding...</span>
          </>
        ) : (
          <>
            <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Bookmark</span>
          </>
        )}
      </button>
    </form>
  )
}
