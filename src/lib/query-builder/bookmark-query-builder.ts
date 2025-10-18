import { Prisma } from '@prisma/client'
import { LinkQuery } from '@/features/bookmarks/schemas/bookmark-schemas'

export class BookmarkQueryBuilder {
  private where: Prisma.LinkWhereInput = {}
  private orderBy: Prisma.LinkOrderByWithRelationInput = {}
  private skip = 0
  private take = 10

  constructor(private query: LinkQuery) {
    this.buildWhere()
    this.buildOrderBy()
    this.buildPagination()
  }

  private buildWhere() {
    if (this.query.search) {
      this.where.OR = [
        { title: { contains: this.query.search } },
        { description: { contains: this.query.search } },
        { url: { contains: this.query.search } },
      ]
    }
  }

  private buildOrderBy() {
    switch (this.query.sort) {
      case 'newest':
        this.orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        this.orderBy = { createdAt: 'asc' }
        break
      case 'title':
        this.orderBy = { title: 'asc' }
        break
      case 'favorites':
        this.orderBy = { isFavorite: 'desc' }
        break
      default:
        this.orderBy = { createdAt: 'desc' }
    }
  }

  private buildPagination() {
    this.skip = (this.query.page - 1) * this.query.limit
    this.take = this.query.limit
  }

  getFindManyArgs(): Prisma.LinkFindManyArgs {
    return {
      where: this.where,
      orderBy: this.orderBy,
      skip: this.skip,
      take: this.take,
    }
  }

  getCountArgs(): Prisma.LinkCountArgs {
    return {
      where: this.where,
    }
  }

  getPaginationInfo(total: number) {
    return {
      page: this.query.page,
      limit: this.query.limit,
      total,
    }
  }
}
