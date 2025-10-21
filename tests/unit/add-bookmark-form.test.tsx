import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AddBookmarkForm } from '@/features/bookmarks/components/add-bookmark-form'
import { createBookmark } from '@/features/bookmarks/actions/bookmark-actions'

// Mock server actions
vi.mock('@/features/bookmarks/actions/bookmark-actions', () => ({
  createBookmark: vi.fn(),
}))

const mockCreateBookmark = vi.mocked(createBookmark)

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
    mockCreateBookmark.mockResolvedValueOnce({
      success: true,
      data: { id: '1', title: 'Test Bookmark' },
    })

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
      expect(mockCreateBookmark).toHaveBeenCalledWith(
        expect.objectContaining({
          get: expect.any(Function),
        })
      )
    })
  })

  it('should show error message on server action failure', async () => {
    mockCreateBookmark.mockResolvedValueOnce({
      success: false,
      error: 'A bookmark with this URL already exists',
    })

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
      expect(screen.getByText(/A bookmark with this URL already exists/i)).toBeInTheDocument()
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
