# Markfy Architecture Brief

### **Presentation Layer**
- **Next.js App Router** - Server-side rendering with client-side interactivity
  - `src/app/page.tsx`, `src/app/layout.tsx`
- **React Components** - UI components with optimistic updates
  - `src/features/bookmarks/components/bookmark-item.tsx`, `src/features/bookmarks/components/bookmark-list.tsx`
- **Server Actions** - Type-safe server-side functions for UI mutations
  - `src/features/bookmarks/actions/bookmark-actions.ts`
- **REST API Routes** - External API endpoints (`/api/links/*`)
  - `src/app/api/links/route.ts`, `src/app/api/links/[id]/route.ts`

### **Business Logic Layer**
- **Service Container** - Dependency injection for services
  - `src/lib/services/service-container.ts`
- **Bookmark Service** - Core business logic and orchestration
  - `src/lib/services/bookmark-service.ts`
- **Query Builder** - Dynamic database query construction
  - `src/lib/query-builder/bookmark-query-builder.ts`
- **Mappers** - Data transformation between layers
  - `src/features/bookmarks/mappers/link-mapper.ts`

### **Data Access Layer**
- **Repository Pattern** - Abstracted data access
  - `src/lib/repositories/bookmark-repository.ts`, `src/lib/repositories/base-repository.ts`
- **Prisma ORM** - Type-safe database operations
  - `prisma/schema.prisma`, `src/lib/db.ts`
- **SQLite/PostgreSQL** - Relational database with migrations
  - `prisma/schema.production.prisma`, `prisma/seed.ts`

### **Infrastructure Layer**
- **Database** - SQLite (dev) / PostgreSQL (production)
  - `prisma/dev.db`, `prisma/schema.prisma`
- **Validation** - Zod schemas for type safety
  - `src/features/bookmarks/schemas/bookmark-schemas.ts`
- **Error Handling** - Centralized error management
  - `src/components/ui/error-boundary.tsx`

## 🔄 Data Flow

```
UI Components → Server Actions/REST API → Services → Repositories → Database
     ↓                    ↓                    ↓           ↓
Optimistic Updates → Validation → Business Logic → Data Mapping
```

## 🧪 Testing Strategy

### **What We Test**
- **Unit Tests** - Service logic, schemas, utilities
- **Integration Tests** - API endpoints, database operations
- **E2E Tests** - Core user workflows (add, search, sort)
- **Component Tests** - Form validation, optimistic updates

### **What We Don't Test**
- **Complex UI Interactions** - Hover states, animations
- **Third-party Dependencies** - Prisma, Next.js internals
- **Browser-specific Features** - CSS, responsive design
- **Performance** - Load testing, memory usage

## 🎯 Key Design Decisions

### **Dual API Approach**
- **Server Actions** - For Next.js UI (optimized UX)
- **REST API** - For external clients (meets requirements)

### **Optimistic Updates**
- **Instant UI feedback** - No loading spinners for mutations
- **Automatic rollback** - On server errors
- **Better UX** - Perceived performance improvement

### **Repository Pattern**
- **Testability** - Easy to mock for unit tests
- **Flexibility** - Can switch databases without changing business logic
- **Separation** - Clean separation of concerns

## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15, React 18, TypeScript | UI framework |
| **Styling** | Tailwind CSS | Component styling |
| **Backend** | Next.js API Routes | REST endpoints |
| **Database** | Prisma ORM + SQLite/PostgreSQL | Data persistence |
| **Testing** | Vitest, Playwright | Unit + E2E testing |
| **Validation** | Zod | Runtime type safety |

## 🚀 Deployment

- **Development** - SQLite with hot reload
- **Production** - PostgreSQL on Vercel
- **Environment** - Automatic schema switching
  - `package.json` build script switches between `schema.prisma` (SQLite) and `schema.production.prisma` (PostgreSQL) based on NODE_ENV
- **Monitoring** - Built-in error boundaries
  - `src/components/ui/error-boundary.tsx` catches React errors, API routes have try-catch blocks for server errors

## 📈 Scalability Considerations

- **Database** - Easy migration to PostgreSQL
- **Caching** - Next.js built-in caching
- **API** - RESTful design for external integrations
- **Testing** - Comprehensive test coverage for reliability

---
*This architecture balances simplicity with scalability, meeting all requirements while maintaining clean code and testability.*
