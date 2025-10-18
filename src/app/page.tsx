import { Suspense } from 'react'
import { BookmarkList } from '@/features/bookmarks/components/bookmark-list'
import { BookmarkListSkeleton } from '@/features/bookmarks/components/bookmark-list-skeleton'
import { HeaderSearch } from '@/features/bookmarks/components/header-search'

interface HomePageProps {
  searchParams: Promise<{
    page?: string
    limit?: string
    search?: string
    sort?: string
  }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  const limit = parseInt(params.limit || '10')
  const search = params.search || ''
  const sort = params.sort || 'newest'

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f3ed' }}>
      <HeaderSearch search={search} sort={sort} />

      <main className="container py-8">
        <Suspense fallback={<BookmarkListSkeleton />}>
          <BookmarkList 
            page={page}
            limit={limit}
            search={search}
            sort={sort}
          />
        </Suspense>
      </main>
    </div>
  )
}
