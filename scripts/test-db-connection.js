#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const linkCount = await prisma.link.count();
    console.log(`📊 Found ${linkCount} links in database`);
    
    // Test creating a test link (if none exist)
    if (linkCount === 0) {
      console.log('📝 Creating test link...');
      const testLink = await prisma.link.create({
        data: {
          title: 'Test Link',
          url: 'https://example.com',
          description: 'This is a test link created during connection verification'
        }
      });
      console.log(`✅ Created test link with ID: ${testLink.id}`);
      
      // Clean up test link
      await prisma.link.delete({ where: { id: testLink.id } });
      console.log('🧹 Cleaned up test link');
    }
    
    console.log('🎉 All tests passed! Database is ready for production.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
