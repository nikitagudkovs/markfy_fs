import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleBookmarks = [
  {
    title: 'Yoga with Adriene',
    url: 'https://www.youtube.com/user/yogawithadriene',
    description: 'Free yoga videos for all levels with Adriene Mishler',
    isFavorite: true,
  },
  {
    title: 'Peloton Digital',
    url: 'https://www.onepeloton.com/digital',
    description: 'Fitness classes including yoga, cycling, and strength training',
    isFavorite: true,
  },
  {
    title: 'Down Dog Yoga',
    url: 'https://www.downdogapp.com',
    description: 'Personalized yoga practice with customizable sessions',
    isFavorite: false,
  },
  {
    title: 'Alo Moves',
    url: 'https://www.alomoves.com',
    description: 'Premium yoga and fitness classes from top instructors',
    isFavorite: true,
  },
  {
    title: 'Nike Training Club',
    url: 'https://www.nike.com/ntc-app',
    description: 'Free fitness workouts and training programs',
    isFavorite: false,
  },
  {
    title: 'CorePower Yoga',
    url: 'https://www.corepoweryoga.com',
    description: 'Heated yoga classes and teacher training programs',
    isFavorite: true,
  },
  {
    title: 'MyFitnessPal',
    url: 'https://www.myfitnesspal.com',
    description: 'Calorie tracking and nutrition database',
    isFavorite: false,
  },
  {
    title: 'Yoga Journal',
    url: 'https://www.yogajournal.com',
    description: 'Yoga poses, sequences, and lifestyle content',
    isFavorite: true,
  },
  {
    title: 'Strava',
    url: 'https://www.strava.com',
    description: 'Social fitness tracking for running and cycling',
    isFavorite: false,
  },
  {
    title: 'Headspace',
    url: 'https://www.headspace.com',
    description: 'Meditation and mindfulness app with sleep stories',
    isFavorite: false,
  },
  {
    title: 'Calm',
    url: 'https://www.calm.com',
    description: 'Meditation, sleep stories, and relaxation content',
    isFavorite: false,
  },
  {
    title: 'Fitbit',
    url: 'https://www.fitbit.com',
    description: 'Fitness tracking devices and health insights',
    isFavorite: true,
  },
  {
    title: 'Glo',
    url: 'https://www.glo.com',
    description: 'Online yoga, meditation, and Pilates classes',
    isFavorite: false,
  },
  {
    title: 'Insight Timer',
    url: 'https://insighttimer.com',
    description: 'Free meditation app with guided practices',
    isFavorite: true,
  },
  {
    title: 'ClassPass',
    url: 'https://classpass.com',
    description: 'Access to fitness classes at various studios',
    isFavorite: false,
  },
  {
    title: 'Freeletics',
    url: 'https://www.freeletics.com',
    description: 'AI-powered personal training and bodyweight workouts',
    isFavorite: false,
  },
  {
    title: 'Yoga International',
    url: 'https://yogainternational.com',
    description: 'Comprehensive yoga education and practice platform',
    isFavorite: true,
  },
  {
    title: 'FitOn',
    url: 'https://fitonapp.com',
    description: 'Free fitness classes with celebrity trainers',
    isFavorite: false,
  },
  {
    title: 'Daily Burn',
    url: 'https://www.dailyburn.com',
    description: 'Live and on-demand fitness streaming platform',
    isFavorite: false,
  },
  {
    title: 'YogaWorks',
    url: 'https://www.yogaworks.com',
    description: 'Yoga studio chain with online classes',
    isFavorite: false,
  },
  {
    title: 'Mindbody',
    url: 'https://www.mindbodyonline.com',
    description: 'Fitness and wellness class booking platform',
    isFavorite: false,
  },
  {
    title: 'Yoga Alliance',
    url: 'https://www.yogaalliance.org',
    description: 'Professional yoga teacher certification organization',
    isFavorite: true,
  },
  {
    title: 'Fitbod',
    url: 'https://fitbod.me',
    description: 'AI-powered strength training workout planner',
    isFavorite: false,
  },
  {
    title: 'YogaGlo',
    url: 'https://www.yogaglo.com',
    description: 'Online yoga, meditation, and Pilates classes',
    isFavorite: false,
  },
  {
    title: 'Strong App',
    url: 'https://www.strong.app',
    description: 'Workout tracking and strength training log',
    isFavorite: true,
  },
  {
    title: 'Yoga Download',
    url: 'https://www.yogadownload.com',
    description: 'Downloadable yoga classes and meditation sessions',
    isFavorite: false,
  },
  {
    title: 'Jefit',
    url: 'https://www.jefit.com',
    description: 'Workout tracking and exercise database',
    isFavorite: false,
  },
  {
    title: 'Yoga Studio',
    url: 'https://www.yogastudioapp.com',
    description: 'Yoga classes and pose library for all levels',
    isFavorite: false,
  },
  {
    title: 'Centr',
    url: 'https://www.centr.com',
    description: 'Chris Hemsworth\'s fitness and nutrition platform',
    isFavorite: false,
  },
  {
    title: 'Yoga Anytime',
    url: 'https://www.yogaanytime.com',
    description: 'Unlimited access to yoga classes and workshops',
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
