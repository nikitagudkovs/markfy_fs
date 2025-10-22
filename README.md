# Markfy

A modern bookmarks management application built with Next.js 15, TypeScript, and SQLite/PostgreSQL. Features clean architecture, type safety, and production-ready patterns.

## Features

- Add, edit, delete, and favorite bookmarks
- Real-time search with debounced input
- Pagination and sorting options
- Responsive design with Tailwind CSS
- REST API and Server Actions
- Comprehensive testing suite
- Type-safe with Zod validation

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Testing**: Vitest + Playwright
- **Validation**: Zod

## Quick Start

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd markfy
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp env.test.example .env.local
   ```
   
   The default configuration uses SQLite for development:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. **Initialize the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:seed         # Seed database with sample data
npm run db:studio       # Open Prisma Studio

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:e2e:full   # Setup test DB and run E2E tests
```

## API Endpoints

```
GET    /api/links              # List bookmarks (with pagination/search)
POST   /api/links              # Create bookmark
GET    /api/links/[id]         # Get single bookmark
PATCH  /api/links/[id]         # Update bookmark
DELETE /api/links/[id]         # Delete bookmark
PATCH  /api/links/[id]/favorite # Toggle favorite status
```

### Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search term (searches title, description, URL)
- `sort`: Sort order (`newest`, `oldest`, `title`, `favorites`)

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
  
  @@index([title])
  @@index([createdAt])
  @@index([isFavorite])
}
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   └── page.tsx           # Home page
├── features/bookmarks/    # Bookmark feature module
│   ├── components/       # React components
│   ├── actions/          # Server actions
│   ├── hooks/            # Custom hooks
│   ├── schemas/          # Zod validation
│   └── types/            # TypeScript types
├── lib/                  # Shared utilities
│   ├── repositories/     # Data access layer
│   ├── services/         # Business logic
│   └── query-builder/    # Query builder
└── components/ui/        # Shared UI components
```

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Vitest for business logic and utilities
- **Component Tests**: React Testing Library for UI components
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright for complete user flows

Run tests:
```bash
npm run test            # Unit tests
npm run test:e2e:full   # E2E tests with setup
```

## Production Deployment

### Environment Setup

For production, update your environment variables:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="production"
```

### Deployment Platforms

- **Vercel** (recommended): Seamless Next.js integration
- **Railway**: Easy PostgreSQL setup
- **Render**: Simple deployment with managed database

The application automatically uses PostgreSQL schema in production environments.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run tests: `npm run test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## License

This project is licensed under the ISC License.