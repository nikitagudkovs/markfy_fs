'use client'

import { useState, useMemo, memo } from 'react'
import { Star, ExternalLink, Clock, Edit, Trash2 } from 'lucide-react'
import { LinkResponse } from '@/features/bookmarks/schemas/bookmark-schemas'
import { useBookmarkOptimistic } from '@/features/bookmarks/hooks/use-bookmark-optimistic'
import { BookmarkModal } from './bookmark-modal'
import { formatDate } from '@/lib/utils/date-utils'

interface BookmarkItemProps {
  bookmark: LinkResponse
}


const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    return domain
  } catch {
    return url
  }
}

function BookmarkItemComponent({ bookmark: initialBookmark }: BookmarkItemProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  const { bookmark, isPending, toggleFavorite, deleteBookmark } = useBookmarkOptimistic(initialBookmark)

  const formattedDate = useMemo(
    () => formatDate(bookmark.createdAt),
    [bookmark.createdAt]
  )

  const domain = useMemo(
    () => getDomainFromUrl(bookmark.url),
    [bookmark.url]
  )

  return (
    <>
      <div className={`bookmark-card group ${isPending ? 'opacity-70' : ''}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3 mb-2">
              {bookmark.isFavorite && (
                <Star className="favorite-star active icon-sm mt-0.5" fill="currentColor" />
              )}
              <div className="flex-1">
                <h3 className="bookmark-title truncate">
                  {bookmark.title}
                </h3>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bookmark-url"
                >
                  <ExternalLink className="icon-xs" />
                  <span>{domain}</span>
                </a>
              </div>
            </div>
            
            {bookmark.description && (
              <p className="bookmark-description line-clamp-2">
                {bookmark.description}
              </p>
            )}
            
            <div className="bookmark-meta">
              <Clock className="icon-xs" />
              <span>{formattedDate}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
            <button
              onClick={toggleFavorite}
              disabled={isPending}
              className="btn btn-icon btn-ghost"
              title={bookmark.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star 
                className="icon-sm" 
                fill={bookmark.isFavorite ? 'currentColor' : 'none'} 
                style={{ color: bookmark.isFavorite ? '#fbbf24' : 'currentColor' }}
              />
            </button>
            
            <button
              onClick={() => setIsEditModalOpen(true)}
              disabled={isPending}
              className="btn btn-icon btn-ghost"
              title="Edit"
            >
              <Edit className="icon-sm" />
            </button>
            
            <button
              onClick={deleteBookmark}
              disabled={isPending}
              className="btn btn-icon btn-destructive"
              title="Delete"
            >
              <Trash2 className="icon-sm" />
            </button>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <BookmarkModal
          mode="edit"
          bookmark={bookmark}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  )
}

export const BookmarkItem = memo(BookmarkItemComponent, (prevProps, nextProps) => {
  return (
    prevProps.bookmark.id === nextProps.bookmark.id &&
    prevProps.bookmark.title === nextProps.bookmark.title &&
    prevProps.bookmark.isFavorite === nextProps.bookmark.isFavorite &&
    prevProps.bookmark.url === nextProps.bookmark.url &&
    prevProps.bookmark.description === nextProps.bookmark.description &&
    prevProps.bookmark.createdAt === nextProps.bookmark.createdAt
  )
})