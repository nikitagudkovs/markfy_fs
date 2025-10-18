'use client'

import { useMemo, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react'

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

  // 🔧 OPTIMIZATION: useCallback prevents function recreation on every render
  const navigateToPage = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`/?${params.toString()}`)
  }, [router, searchParams])

  const visiblePages = useMemo(() => {
    const { page, totalPages } = pagination
    const delta = 2
    const range = []
    const rangeWithDots: (number | string)[] = []

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
  }, [pagination.page, pagination.totalPages])

  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 mt-6" style={{ borderTop: '2px solid var(--border)' }}>
      <div className="badge">
        <FileText className="icon-sm" />
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
          <ChevronLeft className="icon-sm" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="hidden sm:flex items-center gap-2">
          {visiblePages.map((pageNum, index) => (
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
          <ChevronRight className="icon-sm" />
        </button>
      </div>
    </div>
  )
}
