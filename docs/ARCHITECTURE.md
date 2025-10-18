# Markfy - Technical Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Database Design](#database-design)
4. [API Architecture](#api-architecture)
5. [Frontend Architecture](#frontend-architecture)
6. [Component Design](#component-design)
7. [State Management](#state-management)
8. [Error Handling](#error-handling)
9. [Performance Optimizations](#performance-optimizations)
10. [Security Implementation](#security-implementation)
11. [Testing Architecture](#testing-architecture)
12. [Deployment Architecture](#deployment-architecture)

## System Overview

### Technology Stack
- **Frontend Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript (strict mode)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma 5.x
- **Styling**: Tailwind CSS with custom design system
- **Validation**: Zod for runtime schema validation
- **Testing**: Vitest + React Testing Library + Playwright
- **Build Tool**: Webpack (Next.js default)

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Side   │    │   Server Side   │    │   Database      │
│                 │    │                 │    │                 │
│ • React SPA     │◄──►│ • Next.js API   │◄──►│ • SQLite/PostgreSQL
│ • Client Comps  │    │ • Server Comps  │    │ • Prisma ORM    │
│ • State Mgmt    │    │ • Server Actions│    │ • Migrations    │
│ • URL State     │    │ • Route Handlers│    │ • Indexes       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Architecture Patterns

### 1. Feature-Based Organization

The application follows a feature-based architecture where code is organized by business functionality rather than technical layers.

```
src/
├── features/
│   └── bookmarks/              # Bookmark feature module
│       ├── components/         # Feature-specific UI components
│       ├── actions/            # Server actions for mutations
│       ├── hooks/              # Custom React hooks
│       ├── schemas/            # Zod validation schemas
│       ├── dtos/               # Data Transfer Objects
│       └── types/              # Feature-specific TypeScript types
├── lib/                        # Shared utilities and services
│   ├── repositories/           # Data access layer
│   ├── services/               # Business logic layer
│   └── query-builder/          # Query construction utilities
└── components/ui/              # Shared UI components
```

**Benefits:**
- **Scalability**: Easy to add new features without affecting existing code
- **Maintainability**: Related code is co-located
- **Team Collaboration**: Multiple developers can work on different features
- **Code Reusability**: Shared utilities are clearly separated

### 2. Layered Architecture

#### Presentation Layer (Components)
- **Server Components**: Data fetching and initial rendering
- **Client Components**: User interactions and state management
- **Shared Components**: Reusable UI elements

#### Business Logic Layer (Services)
- **Service Classes**: Encapsulate business rules and operations
- **Data Transformation**: Convert between different data representations
- **Validation Logic**: Business rule validation

#### Data Access Layer (Repositories)
- **Repository Pattern**: Abstract database operations
- **Type Safety**: Prisma-generated types for database operations
- **Query Optimization**: Efficient database queries

#### API Layer (Route Handlers)
- **Thin Controllers**: Minimal logic in route handlers
- **Input Validation**: Zod schema validation
- **Error Handling**: Consistent error responses

### 3. Data Transfer Objects (DTOs)

DTOs provide a clean separation between internal data models and external API contracts.

```typescript
// Internal Prisma Model
interface PrismaLink {
  id: string
  title: string
  url: string
  description: string | null
  isFavorite: boolean
  createdAt: Date
  updatedAt: Date
}

// External API Response
interface LinkResponse {
  id: string
  title: string
  url: string
  description?: string
  isFavorite: boolean
  createdAt: string  // ISO string
  updatedAt: string  // ISO string
}

// DTO Transformation
export class LinkResponseDto {
  static fromPrisma(link: PrismaLink): LinkResponse {
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

**Benefits:**
- **API Versioning**: Easy to evolve API without breaking changes
- **Data Transformation**: Clean conversion between layers
- **Type Safety**: Compile-time and runtime validation
- **Security**: Control what data is exposed externally

## Database Design

### Schema Design

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

### Design Decisions

#### 1. Primary Key Strategy
- **CUID**: Collision-resistant unique identifier
- **Benefits**: Better performance than UUIDs, URL-safe, sortable
- **Alternative Considered**: UUIDs (rejected due to performance)

#### 2. URL Uniqueness
- **Constraint**: `@unique` on URL field
- **Rationale**: Prevents duplicate bookmarks
- **Trade-off**: Users can't bookmark same URL with different metadata

#### 3. Indexing Strategy
- **Title Index**: Supports text search operations
- **CreatedAt Index**: Optimizes sorting by date
- **IsFavorite Index**: Optimizes favorite filtering
- **URL Index**: Optimizes duplicate checking

#### 4. Nullable Fields
- **Description**: Optional field for user convenience
- **Rationale**: Not all bookmarks need descriptions

### Query Patterns

#### Search Implementation
```typescript
// Full-text search across multiple fields
const searchQuery = {
  OR: [
    { title: { contains: searchTerm } },
    { description: { contains: searchTerm } },
    { url: { contains: searchTerm } },
  ]
}
```

#### Pagination Implementation
```typescript
const paginationQuery = {
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
}
```

## API Architecture

### RESTful Design Principles

#### Resource-Based URLs
```
GET    /api/links              # Collection resource
POST   /api/links              # Create new resource
GET    /api/links/[id]         # Individual resource
PATCH  /api/links/[id]         # Partial update
DELETE /api/links/[id]         # Delete resource
PATCH  /api/links/[id]/favorite # Sub-resource action
```

#### HTTP Status Codes
- **200**: Success with data
- **201**: Created successfully
- **400**: Bad request (validation errors)
- **404**: Resource not found
- **409**: Conflict (duplicate URL)
- **500**: Internal server error

#### Request/Response Format

**List Request:**
```
GET /api/links?page=1&limit=10&search=react&sort=newest
```

**List Response:**
```typescript
{
  data: LinkResponse[],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  }
}
```

**Error Response:**
```typescript
{
  error: string,
  details?: ValidationError[]  // For validation errors
}
```

### Input Validation Strategy

#### Zod Schema Validation
```typescript
export const CreateLinkSchema = z.object({
  title: z.string().min(1).max(255),
  url: z.string().url(),
  description: z.string().max(500).optional(),
  isFavorite: z.boolean().default(false)
})

export const LinkQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'title', 'favorites']).default('newest')
})
```

#### Validation Benefits
- **Runtime Safety**: Catches invalid data at runtime
- **Type Inference**: Automatic TypeScript type generation
- **Error Messages**: Detailed validation error messages
- **API Documentation**: Self-documenting API contracts

## Frontend Architecture

### React Patterns

#### 1. Server Components
```typescript
// Server Component - runs on server
export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1')
  
  return (
    <main>
      <Suspense fallback={<BookmarkListSkeleton />}>
        <BookmarkList page={page} limit={10} />
      </Suspense>
    </main>
  )
}
```

**Benefits:**
- **Performance**: No JavaScript sent to client
- **SEO**: Server-rendered HTML
- **Security**: Sensitive operations stay on server

#### 2. Client Components
```typescript
'use client'

export function SearchBar() {
  const [search, setSearch] = useState('')
  const router = useRouter()
  
  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`/?search=${search}`)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])
  
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />
}
```

**Benefits:**
- **Interactivity**: User interactions and state management
- **Browser APIs**: Access to localStorage, window, etc.
- **Real-time Updates**: Immediate UI feedback

#### 3. Server Actions
```typescript
'use server'

