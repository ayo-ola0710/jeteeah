/**
 * Points Dashboard Component
 * Shows player's points balance and redemption options
 */

'use client';

import { useState, useEffect } from 'react';
import { useGame } from '@/app/contexts/GameContext';
import { useLineraWallet } from '@/hooks/useLineraWallet';
import { PointsDashboardSkeleton } from './SkeletonLoader';

export default function PointsDashboard() {
  const { wallet } = useLineraWallet();
  const { totalPoints, getPlayerPoints, redeemPlayerPoints } = useGame();
  const [redeemAmount, setRedeemAmount] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (wallet.connected) {
        setLoading(true);
        await getPlayerPoints();
        setLoading(false);
      }
    };
    fetchData();
  }, [wallet.connected]);

  if (loading && wallet.connected) {
    return <PointsDashboardSkeleton />;
  }

  const handleRedeem = async () => {
    const amount = parseInt(redeemAmount);
    
    if (isNaN(amount) || amount <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid amount' });
      return;
    }

    if (amount > totalPoints) {
      setMessage({ type: 'error', text: 'Insufficient points' });
      return;
    }

    setIsRedeeming(true);
    setMessage(null);

    try {
      const success = await redeemPlayerPoints(amount);
      
      if (success) {
        setMessage({ type: 'success', text: `Successfully redeemed ${amount} points!` });
        setRedeemAmount('');
        await getPlayerPoints(); // Refresh balance
      } else {
        setMessage({ type: 'error', text: 'Failed to redeem points' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error redeeming points' });
    } finally {
      setIsRedeeming(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">💰 Points</h2>
        <div className="text-center py-8 text-gray-400">
          <p className="mb-4 text-4xl">🔒</p>
          <p>Connect your wallet to view points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-6">💰 Your Points</h2>

      {/* Points Balance */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-6 mb-6">
        <p className="text-sm text-gray-400 mb-2">Total Balance</p>
        <p className="text-5xl font-bold text-yellow-400 mb-1">
          {totalPoints.toLocaleString()}
        </p>
        <p className="text-sm text-gray-400">points</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Games Played</p>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="bg-gray-700/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Avg. Score</p>
          <p className="text-2xl font-bold">--</p>
        </div>
      </div>

      {/* Redeem Points */}
      <div className="border-t border-gray-700 pt-6">
        <h3 className="font-bold mb-3">Redeem Points</h3>
        
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={redeemAmount}
            onChange={(e) => setRedeemAmount(e.target.value)}
            placeholder="Enter amount"
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            disabled={isRedeeming}
          />
          <button
            onClick={handleRedeem}
            disabled={isRedeeming || !redeemAmount}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-medium transition-colors"
          >
            {isRedeeming ? 'Redeeming...' : 'Redeem'}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded text-sm ${
            message.type === 'success' 
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}>
            {message.text}
          </div>
        )}

        {/* Quick Redeem Buttons */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setRedeemAmount('100')}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded transition-colors"
          >
            100
          </button>
          <button
            onClick={() => setRedeemAmount('500')}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded transition-colors"
          >
            500
          </button>
          <button
            onClick={() => setRedeemAmount('1000')}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded transition-colors"
          >
            1000
          </button>
          <button
            onClick={() => setRedeemAmount(totalPoints.toString())}
            className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-sm rounded transition-colors"
          >
            Max
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 p-3 bg-blue-600/20 border border-blue-600/30 rounded text-sm text-blue-300">
        <p className="font-medium mb-1">💡 How to earn points:</p>
        <ul className="text-xs space-y-1 text-blue-400">
          <li>• Play games in blockchain mode</li>
          <li>• Earn points equal to your score</li>
          <li>• Redeem points for rewards</li>
        </ul>
      </div>
    </div>
  );
}
