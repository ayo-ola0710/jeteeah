/**
 * Leaderboard Component
 * Displays top players from blockchain
 */

'use client';

import { useState, useEffect } from 'react';
import { useLineraWallet } from '@/hooks/useLineraWallet';
import { SnakeContract } from '@/lib/contract-operations';
import { formatAddress } from '@/utils/blockchain-utils';
import { LeaderboardSkeleton } from './SkeletonLoader';

interface LeaderboardEntry {
  rank: number;
  player: string;
  score: number;
  isCurrentPlayer?: boolean;
}

export default function Leaderboard() {
  const { wallet } = useLineraWallet();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'weekly' | 'daily'>('all');

  // Mock leaderboard data for now (replace with actual blockchain queries later)
  const fetchLeaderboard = async () => {
    setLoading(true);
    
    try {
      // TODO: Replace with actual blockchain query when leaderboard contract method is available
      // For now, using mock data
      const mockData: LeaderboardEntry[] = [
        { rank: 1, player: '0x1234...5678', score: 1250 },
        { rank: 2, player: '0x2345...6789', score: 980 },
        { rank: 3, player: '0x3456...7890', score: 850 },
        { rank: 4, player: '0x4567...8901', score: 720 },
        { rank: 5, player: '0x5678...9012', score: 650 },
        { rank: 6, player: '0x6789...0123', score: 580 },
        { rank: 7, player: '0x7890...1234', score: 520 },
        { rank: 8, player: '0x8901...2345', score: 480 },
        { rank: 9, player: '0x9012...3456', score: 420 },
        { rank: 10, player: '0x0123...4567', score: 380 },
      ];

      // Mark current player
      const dataWithHighlight = mockData.map(entry => ({
        ...entry,
        isCurrentPlayer: !!(wallet.address && entry.player.includes(wallet.address.slice(2, 6)))
      }));

      setLeaderboard(dataWithHighlight);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  // Show loading skeleton
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">🏆 Leaderboard</h2>
        <LeaderboardSkeleton />
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">🏆 Leaderboard</h2>
        <button
          onClick={fetchLeaderboard}
          className="text-sm text-blue-400 hover:text-blue-300"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded text-sm ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          All Time
        </button>
        <button
          onClick={() => setFilter('weekly')}
          className={`px-3 py-1 rounded text-sm ${
            filter === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setFilter('daily')}
          className={`px-3 py-1 rounded text-sm ${
            filter === 'daily' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
          }`}
        >
          Daily
        </button>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center gap-3 p-3 rounded-lg ${
              entry.isCurrentPlayer
                ? 'bg-blue-600/20 border border-blue-500/50'
                : 'bg-gray-700/30'
            }`}
          >
            {/* Rank */}
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {entry.rank <= 3 ? (
                <span className="text-2xl">
                  {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                </span>
              ) : (
                <span className="text-gray-400 font-bold">#{entry.rank}</span>
              )}
            </div>

            {/* Player Address */}
            <div className="flex-1">
              <p className="font-mono text-sm">
                {formatAddress(entry.player)}
                {entry.isCurrentPlayer && (
                  <span className="ml-2 text-xs text-blue-400">(You)</span>
                )}
              </p>
            </div>

            {/* Score */}
            <div className="text-right">
              <p className="font-bold text-yellow-400">{entry.score.toLocaleString()}</p>
              <p className="text-xs text-gray-400">points</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      {wallet.connected ? (
        <div className="mt-4 text-center text-sm text-gray-400">
          Play to climb the ranks! 🎮
        </div>
      ) : (
        <div className="mt-4 text-center text-sm text-yellow-400">
          ⚠️ Connect wallet to see your ranking
        </div>
      )}
    </div>
  );
}
