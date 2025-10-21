#!/bin/bash
export DATABASE_URL="file:./prisma/test.db"

# Ensure port 3000 is free
if lsof -ti:3000 >/dev/null 2>&1; then
  lsof -ti:3000 | xargs kill -9 >/dev/null 2>&1 || true
fi

# Force Next.js to use port 3000
export PORT=3000

npm run dev
