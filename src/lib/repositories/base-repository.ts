import { Prisma } from '@prisma/client'

export interface BaseRepository<T> {
  findMany(args?: Prisma.Args<T, 'findMany'>): Promise<T[]>
  findUnique(args: Prisma.Args<T, 'findUnique'>): Promise<T | null>
  create(args: Prisma.Args<T, 'create'>): Promise<T>
  update(args: Prisma.Args<T, 'update'>): Promise<T>
  delete(args: Prisma.Args<T, 'delete'>): Promise<T>
  count(args?: Prisma.Args<T, 'count'>): Promise<number>
}
