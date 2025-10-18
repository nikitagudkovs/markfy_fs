import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { LinkResponse } from '../schemas/bookmark-schemas'

type OptimisticAction = 
  | { type: 'toggle_favorite'; id: string }
  | { type: 'delete'; id: string }
  | { type: 'update'; id: string; data: Partial<LinkResponse> }

/**
 * Custom hook for optimistic bookmark updates
 * 
 * HOW IT WORKS:
 * 1. User performs action (e.g., clicks favorite)
 * 2. UI updates IMMEDIATELY using optimistic state
 * 3. Server request happens in background
 * 4. If successful: optimistic state becomes real state
 * 5. If failed: state reverts + shows error
 * 
 * BENEFITS:
 * - Instant UI feedback (no loading spinners needed)
 * - Better UX than window.location.reload()
 * - Handles errors gracefully
 */
export function useBookmarkOptimistic(initialBookmark: LinkResponse) {
  const router = useRouter()
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
   * Toggle favorite with optimistic update
   */
  const toggleFavorite = async () => {
    // Step 1: Update UI immediately (optimistic)
    setOptimisticBookmark({ type: 'toggle_favorite', id: initialBookmark.id })
    
    // Step 2: Make server request in background
    startTransition(async () => {
      try {
        const response = await fetch(`/api/links/${initialBookmark.id}/favorite`, {
          method: 'PATCH',
        })

        if (!response.ok) {
          throw new Error('Failed to toggle favorite')
        }

        // Step 3: Revalidate to sync with server (Next.js 15 feature)
        router.refresh()
      } catch (error) {
        console.error('Error toggling favorite:', error)
        // On error, React automatically reverts the optimistic update
        alert('Failed to toggle favorite. Please try again.')
        // Force revalidation to get correct state
        router.refresh()
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
        const response = await fetch(`/api/links/${initialBookmark.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error('Failed to update bookmark')
        }

        router.refresh()
      } catch (error) {
        console.error('Error updating bookmark:', error)
        alert('Failed to update bookmark. Please try again.')
        router.refresh()
      }
    })
  }

  /**
   * Delete bookmark (optimistic removal happens in parent component)
   */
  const deleteBookmark = () => {
    if (!confirm('Delete this bookmark?')) {
      return
    }

    startTransition(() => {
      // Perform async operation
      fetch(`/api/links/${initialBookmark.id}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete bookmark')
          }
          // Refresh to remove from list
          router.refresh()
        })
        .catch((error) => {
          console.error('Error deleting bookmark:', error)
          alert('Failed to delete bookmark. Please try again.')
          router.refresh()
        })
    })
  }

  return {
    bookmark: optimisticBookmark,
    isPending,
    toggleFavorite,
    updateBookmark,
    deleteBookmark,
  }
}
