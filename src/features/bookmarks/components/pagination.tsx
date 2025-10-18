'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function Pagination({ pagination }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const navigateToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/?${params.toString()}`)
  }

  const getVisiblePages = () => {
    const { page, totalPages } = pagination
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-6" style={{ borderTop: '2px solid var(--border)' }}>
      <div className="badge">
        <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>
          Showing {((pagination.page - 1) * pagination.limit) + 1}–
          {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigateToPage(pagination.page - 1)}
          disabled={!pagination.hasPrev}
          className={`btn ${pagination.hasPrev ? 'btn-secondary' : ''}`}
          style={{ height: '2.75rem' }}
        >
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          {getVisiblePages().map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="px-3" style={{ color: 'var(--muted-foreground)' }}>...</span>
              ) : (
                <button
                  onClick={() => navigateToPage(pageNum as number)}
                  className={`btn ${
                    pageNum === pagination.page
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                  style={{ minWidth: '2.75rem', height: '2.75rem', padding: '0.5rem' }}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="sm:hidden badge">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <button
          onClick={() => navigateToPage(pagination.page + 1)}
          disabled={!pagination.hasNext}
          className={`btn ${pagination.hasNext ? 'btn-secondary' : ''}`}
          style={{ height: '2.75rem' }}
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
