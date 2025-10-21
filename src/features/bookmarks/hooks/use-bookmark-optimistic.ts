import { useOptimistic, useTransition } from 'react'
import { LinkResponse } from '../schemas/bookmark-schemas'
import { toggleFavorite, deleteBookmark, updateBookmark as updateBookmarkAction } from '../actions/bookmark-actions'

type OptimisticAction = 
  | { type: 'toggle_favorite'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'update'; id: string; data: Partial<LinkResponse> }

/**
 * Custom hook for optimistic bookmark updates using Server Actions
 * 
 * HOW IT WORKS:
 * 1. User performs action (e.g., clicks favorite)
 * 2. UI updates IMMEDIATELY using optimistic state
 * 3. Server Action happens in background
 * 4. If successful: optimistic state becomes real state
 * 5. If failed: state reverts + shows error
 * 
 * BENEFITS:
 * - Instant UI feedback (no loading spinners needed)
 * - Better UX than window.location.reload()
 * - Handles errors gracefully
 * - Uses modern Server Actions instead of API routes
 */
export function useBookmarkOptimistic(initialBookmark: LinkResponse) {
  const [isPending, startTransition] = useTransition()
  
  // useOptimistic manages the "optimistic" state
  const [optimisticBookmark, setOptimisticBookmark] = useOptimistic(
    initialBookmark,
    (state, action: OptimisticAction) => {
      switch (action.type) {
        case 'toggle_favorite':
          return { ...state, isFavorite: !state.isFavorite }
        
        case 'update':
          return { ...state, ...action.data }
        
        case 'delete':
          // For delete, we keep the state but could add a "deleting" flag
          return state
        
        default:
          return state
      }
    }
  )

  /**
   * Toggle favorite with optimistic update using Server Action
   */
  const handleToggleFavorite = async () => {
    // Step 1: Update UI immediately (optimistic)
    setOptimisticBookmark({ type: 'toggle_favorite', id: initialBookmark.id })
    
    // Step 2: Make server request in background using Server Action
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('id', initialBookmark.id)
        
        const result = await toggleFavorite(formData)

        if (!result.success) {
          throw new Error(result.error || 'Failed to toggle favorite')
        }

        // Server Action automatically handles revalidation
      } catch (error) {
        console.error('Error toggling favorite:', error)
        // On error, React automatically reverts the optimistic update
        alert('Failed to toggle favorite. Please try again.')
      }
    })
  }

  /**
   * Update bookmark with optimistic update
   */
  const updateBookmark = async (data: Partial<LinkResponse>) => {
    // Step 1: Update UI immediately
    setOptimisticBookmark({ type: 'update', id: initialBookmark.id, data })
    
    // Step 2: Make server request
    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('id', initialBookmark.id)
        if (data.title) formData.append('title', data.title)
        if (data.url) formData.append('url', data.url)
        if (data.description !== undefined) formData.append('description', data.description)
        if (data.isFavorite !== undefined) formData.append('isFavorite', data.isFavorite ? 'on' : 'off')
        
        const result = await updateBookmarkAction(formData)

        if (!result.success) {
          throw new Error(result.error || 'Failed to update bookmark')
        }

        // Server Action automatically handles revalidation
      } catch (error) {
        console.error('Error updating bookmark:', error)
        alert('Failed to update bookmark. Please try again.')
      }
    })
  }

  /**
   * Delete bookmark using Server Action
   */
  const handleDeleteBookmark = () => {
    if (!confirm('Delete this bookmark?')) {
      return
    }

    startTransition(async () => {
      try {
        const formData = new FormData()
        formData.append('id', initialBookmark.id)
        
        const result = await deleteBookmark(formData)

        if (!result.success) {
          throw new Error(result.error || 'Failed to delete bookmark')
        }

        // Server Action automatically handles revalidation
      } catch (error) {
        console.error('Error deleting bookmark:', error)
        alert('Failed to delete bookmark. Please try again.')
      }
    })
  }

  return {
    bookmark: optimisticBookmark,
    isPending,
    toggleFavorite: handleToggleFavorite,
    updateBookmark,
    deleteBookmark: handleDeleteBookmark,
  }
}
