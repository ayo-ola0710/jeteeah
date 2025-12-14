/**
 * Blockchain Connection Status Component
 * Displays connection health, network info, and troubleshooting
 */

'use client';

import React, { useState, useEffect } from 'react';
import { blockchainConfig } from '@/lib/linera-client';
import { useLineraWallet } from '@/hooks/useLineraWallet';

interface ConnectionStatusProps {
  className?: string;
}

export function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const { wallet } = useLineraWallet();
  const [isTestnet, setIsTestnet] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    // Detect network from endpoint
    const ep = blockchainConfig.endpoint || '';
    setEndpoint(ep);
    setIsTestnet(ep.includes('testnet.linera.io'));
    setIsMockMode(blockchainConfig.enableMockWallet);
  }, []);

  const getStatusColor = () => {
    if (!wallet.connected) return 'text-red-500';
    if (isMockMode) return 'text-yellow-500';
    if (isTestnet) return 'text-green-500';
    return 'text-blue-500';
  };

  const getStatusIcon = () => {
    if (!wallet.connected) return '⚠️';
    if (isMockMode) return '🧪';
    if (isTestnet) return '🌐';
    return '🟢';
  };

  const getStatusText = () => {
    if (!wallet.connected) return 'Not Connected';
    if (isMockMode) return 'Mock Mode (Local)';
    if (isTestnet) return 'Testnet Conway';
    return 'Connected';
  };

  const getNetworkName = () => {
    if (endpoint.includes('testnet')) return 'Testnet Conway';
    if (endpoint.includes('localhost')) return 'Local Network';
    if (endpoint.includes('mainnet')) return 'Mainnet';
    return 'Unknown Network';
  };

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span className={`font-medium ${getStatusColor()}`}>
        {getStatusIcon()} {getStatusText()}
      </span>
      
      {wallet.connected && (
        <>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600 dark:text-gray-400">
            {getNetworkName()}
          </span>
        </>
      )}
    </div>
  );
}

/**
 * Network Validator Component
 * Shows warnings if configuration issues are detected
 */
export function NetworkValidator() {
  const [warnings, setWarnings] = useState<string[]>([]);
  const [endpoint, setEndpoint] = useState('');
  const { wallet } = useLineraWallet();

  useEffect(() => {
    const issues: string[] = [];
    const ep = blockchainConfig.endpoint || '';
    setEndpoint(ep);

    // Check for common misconfigurations
    if (!blockchainConfig.chainId) {
      issues.push('Chain ID not configured');
    }

    if (!blockchainConfig.appId) {
      issues.push('Application ID not configured');
    }

    if (ep.includes('localhost') && !blockchainConfig.enableMockWallet) {
      issues.push('Connecting to localhost but mock mode is disabled');
    }

    if (ep.includes('testnet.linera.io') && blockchainConfig.enableMockWallet) {
      issues.push('Mock mode enabled but connecting to testnet - wallet connection may fail');
    }

    if (!ep) {
      issues.push('No endpoint configured');
    }

    // Check if Linera wallet extension is needed but not installed
    if (!blockchainConfig.enableMockWallet && typeof window !== 'undefined' && !window.linera) {
      issues.push('Linera wallet extension not detected');
    }

    setWarnings(issues);
  }, [wallet]);

  if (warnings.length === 0) return null;

  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2">
        <span className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</span>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            Configuration Issues Detected
          </h3>
          <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start gap-2">
                <span>•</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
          
          {warnings.some(w => w.includes('Chain ID') || w.includes('Application ID')) && (
            <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
              <p className="font-medium mb-1">To fix:</p>
              <ol className="list-decimal list-inside space-y-1 text-yellow-800 dark:text-yellow-200">
                <li>Deploy your contract: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">npm run deploy:testnet</code></li>
                <li>Update <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">.env.local</code> with Chain ID and App ID</li>
                <li>Restart development server: <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">npm run dev</code></li>
              </ol>
            </div>
          )}

          {warnings.some(w => w.includes('wallet extension')) && (
            <div className="mt-3 p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded text-sm">
              <p className="font-medium mb-1">Wallet Extension Required:</p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Install the Linera wallet browser extension to connect to the blockchain.
              </p>
              <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                Or enable mock mode for testing: Set <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">NEXT_PUBLIC_WALLET_MOCK=true</code>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Testnet Connection Badge
 * Shows a prominent badge when connected to testnet
 */
export function TestnetBadge() {
  const [isTestnet, setIsTestnet] = useState(false);
  const { wallet } = useLineraWallet();

  useEffect(() => {
    const ep = blockchainConfig.endpoint || '';
    setIsTestnet(ep.includes('testnet.linera.io') && wallet.connected);
  }, [wallet.connected]);

  if (!isTestnet) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-pulse">
        <span className="font-bold">🌐 TESTNET</span>
        <span className="text-sm">Conway</span>
      </div>
    </div>
  );
}
