import { PrismaClient } from '@prisma/client'

// Test database configuration
const testDatabaseUrl = process.env.TEST_DATABASE_URL || 'file:./test.db'

export const createTestPrismaClient = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: testDatabaseUrl,
      },
    },
  })
}

export const setupTestDatabase = async (prisma: PrismaClient) => {
  // Clean up test database
  await prisma.link.deleteMany()
}

export const teardownTestDatabase = async (prisma: PrismaClient) => {
  await prisma.$disconnect()
}
