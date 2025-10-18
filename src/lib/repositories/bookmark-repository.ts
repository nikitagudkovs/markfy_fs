import { PrismaClient, Link, Prisma } from '@prisma/client'
import { BaseRepository } from './base-repository'
import { BookmarkQueryBuilder } from '../query-builder/bookmark-query-builder'
import { LinkQuery } from '@/features/bookmarks/schemas/bookmark-schemas'

export class BookmarkRepository extends BaseRepository<Link, Prisma.LinkCreateInput, Prisma.LinkUpdateInput> {
  constructor(prisma: PrismaClient) {
    super(prisma)
  }

  async findMany(args?: Prisma.LinkFindManyArgs): Promise<Link[]> {
    return this.prisma.link.findMany(args)
  }

  async findUnique(args: Prisma.LinkFindUniqueArgs): Promise<Link | null> {
    return this.prisma.link.findUnique(args)
  }

  async create(args: Prisma.LinkCreateArgs): Promise<Link> {
    return this.prisma.link.create(args)
  }

  async update(args: Prisma.LinkUpdateArgs): Promise<Link> {
    return this.prisma.link.update(args)
  }

  async delete(args: Prisma.LinkDeleteArgs): Promise<Link> {
    return this.prisma.link.delete(args)
  }

  async count(args?: Prisma.LinkCountArgs): Promise<number> {
    return this.prisma.link.count(args)
  }

  async findByQuery(query: LinkQuery): Promise<{ links: Link[], total: number }> {
    const queryBuilder = new BookmarkQueryBuilder(query)
    const findManyArgs = queryBuilder.getFindManyArgs()
    const countArgs = queryBuilder.getCountArgs()

    const [links, total] = await Promise.all([
      this.findMany(findManyArgs),
      this.count(countArgs),
    ])

    return { links, total }
  }

  async findByUrl(url: string): Promise<Link | null> {
    return this.findUnique({
      where: { url },
    })
  }

  async toggleFavorite(id: string): Promise<Link> {
    const link = await this.findUnique({ where: { id } })
    if (!link) {
      throw new Error('Link not found')
    }

    return this.update({
      where: { id },
      data: { isFavorite: !link.isFavorite },
    })
  }
}
