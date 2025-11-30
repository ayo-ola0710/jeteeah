# 🎮 Jeteeah - Blockchain Snake Game on Linera

A modern, blockchain-powered Snake game built with Next.js and Linera blockchain technology, featuring real-time score tracking, token rewards, customizable skins, and achievement systems.

## ⚡ Quick Start

**Get started in 5 minutes!**

```bash
pnpm install
npm run setup:local
npm run build:backend
npm run deploy:local
npm run dev
```

📖 **Full Guide**: See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions.

## 🚀 Features

### Blockchain-Powered Gameplay

- **On-Chain Score Tracking**: Scores recorded on Linera blockchain
- **Wallet Integration**: Connect Linera wallet or use mock mode for testing
- **Point System**: Earn points stored on-chain, redeemable for rewards
- **Leaderboard**: Compete with players globally with verified scores

### Classic Snake Gameplay

- **Traditional Mechanics**: Eat food to grow, score points, and avoid self-collision
- **Responsive Controls**: Arrow keys with smooth animations
- **Score Tracking**: Real-time score display with blockchain verification

### Web3 Features

- **Token System**: Earn tokens by playing and achieving milestones
- **Skin Customization**: Purchase and equip different snake skins with earned points
- **Achievement Rewards**: Unlock achievements and earn on-chain token rewards
- **Transaction History**: View all your blockchain interactions

### User Interface

- **Modern Design**: Sleek dark theme with vibrant accents and particle effects
- **Responsive Layout**: Optimized for mobile and desktop play
- **Visual Feedback**: Smooth animations, confetti effects, and hover interactions
- **Blockchain Status**: Real-time sync indicator and transaction notifications

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI, Lucide React, React Icons
- **State Management**: React Context API
- **Blockchain Client**: GraphQL with graphql-request

### Backend (Linera Smart Contract)
- **Language**: Rust
- **Blockchain**: Linera Protocol
- **Contract**: WASM-compiled smart contract
- **Services**: GraphQL API for queries

### DevOps
- **Containerization**: Docker & Docker Compose
- **Local Node**: Linera local development network
- **Build Tools**: Cargo, Rust toolchain

## 📦 Installation & Setup

### Option 1: Quick Start (Recommended)

See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide.

### Option 2: Manual Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/Goodnessukaigwe/jeteeah.git
   cd jeteeah
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment**

   ```bash
   cp .env.example .env.local
   ```

4. **Start Linera node (Docker)**

   ```bash
   npm run setup:local
   ```

5. **Build and deploy contract**

   ```bash
   npm run build:backend
   npm run deploy:local
   ```

   Update `.env.local` with the chain and app IDs from deployment output.

6. **Run the development server**

   ```bash
   npm run dev
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./SETUP.md)** - Comprehensive setup and development guide
- **[backend/README.md](./backend/README.md)** - Smart contract documentation

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" or use mock mode for testing
2. **Enable Blockchain Mode**: Toggle the blockchain switch ON for on-chain gameplay
3. **Start Game**: Click "Start Game" to begin
4. **Controls**:
   - **Arrow Keys**: Move the snake (Up, Down, Left, Right)
   - **Pause**: Click pause button or press ESC
5. **Objective**: Eat the food to grow and increase your score
6. **Scoring**: 
   - Each food = 5 points
   - Points are recorded on-chain at game end
   - High scores are saved to blockchain
7. **Rewards**: Earn on-chain points to unlock skins and achievements

## 🔧 Development Commands

```bash
# Frontend
npm run dev              # Start Next.js dev server
npm run build            # Build for production
npm run start            # Start production server

# Backend & Blockchain
npm run setup:local      # Setup local Linera node
npm run build:backend    # Build smart contract
npm run deploy:local     # Deploy to local node

# Docker
npm run docker:up        # Start Linera node
npm run docker:down      # Stop node
npm run docker:logs      # View logs
npm run docker:reset     # Reset blockchain data

# Utilities
npm run linera:info      # Show wallet info
```

## 📁 Project Structure

```
jeteeah/
├── app/                          # Next.js app directory
│   ├── contexts/                 # React contexts
│   │   └── GameContext.tsx       # Blockchain-integrated game state
│   ├── game/                     # Main game page
│   ├── gameover/                 # Game over page
│   ├── landing/                  # Landing page
│   ├── reward/                   # Rewards/achievements page
│   ├── skin/                     # Skin customization page
│   ├── start/                    # Game start page
│   ├── wallet/                   # Wallet connection page
│   └── leaderboard/              # Global leaderboard
├── backend/                      # Linera smart contract (Rust)
│   ├── src/
│   │   ├── contract.rs           # Game logic & operations
│   │   ├── service.rs            # GraphQL service
│   │   ├── state.rs              # Blockchain state
│   │   └── lib.rs                # Contract entry point
│   └── tests/                    # Contract tests
├── components/                   # React components
│   ├── ui/                       # Reusable UI components
│   ├── AchievementCard.tsx       # Achievement display
│   ├── BlockchainStatus.tsx      # Sync status indicator
│   ├── Leaderboard.tsx           # Leaderboard component
│   ├── ParticleEffects.tsx       # Visual effects
│   ├── PointsDashboard.tsx       # Points overview
│   ├── SkinCard.tsx              # Skin selection
│   ├── TransactionNotification.tsx # TX notifications
│   └── WalletButton.tsx          # Wallet connection
├── lib/                          # Utilities & blockchain
│   ├── contract-operations.ts    # Blockchain operations
│   ├── linera-client.ts          # GraphQL client
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Helper functions
├── hooks/                        # Custom React hooks
│   └── useLineraWallet.ts        # Wallet management
├── scripts/                      # Build & deployment
│   ├── setup-local.sh            # Local env setup
│   ├── build-backend.sh          # Contract build
│   └── deploy-local.sh           # Contract deployment
├── docker-compose.yml            # Local Linera node
├── linera.toml                   # Project configuration
└── .devcontainer/                # VSCode dev container
```

## 🎯 Key Features

- **Blockchain Integration**: All game data stored on Linera blockchain
- **On-Chain Leaderboard**: Global rankings with verifiable scores
- **Points System**: Earn and spend points for skins and achievements
- **Achievement Tracking**: Unlock milestones stored permanently on-chain
- **Wallet Connection**: Secure Web3 wallet integration
- **Mock Mode**: Test gameplay without blockchain connection
- **Offline-First**: Play locally, sync when connected
- **Real-Time Sync**: Automatic state synchronization with blockchain

## 🚀 Deployment

### Deploy to Testnet

1. **Update Environment Variables**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with testnet values
   ```

2. **Build Contract**:
   ```bash
   npm run build:backend
   ```

3. **Deploy Contract**:
   ```bash
   linera project publish-and-create
   ```

4. **Update Frontend Config**:
   Update `.env.local` with your deployed chain/app IDs

5. **Deploy Frontend** (Vercel):
   ```bash
   vercel
   ```

### Deploy Frontend Only

The easiest way to deploy the frontend is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables from `.env.local`
4. Deploy automatically

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Linera Documentation**: [https://linera.dev](https://linera.dev)
- **Linera Discord**: [https://discord.gg/linera](https://discord.gg/linera)
- **Report Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/jeteeah/issues)

## 🙏 Acknowledgments

Built with the [Linera Buildathon Template](https://github.com/linera-io/buildathon-template) and Next.js.

---

**Made with ❤️ for the Linera Blockchain**
