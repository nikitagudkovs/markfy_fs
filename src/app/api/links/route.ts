import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { BookmarkService } from '@/lib/services/bookmark-service'
import { LinkQuerySchema } from '@/features/bookmarks/schemas/bookmark-schemas'

const repository = new BookmarkRepository(prisma)
const service = new BookmarkService(repository)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const queryParams = Object.fromEntries(searchParams.entries())
    
    const query = LinkQuerySchema.parse(queryParams)
    const result = await service.getLinks(query)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching links:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const result = await service.createLink(body)
    
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    
    if (error instanceof Error) {
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
