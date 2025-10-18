import { PrismaClient, Prisma } from '@prisma/client'

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  constructor(protected prisma: PrismaClient) {}

  abstract findMany(args?: Prisma.Args<T, 'findMany'>): Promise<T[]>
  abstract findUnique(args: Prisma.Args<T, 'findUnique'>): Promise<T | null>
  abstract create(args: Prisma.Args<T, 'create'>): Promise<T>
  abstract update(args: Prisma.Args<T, 'update'>): Promise<T>
  abstract delete(args: Prisma.Args<T, 'delete'>): Promise<T>
  abstract count(args?: Prisma.Args<T, 'count'>): Promise<number>
}
