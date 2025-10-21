import { describe, it, expect, beforeEach } from 'vitest'
import { ServiceContainer, getBookmarkService, getBookmarkRepository } from '@/lib/services/service-container'
import { BookmarkService } from '@/lib/services/bookmark-service'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'

describe('ServiceContainer', () => {
  beforeEach(() => {
    // Reset the singleton instance for each test
    ServiceContainer.getInstance().reset()
  })

  it('should return the same instance when called multiple times', () => {
    const container1 = ServiceContainer.getInstance()
    const container2 = ServiceContainer.getInstance()
    
    expect(container1).toBe(container2)
  })

  it('should return the same service instance when called multiple times', () => {
    const service1 = getBookmarkService()
    const service2 = getBookmarkService()
    
    expect(service1).toBe(service2)
  })

  it('should return the same repository instance when called multiple times', () => {
    const repository1 = getBookmarkRepository()
    const repository2 = getBookmarkRepository()
    
    expect(repository1).toBe(repository2)
  })

  it('should create service with the same repository instance', () => {
    const service = getBookmarkService()
    const repository = getBookmarkRepository()
    
    // Access the private repository property for testing
    const serviceRepository = (service as any).repository
    
    expect(serviceRepository).toBe(repository)
  })

  it('should allow setting custom instances for testing', () => {
    const mockRepository = {} as BookmarkRepository
    const mockService = {} as BookmarkService
    
    const container = ServiceContainer.getInstance()
    container.setBookmarkRepository(mockRepository)
    container.setBookmarkService(mockService)
    
    expect(getBookmarkRepository()).toBe(mockRepository)
    expect(getBookmarkService()).toBe(mockService)
  })

  it('should reset instances correctly', () => {
    const container = ServiceContainer.getInstance()
    
    // Get initial instances
    const initialService = getBookmarkService()
    const initialRepository = getBookmarkRepository()
    
    // Reset
    container.reset()
    
    // Get new instances
    const newService = getBookmarkService()
    const newRepository = getBookmarkRepository()
    
    expect(newService).not.toBe(initialService)
    expect(newRepository).not.toBe(initialRepository)
  })
})
