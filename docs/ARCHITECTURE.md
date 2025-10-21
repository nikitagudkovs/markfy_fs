# Markfy - Architecture Overview

## Technology Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Testing**: Vitest + React Testing Library + Playwright

## Architecture Patterns

### 1. Feature-Based Organization

```
src/
├── features/bookmarks/          # Bookmark feature module
│   ├── components/             # UI components
│   ├── actions/                # Server actions
│   ├── hooks/                  # Custom hooks
│   ├── schemas/                # Zod validation schemas
│   ├── dtos/                   # Data Transfer Objects
│   └── types/                  # TypeScript types
├── lib/                        # Shared utilities
│   ├── repositories/           # Data access layer
│   ├── services/               # Business logic layer
│   └── query-builder/          # Query construction
└── components/ui/              # Shared UI components
```

### 2. Layered Architecture

**Presentation Layer**: React Server/Client Components
- Server Components: Data fetching (`BookmarkList`)
- Client Components: User interactions (`AddBookmarkForm`, `BookmarkItem`)

**Business Logic Layer**: Service classes
- `BookmarkService`: Encapsulates business rules and operations
- Handles validation, duplicate checking, data transformation

**Data Access Layer**: Repository pattern
- `BookmarkRepository`: Abstracts database operations
- Implements `BaseRepository` interface for common CRUD operations

**API Layer**: Route handlers + Server Actions
- REST API routes (`/api/links/*`)
- Server Actions for mutations (`createBookmark`, `updateBookmark`)

### 3. Data Transfer Objects (DTOs)

```typescript
export class LinkResponseDto {
  static fromPrisma(link: any): LinkResponse {
    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description || undefined,
      isFavorite: link.isFavorite,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    }
  }
}
```

## Database Design

```prisma
model Link {
  id          String   @id @default(cuid())
  title       String
  url         String   @unique
  description String?
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([title])
  @@index([createdAt])
  @@index([isFavorite])
  @@index([url])
}
```

**Key Design Decisions:**
- CUID for better performance than UUIDs
- Unique URL constraint prevents duplicates
- Indexes optimize common query patterns

## API Design

### Dual API Approach

This application implements both REST API routes and Server Actions, serving different purposes:

#### REST API Endpoints
```
GET    /api/links              # List bookmarks with pagination/search
POST   /api/links              # Create bookmark
GET    /api/links/[id]         # Get single bookmark
PATCH  /api/links/[id]         # Update bookmark
DELETE /api/links/[id]         # Delete bookmark
PATCH  /api/links/[id]/favorite # Toggle favorite status
```

**Purpose:**
- External HTTP access for testing tools (Postman, curl)
- Third-party integrations and webhooks
- Mobile apps or external clients
- Standard REST API consumers

**Implementation:** Next.js Route Handlers in `src/app/api/links/`

#### Server Actions
```typescript
// Used for form submissions and mutations
export async function createBookmark(formData: FormData)
export async function updateBookmark(formData: FormData)
export async function deleteBookmark(formData: FormData)
export async function toggleFavorite(formData: FormData)
```

**Purpose:**
- Next.js UI component interactions
- Automatic revalidation with `revalidatePath()`
- Type-safe server-side functions
- Optimistic updates for better UX

**Implementation:** Server Actions in `src/features/bookmarks/actions/`

#### Shared Service Layer

Both APIs call the same `BookmarkService`, ensuring consistent business logic:

```
REST API Routes ──┐
                  ├──> BookmarkService ──> Repository ──> Database
Server Actions ───┘
```

This architecture provides:
- **Flexibility**: Choose the right tool for each use case
- **Consistency**: Same business logic regardless of entry point
- **Modern UX**: Server Actions for UI, REST for external access
- **No Duplication**: Shared service layer prevents code duplication

## State Management

### URL State
- Search, pagination, and sorting state in URL parameters
- Enables shareable URLs and browser navigation

### Optimistic Updates
```typescript
// Custom hook for instant UI feedback
export function useBookmarkOptimistic(initialBookmark: LinkResponse) {
  const [optimisticBookmark, setOptimisticBookmark] = useOptimistic(
    initialBookmark,
    (state, action) => {
      switch (action.type) {
        case 'toggle_favorite':
          return { ...state, isFavorite: !state.isFavorite }
        // ... other actions
      }
    }
  )
}
```

## Component Architecture

### Server Components
- `BookmarkList`: Fetches and renders bookmark data
- `HomePage`: Main page layout with search parameters

### Client Components
- `AddBookmarkForm`: Form handling with API calls
- `BookmarkItem`: Individual bookmark display and actions
- `HeaderSearch`: Search and filter controls

## Error Handling

### API Error Handling
```typescript
export async function GET(request: NextRequest) {
  try {
    const result = await service.getLinks(query)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Client Error Handling
- Form validation with Zod schemas
- Try/catch blocks with user-friendly error messages
- Error boundary for unhandled React errors

## Performance Optimizations

### Database
- Query builder pattern for efficient Prisma queries
- Proper indexing for search and sorting operations
- Pagination to limit data transfer

### Frontend
- Server Components for initial data fetching
- Optimistic updates for instant UI feedback
- Debounced search (implemented in components)

## Testing Strategy

### Unit Tests
- Schema validation with Zod
- Service layer business logic
- Component behavior with React Testing Library

### Integration Tests
- API endpoint testing
- Database operations

### E2E Tests
- Complete user workflows with Playwright
- Form submissions and navigation

## Key Implementation Details

1. **Hybrid API Approach**: Uses both REST API routes and Server Actions
2. **Type Safety**: End-to-end TypeScript with runtime validation
3. **Query Builder**: Centralized query construction for database operations
4. **Optimistic Updates**: Instant UI feedback with error rollback
5. **URL State Management**: Search and pagination state in URL for shareability