import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'
import { UpdateLinkSchema } from '@/features/bookmarks/schemas/bookmark-schemas'

const repository = new BookmarkRepository(prisma)
const service = new BookmarkService(repository)

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await service.getLinkById(id)
    
    if (!result) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching link:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const updateData = UpdateLinkSchema.parse({ ...body, id })
    
    const result = await service.updateLink(id, updateData)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating link:', error)
    
    if (error instanceof Error) {
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
      
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid request data', details: error.message },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await service.deleteLink(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    
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
