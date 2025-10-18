import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleBookmarks = [
  {
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'The official Next.js documentation and guides',
    isFavorite: true,
  },
  {
    title: 'TypeScript Handbook',
    url: 'https://www.typescriptlang.org/docs/',
    description: 'Complete guide to TypeScript programming language',
    isFavorite: true,
  },
  {
    title: 'Prisma Documentation',
    url: 'https://www.prisma.io/docs',
    description: 'Database toolkit and ORM for Node.js and TypeScript',
    isFavorite: false,
  },
  {
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com/docs',
    description: 'Utility-first CSS framework for rapid UI development',
    isFavorite: true,
  },
  {
    title: 'React Documentation',
    url: 'https://react.dev/learn',
    description: 'Learn React with interactive examples and tutorials',
    isFavorite: false,
  },
  {
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Code hosting platform for version control and collaboration',
    isFavorite: true,
  },
  {
    title: 'Stack Overflow',
    url: 'https://stackoverflow.com',
    description: 'Community-driven Q&A for developers',
    isFavorite: false,
  },
  {
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Resources for developers, by developers',
    isFavorite: true,
  },
  {
    title: 'Vercel',
    url: 'https://vercel.com',
    description: 'Frontend cloud platform for developers',
    isFavorite: false,
  },
  {
    title: 'Node.js',
    url: 'https://nodejs.org',
    description: 'JavaScript runtime built on Chrome\'s V8 JavaScript engine',
    isFavorite: false,
  },
  {
    title: 'Docker',
    url: 'https://www.docker.com',
    description: 'Containerization platform for applications',
    isFavorite: false,
  },
  {
    title: 'AWS',
    url: 'https://aws.amazon.com',
    description: 'Cloud computing services by Amazon',
    isFavorite: true,
  },
  {
    title: 'Figma',
    url: 'https://www.figma.com',
    description: 'Collaborative interface design tool',
    isFavorite: false,
  },
  {
    title: 'Notion',
    url: 'https://www.notion.so',
    description: 'All-in-one workspace for notes, docs, and collaboration',
    isFavorite: true,
  },
  {
    title: 'Linear',
    url: 'https://linear.app',
    description: 'Issue tracking and project management tool',
    isFavorite: false,
  },
  {
    title: 'Postman',
    url: 'https://www.postman.com',
    description: 'API development and testing platform',
    isFavorite: false,
  },
  {
    title: 'VS Code',
    url: 'https://code.visualstudio.com',
    description: 'Free source-code editor by Microsoft',
    isFavorite: true,
  },
  {
    title: 'JetBrains',
    url: 'https://www.jetbrains.com',
    description: 'Professional development tools and IDEs',
    isFavorite: false,
  },
  {
    title: 'npm',
    url: 'https://www.npmjs.com',
    description: 'Package manager for JavaScript',
    isFavorite: false,
  },
  {
    title: 'Yarn',
    url: 'https://yarnpkg.com',
    description: 'Fast, reliable, and secure dependency management',
    isFavorite: false,
  },
  {
    title: 'Webpack',
    url: 'https://webpack.js.org',
    description: 'Module bundler for JavaScript applications',
    isFavorite: false,
  },
  {
    title: 'Vite',
    url: 'https://vitejs.dev',
    description: 'Next generation frontend tooling',
    isFavorite: true,
  },
  {
    title: 'ESLint',
    url: 'https://eslint.org',
    description: 'Static analysis tool for JavaScript',
    isFavorite: false,
  },
  {
    title: 'Prettier',
    url: 'https://prettier.io',
    description: 'Code formatter for JavaScript, CSS, and more',
    isFavorite: false,
  },
  {
    title: 'Jest',
    url: 'https://jestjs.io',
    description: 'JavaScript testing framework',
    isFavorite: false,
  },
  {
    title: 'Vitest',
    url: 'https://vitest.dev',
    description: 'Fast unit test framework powered by Vite',
    isFavorite: true,
  },
  {
    title: 'Playwright',
    url: 'https://playwright.dev',
    description: 'End-to-end testing framework',
    isFavorite: false,
  },
  {
    title: 'Cypress',
    url: 'https://www.cypress.io',
    description: 'Frontend testing tool for web applications',
    isFavorite: false,
  },
  {
    title: 'Storybook',
    url: 'https://storybook.js.org',
    description: 'Tool for building UI components in isolation',
    isFavorite: false,
  },
  {
    title: 'Framer Motion',
    url: 'https://www.framer.com/motion',
    description: 'Production-ready motion library for React',
    isFavorite: false,
  },
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  await prisma.link.deleteMany()
  console.log('🗑️  Cleared existing links')

  // Create sample bookmarks
  for (const bookmark of sampleBookmarks) {
    await prisma.link.create({
      data: bookmark,
    })
  }

  console.log(`✅ Created ${sampleBookmarks.length} sample bookmarks`)
  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
