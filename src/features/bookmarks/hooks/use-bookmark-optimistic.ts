'use client'

import { useOptimistic, useTransition } from 'react'
import { LinkResponse } from '@/features/bookmarks/schemas/bookmark-schemas'
import { toggleFavorite, deleteBookmark } from '@/features/bookmarks/actions/bookmark-actions'

export function useBookmarkOptimistic(bookmarks: LinkResponse[]) {
  const [isPending, startTransition] = useTransition()
  const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic(
    bookmarks,
    (state, optimisticUpdate: OptimisticUpdate) => {
      switch (optimisticUpdate.type) {
        case 'toggle-favorite':
          return state.map(bookmark =>
            bookmark.id === optimisticUpdate.id
              ? { ...bookmark, isFavorite: optimisticUpdate.isFavorite }
              : bookmark
          )
        case 'delete':
          return state.filter(bookmark => bookmark.id !== optimisticUpdate.id)
        default:
          return state
      }
    }
  )

  const optimisticToggleFavorite = (id: string, currentFavorite: boolean) => {
    startTransition(async () => {
      addOptimisticBookmark({
        type: 'toggle-favorite',
        id,
        isFavorite: !currentFavorite,
      })

      const result = await toggleFavorite(id)
      if (!result.success) {
        // Revert optimistic update on error
        addOptimisticBookmark({
          type: 'toggle-favorite',
          id,
          isFavorite: currentFavorite,
        })
      }
    })
  }

  const optimisticDeleteBookmark = (id: string) => {
    startTransition(async () => {
      addOptimisticBookmark({
        type: 'delete',
        id,
      })

      const result = await deleteBookmark(id)
      if (!result.success) {
        // Revert optimistic update on error by refreshing
        window.location.reload()
      }
    })
  }

  return {
    optimisticBookmarks,
    optimisticToggleFavorite,
    optimisticDeleteBookmark,
    isPending,
  }
}

type OptimisticUpdate = 
  | { type: 'toggle-favorite'; id: string; isFavorite: boolean }
  | { type: 'delete'; id: string }
