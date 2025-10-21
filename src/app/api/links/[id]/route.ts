import { NextRequest, NextResponse } from 'next/server'
import { getBookmarkService } from '@/lib/services/service-container'
import { UpdateLinkSchema } from '@/features/bookmarks/schemas/bookmark-schemas'
import { ZodError } from 'zod'

const service = getBookmarkService()

/**
 * GET /api/links/[id]
 * Retrieve a single bookmark by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await service.getLinkById(id)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error fetching link:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/links/[id]
 * Update a bookmark
 * 
 * Body: {
 *   title?: string
 *   url?: string
 *   description?: string
 *   isFavorite?: boolean
 * }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const validatedData = UpdateLinkSchema.parse({ ...body, id })
    const result = await service.updateLink(id, validatedData)
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error updating link:', error)
    
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
      // Check for specific errors
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
        )
      }
      
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

/**
 * DELETE /api/links/[id]
 * Delete a bookmark
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await service.deleteLink(id)
    
    return NextResponse.json(
      { message: 'Bookmark deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting link:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: error.message },
          { status: 404 }
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

