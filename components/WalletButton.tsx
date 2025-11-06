/**
 * Wallet Button Component
 * Shows wallet status and navigates to wallet page
 */

'use client';

import { useLineraWallet } from '@/hooks/useLineraWallet';
import { formatAddress } from '@/utils/blockchain-utils';
import { useRouter, usePathname } from 'next/navigation';
import { useGame } from '@/app/contexts/GameContext';

export default function WalletButton() {
  const { wallet, disconnect, isMockMode } = useLineraWallet();
  const { totalPoints } = useGame();
  const router = useRouter();
  const pathname = usePathname();

  // Don't show on wallet page
  if (pathname === '/wallet') {
    return null;
  }

  if (wallet.connected) {
    return (
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm px-4 py-3 rounded-lg border border-gray-700 shadow-lg">
        {/* Connection indicator */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => router.push('/wallet')}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <div className="flex flex-col">
            <span className="text-white font-mono text-sm">
              {formatAddress(wallet.address || '')}
            </span>
            {isMockMode && (
              <span className="text-yellow-400 text-xs">Mock Mode</span>
            )}
          </div>
        </div>

        {/* Points Balance */}
        <div className="text-gray-400 text-sm border-l border-gray-700 pl-3">
          {totalPoints.toLocaleString()} pts
        </div>

        {/* Disconnect button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            disconnect();
          }}
          className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => router.push('/wallet')}
        className="px-6 py-3 bg-[#FF1414] hover:bg-[#f76f6f] text-white rounded-lg font-bold transition-colors shadow-lg"
      >
        Connect Wallet
      </button>
    </div>
  );
}
