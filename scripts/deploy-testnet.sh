#!/bin/bash

# Deploy Jeteeah to Linera Testnet Conway
# This script builds the smart contract and deploys it to the testnet

set -e  # Exit on error

echo "🚀 Deploying Jeteeah to Linera Testnet Conway"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Linera CLI is installed
if ! command -v linera &> /dev/null; then
    echo -e "${RED}❌ Linera CLI not found${NC}"
    echo "Please install Linera CLI first:"
    echo "  curl https://install.linera.dev | bash"
    exit 1
fi

echo -e "${GREEN}✓ Linera CLI found${NC}"

# Check if we're in the right directory
if [ ! -f "linera.toml" ]; then
    echo -e "${RED}❌ linera.toml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${GREEN}✓ Project configuration found${NC}"
echo ""

# Build the backend contract
echo "📦 Building smart contract..."
cd backend

# Ensure wasm32 target is installed
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo "Installing wasm32-unknown-unknown target..."
    rustup target add wasm32-unknown-unknown
fi

# Build the contract
cargo build --release --target wasm32-unknown-unknown

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Contract built successfully${NC}"
else
    echo -e "${RED}❌ Contract build failed${NC}"
    exit 1
fi

cd ..
echo ""

# Check if wallet is initialized for testnet
echo "🔍 Checking wallet configuration..."
WALLET_INFO=$(linera wallet show 2>&1 || echo "")

if [ -z "$WALLET_INFO" ] || [[ $WALLET_INFO == *"No wallet"* ]]; then
    echo -e "${YELLOW}⚠️  No wallet found. Initializing wallet for testnet...${NC}"
    echo ""
    echo "This will create a new chain on Testnet Conway."
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
    
    linera wallet init --with-new-chain --faucet https://faucet.testnet.linera.io
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Wallet initialized${NC}"
    else
        echo -e "${RED}❌ Wallet initialization failed${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Wallet configured${NC}"
echo ""

# Request testnet tokens if needed
echo "💰 Requesting testnet tokens from faucet..."
linera faucet --network testnet || echo -e "${YELLOW}⚠️  Could not request tokens (you may already have some)${NC}"
echo ""

# Deploy to testnet
echo "🚀 Deploying to Testnet Conway..."
echo "This may take a minute..."
echo ""

DEPLOY_OUTPUT=$(linera project publish-and-create 2>&1)
DEPLOY_STATUS=$?

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo ""
    echo "$DEPLOY_OUTPUT"
    echo ""
    
    # Extract Chain ID and Application ID
    CHAIN_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'chain[_\s]+(?:id[:\s]+)?[a-f0-9]{64}' | grep -oP '[a-f0-9]{64}' | head -1)
    APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP 'application[_\s]+(?:id[:\s]+)?[a-f0-9]{64}' | grep -oP '[a-f0-9]{64}' | head -1)
    
    if [ -z "$CHAIN_ID" ]; then
        # Try alternative pattern
        CHAIN_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP '[a-f0-9]{64}' | head -1)
    fi
    
    if [ -z "$APP_ID" ]; then
        # Try alternative pattern
        APP_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP '[a-f0-9]{64}' | tail -1)
    fi
    
    echo "=============================================="
    echo -e "${GREEN}🎉 DEPLOYMENT SUCCESSFUL!${NC}"
    echo "=============================================="
    echo ""
    echo "Your application is now live on Testnet Conway!"
    echo ""
    
    if [ -n "$CHAIN_ID" ] && [ -n "$APP_ID" ]; then
        echo "📋 Configuration Details:"
        echo "------------------------"
        echo "Chain ID:       $CHAIN_ID"
        echo "Application ID: $APP_ID"
        echo "Network:        Testnet Conway"
        echo "RPC URL:        https://testnet.linera.io"
        echo ""
        echo "⚙️  Next Steps:"
        echo "1. Create .env.local with these values:"
        echo ""
        echo "cat > .env.local << EOF"
        echo "NEXT_PUBLIC_LINERA_ENDPOINT=https://testnet.linera.io"
        echo "NEXT_PUBLIC_CHAIN_ID=$CHAIN_ID"
        echo "NEXT_PUBLIC_APP_ID=$APP_ID"
        echo "NEXT_PUBLIC_WALLET_MOCK=false"
        echo "NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true"
        echo "EOF"
        echo ""
        echo "2. Restart your development server:"
        echo "   pnpm dev"
        echo ""
        echo "3. Install Linera wallet browser extension for real wallet connection"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Could not automatically extract Chain ID and App ID${NC}"
        echo "Please find them in the output above and manually update .env.local"
        echo ""
        echo "Create .env.local with:"
        echo "NEXT_PUBLIC_LINERA_ENDPOINT=https://testnet.linera.io"
        echo "NEXT_PUBLIC_CHAIN_ID=<your_chain_id>"
        echo "NEXT_PUBLIC_APP_ID=<your_app_id>"
        echo "NEXT_PUBLIC_WALLET_MOCK=false"
        echo "NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true"
        echo ""
    fi
    
    echo "=============================================="
    
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Error output:"
    echo "$DEPLOY_OUTPUT"
    echo ""
    echo "Common issues:"
    echo "- Not enough testnet tokens (request from faucet)"
    echo "- Network connectivity issues"
    echo "- Wallet not properly configured"
    echo ""
    exit 1
fi