export async function createBookmark(data: CreateLinkInput) {
  try {
    const validatedData = CreateLinkSchema.parse(data)
    const newBookmark = await bookmarkService.createLink(validatedData)
    revalidatePath('/')
    return { success: true, data: newBookmark }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
```

**Benefits:**
- **Type Safety**: End-to-end type safety
- **Automatic Revalidation**: Cache invalidation
- **Progressive Enhancement**: Works without JavaScript

### State Management Strategy

#### 1. URL State Management
```typescript
// Search and filter state in URL
const searchParams = useSearchParams()
const router = useRouter()

const updateSearch = (search: string) => {
  const params = new URLSearchParams(searchParams)
  if (search) {
    params.set('search', search)
  } else {
    params.delete('search')
  }
  router.push(`/?${params.toString()}`)
}
```

**Benefits:**
- **Shareable URLs**: Users can bookmark filtered views
- **Browser Navigation**: Back/forward button support
- **Server-Side Rendering**: State available on server

#### 2. Component State
```typescript
// Local component state for UI interactions
const [isEditModalOpen, setIsEditModalOpen] = useState(false)
const [isSubmitting, setIsSubmitting] = useState(false)
```

#### 3. Optimistic Updates
```typescript
const [optimisticBookmark, addOptimisticBookmark] = useOptimistic(
  bookmark,
  (state, payload: Partial<Bookmark>) => ({ ...state, ...payload })
)

const handleToggleFavorite = async () => {
  // Optimistic update
  addOptimisticBookmark({ isFavorite: !bookmark.isFavorite })
  
  try {
    await toggleFavorite(bookmark.id)
  } catch (error) {
    // Revert on error
    addOptimisticBookmark({ isFavorite: bookmark.isFavorite })
  }
}
```

## Component Design

### Component Hierarchy

```
App
├── RootLayout
│   ├── ErrorBoundary
│   └── ToastProvider
└── HomePage (Server Component)
    ├── Header
    ├── AddBookmarkForm (Client Component)
    └── BookmarkList (Server Component)
        ├── SearchBar (Client Component)
        ├── BookmarkItem (Client Component)
        │   └── EditBookmarkModal (Client Component)
        └── Pagination (Client Component)
```

### Component Responsibilities

#### Server Components
- **Data Fetching**: Fetch data from database
- **Initial Rendering**: Render initial HTML
- **SEO**: Provide meta tags and structured data

#### Client Components
- **User Interactions**: Handle clicks, form submissions
- **State Management**: Manage component state
- **Browser APIs**: Access localStorage, window, etc.

### Component Patterns

#### 1. Compound Components
```typescript
// Modal compound component
<Modal>
  <Modal.Header>Edit Bookmark</Modal.Header>
  <Modal.Body>
    <EditForm />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary">Cancel</Button>
    <Button variant="primary">Save</Button>
  </Modal.Footer>
</Modal>
```

#### 2. Render Props
```typescript
// Flexible data fetching component
<DataFetcher>
  {({ data, loading, error }) => (
    loading ? <Skeleton /> :
    error ? <ErrorMessage error={error} /> :
    <DataList data={data} />
  )}
</DataFetcher>
```

#### 3. Custom Hooks
```typescript
// Reusable bookmark operations
export function useBookmarkOperations(bookmark: Bookmark) {
  const [isDeleting, setIsDeleting] = useState(false)
  
  const deleteBookmark = async () => {
    setIsDeleting(true)
    try {
      await bookmarkService.deleteBookmark(bookmark.id)
      router.refresh()
    } catch (error) {
      toast.error('Failed to delete bookmark')
    } finally {
      setIsDeleting(false)
    }
  }
  
  return { deleteBookmark, isDeleting }
}
```

## Error Handling

### Error Boundary Implementation
```typescript
export class ErrorBoundary extends Component<Props, State> {
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
    // Log to monitoring service
    Sentry.captureException(error, { extra: errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h1>Something went wrong</h1>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

### API Error Handling
```typescript
export async function GET(request: NextRequest) {
  try {
    const result = await bookmarkService.getLinks(query)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching links:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
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

### Client-Side Error Handling
```typescript
const handleSubmit = async (data: FormData) => {
  try {
    setIsSubmitting(true)
    const result = await createBookmark(data)
    
    if (result.success) {
      toast.success('Bookmark created successfully!')
      router.refresh()
    } else {
      toast.error(result.error)
    }
  } catch (error) {
    toast.error('An unexpected error occurred')
    console.error('Form submission error:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

## Performance Optimizations

### 1. Database Optimizations

#### Query Optimization
```typescript
// Efficient pagination query
const getLinksQuery = {
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' },
  where: searchTerm ? {
    OR: [
      { title: { contains: searchTerm } },
      { description: { contains: searchTerm } },
      { url: { contains: searchTerm } }
    ]
  } : undefined
}
```

#### Connection Pooling
```typescript
// Prisma client with connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: ['query', 'info', 'warn', 'error'],
})
```

### 2. Frontend Optimizations

#### Debounced Search
```typescript
const debouncedSearch = useDebounce(searchTerm, 300)

useEffect(() => {
  if (debouncedSearch) {
    router.push(`/?search=${debouncedSearch}`)
  }
}, [debouncedSearch])
```

#### Lazy Loading
```typescript
// Dynamic imports for heavy components
const EditModal = lazy(() => import('./EditBookmarkModal'))

// Usage with Suspense
<Suspense fallback={<ModalSkeleton />}>
  <EditModal />
</Suspense>
```

#### Memoization
```typescript
// Memoized expensive calculations
const filteredBookmarks = useMemo(() => {
  return bookmarks.filter(bookmark => 
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
}, [bookmarks, searchTerm])

// Memoized callbacks
const handleDelete = useCallback(async (id: string) => {
  await deleteBookmark(id)
}, [deleteBookmark])
```

### 3. Bundle Optimizations

#### Code Splitting
```typescript
// Route-based code splitting (automatic with Next.js)
// Component-based code splitting
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <ComponentSkeleton />
})
```

#### Tree Shaking
- ES6 modules for better tree shaking
- Barrel exports avoided in favor of direct imports
- Unused code elimination

## Security Implementation

### 1. Input Validation
```typescript
// Server-side validation with Zod
const validatedData = CreateLinkSchema.parse(requestBody)

// Client-side validation for UX
const formSchema = zodResolver(CreateLinkSchema)
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: formSchema
})
```

### 2. SQL Injection Prevention
- **Prisma ORM**: Parameterized queries prevent SQL injection
- **No Raw Queries**: All database operations go through Prisma
- **Type Safety**: Compile-time type checking

### 3. XSS Prevention
- **React Defaults**: React automatically escapes content
- **Sanitization**: User input sanitized before display
- **Content Security Policy**: CSP headers for additional protection

### 4. CSRF Protection
- **SameSite Cookies**: Prevent cross-site request forgery
- **Origin Validation**: Validate request origins
- **CSRF Tokens**: For state-changing operations

## Testing Architecture

### Test Pyramid Structure

```
    ┌─────────────────┐
    │   E2E Tests     │  ← Few, high-level user journeys
    │   (Playwright)  │
    ├─────────────────┤
    │ Component Tests │  ← Some, component behavior
    │ (RTL + Vitest)  │
    ├─────────────────┤
    │ Integration     │  ← Some, API and service integration
    │ Tests (Vitest)  │
    ├─────────────────┤
    │   Unit Tests    │  ← Many, pure functions and utilities
    │   (Vitest)      │
    └─────────────────┘
```

### Unit Testing Strategy
```typescript
// Pure function testing
describe('BookmarkQueryBuilder', () => {
  it('should build correct query for search', () => {
    const query = { search: 'react', page: 1, limit: 10 }
    const builder = new BookmarkQueryBuilder(query)
    const result = builder.build()
    
    expect(result.where.OR).toHaveLength(3)
    expect(result.skip).toBe(0)
    expect(result.take).toBe(10)
  })
})
```

### Integration Testing Strategy
```typescript
// API route testing
describe('Bookmark API', () => {
  it('should create bookmark successfully', async () => {
    const bookmarkData = {
      title: 'Test Bookmark',
      url: 'https://example.com',
      description: 'Test description'
    }
    
    const response = await request(app)
      .post('/api/links')
      .send(bookmarkData)
      .expect(201)
    
    expect(response.body.title).toBe(bookmarkData.title)
  })
})
```

### Component Testing Strategy
```typescript
// React component testing
describe('AddBookmarkForm', () => {
  it('should submit form with valid data', async () => {
    render(<AddBookmarkForm />)
    
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: 'Test Title' }
    })
    fireEvent.change(screen.getByLabelText(/url/i), {
      target: { value: 'https://example.com' }
    })
    fireEvent.click(screen.getByRole('button', { name: /add bookmark/i }))
    
    await waitFor(() => {
      expect(mockCreateBookmark).toHaveBeenCalledWith({
        title: 'Test Title',
        url: 'https://example.com',
        description: '',
        isFavorite: false
      })
    })
  })
})
```

### E2E Testing Strategy
```typescript
// End-to-end user journey testing
test('user can create and manage bookmarks', async ({ page }) => {
  await page.goto('/')
  
  // Add new bookmark
  await page.fill('[data-testid="title-input"]', 'Test Bookmark')
  await page.fill('[data-testid="url-input"]', 'https://example.com')
  await page.click('[data-testid="add-button"]')
  
  // Verify bookmark appears
  await expect(page.locator('[data-testid="bookmark-item"]')).toContainText('Test Bookmark')
  
  // Edit bookmark
  await page.click('[data-testid="edit-button"]')
  await page.fill('[data-testid="title-input"]', 'Updated Bookmark')
  await page.click('[data-testid="save-button"]')
  
  // Verify update
  await expect(page.locator('[data-testid="bookmark-item"]')).toContainText('Updated Bookmark')
})
```

## Deployment Architecture

### Production Environment

#### Infrastructure Components
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Edge      │    │   Application   │    │   Database      │
│                 │    │   Server        │    │                 │
│ • Static Assets │◄──►│ • Next.js App   │◄──►│ • PostgreSQL   │
│ • Caching       │    │ • API Routes    │    │ • Connection    │
│ • SSL/TLS       │    │ • Server Actions│    │   Pooling       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Deployment Pipeline
```yaml
# GitHub Actions Workflow
name: Deploy to Production
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run db:migrate

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm run deploy
```

### Environment Configuration

#### Development Environment
```env
# .env.local
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

#### Production Environment
```env
# Production
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://api.markfy.com"
SENTRY_DSN="https://..."
```

### Monitoring and Observability

#### Application Monitoring
```typescript
// Performance monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric: any) {
  // Send to monitoring service
  analytics.track('web-vital', {
    name: metric.name,
    value: metric.value,
    delta: metric.delta
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

#### Error Monitoring
```typescript
// Error tracking with Sentry
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
})

// Error boundary integration
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    })
  }
}
```

#### Logging Strategy
```typescript
// Structured logging
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

// Usage in application
logger.info('User created bookmark', { userId, bookmarkId })
logger.error('Database connection failed', { error: error.message })
```

This technical documentation provides a comprehensive overview of the Markfy application's architecture, implementation details, and design decisions. It serves as a reference for developers working on the project and demonstrates the sophisticated architectural patterns used throughout the application.
