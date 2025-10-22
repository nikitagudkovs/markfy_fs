import { PrismaClient } from '@prisma/client'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'


class ServiceContainer {
  private static instance: ServiceContainer
  private bookmarkRepository: BookmarkRepository | null = null
  private bookmarkService: BookmarkService | null = null

  private constructor() {
  }

  public static getInstance(): ServiceContainer {
    if (!ServiceContainer.instance) {
      ServiceContainer.instance = new ServiceContainer()
    }
    return ServiceContainer.instance
  }

  public getBookmarkRepository(): BookmarkRepository {
    if (!this.bookmarkRepository) {
      this.bookmarkRepository = new BookmarkRepository(prisma)
    }
    return this.bookmarkRepository
  }

  public getBookmarkService(): BookmarkService {
    if (!this.bookmarkService) {
      this.bookmarkService = new BookmarkService(this.getBookmarkRepository())
    }
    return this.bookmarkService
  }

  public reset(): void {
    this.bookmarkRepository = null
    this.bookmarkService = null
  }

  public setBookmarkRepository(repository: BookmarkRepository): void {
    this.bookmarkRepository = repository
  }

  public setBookmarkService(service: BookmarkService): void {
    this.bookmarkService = service
  }
}

export const serviceContainer = ServiceContainer.getInstance()

export const getBookmarkService = () => serviceContainer.getBookmarkService()
export const getBookmarkRepository = () => serviceContainer.getBookmarkRepository()

export { ServiceContainer }
