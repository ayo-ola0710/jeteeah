/**
 * Blockchain Status Component
 * Shows blockchain connection and sync status
 */

'use client';

import { useGame } from '@/app/contexts/GameContext';
import { useLineraWallet } from '@/hooks/useLineraWallet';
import { getTimeElapsed } from '@/utils/blockchain-utils';

export default function BlockchainStatus() {
  const { wallet } = useLineraWallet();
  const {
    isBlockchainMode,
    setBlockchainMode,
    syncState,
    pendingTransactions,
    totalPoints,
    blockchainGameState,
  } = useGame();

  if (!wallet.connected) {
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-700 shadow-lg">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <div className="w-2 h-2 bg-gray-500 rounded-full" />
          <span>Offline Mode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      {/* Blockchain Mode Toggle */}
      <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-700 shadow-lg">
        <label className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              checked={isBlockchainMode}
              onChange={(e) => setBlockchainMode(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
          <span className="text-white text-sm font-medium">
            {isBlockchainMode ? '🔗 Blockchain Mode' : '📴 Local Mode'}
          </span>
        </label>
      </div>

      {/* Sync Status */}
      {isBlockchainMode && (
        <div className="bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-700 shadow-lg space-y-2">
          {/* Sync indicator */}
          <div className="flex items-center gap-2 text-sm">
            {syncState.isSyncing ? (
              <>
                <svg className="animate-spin h-4 w-4 text-blue-500" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-blue-400">Syncing...</span>
              </>
            ) : syncState.syncError ? (
              <>
                <span className="text-red-500">⚠️</span>
                <span className="text-red-400">Sync error</span>
              </>
            ) : (
              <>
                <span className="text-green-500">✓</span>
                <span className="text-gray-400">
                  {syncState.lastSyncTime
                    ? `Synced ${getTimeElapsed(syncState.lastSyncTime)}`
                    : 'Not synced'}
                </span>
              </>
            )}
          </div>

          {/* Pending transactions */}
          {pendingTransactions.length > 0 && (
            <div className="text-sm text-yellow-400">
              ⏳ {pendingTransactions.length} pending transaction{pendingTransactions.length > 1 ? 's' : ''}
            </div>
          )}

          {/* Points balance */}
          <div className="flex items-center gap-2 text-sm pt-2 border-t border-gray-700">
            <span className="text-yellow-500">💰</span>
            <span className="text-white font-medium">{totalPoints.toLocaleString()}</span>
            <span className="text-gray-400">points</span>
          </div>

          {/* Game state info */}
          {blockchainGameState && (
            <div className="text-xs text-gray-500 pt-1">
              {blockchainGameState.is_active ? (
                blockchainGameState.is_paused ? (
                  <span className="text-yellow-400">⏸️ Paused</span>
                ) : (
                  <span className="text-green-400">▶️ Active</span>
                )
              ) : (
                <span>⏹️ No active game</span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
