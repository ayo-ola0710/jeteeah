/**
 * Skeleton Loader Component
 * Reusable loading placeholders for blockchain data
 */

'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string;
  height?: string;
  count?: number;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width = '100%',
  height = '20px',
  count = 1
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-700/50';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  const skeletons = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={skeletonClass}
      style={{ width, height }}
    />
  ));

  return count > 1 ? <div className="space-y-2">{skeletons}</div> : skeletons[0];
}

// Specific skeleton layouts
export function LeaderboardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 10 }, (_, i) => (
        <div 
          key={i}
          className="bg-[#1B2A4E99] rounded-lg p-4 flex items-center gap-4"
        >
          {/* Rank */}
          <Skeleton variant="circular" width="40px" height="40px" />
          
          {/* Player info */}
          <div className="flex-1 space-y-2">
            <Skeleton width="60%" height="16px" />
            <Skeleton width="40%" height="12px" />
          </div>
          
          {/* Score */}
          <Skeleton width="60px" height="24px" />
        </div>
      ))}
    </div>
  );
}

export function PointsDashboardSkeleton() {
  return (
    <div className="space-y-4">
      {/* Balance display */}
      <div className="bg-[#1B2A4E99] rounded-lg p-6 text-center">
        <Skeleton width="120px" height="16px" className="mx-auto mb-3" />
        <Skeleton width="180px" height="48px" className="mx-auto" />
      </div>

      {/* Redemption section */}
      <div className="bg-[#1B2A4E99] rounded-lg p-6">
        <Skeleton width="150px" height="20px" className="mb-4" />
        <Skeleton width="100%" height="48px" className="mb-3" />
        <div className="grid grid-cols-4 gap-2">
          <Skeleton height="36px" />
          <Skeleton height="36px" />
          <Skeleton height="36px" />
          <Skeleton height="36px" />
        </div>
      </div>

      {/* History */}
      <div className="bg-[#1B2A4E99] rounded-lg p-4">
        <Skeleton width="180px" height="20px" className="mb-3" />
        <div className="space-y-2">
          <Skeleton count={3} height="40px" />
        </div>
      </div>
    </div>
  );
}

export function GameStatsSkeleton() {
  return (
    <div className="flex gap-4">
      <div className="bg-[#1B2A4E99] rounded-lg p-4 flex-1 text-center">
        <Skeleton width="80px" height="12px" className="mx-auto mb-2" />
        <Skeleton width="60px" height="32px" className="mx-auto" />
      </div>
      <div className="bg-[#1B2A4E99] rounded-lg p-4 flex-1 text-center">
        <Skeleton width="80px" height="12px" className="mx-auto mb-2" />
        <Skeleton width="60px" height="32px" className="mx-auto" />
      </div>
    </div>
  );
}

export function WalletInfoSkeleton() {
  return (
    <div className="bg-[#1B2A4E99] rounded-lg p-4">
      <Skeleton width="120px" height="14px" className="mb-3" />
      <Skeleton width="100%" height="20px" className="mb-2" />
      <Skeleton width="60%" height="16px" />
    </div>
  );
}
