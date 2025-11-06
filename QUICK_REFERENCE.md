# 🚀 Quick Reference - Jeteeah Blockchain Integration

## 📁 Project Structure

```
jeteeah/
├── app/
│   ├── contexts/
│   │   └── GameContext.tsx          # ⭐ Core blockchain state
│   ├── game/page.tsx                # ⭐ Updated with golden snake
│   ├── gameover/page.tsx            # ⭐ Shows blockchain points
│   ├── start/page.tsx               # ⭐ Token balance display
│   ├── reward/page.tsx              # ⭐ Points redemption
│   ├── leaderboard/page.tsx         # ✨ NEW - Rankings page
│   ├── landing/page.tsx             # Updated menu
│   └── layout.tsx                   # ⭐ Wallet button added
│
├── components/
│   ├── Leaderboard.tsx              # ✨ NEW - Top 10 players
│   ├── PointsDashboard.tsx          # ✨ NEW - Redemption UI
│   ├── TransactionNotification.tsx  # ✨ NEW - Toast alerts
│   ├── BlockchainStatus.tsx         # ✨ NEW - Status panel
│   └── WalletButton.tsx             # ✨ NEW - Connect wallet
│
├── hooks/
│   └── useLineraWallet.ts           # Wallet management hook
│
├── lib/
│   ├── types.ts                     # Blockchain types
│   ├── linera-client.ts             # GraphQL client
│   └── contract-operations.ts       # 15 smart contract functions
│
└── utils/
    └── blockchain-utils.ts          # Helper functions
```

## 🎮 Key Components Usage

### 1. GameContext (Central State)

```tsx
import { useGame } from "@/app/contexts/GameContext";

const {
  totalPoints, // Current points balance
  highScore, // Best score
  isBlockchainMode, // Blockchain toggle state
  syncWithBlockchain, // Manual sync function
  startGameOnChain, // Start new game
  endGameOnChain, // End & award points
} = useGame();
```

### 2. Wallet Hook

```tsx
import { useLineraWallet } from "@/hooks/useLineraWallet";

const {
  wallet, // { connected, address, chainId, balance }
  connect, // Connect wallet function
  disconnect, // Disconnect function
  isConnecting, // Loading state
  isMockMode, // Development mode flag
} = useLineraWallet();
```

### 3. Contract Operations

```tsx
import { SnakeContract } from "@/lib/contract-operations";

const contract = new SnakeContract();

// Start game
await contract.startGame(walletAddress);

// Move snake
await contract.moveSnake(walletAddress, "Up");

// End game
const result = await contract.endGame(walletAddress, finalScore);

// Get points
const points = await contract.getPoints(walletAddress);

// Redeem points
await contract.redeemPoints(walletAddress, amount);
```

## 🎨 Visual States

### Blockchain Mode OFF

```
Snake: Green (bg-green-500)
Food: Red (bg-red-500)
Points: Not tracked on blockchain
```

### Blockchain Mode ON

```
Snake: Golden gradient (bg-gradient-to-br from-yellow-400 to-orange-500)
Food: Yellow glow (bg-yellow-400 animate-pulse)
Points: Synced every 5 seconds
Status: Bottom-left panel visible
```

## 🔄 Blockchain Operations Flow

```
Connect Wallet
    ↓
Toggle Blockchain Mode ON
    ↓
Start Game → startGameOnChain()
    ↓
Play Game → Movements tracked locally
    ↓
Game Over → endGameOnChain(score)
    ↓
Points Awarded → totalPoints updated
    ↓
Periodic Sync → Every 5 seconds
```

## 📊 Data Flow

```
Smart Contract (Linera)
    ↓ (GraphQL)
Contract Operations
    ↓
GameContext (State)
    ↓
React Components
    ↓
User Interface
```

## 🎯 Important Functions

### Start Game

