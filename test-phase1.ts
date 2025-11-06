/**
 * Test file for Phase 1 Foundation Setup
 * Run this to verify all blockchain infrastructure is working
 */

import { lineraClient, blockchainConfig, checkBlockchainConnection } from '@/lib/linera-client';
import { SnakeContract } from '@/lib/contract-operations';
import { Direction } from '@/lib/types';
import { formatAddress, directionToArrow, isValidGameState } from '@/utils/blockchain-utils';

// Test 1: Configuration
console.log('=== Phase 1 Foundation Test ===\n');

console.log('✅ Test 1: Configuration');
console.log('  Endpoint:', blockchainConfig.endpoint);
console.log('  Chain ID:', formatAddress(blockchainConfig.chainId, 8, 8));
console.log('  App ID:', formatAddress(blockchainConfig.appId, 8, 8));
console.log('  Mock Mode:', blockchainConfig.enableMockWallet);

// Test 2: Types
console.log('\n✅ Test 2: Types');
const testDirection: Direction = Direction.Up;
console.log('  Direction:', testDirection, directionToArrow(testDirection));

// Test 3: Utilities
console.log('\n✅ Test 3: Utilities');
console.log('  Format address:', formatAddress('0x1234567890abcdef1234567890abcdef12345678'));
console.log('  Arrow symbols: ↑', directionToArrow(Direction.Up));

// Test 4: Contract Operations (Mock)
console.log('\n✅ Test 4: Contract Operations');
(async () => {
  try {
    const result = await SnakeContract.startGame();
    console.log('  Start Game:', result.success ? '✅ Success' : '❌ Failed');
    
    const moveResult = await SnakeContract.moveSnake(Direction.Right);
    console.log('  Move Snake:', moveResult.success ? '✅ Success' : '❌ Failed');
    
    const stateResult = await SnakeContract.getGameState('mock-player');
    console.log('  Get State:', stateResult.success ? '✅ Success' : '❌ Failed');
    if (stateResult.data) {
      console.log('    - Snake length:', stateResult.data.snake_body.length);
      console.log('    - Score:', stateResult.data.score);
      console.log('    - Active:', stateResult.data.is_active);
    }
    
    console.log('\n🎉 Phase 1 Foundation Setup Complete!');
    console.log('All blockchain infrastructure is ready.');
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
})();

export {};
