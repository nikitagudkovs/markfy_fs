import { BookmarkRepository } from '@/lib/repositories/bookmark-repository'
import { mapLink, mapLinkList } from '@/features/bookmarks/mappers/link-mapper'
import { CreateLink, UpdateLink, LinkQuery, LinkResponse, PaginatedLinksResponse } from '@/features/bookmarks/schemas/bookmark-schemas'

export class BookmarkService {
  constructor(private repository: BookmarkRepository) {}

  async getLinks(query: LinkQuery): Promise<PaginatedLinksResponse> {
    const { links, total } = await this.repository.findByQuery(query)
    const pagination = {
      page: query.page,
      limit: query.limit,
      total,
    }

    return mapLinkList(links, pagination)
  }

  async getLinkById(id: string): Promise<LinkResponse | null> {
    const link = await this.repository.findUnique({ where: { id } })
    return link ? mapLink(link) : null
  }

  async createLink(data: CreateLink): Promise<LinkResponse> {
    const existingLink = await this.repository.findByUrl(data.url)
    if (existingLink) {
      throw new Error('A bookmark with this URL already exists')
    }

    const link = await this.repository.create({ data })
    return mapLink(link)
  }

  async updateLink(id: string, data: Partial<UpdateLink>): Promise<LinkResponse> {
    const existingLink = await this.repository.findUnique({ where: { id } })
    if (!existingLink) {
      throw new Error('Link not found')
    }

    if (data.url && data.url !== existingLink.url) {
      const duplicateLink = await this.repository.findByUrl(data.url)
      if (duplicateLink) {
        throw new Error('A bookmark with this URL already exists')
      }
    }

    const link = await this.repository.update({
      where: { id },
      data,
    })

    return mapLink(link)
  }

  async deleteLink(id: string): Promise<void> {
    const link = await this.repository.findUnique({ where: { id } })
    if (!link) {
      throw new Error('Link not found')
    }

    await this.repository.delete({ where: { id } })
  }

  async toggleFavorite(id: string): Promise<LinkResponse> {
    const link = await this.repository.toggleFavorite(id)
    return mapLink(link)
  }

  async getFavoriteLinks(query: Omit<LinkQuery, 'sort'>): Promise<PaginatedLinksResponse> {
    const favoriteQuery = { ...query, sort: 'newest' as const }
    const { links, total } = await this.repository.findByQuery(favoriteQuery)
    
    const favoriteLinks = links.filter(link => link.isFavorite)
    
    const pagination = {
      page: query.page,
      limit: query.limit,
      total: favoriteLinks.length,
    }

    return mapLinkList(favoriteLinks, pagination)
  }
}
