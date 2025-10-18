'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Plus, ChevronDown } from 'lucide-react'
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
  const isUpdatingUrl = useRef(false)
  const hasInitialized = useRef(false)

  // 🔧 OPTIMIZATION: Only sync with URL params on initial mount
  // This prevents the sync from interfering with user input
  useEffect(() => {
    if (!hasInitialized.current) {
      const urlSearch = searchParams.get('search') || ''
      const urlSort = searchParams.get('sort') || 'newest'
      
      setSearch(urlSearch)
      setSort(urlSort)
      hasInitialized.current = true
    }
  }, [searchParams])

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      
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
      
      if (search !== (searchParams.get('search') || '')) {
        params.delete('page')
      }
      
      isUpdatingUrl.current = true
      router.push(`/?${params.toString()}`)
    }, 300)

    return () => clearTimeout(timer)
  }, [search, sort, searchParams, router])

  // 🔧 OPTIMIZATION: useCallback prevents function recreation
  const handleSortChange = useCallback((newSort: string) => {
    setSort(newSort)
  }, [])

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="flex items-center justify-between gap-4 py-6">
            {/* Logo */}
            <div className={`flex-shrink-0 transition-all ${isSearchFocused ? 'hidden md:block' : 'block'}`}>
              <h1 className="logo">Markfy</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative flex items-center">
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
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className={`input transition-all ${isSearchFocused ? 'hidden md:block' : 'hidden sm:block'}`}
                  style={{ 
                    minWidth: '140px',
                    paddingRight: '2rem',
                    appearance: 'none'
                  }}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="title">A-Z</option>
                  <option value="favorites">Favorites</option>
                </select>
                <ChevronDown 
                  className="icon-sm absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'var(--muted-foreground)' }}
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn btn-primary"
              >
                <Plus className="icon-sm" />
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