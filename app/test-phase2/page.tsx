/**
 * Phase 2 Test Page
 * Tests wallet connection and blockchain integration
 */

'use client';

import { useGame } from '@/app/contexts/GameContext';
import { useLineraWallet } from '@/hooks/useLineraWallet';
import WalletButton from '@/components/WalletButton';
import BlockchainStatus from '@/components/BlockchainStatus';
import { Direction } from '@/lib/types';

export default function Phase2TestPage() {
  const { wallet } = useLineraWallet();
  const {
    score,
    highScore,
    totalPoints,
    isBlockchainMode,
    blockchainGameState,
    syncState,
    startGameOnChain,
    endGameOnChain,
    moveSnakeOnChain,
    pauseGameOnChain,
    resumeGameOnChain,
    resetGameOnChain,
    getPlayerPoints,
    redeemPlayerPoints,
    syncWithBlockchain,
  } = useGame();

  const handleStartGame = async () => {
    console.log('🎮 Starting game...');
    const success = await startGameOnChain();
    console.log(success ? '✅ Game started' : '❌ Failed to start game');
  };

  const handleEndGame = async () => {
    console.log('🏁 Ending game...');
    const success = await endGameOnChain();
    console.log(success ? '✅ Game ended' : '❌ Failed to end game');
  };

  const handleMove = async (direction: Direction) => {
    console.log(`🎮 Moving ${direction}...`);
    const success = await moveSnakeOnChain(direction);
    console.log(success ? '✅ Moved' : '❌ Failed to move');
  };

  const handlePause = async () => {
    const success = await pauseGameOnChain();
    console.log(success ? '⏸️ Paused' : '❌ Failed to pause');
  };

  const handleResume = async () => {
    const success = await resumeGameOnChain();
    console.log(success ? '▶️ Resumed' : '❌ Failed to resume');
  };

  const handleReset = async () => {
    const success = await resetGameOnChain();
    console.log(success ? '🔄 Reset' : '❌ Failed to reset');
  };

  const handleSync = async () => {
    console.log('🔄 Manual sync...');
    await syncWithBlockchain();
  };

  const handleGetPoints = async () => {
    const points = await getPlayerPoints();
    console.log('💰 Points:', points);
  };

  const handleRedeemPoints = async () => {
    const success = await redeemPlayerPoints(100);
    console.log(success ? '✅ Redeemed 100 points' : '❌ Failed to redeem');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <WalletButton />
      <BlockchainStatus />

      <div className="max-w-4xl mx-auto space-y-8 pt-20">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Phase 2: Core Integration Test
          </h1>
          <p className="text-gray-400">
            Test wallet connection and blockchain operations
          </p>
        </div>

        {/* Wallet Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Wallet Status</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Connected:</span>
              <span className="ml-2 font-mono">{wallet.connected ? '✅ Yes' : '❌ No'}</span>
            </div>
            <div>
              <span className="text-gray-400">Address:</span>
              <span className="ml-2 font-mono">{wallet.address || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-400">Blockchain Mode:</span>
              <span className="ml-2 font-mono">{isBlockchainMode ? '✅ Enabled' : '❌ Disabled'}</span>
            </div>
            <div>
              <span className="text-gray-400">Sync Status:</span>
              <span className="ml-2 font-mono">
                {syncState.isSyncing ? '🔄 Syncing' : syncState.syncError ? '❌ Error' : '✅ Synced'}
              </span>
            </div>
          </div>
        </div>

        {/* Game State */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Game State</h2>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Local Score:</span>
              <span className="ml-2 font-bold text-xl">{score}</span>
            </div>
            <div>
              <span className="text-gray-400">High Score:</span>
              <span className="ml-2 font-bold text-xl">{highScore}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Points:</span>
              <span className="ml-2 font-bold text-xl text-yellow-400">{totalPoints}</span>
            </div>
          </div>

          {blockchainGameState && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h3 className="font-bold mb-2">Blockchain Game State:</h3>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div>Snake Length: {blockchainGameState.snake_body.length}</div>
                <div>Direction: {blockchainGameState.direction}</div>
                <div>Score: {blockchainGameState.score}</div>
                <div>Active: {blockchainGameState.is_active ? '✅' : '❌'}</div>
                <div>Paused: {blockchainGameState.is_paused ? '✅' : '❌'}</div>
                <div>Board: {blockchainGameState.width}x{blockchainGameState.height}</div>
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Blockchain Operations</h2>
          
          <div className="space-y-4">
            {/* Game Lifecycle */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Game Lifecycle:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleStartGame}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  🎮 Start Game
                </button>
                <button
                  onClick={handleEndGame}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  🏁 End Game
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={handleResume}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  ▶️ Resume
                </button>
                <button
                  onClick={handleReset}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  🔄 Reset
                </button>
              </div>
            </div>

            {/* Movement */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Movement:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMove(Direction.Up)}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  ↑ Up
                </button>
                <button
                  onClick={() => handleMove(Direction.Down)}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  ↓ Down
                </button>
                <button
                  onClick={() => handleMove(Direction.Left)}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  ← Left
                </button>
                <button
                  onClick={() => handleMove(Direction.Right)}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  → Right
                </button>
              </div>
            </div>

            {/* Points */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Points:</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleGetPoints}
                  disabled={!wallet.connected}
                  className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  💰 Get Points
                </button>
                <button
                  onClick={handleRedeemPoints}
                  disabled={!isBlockchainMode}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded transition-colors"
                >
                  🎁 Redeem 100 Points
                </button>
              </div>
            </div>

            {/* Sync */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Sync:</h3>
              <button
                onClick={handleSync}
                disabled={!isBlockchainMode}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 rounded transition-colors"
              >
                🔄 Manual Sync
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-bold mb-2 text-blue-300">How to Test:</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
            <li>Click "Connect Wallet" in the top-right corner</li>
            <li>Toggle "Blockchain Mode" in the bottom-left status panel</li>
            <li>Click "Start Game" to initialize a game on the blockchain</li>
            <li>Use movement buttons to test snake movement</li>
            <li>Watch the blockchain state update automatically (5s sync)</li>
            <li>Check the console for detailed logs</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
