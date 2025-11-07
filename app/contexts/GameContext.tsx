"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useLineraWallet } from "@/hooks/useLineraWallet";
import { SnakeContract } from "@/lib/contract-operations";
import type { Direction, GameState as BlockchainGameState, SyncState, Transaction, TransactionStatus } from "@/lib/types";
import { storage } from "@/utils/blockchain-utils";

interface GameContextType {
  score: number;
  highScore: number;
  setScore: (score: number | ((prevScore: number) => number)) => void;
  updateHighScore: (score: number) => void;
  resetScore: () => void;
  
  // Blockchain functionality
  isBlockchainMode: boolean;
  setBlockchainMode: (enabled: boolean) => void;
  isGameActive: boolean;
  setIsGameActive: (active: boolean) => void;
  syncState: SyncState;
  pendingTransactions: Transaction[];
  blockchainGameState: BlockchainGameState | null;
  totalPoints: number;
  
  // Blockchain operations
  syncWithBlockchain: () => Promise<void>;
  startGameOnChain: () => Promise<boolean>;
  endGameOnChain: () => Promise<boolean>;
  moveSnakeOnChain: (direction: Direction) => Promise<boolean>;
  pauseGameOnChain: () => Promise<boolean>;
  resumeGameOnChain: () => Promise<boolean>;
  resetGameOnChain: () => Promise<boolean>;
  
