#!/bin/bash

# Setup local Linera development environment
set -e

echo "🚀 Setting up Jeteeah Snake Game on Linera..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Starting Linera local node...${NC}"
docker-compose up -d

echo -e "${BLUE}⏳ Waiting for Linera node to be ready...${NC}"
sleep 5

# Wait for health check
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if docker-compose ps | grep -q "healthy"; then
        echo -e "${GREEN}✅ Linera node is healthy${NC}"
        break
    fi
    echo "Waiting for node to be ready... ($RETRY_COUNT/$MAX_RETRIES)"
    sleep 2
    RETRY_COUNT=$((RETRY_COUNT + 1))
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${YELLOW}⚠️  Node didn't become healthy in time. Check logs with: docker-compose logs${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Local Linera environment is ready!${NC}"
echo ""
echo -e "${BLUE}📝 Next steps:${NC}"
echo "1. Build the backend: npm run build:backend"
echo "2. Deploy the contract: npm run deploy:local"
echo "3. Start the frontend: npm run dev"
echo ""
echo -e "${BLUE}🔍 Useful commands:${NC}"
echo "- View logs: docker-compose logs -f"
echo "- Stop node: docker-compose down"
echo "- Reset data: docker-compose down -v"