```tsx
const handleStartGame = async () => {
  if (isBlockchainMode && wallet.wallet.connected) {
    await startGameOnChain();
  }
  // Continue with local game logic
};
```

### End Game

```tsx
const handleGameOver = async (finalScore: number) => {
  if (isBlockchainMode && wallet.wallet.connected) {
    const pointsEarned = await endGameOnChain(finalScore);
    showNotification(`Earned ${pointsEarned} points!`);
  }
};
```

### Sync Points

```tsx
const syncPoints = async () => {
  if (wallet.wallet.connected) {
    await syncWithBlockchain();
  }
};
```

## 🔔 Notifications

### Trigger Notification

```tsx
import { useGame } from "@/app/contexts/GameContext";

const { addTransaction } = useGame();

// Add pending transaction
addTransaction({
  id: "tx-123",
  type: "game_end",
  status: "pending",
  message: "Saving score...",
});

// Update to confirmed
updateTransaction("tx-123", "confirmed");
```

## 🎨 Styling Classes

### Golden Snake

```tsx
className="bg-gradient-to-br from-yellow-400 to-orange-500
           shadow-md shadow-yellow-500/30"
```

### Glowing Food

```tsx
className="bg-yellow-400
           shadow-lg shadow-yellow-500/50
           animate-pulse"
```

### Blockchain Badge

```tsx
className="bg-green-500/20
           border border-green-500/50
           text-green-400
           px-2 py-1 rounded"
```

## 🔧 Environment Variables

```env
# .env.local
NEXT_PUBLIC_LINERA_ENDPOINT=http://localhost:8080
NEXT_PUBLIC_CHAIN_ID=443c867331e9b1347b68f2068580ccb92188cc588e89b358b5329cfae958c89d
NEXT_PUBLIC_APP_ID=509ecb8d1745da6ab7a559548f05fde413f3f5c4010cfc948709f58cc0dedbbe
NEXT_PUBLIC_WALLET_MOCK=true  # Set to false for production
```

## 🐛 Debugging Tips

### Check Wallet Connection

```tsx
console.log("Wallet:", wallet.wallet.connected);
console.log("Address:", wallet.wallet.address);
console.log("Mock Mode:", wallet.isMockMode);
```

### Check Blockchain State

```tsx
console.log("Blockchain Mode:", isBlockchainMode);
console.log("Total Points:", totalPoints);
console.log("Last Sync:", lastSyncTime);
```

### Check Contract Operations

```tsx
try {
  const result = await contract.getPoints(address);
  console.log("Points from contract:", result);
} catch (error) {
  console.error("Contract error:", error);
}
```

## 📱 Testing Checklist

- [ ] Wallet connects successfully
- [ ] Blockchain mode toggle works
- [ ] Golden snake appears when ON
- [ ] Points sync every 5 seconds
- [ ] Game over awards points
- [ ] Leaderboard displays rankings
- [ ] Redemption system works
- [ ] Notifications appear correctly
- [ ] Wallet disconnect works
- [ ] Page refresh maintains state

## 🚀 Quick Commands

```bash
# Start dev server
pnpm run dev

# Build for production
pnpm run build

# Run production build
pnpm start

# Type check
pnpm run type-check

# Lint code
pnpm run lint
```

## 🎯 Key URLs

```
Landing:     http://localhost:3000/landing
Start:       http://localhost:3000/start
Game:        http://localhost:3000/game
Game Over:   http://localhost:3000/gameover
Reward:      http://localhost:3000/reward
Leaderboard: http://localhost:3000/leaderboard
Wallet:      http://localhost:3000/wallet
```

## 📚 Documentation Files

- `PHASE3_STATUS.md` - Complete status report
- `PHASE3_COMPLETE.md` - Implementation overview
- `QUICK_REFERENCE.md` - This file
- `README.md` - Project documentation

---

**Last Updated:** Phase 3 Complete
**Status:** ✅ All features implemented
**Dev Server:** Running on port 3000/3001
