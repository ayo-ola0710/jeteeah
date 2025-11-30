# 🚀 Quick Start Guide

Get Jeteeah Snake Game running in 5 minutes!

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Setup Environment

```bash
# Copy the example environment file
cp .env.example .env.local
```

## Step 3: Start Linera Node (Docker)

```bash
# This will start a local Linera blockchain node
npm run setup:local
```

Wait for the message: ✅ Local Linera environment is ready!

## Step 4: Build Smart Contract

```bash
npm run build:backend
```

## Step 5: Deploy Contract

```bash
npm run deploy:local
```

**Important**: After deployment, you'll see output like:
```
Chain ID: e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
Application ID: e476187f...your-app-id...
```

Copy these IDs and update your `.env.local`:

```bash
NEXT_PUBLIC_LINERA_CHAIN_ID=e476187f6ddfeb9d588c7b45d3df334d5501d6499b3f9ad5595cae86cce16a65
NEXT_PUBLIC_LINERA_APP_ID=your-full-app-id-here
```

## Step 6: Start Frontend

```bash
npm run dev
```

Open http://localhost:3000 🎉

## 🎮 Playing the Game

1. Click "Connect Wallet" or use mock mode
2. Toggle "Blockchain Mode" ON
3. Click "Start Game"
4. Use arrow keys to play
5. Watch your score and points accumulate!

## 🐛 Troubleshooting

### Docker not starting?
```bash
# Check Docker is running
docker info

# Reset everything
npm run docker:reset
```

### Contract build fails?
```bash
# Install Rust if needed
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup target add wasm32-unknown-unknown
```

### Frontend shows errors?
```bash
# Make sure you updated .env.local with chain/app IDs
# Restart dev server
npm run dev
```

### Can't connect to blockchain?
```bash
# Check node is running
npm run docker:logs

# Verify node is healthy
docker-compose ps
```

## 📚 Next Steps

- Read [SETUP.md](./SETUP.md) for detailed documentation
- Explore `backend/` for smart contract code
- Check `app/` for frontend components
- Join the community!

## 🆘 Need Help?

- Check logs: `npm run docker:logs`
- Reset node: `npm run docker:reset`
- View wallet: `npm run linera:info`
- Open an issue on GitHub

---

Happy Gaming! 🐍⛓️
