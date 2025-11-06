/**
 * Transaction Notification Component
 * Toast notifications for blockchain transactions
 */

'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/app/contexts/GameContext';
import { getTransactionStatusEmoji } from '@/utils/blockchain-utils';
import type { Transaction } from '@/lib/types';

export default function TransactionNotification() {
  const { pendingTransactions } = useGame();
  const [notifications, setNotifications] = useState<Transaction[]>([]);

  useEffect(() => {
    // Update notifications when pending transactions change
    setNotifications(pendingTransactions);
  }, [pendingTransactions]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((tx) => (
        <div
          key={tx.id}
          className="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-4 shadow-lg animate-slide-in"
        >
          <div className="flex items-start gap-3">
            {/* Status Icon */}
            <div className="text-2xl flex-shrink-0">
              {getTransactionStatusEmoji(tx.status)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white mb-1">
                {tx.type}
              </p>
              <p className="text-sm text-gray-400">
                {tx.status === 'pending' && 'Processing transaction...'}
                {tx.status === 'confirmed' && 'Transaction confirmed!'}
                {tx.status === 'failed' && (tx.error || 'Transaction failed')}
              </p>
              {tx.status === 'pending' && (
                <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                  <div className="bg-blue-500 h-1 rounded-full animate-pulse w-2/3" />
                </div>
              )}
            </div>

            {/* Close Button (for completed/failed) */}
            {tx.status !== 'pending' && (
              <button
                onClick={() => setNotifications(prev => prev.filter(n => n.id !== tx.id))}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
