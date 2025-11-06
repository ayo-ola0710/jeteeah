/**
 * Linera Wallet Hook
 * Manages wallet connection, authentication, and state
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { WalletState } from '@/lib/types';
import { blockchainConfig } from '@/lib/linera-client';
import { generateMockAddress, storage } from '@/utils/blockchain-utils';

// Extend window type for Linera wallet
declare global {
  interface Window {
    linera?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
    };
  }
}

const STORAGE_KEY = 'jeteeah_wallet_state';
const MOCK_ADDRESS_KEY = 'jeteeah_mock_address';

/**
 * Custom hook for Linera wallet connection and management
 */
export function useLineraWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    chainId: null,
    balance: undefined,
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Connect to Linera wallet
   */
  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Check if we're in mock mode
      if (blockchainConfig.enableMockWallet) {
        console.log('🧪 [MOCK] Connecting to mock wallet...');
        
        // Get or create mock address
        let mockAddress = storage.get(MOCK_ADDRESS_KEY);
        if (!mockAddress) {
          mockAddress = generateMockAddress();
          storage.set(MOCK_ADDRESS_KEY, mockAddress);
        }

        const mockWalletState: WalletState = {
          connected: true,
          address: mockAddress,
          chainId: blockchainConfig.chainId,
          balance: 1000, // Mock balance
        };

        setWallet(mockWalletState);
        storage.set(STORAGE_KEY, mockWalletState);
        console.log('✅ Mock wallet connected:', mockAddress);
        
        return mockWalletState;
      }

      // Check if Linera wallet extension exists
      if (typeof window !== 'undefined' && window.linera) {
        console.log('🔗 Connecting to Linera wallet...');

        // Request account access
        const accounts = await window.linera.request({
          method: 'linera_requestAccounts',
        });

        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found in wallet');
        }

        const address = accounts[0];
        const chainId = blockchainConfig.chainId;

        // Optional: Get balance
        let balance: number | undefined;
        try {
          balance = await window.linera.request({
            method: 'linera_getBalance',
            params: [address],
          });
        } catch (err) {
          console.warn('Could not fetch balance:', err);
        }

        const walletState: WalletState = {
          connected: true,
          address,
          chainId,
          balance,
        };

        setWallet(walletState);
        storage.set(STORAGE_KEY, walletState);
        console.log('✅ Wallet connected:', address);

        return walletState;
      } else {
        // Wallet not found - fall back to mock mode
        console.warn('⚠️ Linera wallet not found, using mock wallet');
        
        let mockAddress = storage.get(MOCK_ADDRESS_KEY);
        if (!mockAddress) {
          mockAddress = generateMockAddress();
          storage.set(MOCK_ADDRESS_KEY, mockAddress);
        }

        const mockWalletState: WalletState = {
          connected: true,
          address: mockAddress,
          chainId: blockchainConfig.chainId,
          balance: 1000,
        };

        setWallet(mockWalletState);
        storage.set(STORAGE_KEY, mockWalletState);
        
        return mockWalletState;
      }
    } catch (err: any) {
      console.error('❌ Failed to connect wallet:', err);
      setError(err.message || 'Failed to connect wallet');
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Disconnect wallet
   */
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting wallet...');
    
    const disconnectedState: WalletState = {
      connected: false,
      address: null,
      chainId: null,
      balance: undefined,
    };

    setWallet(disconnectedState);
    storage.remove(STORAGE_KEY);
    setError(null);
    
    console.log('✅ Wallet disconnected');
  }, []);

  /**
   * Switch to a different account
   */
  const switchAccount = useCallback(async (newAddress: string) => {
    if (!wallet.connected) {
      throw new Error('Wallet not connected');
    }

    setWallet(prev => ({
      ...prev,
      address: newAddress,
    }));

    storage.set(STORAGE_KEY, { ...wallet, address: newAddress });
    console.log('🔄 Switched account to:', newAddress);
  }, [wallet]);

  /**
   * Refresh wallet balance
   */
  const refreshBalance = useCallback(async () => {
    if (!wallet.connected || !wallet.address) return;

    try {
      if (blockchainConfig.enableMockWallet) {
        // Mock balance refresh
        const newBalance = Math.floor(Math.random() * 10000);
        setWallet(prev => ({ ...prev, balance: newBalance }));
        return;
      }

      if (window.linera) {
        const balance = await window.linera.request({
          method: 'linera_getBalance',
          params: [wallet.address],
        });

        setWallet(prev => ({ ...prev, balance }));
      }
    } catch (err) {
      console.error('Failed to refresh balance:', err);
    }
  }, [wallet.connected, wallet.address]);

  /**
   * Auto-connect on mount if previously connected
   */
  useEffect(() => {
    const savedState = storage.get(STORAGE_KEY);
    
    if (savedState && savedState.connected) {
      console.log('🔄 Auto-connecting wallet...');
      connect().catch(err => {
        console.error('Auto-connect failed:', err);
        storage.remove(STORAGE_KEY);
      });
    }
  }, [connect]);

  /**
   * Listen for wallet events (account changes, disconnection)
   */
  useEffect(() => {
    if (typeof window === 'undefined' || !window.linera || blockchainConfig.enableMockWallet) {
      return;
    }

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('👤 Account changed:', accounts[0]);
      
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnect();
      } else {
        // Account switched
        switchAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      console.log('⛓️ Chain changed:', chainId);
      
      if (chainId !== blockchainConfig.chainId) {
        setError(`Please switch to chain: ${blockchainConfig.chainId}`);
      } else {
        setError(null);
      }
    };

    const handleDisconnect = () => {
      console.log('🔌 Wallet disconnected');
      disconnect();
    };

    // Register event listeners
    window.linera.on('accountsChanged', handleAccountsChanged);
    window.linera.on('chainChanged', handleChainChanged);
    window.linera.on('disconnect', handleDisconnect);

    // Cleanup
    return () => {
      if (window.linera) {
        window.linera.removeListener('accountsChanged', handleAccountsChanged);
        window.linera.removeListener('chainChanged', handleChainChanged);
        window.linera.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [disconnect, switchAccount]);

  /**
   * Check if wallet extension is installed
   */
  const isWalletInstalled = useCallback(() => {
    return typeof window !== 'undefined' && !!window.linera;
  }, []);

  return {
    wallet,
    connect,
    disconnect,
    switchAccount,
    refreshBalance,
    isConnecting,
    error,
    isWalletInstalled,
    isMockMode: blockchainConfig.enableMockWallet,
  };
}
