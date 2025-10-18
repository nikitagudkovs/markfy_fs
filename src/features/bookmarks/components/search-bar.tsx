'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      
      if (search) {
        params.set('search', search)
      } else {
        params.delete('search')
      }
      
      if (sort !== 'newest') {
        params.set('sort', sort)
      } else {
        params.delete('sort')
      }
      
      // Reset to page 1 when searching or sorting
      params.delete('page')
      
      router.push(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, sort, router, searchParams])

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort)
  }, [])

  return (
    <div className="space-y-5">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="icon-md" style={{ color: 'var(--muted-foreground)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, description, or URL..."
          className="input pl-12"
        />
      </div>
      
      {/* Sort Dropdown */}
      <div className="flex items-center gap-4">
        <label htmlFor="sort" className="label text-sm whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="input cursor-pointer flex-1"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title">Title A-Z</option>
          <option value="favorites">Favorites first</option>
        </select>
      </div>
    </div>
  )
}
