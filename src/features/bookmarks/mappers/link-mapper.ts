import type { Link as PrismaLink } from '@prisma/client'
import type { LinkResponse, PaginatedLinksResponse } from '../schemas/bookmark-schemas'

export function mapLink(link: PrismaLink): LinkResponse {
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

export function mapLinkList(links: PrismaLink[], pagination: { page: number; limit: number; total: number }): PaginatedLinksResponse {
  const totalPages = Math.ceil(pagination.total / pagination.limit)
  return {
    data: links.map(mapLink),
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




