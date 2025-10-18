# Environment Variables

## Local Development (SQLite)
```
DATABASE_URL="file:./dev.db"
NODE_ENV=development
```

## Production (PostgreSQL)
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
NODE_ENV=production
```

## Required Environment Variables for Vercel

1. **DATABASE_URL** - PostgreSQL connection string (required)
   - You'll get this from Vercel Postgres, Neon, or Supabase

2. **NODE_ENV** - Set to "production" (Vercel sets this automatically)

