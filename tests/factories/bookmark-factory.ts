import { CreateLink } from '@/features/bookmarks/schemas/bookmark-schemas'

export function createBookmark(overrides: Partial<CreateLink> = {}): CreateLink {
  return {
    title: 'Test Bookmark',
    url: 'https://example.com',
    description: 'A test bookmark',
    isFavorite: false,
    ...overrides,
  }
}

export function createBookmarks(count: number, overrides: Partial<CreateLink> = {}): CreateLink[] {
  return Array.from({ length: count }, (_, index) => 
    createBookmark({
      title: `Test Bookmark ${index + 1}`,
      url: `https://example${index + 1}.com`,
      ...overrides,
    })
  )
}

export const sampleBookmarks = [
  createBookmark({
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation',
    isFavorite: true,
  }),
  createBookmark({
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'Complete guide to TypeScript',
    isFavorite: false,
  }),
  createBookmark({
    title: 'Prisma Documentation',
    url: 'https://www.prisma.io/docs',
    description: 'Database toolkit and ORM',
    isFavorite: true,
  }),
]
