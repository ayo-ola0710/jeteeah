#!/bin/bash

# Deploy smart contract to local Linera node
set -e

echo "🚀 Deploying Jeteeah Snake Game to local Linera node..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if Docker is running
if ! docker compose ps | grep -q "jeteeah-linera-node"; then
    echo -e "${RED}❌ Linera node is not running. Start it with: npm run setup:local${NC}"
    exit 1
fi

# Check if contract is built
if [ ! -f "backend/target/wasm32-unknown-unknown/release/snake_game.wasm" ]; then
    echo -e "${YELLOW}⚠️  Contract not built. Building now...${NC}"
    ./scripts/build-backend.sh
fi

echo -e "${BLUE}📦 Publishing contract to Linera...${NC}"

# Execute deployment in Docker container
docker compose exec linera-node bash -c "
    cd /app/backend && \
    linera project publish-and-create --wait-for-outgoing-messages
"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📝 Update your .env.local with the chain and application IDs shown above${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi
