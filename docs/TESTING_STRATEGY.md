# Testing Strategy: Mocking vs Real Database

## Overview

You were absolutely right to question connecting to a real database in tests! Here's the proper testing strategy:

## Test Types & Database Usage

### 1. **Unit Tests** ✅ (Mock Everything)
- **Purpose**: Test individual components/functions in isolation
- **Database**: Always mocked
- **Example**: `add-bookmark-form.test.tsx` - mocks `fetch`
- **Speed**: Very fast
- **Reliability**: High (no external dependencies)

### 2. **Integration Tests** ✅ (Mock Services)
- **Purpose**: Test how different parts work together
- **Database**: Mock the service layer, not the database
- **Example**: `bookmark-api.test.ts` - mocks service calls
- **Speed**: Fast
- **Reliability**: High

### 3. **E2E Tests** ✅ (Real Database)
- **Purpose**: Test the entire application flow
- **Database**: Use real database in controlled environment
- **Example**: `bookmark-api-e2e.test.ts` - tests actual API endpoints
- **Speed**: Slower
- **Reliability**: Lower (more moving parts)

## What We Fixed

### Before (❌ Problems):
```typescript
// Dangerous: Using dev database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:/Users/nikita/projects/markfy/prisma/dev.db', // Hardcoded path!
    },
  },
})

// Testing Prisma directly, not your API
const createdBookmark = await prisma.link.create({ data: bookmarkData })
```

### After (✅ Solutions):

#### Integration Tests (Mocked):
```typescript
// Mock the service layer
const mockBookmarkService = {
  createBookmark: vi.fn(),
  getBookmarks: vi.fn(),
  // ...
}

// Test service behavior, not database
mockBookmarkService.createBookmark.mockResolvedValue(expectedBookmark)
const result = await mockBookmarkService.createBookmark(bookmarkData)
```

#### E2E Tests (Real Database):
```typescript
// Use separate test database
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'file:./test.db'

// Test actual API endpoints
const response = await fetch('/api/links', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(bookmarkData),
})
```

## Benefits of This Approach

1. **Safety**: No risk of corrupting dev data
2. **Speed**: Unit/integration tests run fast
3. **Reliability**: Tests don't depend on database state
4. **Portability**: Works on any machine
5. **Isolation**: Each test is independent

## When to Use Each Type

- **Unit Tests**: Test component logic, validation, UI behavior
- **Integration Tests**: Test service layer, business logic, data flow
- **E2E Tests**: Test complete user workflows, API contracts

## Environment Variables

Set up these environment variables:

```bash
# For E2E tests
TEST_DATABASE_URL="file:./test.db"

# For development
DATABASE_URL="file:./dev.db"
```

## Running Tests

```bash
# Unit + Integration tests (fast, mocked)
npm run test

# E2E tests (slower, real database)
npm run test:e2e
```

This approach gives you the best of both worlds: fast, reliable tests for development, and comprehensive E2E tests for confidence in production.
