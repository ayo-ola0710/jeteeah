# 🎮 Jeteeah - Blockchain Snake Game on Linera

A modern, blockchain-powered Snake game built with Next.js and Linera blockchain.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Docker and Docker Compose
- Rust (optional, for backend development)

### 1. Setup Local Development Environment

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start local Linera node with Docker
npm run setup:local
```

This will:
- Start a local Linera blockchain node
- Start a faucet service for test tokens
- Set up the development environment

### 2. Build & Deploy Smart Contract

```bash
# Build the Rust smart contract
npm run build:backend

# Deploy to local Linera node
npm run deploy:local
```

After deployment, update `.env.local` with the chain and application IDs.

### 3. Start Frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
jeteeah/
├── app/                    # Next.js app directory
│   ├── contexts/          # React contexts (GameContext)
│   ├── game/              # Snake game page
│   ├── wallet/            # Wallet connection
│   └── ...
├── backend/               # Linera smart contract (Rust)
│   ├── src/
│   │   ├── contract.rs    # Contract logic
│   │   ├── service.rs     # GraphQL service
│   │   └── state.rs       # Game state
│   └── Cargo.toml
├── components/            # React components
├── lib/                   # Utilities & blockchain client
├── hooks/                 # Custom React hooks
├── scripts/               # Build & deployment scripts
├── docker-compose.yml     # Local Linera node setup
└── linera.toml           # Linera project configuration
```

## 🎮 Game Features

- **Blockchain Mode**: Play with on-chain score tracking
- **Wallet Integration**: Connect Linera wallet or use mock mode
- **Points System**: Earn points for each game, stored on blockchain
- **Achievements**: Unlock achievements based on high scores
- **Skins**: Purchase snake skins with earned points
- **Leaderboard**: Compete with other players

## 🔧 Development Commands

```bash
# Frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Backend
npm run build:backend    # Build Rust smart contract
npm run deploy:local     # Deploy to local node

# Docker
npm run docker:up        # Start Linera node
npm run docker:down      # Stop Linera node
npm run docker:logs      # View node logs
npm run docker:reset     # Reset and restart node

# Linera
npm run linera:info      # Show wallet information
```

## 🌐 Environment Variables

Create `.env.local` from `.env.example`:

```bash
# Linera Node Configuration
NEXT_PUBLIC_LINERA_RPC_URL=http://localhost:8080
NEXT_PUBLIC_LINERA_FAUCET_URL=http://localhost:8081
NEXT_PUBLIC_LINERA_CHAIN_ID=your-chain-id
NEXT_PUBLIC_LINERA_APP_ID=your-app-id

# Development
NEXT_PUBLIC_WALLET_MOCK=true
```

## 🧪 Testing

```bash
# Run smart contract tests
cd backend
cargo test

# Frontend tests (to be added)
npm test
```

## 🐳 Docker Development

The project includes a complete Docker setup for local Linera development:

```bash
# Start everything
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f linera-node

# Access node shell
docker-compose exec linera-node bash

# Clean up
docker-compose down -v
```

## 📝 Smart Contract Operations

The backend contract handles:
- Game state management
- Score tracking
- Points distribution
- High score records
- Player achievements

### Key Operations

- `StartGame` - Initialize a new game session
- `MoveSnake` - Process snake movement
- `EndGame` - Finalize game and award points
- `RedeemPoints` - Exchange points for rewards

## 🎨 Frontend Architecture

Built with:
- **Next.js 16** with App Router
- **React 19** with Server Components
- **TailwindCSS 4** for styling
- **GraphQL** for blockchain queries
- **TypeScript** for type safety

## 🔗 Blockchain Integration

The game integrates with Linera blockchain through:

1. **Contract Operations** (`lib/contract-operations.ts`)
   - GraphQL mutations for game actions
   - Wallet-specific point tracking
   - Transaction management

2. **Wallet Hook** (`hooks/useLineraWallet.ts`)
   - Wallet connection
   - Mock mode for development
   - Balance tracking

3. **Game Context** (`app/contexts/GameContext.tsx`)
   - Central state management
   - Blockchain sync
   - Score/points handling

## 🚢 Deployment

### Local Testnet
Already configured via Docker Compose

### Linera Testnet
Update `linera.toml` and `.env.local`:
```bash
NEXT_PUBLIC_LINERA_RPC_URL=https://testnet.linera.io
```

### Production
1. Build the contract: `npm run build:backend`
2. Deploy to mainnet
3. Update environment variables
4. Deploy frontend: `npm run build && npm run start`

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file

## 🔗 Links

- [Linera Documentation](https://linera.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Project Repository](https://github.com/Goodnessukaigwe/jeteeah)

## 💡 Tips

- Use mock wallet mode (`NEXT_PUBLIC_WALLET_MOCK=true`) for development
- Check Docker logs if node fails: `npm run docker:logs`
- Reset blockchain data: `npm run docker:reset`
- View wallet info: `npm run linera:info`

---

Built with ❤️ using Linera Blockchain