  // Points operations
  getPlayerPoints: () => Promise<number>;
  redeemPlayerPoints: (amount: number) => Promise<boolean>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [score, setScoreState] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on client side only (after hydration)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHighScore = localStorage.getItem("snakeHighScore");
      if (savedHighScore) {
        setHighScore(parseInt(savedHighScore, 10));
      }
    }
  }, []);

  // Blockchain state
  const { wallet } = useLineraWallet();
  const [isBlockchainMode, setBlockchainModeState] = useState(false);
  const [blockchainGameState, setBlockchainGameState] = useState<BlockchainGameState | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false); // Track if game is being played
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncTime: null,
    syncError: null,
  });
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  
  // Ref for sync interval
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const setScore = useCallback(
    (newScore: number | ((prevScore: number) => number)) => {
      setScoreState(newScore);
    },
    []
  );

  const updateHighScore = useCallback(
    (newScore: number) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        if (typeof window !== "undefined") {
          localStorage.setItem("snakeHighScore", newScore.toString());
        }
      }
    },
    [highScore]
  );

  const resetScore = useCallback(() => {
    setScoreState(0);
  }, []);

  /**
   * Set blockchain mode and enable/disable features accordingly
   */
  const setBlockchainMode = useCallback((enabled: boolean) => {
    if (enabled && !wallet.connected) {
      console.warn("⚠️ Cannot enable blockchain mode: wallet not connected");
      return;
    }
    
    console.log(enabled ? "🔗 Blockchain mode enabled" : "📴 Blockchain mode disabled");
    setBlockchainModeState(enabled);
    storage.set('jeteeah_blockchain_mode', enabled);
  }, [wallet.connected]);

  /**
   * Add a pending transaction
   */
  const addTransaction = useCallback((tx: Transaction) => {
    setPendingTransactions(prev => [...prev, tx]);
  }, []);

  /**
   * Remove a transaction
   */
  const removeTransaction = useCallback((txId: string) => {
    setPendingTransactions(prev => prev.filter(tx => tx.id !== txId));
  }, []);

  /**
   * Sync game state from blockchain
   * Note: During active gameplay, score is tracked LOCALLY (off-chain) for performance.
   * Only at game end is the final score sent to blockchain via endGameOnChain()
   */
  const syncWithBlockchain = useCallback(async () => {
    if (!wallet.connected || !wallet.address || !isBlockchainMode) {
      return;
    }

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      if (isGameActive) {
        console.log("🎮 Game active - score tracked locally, will sync at game end");
      } else {
        console.log("🔄 Syncing with blockchain...");
      }
      
      // Fetch game state (only update score when game is inactive)
      const stateResult = await SnakeContract.getGameState(wallet.address);
      
      if (stateResult.success && stateResult.data) {
        setBlockchainGameState(stateResult.data);
        // Score is ONLY synced when game is NOT active
        // During gameplay, score is local and sent to blockchain at game end
        if (!isGameActive) {
          setScore(stateResult.data.score);
          console.log(`📊 Synced blockchain score: ${stateResult.data.score}`);
        }
      } else {
        if (!isGameActive) {
          console.log("ℹ️ No game state found on blockchain");
        }
        setBlockchainGameState(null);
      }

      // Fetch high score
      const highScoreResult = await SnakeContract.getHighScore(wallet.address);
      if (highScoreResult.success && highScoreResult.data) {
        setHighScore(highScoreResult.data);
      }

      // Fetch points - only when game is not active
      if (!isGameActive) {
        const pointsResult = await SnakeContract.getPoints(wallet.address);
        if (pointsResult.success && pointsResult.data !== undefined) {
          console.log(`💰 Synced points: ${pointsResult.data}`);
          setTotalPoints(pointsResult.data);
        }
      }

      setSyncState({
        isSyncing: false,
        lastSyncTime: Date.now(),
        syncError: null,
      });
    } catch (error: any) {
      console.error("❌ Blockchain sync failed:", error);
      setSyncState({
        isSyncing: false,
        lastSyncTime: Date.now(),
        syncError: error.message || "Sync failed",
      });
    }
  }, [wallet.connected, wallet.address, isBlockchainMode]);

  /**
   * Start a new game on blockchain
   */
  const startGameOnChain = useCallback(async (): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode) {
      console.warn("⚠️ Wallet not connected or blockchain mode disabled");
      return false;
    }

    try {
      console.log("🎮 Starting game on blockchain...");
      
      const tx: Transaction = {
        id: `tx-start-${Date.now()}`,
        type: 'StartGame',
        status: 'pending' as TransactionStatus,
        timestamp: Date.now(),
      };
      addTransaction(tx);

      const result = await SnakeContract.startGame();
      
      removeTransaction(tx.id);

      if (result.success) {
        console.log("✅ Game started on blockchain");
        await syncWithBlockchain();
        return true;
      } else {
        console.error("❌ Failed to start game:", result.error);
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error starting game:", error);
      return false;
    }
  }, [wallet.connected, isBlockchainMode, syncWithBlockchain, addTransaction, removeTransaction]);

  /**
   * End game and save final score to blockchain
   * This is where the local (off-chain) score is sent to the blockchain
   * Flow: Game plays locally → Score accumulates → Game ends → Score sent to blockchain → Points awarded
   */
  const endGameOnChain = useCallback(async (): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode || !wallet.address) {
      return false;
    }

    try {
      console.log(`🏁 Ending game - sending final score ${score} to blockchain for ${wallet.address}...`);
      
      const tx: Transaction = {
        id: `tx-end-${Date.now()}`,
        type: 'EndGame',
        status: 'pending' as TransactionStatus,
        timestamp: Date.now(),
      };
      addTransaction(tx);

      // Send local score to blockchain and award points to wallet
      const result = await SnakeContract.endGame(wallet.address, score);
      
      removeTransaction(tx.id);

      if (result.success) {
        const pointsData = result.data as { pointsEarned?: number; totalPoints?: number };
        console.log(`✅ Game ended! Score: ${score} → Points earned: ${pointsData.pointsEarned || score}, Total: ${pointsData.totalPoints || 0}`);
        
        // Update local points state with the new total from blockchain
        if (pointsData.totalPoints !== undefined) {
          console.log(`💰 endGameOnChain: Updating totalPoints to ${pointsData.totalPoints}`);
          setTotalPoints(pointsData.totalPoints);
        }
        
        await syncWithBlockchain();
        return true;
      } else {
        console.error("❌ Failed to end game:", result.error);
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error ending game:", error);
      return false;
    }
  }, [wallet.connected, wallet.address, isBlockchainMode, score, syncWithBlockchain, addTransaction, removeTransaction]);

  /**
   * Move snake with optimistic update
   */
  const moveSnakeOnChain = useCallback(async (direction: Direction): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode) {
      return false;
    }

    try {
      // Optimistic update happens in the game component
      // Here we just send to blockchain
      const result = await SnakeContract.moveSnake(direction);

      if (result.success) {
        // Sync after move to get authoritative state
        await syncWithBlockchain();
        return true;
      } else {
        console.error("❌ Failed to move snake:", result.error);
        // Rollback by syncing
        await syncWithBlockchain();
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error moving snake:", error);
      await syncWithBlockchain();
      return false;
    }
  }, [wallet.connected, isBlockchainMode, syncWithBlockchain]);

  /**
   * Pause game on blockchain
   */
  const pauseGameOnChain = useCallback(async (): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode) {
      return false;
    }

    try {
      const result = await SnakeContract.pauseGame();
      
      if (result.success) {
        console.log("⏸️ Game paused on blockchain");
        await syncWithBlockchain();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Error pausing game:", error);
      return false;
    }
  }, [wallet.connected, isBlockchainMode, syncWithBlockchain]);

  /**
   * Resume game on blockchain
   */
  const resumeGameOnChain = useCallback(async (): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode) {
      return false;
    }

    try {
      const result = await SnakeContract.resumeGame();
      
      if (result.success) {
        console.log("▶️ Game resumed on blockchain");
        await syncWithBlockchain();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Error resuming game:", error);
      return false;
    }
  }, [wallet.connected, isBlockchainMode, syncWithBlockchain]);

  /**
   * Reset game on blockchain
   */
  const resetGameOnChain = useCallback(async (): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode) {
      return false;
    }

    try {
      const result = await SnakeContract.resetGame();
      
      if (result.success) {
        console.log("🔄 Game reset on blockchain");
        await syncWithBlockchain();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("❌ Error resetting game:", error);
      return false;
    }
  }, [wallet.connected, isBlockchainMode, syncWithBlockchain]);

  /**
   * Get player's total points
   * Note: Avoids updating state during active gameplay to prevent overwriting accumulated score
   */
  const getPlayerPoints = useCallback(async (): Promise<number> => {
    if (!wallet.connected || !wallet.address) {
      return 0;
    }

    try {
      const result = await SnakeContract.getPoints(wallet.address);
      if (result.success && result.data !== undefined) {
        // Only update state if game is not active to avoid overwriting during gameplay
        if (!isGameActive) {
          console.log(`💰 getPlayerPoints: Updating state to ${result.data} (game inactive)`);
          setTotalPoints(result.data);
        } else {
          console.log(`⏭️ getPlayerPoints: Skipping state update (game is active), returned ${result.data}`);
        }
        return result.data;
      }
      return 0;
    } catch (error) {
      console.error("❌ Error getting points:", error);
      return 0;
    }
  }, [wallet.connected, wallet.address, isGameActive]);

  /**
   * Redeem points
   */
  const redeemPlayerPoints = useCallback(async (amount: number): Promise<boolean> => {
    if (!wallet.connected || !isBlockchainMode || !wallet.address) {
      return false;
    }

    try {
      console.log(`💰 Redeeming ${amount} points for ${wallet.address}...`);
      const result = await SnakeContract.redeemPoints(wallet.address, amount);
      
      if (result.success) {
        const remainingData = result.data as { remainingPoints?: number };
        console.log(`✅ Points redeemed successfully. Remaining: ${remainingData.remainingPoints || 0}`);
        
        // Update local points if returned
        if (remainingData.remainingPoints !== undefined) {
          setTotalPoints(remainingData.remainingPoints);
        }
        
        await getPlayerPoints(); // Refresh points from blockchain
        return true;
      } else {
        console.error("❌ Failed to redeem points:", result.error);
        return false;
      }
    } catch (error: any) {
      console.error("❌ Error redeeming points:", error);
      return false;
    }
  }, [wallet.connected, wallet.address, isBlockchainMode, getPlayerPoints]);

  /**
   * Auto-enable blockchain mode when wallet connects
   */
  useEffect(() => {
    if (wallet.connected) {
      const savedMode = storage.get('jeteeah_blockchain_mode', false);
      setBlockchainModeState(savedMode);
    } else {
      setBlockchainModeState(false);
    }
  }, [wallet.connected]);

  /**
   * Initial sync when blockchain mode is enabled
   */
  useEffect(() => {
    if (isBlockchainMode && wallet.connected) {
      syncWithBlockchain();
    }
  }, [isBlockchainMode, wallet.connected]);

  /**
   * Set up dynamic sync intervals based on game state
   * - Active gameplay: 3 seconds (more frequent)
   * - Idle/menu: 10 seconds (less frequent)
   */
  useEffect(() => {
    if (isBlockchainMode && wallet.connected) {
      // Initial sync
      syncWithBlockchain();

      // Dynamic interval based on game state
      const syncInterval = isGameActive ? 3000 : 10000;
      
      // Set up interval
      syncIntervalRef.current = setInterval(() => {
        syncWithBlockchain();
      }, syncInterval);

      console.log(`⏱️ Periodic blockchain sync enabled (${syncInterval/1000}s interval, ${isGameActive ? 'active game' : 'idle'})`);
    }

    // Cleanup
    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
        syncIntervalRef.current = null;
        console.log("⏱️ Periodic blockchain sync disabled");
      }
    };
  }, [isBlockchainMode, wallet.connected, isGameActive, syncWithBlockchain]);

  return (
    <GameContext.Provider
      value={{
        score,
        highScore,
        setScore,
        updateHighScore,
        resetScore,
        isBlockchainMode,
        setBlockchainMode,
        isGameActive,
        setIsGameActive,
        syncState,
        pendingTransactions,
        blockchainGameState,
        totalPoints,
        syncWithBlockchain,
        startGameOnChain,
        endGameOnChain,
        moveSnakeOnChain,
        pauseGameOnChain,
        resumeGameOnChain,
        resetGameOnChain,
        getPlayerPoints,
        redeemPlayerPoints,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
