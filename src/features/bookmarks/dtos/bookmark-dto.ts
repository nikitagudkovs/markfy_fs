import { Link, LinkResponse, PaginatedLinksResponse } from '../schemas/bookmark-schemas'
import { prisma } from '@/lib/db'

export class LinkResponseDto {
  static fromPrisma(link: any): LinkResponse {
    return {
      id: link.id,
      title: link.title,
      url: link.url,
      description: link.description || undefined,
      isFavorite: link.isFavorite,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    }
  }

  static toList(links: any[], pagination: {
    page: number
    limit: number
    total: number
  }): PaginatedLinksResponse {
    const totalPages = Math.ceil(pagination.total / pagination.limit)
    
    return {
      data: links.map(link => this.fromPrisma(link)),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages,
        hasNext: pagination.page < totalPages,
        hasPrev: pagination.page > 1,
      },
    }
  }
}

export class LinkCreateDto {
  static async validateAndTransform(data: unknown) {
    const { CreateLinkSchema } = await import('../schemas/bookmark-schemas')
    return CreateLinkSchema.parse(data)
  }
}

export class LinkUpdateDto {
  static async validateAndTransform(data: unknown) {
    const { UpdateLinkSchema } = await import('../schemas/bookmark-schemas')
    return UpdateLinkSchema.parse(data)
  }
}
