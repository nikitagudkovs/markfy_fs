'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookmarkModal } from './bookmark-modal'


interface HeaderSearchProps {
  search: string
  sort: string
}

export function HeaderSearch({ search: initialSearch, sort: initialSort }: HeaderSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [sort, setSort] = useState(initialSort)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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
      
      params.delete('page')
      
      router.push(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, sort, router, searchParams])

  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort)
  }, [])

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between gap-4 py-4">
            {/* Logo */}
            <div className={`flex-shrink-0 transition-all ${isSearchFocused ? 'hidden md:block' : 'block'}`}>
              <h1 className="logo">Markfy</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <svg 
                  className="icon-sm absolute left-3 top-1/2 -translate-y-1/2" 
                  style={{ color: 'var(--muted-foreground)' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search..."
                  className="input pl-10"
                  style={{ 
                    background: 'white',
                    border: '1px solid var(--border)'
                  }}
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`input transition-all ${isSearchFocused ? 'hidden md:block' : 'hidden sm:block'}`}
                style={{ 
                  minWidth: '140px',
                  paddingRight: '2rem',
                  appearance: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.25rem'
                }}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">A-Z</option>
                <option value="favorites">Favorites</option>
              </select>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
              >
                <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isAddModalOpen && (
        <BookmarkModal mode="add" onClose={() => setIsAddModalOpen(false)} />
      )}
    </>
  )
}