# Deploying Markfy to Vercel

## Step 1: Set Up PostgreSQL Database

Choose one of these options:

### Option A: Vercel Postgres (Recommended)
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage tab
3. Click "Create Database" → Select "Postgres"
4. Follow the setup wizard
5. Copy the `DATABASE_URL` connection string

### Option B: Neon (Free Serverless Postgres)
1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string (starts with `postgresql://`)

### Option C: Supabase
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → Database → Connection String (URI)
4. Copy the connection string

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? markfy (or your choice)
# - Directory? ./ (just press Enter)
# - Override settings? No

# After initial deployment, set environment variables:
vercel env add DATABASE_URL

# Then deploy to production:
vercel --prod
```

### Method 2: Using Vercel Dashboard (GUI)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `nikitagudkovs/markfy`
3. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**:
   - `DATABASE_URL` = Your PostgreSQL connection string

5. Click **Deploy**

## Step 3: Initialize Database

After deployment, you need to push the Prisma schema to your database:

```bash
# Set the production DATABASE_URL locally (temporarily)
export DATABASE_URL="your-production-postgres-url"

# Push the schema to production database
npx prisma db push

# Optional: Seed with sample data
npm run db:seed
```

Or use Vercel CLI:

```bash
# Run command in Vercel environment
vercel env pull .env.local
npx prisma db push
```

## Step 4: Verify Deployment

1. Visit your deployment URL (e.g., `markfy.vercel.app`)
2. Try adding a bookmark
3. Check that favorites work
4. Test search functionality

## Troubleshooting

### Build Fails
- Check that `DATABASE_URL` is set in Vercel environment variables
- Ensure it's a PostgreSQL connection string (not SQLite)

### Database Connection Issues
- Verify the connection string format: `postgresql://user:password@host:5432/database`
- Make sure your database allows connections from Vercel IPs (most cloud databases allow all by default)

### "Cannot find module '@prisma/client'"
- This should be handled by the `postinstall` script
- If it persists, try redeploying

## Environment Variables Reference

Required in Vercel:
- `DATABASE_URL` - PostgreSQL connection string

Vercel sets automatically:
- `NODE_ENV=production`
- `VERCEL=1`
- `VERCEL_URL` - Your deployment URL

## Local Development After Changing to PostgreSQL

If you want to continue using SQLite locally, you can:

1. Keep a local `.env.local` file with:
   ```
   DATABASE_URL="file:./dev.db"
   ```

2. Change `prisma/schema.prisma` provider back to `sqlite` for local dev

3. Or use PostgreSQL locally too (recommended for consistency):
   ```bash
   # Using Docker
   docker run -d \
     --name markfy-postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=markfy \
     -p 5432:5432 \
     postgres:16-alpine
   
   # Then use in .env.local:
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/markfy"
   ```

