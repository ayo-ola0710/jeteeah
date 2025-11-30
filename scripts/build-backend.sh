#!/bin/bash

# Build Linera smart contract
set -e

echo "🔨 Building Jeteeah Snake Game Smart Contract..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if Rust is installed
if ! command -v cargo &> /dev/null; then
    echo -e "${YELLOW}⚠️  Rust is not installed. Installing...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
    source $HOME/.cargo/env
fi

# Check for wasm32 target
if ! rustup target list | grep -q "wasm32-unknown-unknown (installed)"; then
    echo -e "${BLUE}📦 Adding wasm32-unknown-unknown target...${NC}"
    rustup target add wasm32-unknown-unknown
fi

# Navigate to backend
cd backend

echo -e "${BLUE}🧹 Cleaning previous builds...${NC}"
cargo clean

echo -e "${BLUE}🔨 Building contract...${NC}"
cargo build --release --target wasm32-unknown-unknown

echo -e "${BLUE}🔨 Building service...${NC}"
cargo build --release --target wasm32-unknown-unknown

# Check if build succeeded
if [ -f "target/wasm32-unknown-unknown/release/snake_game.wasm" ]; then
    echo -e "${GREEN}✅ Contract built successfully!${NC}"
    ls -lh target/wasm32-unknown-unknown/release/*.wasm
else
    echo -e "${YELLOW}⚠️  Build completed but WASM file not found${NC}"
fi

cd ..
echo -e "${GREEN}✅ Backend build complete!${NC}"
