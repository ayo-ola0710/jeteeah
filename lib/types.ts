/**
 * Blockchain Types for Jeteeah Snake Game
 * Matches the smart contract state structures
 */

// Direction enum - matches smart contract Direction
export enum Direction {
  Up = 'Up',
  Down = 'Down',
  Left = 'Left',
  Right = 'Right',
}

// Position interface - matches smart contract Position
export interface Position {
  x: number;
  y: number;
}

// GameState interface - matches smart contract GameState
export interface GameState {
  snake_body: Position[];
  direction: Direction;
  food_position: Position;
  score: number;
  is_active: boolean;
  is_paused: boolean;
  width: number;
  height: number;
}

// Player data from blockchain
export interface PlayerData {
  address: string;
  high_score: number;
  total_points: number;
  games_played: number;
}

// Leaderboard entry
export interface LeaderboardEntry {
  player: string;
  score: number;
  rank: number;
  timestamp?: number;
}

// Transaction status
export enum TransactionStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Failed = 'failed',
}

// Transaction info
export interface Transaction {
  id: string;
  type: string;
  status: TransactionStatus;
  timestamp: number;
  error?: string;
}

// Wallet state
export interface WalletState {
  connected: boolean;
  address: string | null;
  chainId: string | null;
  balance?: number;
}

// Blockchain sync state
export interface SyncState {
  isSyncing: boolean;
  lastSyncTime: number | null;
  syncError: string | null;
}

// Game mode
export enum GameMode {
  Local = 'local',
  Blockchain = 'blockchain',
}

// Contract operation types
export type OperationType =
  | 'StartGame'
  | 'MoveSnake'
  | 'PauseGame'
  | 'ResumeGame'
  | 'EndGame'
  | 'ResetGame'
  | 'EatFood'
  | 'AddPoints'
  | 'RedeemPoints'
  | 'SetGameParameters'
  | 'UpdateFoodSpawnRate'
  | 'ResetLeaderboard';

// GraphQL query response types
export interface GameStateResponse {
  games: GameState | null;
}

export interface HighScoreResponse {
  high_scores: number;
}

export interface PointsResponse {
  points: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}

// Operation result
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  transactionId?: string;
}

// Configuration
export interface BlockchainConfig {
  endpoint: string;
  chainId: string;
  appId: string;
  enableMockWallet: boolean;
}
