/**
 * Smart Contract Operations
 * Wrapper functions for all Jeteeah smart contract operations
 */

import { lineraClient, lineraQueryClient, isMockMode } from "./linera-client";
import type {
  Direction,
  GameState,
  GameStateResponse,
  HighScoreResponse,
  PointsResponse,
  OperationResult,
} from "./types";

/**
 * SnakeContract - Main contract interaction class
 */
export class SnakeContract {
  /**
   * Start a new game for the current player
   */
  static async startGame(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Starting game");
        return { success: true, transactionId: "mock-tx-start" };
      }

      const mutation = `
        mutation {
          operation(operation: "StartGame")
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log("✅ Game started on blockchain");
      return {
        success: true,
        data: result,
        transactionId: "tx-start-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to start game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Move the snake in a specified direction
   */
  static async moveSnake(direction: Direction): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(`🧪 [MOCK] Moving snake: ${direction}`);
        return { success: true, transactionId: "mock-tx-move" };
      }

      const mutation = `
        mutation {
          operation(operation: {
            MoveSnake: {
              direction: ${direction}
            }
          })
        }
      `;

      const result = await lineraClient.request(mutation);
      return {
        success: true,
        data: result,
        transactionId: "tx-move-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to move snake:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Pause the current game
   */
  static async pauseGame(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Pausing game");
        return { success: true, transactionId: "mock-tx-pause" };
      }

      const mutation = `
        mutation {
          operation(operation: "PauseGame")
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log("⏸️ Game paused on blockchain");
      return {
        success: true,
        data: result,
        transactionId: "tx-pause-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to pause game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Resume a paused game
   */
  static async resumeGame(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Resuming game");
        return { success: true, transactionId: "mock-tx-resume" };
      }

      const mutation = `
        mutation {
          operation(operation: "ResumeGame")
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log("▶️ Game resumed on blockchain");
      return {
        success: true,
        data: result,
        transactionId: "tx-resume-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to resume game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * End the current game and award points
   */
  /**
   * End the current game and award points to the player's wallet
   * @param playerAddress - Wallet address to award points to
   * @param finalScore - Final score achieved in the game
   */
  static async endGame(
    playerAddress: string,
    finalScore: number
  ): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(
          `🧪 [MOCK] Ending game for ${playerAddress} with score ${finalScore}`
        );

        // In mock mode, store points per wallet address
        const pointsKey = `jeteeah_points_${playerAddress}`;
        const currentPoints = parseInt(localStorage.getItem(pointsKey) || "0");
        const pointsEarned = finalScore; // 1 point per score point
        const newTotal = currentPoints + pointsEarned;

        localStorage.setItem(pointsKey, newTotal.toString());
        console.log(
          `💰 Mock: Awarded ${pointsEarned} points. Total: ${newTotal}`
        );

        return {
          success: true,
          transactionId: "mock-tx-end",
          data: { pointsEarned, totalPoints: newTotal },
        };
      }

      const mutation = `
        mutation EndGame($playerAddress: String!, $finalScore: Int!) {
          operation(
            operation: "EndGame",
            playerAddress: $playerAddress,
            finalScore: $finalScore
          ) {
            pointsEarned
            totalPoints
          }
        }
      `;

      const variables = { playerAddress, finalScore };
      const result = await lineraClient.request(mutation, variables);
      console.log(
        `🏁 Game ended for ${playerAddress}. Score: ${finalScore}, Points awarded: ${result.pointsEarned}`
      );

      return {
        success: true,
        data: result,
        transactionId: "tx-end-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to end game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset the game to start fresh
   */
  static async resetGame(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Resetting game");
        return { success: true, transactionId: "mock-tx-reset" };
      }

      const mutation = `
        mutation {
          operation(operation: "ResetGame")
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log("🔄 Game reset");
      return {
        success: true,
        data: result,
        transactionId: "tx-reset-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to reset game:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process food consumption (called internally by contract)
   */
  static async eatFood(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Eating food");
        return { success: true, transactionId: "mock-tx-eat" };
      }

      const mutation = `
        mutation {
          operation(operation: "EatFood")
        }
      `;

      const result = await lineraClient.request(mutation);
      return {
        success: true,
        data: result,
        transactionId: "tx-eat-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to eat food:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get the current game state for a player
   */
  static async getGameState(
    playerAddress: string
  ): Promise<OperationResult<GameState>> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Getting game state");
        const mockState: GameState = {
          snake_body: [
            { x: 10, y: 10 },
            { x: 10, y: 9 },
            { x: 10, y: 8 },
          ],
          direction: "Right" as Direction,
          food_position: { x: 15, y: 7 },
          score: 0,
          is_active: true,
          is_paused: false,
          width: 20,
          height: 20,
        };
        return { success: true, data: mockState };
      }

      const query = `
        query {
          games(key: "${playerAddress}") {
            snake_body {
              x
              y
            }
            direction
            food_position {
              x
              y
            }
            score
            is_active
            is_paused
            width
            height
          }
        }
      `;

      const result = await lineraQueryClient.request<GameStateResponse>(query);

      if (!result.games) {
        return { success: false, error: "No game state found for player" };
      }

      return { success: true, data: result.games };
    } catch (error: any) {
      console.error("❌ Failed to get game state:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a player's high score
   */
  static async getHighScore(
    playerAddress: string
  ): Promise<OperationResult<number>> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Getting high score");
        return { success: true, data: 0 };
      }

      const query = `
        query {
          high_scores(key: "${playerAddress}")
        }
      `;

      const result = await lineraQueryClient.request<HighScoreResponse>(query);
      return { success: true, data: result.high_scores || 0 };
    } catch (error: any) {
      console.error("❌ Failed to get high score:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get a player's points balance
   */
  /**
   * Get player's current points balance
   * @param playerAddress - Wallet address to check points for
   */
  static async getPoints(
    playerAddress: string
  ): Promise<OperationResult<number>> {
    try {
      if (isMockMode()) {
        // Get points specific to this wallet address
        const pointsKey = `jeteeah_points_${playerAddress}`;
        const points = parseInt(localStorage.getItem(pointsKey) || "0");
        console.log(`🧪 [MOCK] Getting points for ${playerAddress}: ${points}`);
        return { success: true, data: points };
      }

      const query = `
        query GetPoints($playerAddress: String!) {
          points(playerAddress: $playerAddress)
        }
      `;

      const variables = { playerAddress };
      const result = await lineraQueryClient.request<PointsResponse>(
        query,
        variables
      );
      return { success: true, data: result.points || 0 };
    } catch (error: any) {
      console.error("❌ Failed to get points:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Redeem points from player's account
   * @param playerAddress - Wallet address redeeming points
   * @param amount - Number of points to redeem
   */
  static async redeemPoints(
    playerAddress: string,
    amount: number
  ): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(
          `🧪 [MOCK] Redeeming ${amount} points for ${playerAddress}`
        );

        // Deduct points from wallet-specific storage
        const pointsKey = `jeteeah_points_${playerAddress}`;
        const currentPoints = parseInt(localStorage.getItem(pointsKey) || "0");

        if (currentPoints < amount) {
          return { success: false, error: "Insufficient points" };
        }

        const newTotal = currentPoints - amount;
        localStorage.setItem(pointsKey, newTotal.toString());
        console.log(
          `💰 Mock: Redeemed ${amount} points. Remaining: ${newTotal}`
        );

        return {
          success: true,
          transactionId: "mock-tx-redeem",
          data: { remainingPoints: newTotal },
        };
      }

      const mutation = `
        mutation RedeemPoints($playerAddress: String!, $amount: Int!) {
          operation(
            operation: "RedeemPoints",
            playerAddress: $playerAddress,
            amount: $amount
          ) {
            remainingPoints
          }
        }
      `;

      const variables = { playerAddress, amount };
      const result = await lineraClient.request(mutation, variables);
      console.log(`💰 Redeemed ${amount} points for ${playerAddress}`);
      return {
        success: true,
        data: result,
        transactionId: "tx-redeem-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to redeem points:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Add points to a player's account (admin function)
   */
  static async addPoints(amount: number): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(`🧪 [MOCK] Adding ${amount} points`);
        return { success: true, transactionId: "mock-tx-add-points" };
      }

      const mutation = `
        mutation {
          operation(operation: {
            AddPoints: {
              amount: ${amount}
            }
          })
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log(`➕ Added ${amount} points`);
      return {
        success: true,
        data: result,
        transactionId: "tx-add-points-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to add points:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Set game board parameters (width, height)
   */
  static async setGameParameters(
    width: number,
    height: number
  ): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(`🧪 [MOCK] Setting game parameters: ${width}x${height}`);
        return { success: true, transactionId: "mock-tx-params" };
      }

      const mutation = `
        mutation {
          operation(operation: {
            SetGameParameters: {
              width: ${width}
              height: ${height}
            }
          })
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log(`⚙️ Game parameters set: ${width}x${height}`);
      return {
        success: true,
        data: result,
        transactionId: "tx-params-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to set game parameters:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Update food spawn rate
   */
  static async updateFoodSpawnRate(rate: number): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log(`🧪 [MOCK] Updating food spawn rate: ${rate}`);
        return { success: true, transactionId: "mock-tx-spawn-rate" };
      }

      const mutation = `
        mutation {
          operation(operation: {
            UpdateFoodSpawnRate: {
              rate: ${rate}
            }
          })
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log(`🍎 Food spawn rate updated: ${rate}`);
      return {
        success: true,
        data: result,
        transactionId: "tx-spawn-rate-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to update spawn rate:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset the leaderboard (admin function)
   */
  static async resetLeaderboard(): Promise<OperationResult> {
    try {
      if (isMockMode()) {
        console.log("🧪 [MOCK] Resetting leaderboard");
        return { success: true, transactionId: "mock-tx-reset-lb" };
      }

      const mutation = `
        mutation {
          operation(operation: "ResetLeaderboard")
        }
      `;

      const result = await lineraClient.request(mutation);
      console.log("🗑️ Leaderboard reset");
      return {
        success: true,
        data: result,
        transactionId: "tx-reset-lb-" + Date.now(),
      };
    } catch (error: any) {
      console.error("❌ Failed to reset leaderboard:", error);
      return { success: false, error: error.message };
    }
  }
}

// Export convenience functions
export const {
  startGame,
  moveSnake,
  pauseGame,
  resumeGame,
  endGame,
  resetGame,
  eatFood,
  getGameState,
  getHighScore,
  getPoints,
  redeemPoints,
  addPoints,
  setGameParameters,
  updateFoodSpawnRate,
  resetLeaderboard,
} = SnakeContract;
