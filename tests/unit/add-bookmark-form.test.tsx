import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddBookmarkForm } from '@/features/bookmarks/components/add-bookmark-form'

// Mock fetch
global.fetch = vi.fn()

describe('AddBookmarkForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render form fields', () => {
    render(<AddBookmarkForm />)
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mark as favorite/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add bookmark/i })).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    render(<AddBookmarkForm />)
    
    const submitButton = screen.getByRole('button', { name: /add bookmark/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /title/i })).toBeInvalid()
    })
  })

  it('should submit form with valid data', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: '1', title: 'Test' }),
    } as Response)

    render(<AddBookmarkForm />)
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Bookmark' },
    })
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: 'https://test.com' },
    })
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test description' },
    })
    
    const submitButton = screen.getByRole('button', { name: /add bookmark/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Bookmark',
          url: 'https://test.com',
          description: 'Test description',
          isFavorite: false,
        }),
      })
    })
  })

  it('should show error message on API failure', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'API Error' }),
    } as Response)

    render(<AddBookmarkForm />)
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Bookmark' },
    })
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: 'https://test.com' },
    })
    
    const submitButton = screen.getByRole('button', { name: /add bookmark/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument()
    })
  })

  it('should toggle favorite checkbox', () => {
    render(<AddBookmarkForm />)
    
    const favoriteCheckbox = screen.getByLabelText(/mark as favorite/i)
    expect(favoriteCheckbox).not.toBeChecked()
    
    fireEvent.click(favoriteCheckbox)
    expect(favoriteCheckbox).toBeChecked()
  })
})
