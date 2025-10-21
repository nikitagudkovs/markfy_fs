# Service Container Pattern

## Overview

The Service Container implements the Singleton pattern to manage service and repository instances across the application. This eliminates the anti-pattern of creating new instances on every request/render.

## Benefits

- **Performance**: No overhead from creating new instances repeatedly
- **Consistency**: Shared state across the application
- **Memory Efficiency**: Single instances instead of multiple duplicates
- **Testing**: Easy to mock and test with dependency injection
- **Maintainability**: Centralized service management

## Usage

### Basic Usage

```typescript
import { getBookmarkService, getBookmarkRepository } from '@/lib/services/service-container'

// Get singleton service instance
const service = getBookmarkService()

// Get singleton repository instance
const repository = getBookmarkRepository()
```

### Advanced Usage

```typescript
import { ServiceContainer } from '@/lib/services/service-container'

// Get the container instance
const container = ServiceContainer.getInstance()

// Reset instances (useful for testing)
container.reset()

// Set custom instances (useful for testing with mocks)
container.setBookmarkService(mockService)
container.setBookmarkRepository(mockRepository)
```

## Implementation Details

- **Singleton Pattern**: Only one instance of each service/repository exists
- **Lazy Initialization**: Instances are created only when first requested
- **Dependency Injection**: Services automatically receive their dependencies
- **Test-Friendly**: Easy to reset and mock for testing

## Migration

All files that previously created new instances:

```typescript
// OLD (Anti-pattern)
const repository = new BookmarkRepository(prisma)
const service = new BookmarkService(repository)
```

Now use the service container:

```typescript
// NEW (Singleton pattern)
const service = getBookmarkService()
```

## Files Updated

- `src/features/bookmarks/components/bookmark-list.tsx`
- `src/features/bookmarks/actions/bookmark-actions.ts`
- `src/app/api/links/route.ts`
- `src/app/api/links/[id]/route.ts`
- `src/app/api/links/[id]/favorite/route.ts`
