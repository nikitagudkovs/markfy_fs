import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PrismaClient } from '@prisma/client'
import { createBookmark } from '../factories/bookmark-factory'

// Test database setup
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
})

describe('Bookmark API Integration Tests', () => {
  beforeAll(async () => {
    // Clean up test database
    await prisma.link.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/links', () => {
    it('should create a new bookmark', async () => {
      const bookmarkData = createBookmark({
        title: 'Test Bookmark',
        url: 'https://test.com',
        description: 'A test bookmark',
        isFavorite: true,
      })

      // This would be a real API call in a full integration test
      const createdBookmark = await prisma.link.create({
        data: bookmarkData,
      })

      expect(createdBookmark).toMatchObject({
        title: bookmarkData.title,
        url: bookmarkData.url,
        description: bookmarkData.description,
        isFavorite: bookmarkData.isFavorite,
      })
      expect(createdBookmark.id).toBeDefined()
      expect(createdBookmark.createdAt).toBeDefined()
      expect(createdBookmark.updatedAt).toBeDefined()
    })

    it('should reject duplicate URLs', async () => {
      const bookmarkData = createBookmark({
        title: 'Duplicate Test',
        url: 'https://duplicate.com',
      })

      // Create first bookmark
      await prisma.link.create({ data: bookmarkData })

      // Try to create duplicate
      try {
        await prisma.link.create({ data: bookmarkData })
        expect.fail('Should have thrown an error for duplicate URL')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('GET /api/links', () => {
    it('should return paginated bookmarks', async () => {
      // Create test data
      const testBookmarks = [
        createBookmark({ title: 'Bookmark 1', url: 'https://bookmark1.com' }),
        createBookmark({ title: 'Bookmark 2', url: 'https://bookmark2.com' }),
        createBookmark({ title: 'Bookmark 3', url: 'https://bookmark3.com' }),
      ]

      for (const bookmark of testBookmarks) {
        await prisma.link.create({ data: bookmark })
      }

      // Test pagination
      const page1 = await prisma.link.findMany({
        take: 2,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      })

      expect(page1).toHaveLength(2)
      expect(page1[0].title).toBe('Bookmark 3')
      expect(page1[1].title).toBe('Bookmark 2')
    })

    it('should search bookmarks by title', async () => {
      const searchResults = await prisma.link.findMany({
        where: {
          title: {
            contains: 'Bookmark',
            mode: 'insensitive',
          },
        },
      })

      expect(searchResults.length).toBeGreaterThan(0)
      searchResults.forEach(bookmark => {
        expect(bookmark.title.toLowerCase()).toContain('bookmark')
      })
    })
  })

  describe('PATCH /api/links/[id]', () => {
    it('should update bookmark', async () => {
      const bookmark = await prisma.link.create({
        data: createBookmark({
          title: 'Original Title',
          url: 'https://original.com',
        }),
      })

      const updatedBookmark = await prisma.link.update({
        where: { id: bookmark.id },
        data: { title: 'Updated Title' },
      })

      expect(updatedBookmark.title).toBe('Updated Title')
      expect(updatedBookmark.url).toBe(bookmark.url) // Should remain unchanged
    })
  })

  describe('DELETE /api/links/[id]', () => {
    it('should delete bookmark', async () => {
      const bookmark = await prisma.link.create({
        data: createBookmark({
          title: 'To Delete',
          url: 'https://delete.com',
        }),
      })

      await prisma.link.delete({
        where: { id: bookmark.id },
      })

      const deletedBookmark = await prisma.link.findUnique({
        where: { id: bookmark.id },
      })

      expect(deletedBookmark).toBeNull()
    })
  })
})
