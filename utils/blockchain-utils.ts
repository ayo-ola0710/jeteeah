/**
 * Blockchain Utilities
 * Helper functions for blockchain interactions
 */

import type { Direction, Position, GameState, Transaction, TransactionStatus } from '@/lib/types';

/**
 * Format a blockchain address for display
 * Example: 0x1234567890abcdef... -> 0x1234...cdef
 */
export function formatAddress(address: string, prefixLength = 6, suffixLength = 4): string {
  if (!address) return '';
  if (address.length <= prefixLength + suffixLength) return address;
  
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format points with comma separators
 * Example: 1234567 -> 1,234,567
 */
export function formatPoints(points: number): string {
  return points.toLocaleString();
}

/**
 * Convert Direction to arrow symbol
 */
export function directionToArrow(direction: Direction): string {
  const arrows = {
    Up: '↑',
    Down: '↓',
    Left: '←',
    Right: '→',
  };
  return arrows[direction] || '•';
}

/**
 * Calculate distance between two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
}

/**
 * Check if two positions are equal
 */
export function positionsEqual(pos1: Position, pos2: Position): boolean {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

/**
 * Check if position is within bounds
 */
export function isPositionValid(pos: Position, width: number, height: number): boolean {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
}

/**
 * Generate a mock player address (for testing)
 */
export function generateMockAddress(): string {
  const randomHex = () => Math.floor(Math.random() * 16).toString(16);
  const address = '0x' + Array.from({ length: 40 }, randomHex).join('');
  return address;
}

/**
 * Calculate time elapsed since timestamp
 */
export function getTimeElapsed(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Parse transaction ID to get timestamp
 */
export function getTransactionTimestamp(txId: string): number {
  const match = txId.match(/tx-\w+-(\d+)$/);
  if (match) {
    return parseInt(match[1]);
  }
  return Date.now();
}

/**
 * Get transaction status emoji
 */
export function getTransactionStatusEmoji(status: TransactionStatus): string {
  const emojis = {
    pending: '⏳',
    confirmed: '✅',
    failed: '❌',
  };
  return emojis[status] || '•';
}

/**
 * Validate game state structure
 */
export function isValidGameState(state: any): state is GameState {
  return (
    state &&
    Array.isArray(state.snake_body) &&
    state.snake_body.length > 0 &&
    typeof state.direction === 'string' &&
    state.food_position &&
    typeof state.food_position.x === 'number' &&
    typeof state.food_position.y === 'number' &&
    typeof state.score === 'number' &&
    typeof state.is_active === 'boolean' &&
    typeof state.is_paused === 'boolean' &&
    typeof state.width === 'number' &&
    typeof state.height === 'number'
  );
}

/**
 * Deep clone game state to prevent mutations
 */
export function cloneGameState(state: GameState): GameState {
  return {
    snake_body: state.snake_body.map(pos => ({ ...pos })),
    direction: state.direction,
    food_position: { ...state.food_position },
    score: state.score,
    is_active: state.is_active,
    is_paused: state.is_paused,
    width: state.width,
    height: state.height,
  };
}

/**
 * Check if snake collides with itself
 */
export function checkSelfCollision(snakeBody: Position[]): boolean {
  if (snakeBody.length < 2) return false;
  
  const head = snakeBody[0];
  for (let i = 1; i < snakeBody.length; i++) {
    if (positionsEqual(head, snakeBody[i])) {
      return true;
    }
  }
  return false;
}

/**
 * Check if snake collides with walls
 */
export function checkWallCollision(head: Position, width: number, height: number): boolean {
  return !isPositionValid(head, width, height);
}

/**
 * Get next head position based on direction
 */
export function getNextHeadPosition(currentHead: Position, direction: Direction): Position {
  const nextHead = { ...currentHead };
  
  switch (direction) {
    case 'Up':
      nextHead.y -= 1;
      break;
    case 'Down':
      nextHead.y += 1;
      break;
    case 'Left':
      nextHead.x -= 1;
      break;
    case 'Right':
      nextHead.x += 1;
      break;
  }
  
  return nextHead;
}

/**
 * Check if direction change is valid (not opposite)
 */
export function isValidDirectionChange(current: Direction, next: Direction): boolean {
  const opposites: Record<Direction, Direction> = {
    Up: 'Down' as Direction,
    Down: 'Up' as Direction,
    Left: 'Right' as Direction,
    Right: 'Left' as Direction,
  };
  
  return opposites[current] !== next;
}

/**
 * Create a pending transaction object
 */
export function createTransaction(type: string): Transaction {
  return {
    id: `tx-${type}-${Date.now()}`,
    type,
    status: 'pending' as TransactionStatus,
    timestamp: Date.now(),
  };
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

/**
 * Debounce a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  },
};

/**
 * Check if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
