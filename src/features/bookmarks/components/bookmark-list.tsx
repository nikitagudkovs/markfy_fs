import { getBookmarkService } from '@/lib/services/service-container'
import { LinkQuerySchema } from '@/features/bookmarks/schemas/bookmark-schemas'
import { BookmarkItem } from './bookmark-item'
import { Pagination } from './pagination'

interface BookmarkListProps {
  page: number
  limit: number
  search: string
  sort: string
}

export async function BookmarkList({ page, limit, search, sort }: BookmarkListProps) {
  const service = getBookmarkService()

  try {
    const query = LinkQuerySchema.parse({
      page,
      limit,
      search: search || undefined,
      sort: sort as 'newest' | 'oldest' | 'title' | 'favorites',
    })

    const result = await service.getLinks(query)

    if (result.data.length === 0) {
      return (
        <div className="card text-center py-16 mt-8" style={{ padding: '4rem 2rem' }}>
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--foreground)' }}>
            No bookmarks found
          </h3>
          <p style={{ color: 'var(--muted-foreground)' }}>
            {search 
              ? `No bookmarks match "${search}". Try a different search term.`
              : 'Click the "Add Bookmark" button to save your first link.'
            }
          </p>
        </div>
      )
    }

    return (
      <div className="space-y-8 mt-8">
        <div className="space-y-6 !mt-6">
          {result.data.map((bookmark) => (
            <BookmarkItem key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>

        <Pagination pagination={result.pagination} />
      </div>
    )
  } catch (error) {
    console.error('Error fetching bookmarks:', error)
    return (
      <div className="card text-center py-16 mt-8" style={{ padding: '4rem 2rem' }}>
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--destructive)' }}>
          Error loading bookmarks
        </h3>
        <p style={{ color: 'var(--muted-foreground)' }}>
          There was an error loading your bookmarks. Please try refreshing the page.
        </p>
      </div>
    )
  }
}
