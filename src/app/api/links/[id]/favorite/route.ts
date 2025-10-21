import { NextRequest, NextResponse } from 'next/server'
import { getBookmarkService } from '@/lib/services/service-container'

const service = getBookmarkService()

/**
 * PATCH /api/links/[id]/favorite
 * Toggle the favorite status of a bookmark
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await service.toggleFavorite(id)
    
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('Error toggling favorite:', error)
    
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

