#!/bin/bash

# Test database setup script
# This script creates a test database and runs migrations

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Setting up test database...${NC}"

# Set test database URL
export TEST_DATABASE_URL="file:./prisma/test.db"

# Remove existing test database if it exists
if [ -f "./prisma/test.db" ]; then
    echo -e "${YELLOW}Removing existing test database...${NC}"
    rm -f "./prisma/test.db"
fi

# Create test database directory if it doesn't exist
mkdir -p ./prisma

# Run Prisma migrations for test database
echo -e "${YELLOW}Running database migrations...${NC}"
DATABASE_URL="$TEST_DATABASE_URL" npx prisma db push --schema=./prisma/schema.prisma

# Seed test database with test data
echo -e "${YELLOW}Seeding test database...${NC}"
DATABASE_URL="$TEST_DATABASE_URL" npx prisma db seed

echo -e "${GREEN}Test database setup complete!${NC}"
echo -e "${GREEN}Test database URL: ${TEST_DATABASE_URL}${NC}"
