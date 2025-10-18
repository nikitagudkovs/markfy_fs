import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'

const repository = new BookmarkRepository(prisma)
const service = new BookmarkService(repository)

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await service.toggleFavorite(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
