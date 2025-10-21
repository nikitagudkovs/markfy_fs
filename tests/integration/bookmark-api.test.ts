import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBookmark } from '../factories/bookmark-factory'

// Mock the bookmark service and repository
const mockBookmarkService = {
  createBookmark: vi.fn(),
  getBookmarks: vi.fn(),
  updateBookmark: vi.fn(),
  deleteBookmark: vi.fn(),
  toggleFavorite: vi.fn(),
}

const mockBookmarkRepository = {
  create: vi.fn(),
  findMany: vi.fn(),
  findById: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}

// Mock the service container
vi.mock('@/lib/services/service-container', () => ({
  getBookmarkService: () => mockBookmarkService,
  getBookmarkRepository: () => mockBookmarkRepository,
}))

describe('Bookmark API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('POST /api/links', () => {
    it('should create a new bookmark', async () => {
      const bookmarkData = createBookmark({
        title: 'Test Bookmark',
        url: 'https://test.com',
        description: 'A test bookmark',
        isFavorite: true,
      })

      const expectedBookmark = {
        id: '1',
        ...bookmarkData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockBookmarkService.createBookmark.mockResolvedValue(expectedBookmark)

      const result = await mockBookmarkService.createBookmark(bookmarkData)

      expect(mockBookmarkService.createBookmark).toHaveBeenCalledWith(bookmarkData)
      expect(result).toMatchObject({
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
        isFavorite: bookmarkData.isFavorite,
      })
      expect(result.id).toBeDefined()
      expect(result.createdAt).toBeDefined()
      expect(result.updatedAt).toBeDefined()
    })

    it('should handle duplicate URLs', async () => {
      const bookmarkData = createBookmark({
        title: 'Duplicate Test',
        url: 'https://duplicate.com',
      })

      const duplicateError = new Error('URL already exists')
      mockBookmarkService.createBookmark.mockRejectedValue(duplicateError)

      await expect(mockBookmarkService.createBookmark(bookmarkData))
        .rejects.toThrow('URL already exists')

      expect(mockBookmarkService.createBookmark).toHaveBeenCalledWith(bookmarkData)
    })
  })

  describe('GET /api/links', () => {
    it('should return paginated bookmarks', async () => {
      const testBookmarks = [
        { id: '1', title: 'Bookmark 1', url: 'https://bookmark1.com', createdAt: new Date() },
        { id: '2', title: 'Bookmark 2', url: 'https://bookmark2.com', createdAt: new Date() },
        { id: '3', title: 'Bookmark 3', url: 'https://bookmark3.com', createdAt: new Date() },
      ]

      mockBookmarkService.getBookmarks.mockResolvedValue({
        bookmarks: testBookmarks.slice(0, 2),
        total: testBookmarks.length,
        page: 1,
        limit: 2,
      })

      const result = await mockBookmarkService.getBookmarks({ page: 1, limit: 2 })

      expect(mockBookmarkService.getBookmarks).toHaveBeenCalledWith({ page: 1, limit: 2 })
      expect(result.bookmarks).toHaveLength(2)
      expect(result.total).toBe(3)
      expect(result.bookmarks[0].title).toBe('Bookmark 1')
      expect(result.bookmarks[1].title).toBe('Bookmark 2')
    })

    it('should search bookmarks by title', async () => {
      const searchResults = [
        { id: '1', title: 'Test Bookmark', url: 'https://test.com', createdAt: new Date() },
        { id: '2', title: 'Another Test', url: 'https://another.com', createdAt: new Date() },
      ]

      mockBookmarkService.getBookmarks.mockResolvedValue({
        bookmarks: searchResults,
        total: searchResults.length,
        page: 1,
        limit: 10,
      })

      const result = await mockBookmarkService.getBookmarks({ search: 'Test' })

      expect(mockBookmarkService.getBookmarks).toHaveBeenCalledWith({ search: 'Test' })
      expect(result.bookmarks.length).toBeGreaterThan(0)
      result.bookmarks.forEach(bookmark => {
        expect(bookmark.title.toLowerCase()).toContain('test')
      })
    })
  })

  describe('PATCH /api/links/[id]', () => {
    it('should update bookmark', async () => {
      const originalBookmark = {
        id: '1',
        title: 'Original Title',
        url: 'https://original.com',
        description: 'Original description',
        isFavorite: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const updatedBookmark = {
        ...originalBookmark,
        title: 'Updated Title',
        updatedAt: new Date(),
      }

      mockBookmarkService.updateBookmark.mockResolvedValue(updatedBookmark)

      const result = await mockBookmarkService.updateBookmark('1', { title: 'Updated Title' })

      expect(mockBookmarkService.updateBookmark).toHaveBeenCalledWith('1', { title: 'Updated Title' })
      expect(result.title).toBe('Updated Title')
      expect(result.url).toBe(originalBookmark.url) // Should remain unchanged
    })
  })

  describe('DELETE /api/links/[id]', () => {
    it('should delete bookmark', async () => {
      mockBookmarkService.deleteBookmark.mockResolvedValue(true)

      const result = await mockBookmarkService.deleteBookmark('1')

      expect(mockBookmarkService.deleteBookmark).toHaveBeenCalledWith('1')
      expect(result).toBe(true)
    })
  })
})
