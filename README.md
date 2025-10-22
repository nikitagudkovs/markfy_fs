# Markfy - Personal Bookmarks Manager

A modern, full-stack bookmarks application built with Next.js. Save, organize, and manage your personal links with powerful search, sorting, and pagination features.

## Features

- **Bookmark Management**: Add, edit, delete, and favorite bookmarks
- **Smart Search**: Real-time search by title with instant results
- **Flexible Sorting**: Sort by newest, oldest, title, or favorites
- **Pagination**: Navigate through large bookmark collections efficiently
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Loading States**: Smooth user experience with proper loading indicators
- **Error Handling**: Graceful error recovery and user feedback

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **SQLite** (development) / **PostgreSQL** (production)
- **Prisma** ORM for database operations
- **Tailwind CSS** for styling
- **Zod** for data validation

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd markfy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.test.example .env.local
   ```
   
   The default configuration uses SQLite:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

4. **Initialize the database**
   ```bash
   # Create database tables
   npm run db:push
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Sample Data

The application comes with a seed script that populates the database with sample bookmarks across various categories including development tools, design resources, productivity apps, and more. This helps demonstrate the search, sorting, and pagination features.

Run the seed script:
```bash
npm run db:seed
```

## API Reference

### Endpoints

```
GET    /api/links              # List bookmarks (supports pagination, search, sort)
POST   /api/links              # Create new bookmark
GET    /api/links/[id]         # Get single bookmark
PATCH  /api/links/[id]         # Update bookmark
DELETE /api/links/[id]         # Delete bookmark
PATCH  /api/links/[id]/favorite # Toggle favorite status
```

### Query Parameters for `/api/links`

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search term (searches title, description, URL)
- `sort`: Sort order (`newest`, `oldest`, `title`, `favorites`)

### Example Usage

```bash
# Get first page of bookmarks, sorted by newest
GET /api/links?page=1&sort=newest

# Search for "react" bookmarks
GET /api/links?search=react&sort=title

# Get favorited bookmarks only
GET /api/links?sort=favorites
```

## Database Schema

```prisma
model Link {
  id          String   @id @default(cuid())
  title       String
  url         String   @unique
  description String?
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([title])      # Optimizes search queries
  @@index([createdAt])  # Optimizes sorting by date
  @@index([isFavorite]) # Optimizes favorite filtering
}
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio (database GUI)

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
```

## Architecture & Design Decisions

### Technology Choices

- **Next.js App Router**: Provides seamless full-stack integration with built-in API routes and server components
- **Prisma ORM**: Offers type safety, automatic migrations, and database abstraction
- **SQLite for Development**: Zero-configuration setup, perfect for local development
- **Dual API Approach**: Server Actions for UI interactions, REST API for external integrations
- **Feature-based Organization**: Domain-driven structure for better maintainability

### Database Design

- **Unique URLs**: Prevents duplicate bookmarks automatically
- **CUID IDs**: Better performance than UUIDs, URL-safe identifiers
- **Strategic Indexing**: Optimized for common query patterns (search, sort, favorites)
- **Flexible Schema**: Optional description field accommodates various bookmark types

### User Experience

- **Debounced Search**: 300ms delay reduces API calls while maintaining responsiveness
- **URL State Management**: Search and sort parameters persist in URL for bookmarkable states
- **Optimistic Updates**: Immediate UI feedback for better perceived performance
- **Loading Skeletons**: Enhanced UX during data loading

## Production Deployment

### Environment Setup

1. **Database Configuration**:
   - Set up managed PostgreSQL (Vercel Postgres, Supabase, or Neon)
   - Update `DATABASE_URL` environment variable
   - Run `npm run db:push` to create production schema

2. **Environment Variables**:
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

3. **Deployment**:
   - Deploy to Vercel, Railway, or similar platform
   - Configure environment variables in platform dashboard
   - Set up custom domain if needed

### Monitoring & Observability

- **Error Tracking**: Sentry integration for error monitoring and performance tracking
- **Database Monitoring**: Query performance and connection pool monitoring
- **Uptime Monitoring**: Service availability tracking
- **Performance Metrics**: API response times and user interaction analytics

## Testing

Comprehensive testing suite including:

- **Unit Tests**: Business logic and utility functions
- **Integration Tests**: API endpoints and database operations
- **Component Tests**: React component behavior
- **End-to-End Tests**: Complete user workflows

```bash
npm run test            # Unit and integration tests
npm run test:e2e:full   # End-to-end tests with database setup
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

ISC License