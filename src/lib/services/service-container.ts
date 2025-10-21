import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'

/**
 * Service Container with Singleton Pattern
 * 
 * This container manages singleton instances of services and repositories
 * to avoid creating new instances on every request/render, improving
 * performance and ensuring consistent state across the application.
 */
class ServiceContainer {
  private static instance: ServiceContainer
  private bookmarkRepository: BookmarkRepository | null = null
  private bookmarkService: BookmarkService | null = null

  private constructor() {
    // Private constructor to prevent direct instantiation
  }

  /**
   * Get the singleton instance of ServiceContainer
   */
  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  /**
   * Get the singleton BookmarkRepository instance
   */
  public getBookmarkRepository(): BookmarkRepository {
    if (!this.bookmarkRepository) {
      this.bookmarkRepository = new BookmarkRepository(prisma)
    }
    return this.bookmarkRepository
  }

  /**
   * Get the singleton BookmarkService instance
   */
  public getBookmarkService(): BookmarkService {
    if (!this.bookmarkService) {
      this.bookmarkService = new BookmarkService(this.getBookmarkRepository())
    }
    return this.bookmarkService
  }

  /**
   * Reset all instances (useful for testing)
   */
  public reset(): void {
    this.bookmarkRepository = null
    this.bookmarkService = null
  }

  /**
   * Set custom instances (useful for testing with mocks)
   */
  public setBookmarkRepository(repository: BookmarkRepository): void {
    this.bookmarkRepository = repository
  }

  public setBookmarkService(service: BookmarkService): void {
    this.bookmarkService = service
  }
}

// Export singleton instance
export const serviceContainer = ServiceContainer.getInstance()

// Export convenience functions for easier usage
export const getBookmarkService = () => serviceContainer.getBookmarkService()
export const getBookmarkRepository = () => serviceContainer.getBookmarkRepository()

// Export the container for advanced usage
export { ServiceContainer }
