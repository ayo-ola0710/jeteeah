/**
 * Linera GraphQL Client
 * Handles communication with the Linera blockchain node
 */

import { GraphQLClient } from 'graphql-request';
import type { BlockchainConfig } from './types';

// Load configuration from environment variables
const config: BlockchainConfig = {
  endpoint: process.env.NEXT_PUBLIC_LINERA_ENDPOINT || 'http://localhost:8080',
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '',
  appId: process.env.NEXT_PUBLIC_APP_ID || '',
  enableMockWallet: process.env.NEXT_PUBLIC_WALLET_MOCK === 'true',
};

// Validate configuration
if (!config.chainId || !config.appId) {
  console.warn('⚠️ Linera blockchain configuration incomplete. Check environment variables.');
  console.warn('Current endpoint:', config.endpoint);
  console.warn('Mock wallet enabled:', config.enableMockWallet);
}

// Construct the GraphQL endpoint URL
const graphqlEndpoint = `${config.endpoint}/chains/${config.chainId}/applications/${config.appId}`;

// Create GraphQL client instance
export const lineraClient = new GraphQLClient(graphqlEndpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alternative client for queries
export const lineraQueryClient = new GraphQLClient(graphqlEndpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export configuration for use in other modules
export { config as blockchainConfig };

// Helper function to check if blockchain is available
export async function checkBlockchainConnection(): Promise<boolean> {
  try {
    const query = `
      query {
        value
      }
    `;
    await lineraQueryClient.request(query);
    console.log('✅ Linera blockchain connection established');
    return true;
  } catch (error) {
    console.error('❌ Failed to connect to Linera blockchain:', error);
    return false;
  }
}

// Helper function to build GraphQL endpoint for custom queries
export function getGraphQLEndpoint(): string {
  return graphqlEndpoint;
}

// Helper to check if we're in mock mode
export function isMockMode(): boolean {
  return config.enableMockWallet;
}

// Log initialization
if (typeof window !== 'undefined') {
  console.log('🔗 Linera Client initialized');
  console.log('📍 Endpoint:', config.endpoint);
  console.log('⛓️  Chain ID:', config.chainId.slice(0, 8) + '...');
  console.log('📱 App ID:', config.appId.slice(0, 8) + '...');
  console.log('🧪 Mock Mode:', config.enableMockWallet ? 'Enabled' : 'Disabled');
}
