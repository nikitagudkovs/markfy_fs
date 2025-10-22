import { NextRequest, NextResponse } from 'next/server'
import { getBookmarkService } from '@/lib/services/service-container'
import { LinkQuerySchema, CreateLinkSchema } from '@/features/bookmarks/schemas/bookmark-schemas'
import { ZodError } from 'zod'

const service = getBookmarkService()

/**
 * GET /api/links
 * List bookmarks with pagination, search, and sorting
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - limit: number (default: 10, max: 100)
 * - search: string (optional)
 * - sort: 'newest' | 'oldest' | 'title' | 'favorites' (default: 'newest')
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const query = LinkQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      search: searchParams.get('search') || undefined,
      sort: searchParams.get('sort') || 'newest',
    })

    const result = await service.getLinks(query)
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error fetching links:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid query parameters',
          details: error.issues 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/links
 * Create a new bookmark
 * 
 * Body: {
 *   title: string (required)
 *   url: string (required, must be valid URL)
 *   description?: string (optional)
 *   isFavorite?: boolean (optional, default: false)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validatedData = CreateLinkSchema.parse(body)
    const result = await service.createLink(validatedData)
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid request body',
          details: error.issues 
        },
        { status: 400 }
      )
    }
    
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

