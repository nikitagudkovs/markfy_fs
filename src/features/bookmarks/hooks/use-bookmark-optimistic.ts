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
 * 2. Both optimistic update and server request wrapped in startTransition
 * 3. UI updates IMMEDIATELY using optimistic state
 * 4. Server Action happens in background
 * 5. If successful: optimistic state becomes real state
 * 6. If failed: state reverts + shows error
 * 
 * BENEFITS:
 * - Instant UI feedback (no loading spinners needed)
 * - Better UX than window.location.reload()
 * - Handles errors gracefully
 * - Uses modern Server Actions instead of API routes
 * - Complies with React's transition requirements
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
    // Wrap both optimistic update and server request in startTransition
    startTransition(async () => {
      // Step 1: Update UI immediately (optimistic)
      setOptimisticBookmark({ type: 'toggle_favorite', id: initialBookmark.id })
      
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
        // TODO: Replace with toast notification when toast system is implemented
        console.error('Failed to toggle favorite:', error)
      }
    })
  }

  /**
   * Update bookmark with optimistic update
   */
  const updateBookmark = async (data: Partial<LinkResponse>) => {
    // Wrap both optimistic update and server request in startTransition
    startTransition(async () => {
      // Step 1: Update UI immediately
      setOptimisticBookmark({ type: 'update', id: initialBookmark.id, data })
      
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
        // TODO: Replace with toast notification when toast system is implemented
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
