import { describe, it, expect } from 'vitest'
import { CreateLinkSchema, UpdateLinkSchema, LinkQuerySchema } from '@/features/bookmarks/schemas/bookmark-schemas'

describe('Bookmark Schemas', () => {
  describe('CreateLinkSchema', () => {
    it('should validate valid bookmark data', () => {
      const validData = {
        title: 'Test Bookmark',
        url: 'https://example.com',
        description: 'A test bookmark',
        isFavorite: true,
      }

      const result = CreateLinkSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })

    it('should reject invalid URL', () => {
      const invalidData = {
        title: 'Test Bookmark',
        url: 'not-a-url',
        description: 'A test bookmark',
        isFavorite: false,
      }

      const result = CreateLinkSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Must be a valid URL')
      }
    })

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        url: 'https://example.com',
        description: 'A test bookmark',
        isFavorite: false,
      }

      const result = CreateLinkSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Title is required')
      }
    })

    it('should reject title that is too long', () => {
      const invalidData = {
        title: 'a'.repeat(256),
        url: 'https://example.com',
        description: 'A test bookmark',
        isFavorite: false,
      }

      const result = CreateLinkSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Title must be less than 255 characters')
      }
    })

    it('should set default values', () => {
      const minimalData = {
        title: 'Test Bookmark',
        url: 'https://example.com',
      }

      const result = CreateLinkSchema.parse(minimalData)
      expect(result.isFavorite).toBe(false)
      expect(result.description).toBeUndefined()
    })
  })

  describe('UpdateLinkSchema', () => {
    it('should validate partial update data', () => {
      const updateData = {
        id: 'clh1234567890123456789012', // Valid CUID format
        title: 'Updated Title',
        isFavorite: true,
      }

      const result = UpdateLinkSchema.safeParse(updateData)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('clh1234567890123456789012')
        expect(result.data.title).toBe('Updated Title')
        expect(result.data.isFavorite).toBe(true)
      }
    })

    it('should require id', () => {
      const invalidData = {
        title: 'Updated Title',
      }

      const result = UpdateLinkSchema.safeParse(invalidData)
      expect(result.success).toBe(false)
    })
  })

  describe('LinkQuerySchema', () => {
    it('should validate valid query parameters', () => {
      const validQuery = {
        page: '1',
        limit: '10',
        search: 'test',
        sort: 'newest',
      }

      const result = LinkQuerySchema.safeParse(validQuery)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(10)
        expect(result.data.search).toBe('test')
        expect(result.data.sort).toBe('newest')
      }
    })

    it('should set default values', () => {
      const emptyQuery = {}

      const result = LinkQuerySchema.parse(emptyQuery)
      expect(result.page).toBe(1)
      expect(result.limit).toBe(10)
      expect(result.sort).toBe('newest')
    })

    it('should reject invalid sort value', () => {
      const invalidQuery = {
        sort: 'invalid-sort',
      }

      const result = LinkQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })

    it('should reject page less than 1', () => {
      const invalidQuery = {
        page: '0',
      }

      const result = LinkQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })

    it('should reject limit greater than 100', () => {
      const invalidQuery = {
        limit: '101',
      }

      const result = LinkQuerySchema.safeParse(invalidQuery)
      expect(result.success).toBe(false)
    })
  })
})
