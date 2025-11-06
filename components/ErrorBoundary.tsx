/**
 * Error Boundary Component
 * Catches React errors and provides graceful fallback UI
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-4">
          <div className="bg-[#1B2A4E99] rounded-lg p-8 max-w-md w-full border border-red-500/30">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold mb-4 text-red-400">Something went wrong</h2>
              <p className="text-gray-400 mb-6">
                An unexpected error occurred. Please try refreshing the page.
              </p>
              {this.state.error && (
                <details className="text-left text-sm bg-gray-900/50 p-4 rounded mb-4">
                  <summary className="cursor-pointer text-gray-300 mb-2">
                    Error details
                  </summary>
                  <pre className="text-red-400 overflow-auto max-h-40">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-[#FF1414] hover:bg-[#f76f6f] text-white px-6 py-3 rounded-lg font-bold transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Blockchain Error Boundary
 * Specialized error boundary for blockchain operations
 */
export class BlockchainErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Blockchain error:', error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 m-4">
          <div className="flex items-start gap-4">
            <div className="text-3xl">🔗</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-2">
                Blockchain Connection Error
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Unable to connect to the blockchain. You can continue playing in offline mode,
                and your progress will sync when connection is restored.
              </p>
              {this.state.error && (
                <p className="text-xs text-gray-500 mb-4">
                  Error: {this.state.error.message}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={this.handleRetry}
                  className="bg-[#FF1414] hover:bg-[#f76f6f] text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Retry Connection
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundaryComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
