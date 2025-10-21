#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';

console.log(`Environment: ${env || 'development'}`);
console.log(`Switching to ${isProduction ? 'PostgreSQL' : 'SQLite'} schema...`);

// Define source and destination paths
const sourceFile = isProduction 
  ? 'prisma/schema.production.prisma' 
  : 'prisma/schema.prisma';
const destFile = 'prisma/schema.prisma';

// Check if source file exists
if (!fs.existsSync(sourceFile)) {
  console.error(`❌ Schema file not found: ${sourceFile}`);
  process.exit(1);
}

// Copy the appropriate schema file
try {
  fs.copyFileSync(sourceFile, destFile);
  console.log(`✅ Successfully switched to ${isProduction ? 'PostgreSQL' : 'SQLite'} schema`);
} catch (error) {
  console.error(`❌ Failed to switch schema: ${error.message}`);
  process.exit(1);
}
