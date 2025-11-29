"use client";

import { Button } from "@/components/ui/button";
import { BsArrowLeft } from "react-icons/bs";
import { FiCopy, FiCheck } from "react-icons/fi";
import { LuCoins } from "react-icons/lu";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLineraWallet } from "@/hooks/useLineraWallet";
import { useGame } from "../contexts/GameContext";
import { useState } from "react";

const Wallet = () => {
  const router = useRouter();
  const { wallet, connect, disconnect, isMockMode, isConnecting, error } = useLineraWallet();
  const { totalPoints, isBlockchainMode, setBlockchainMode } = useGame();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    await connect();

    // Enable blockchain mode after connection
    if (!isBlockchainMode) {
      setBlockchainMode(true);
    }

    // Navigate back or to start page
    setTimeout(() => {
      router.push("/start");
    }, 1000);
  };

  const handleDisconnect = async () => {
    disconnect();
    setSelectedWallet(null);
  };

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-[#0F172A] h-screen overflow-y-auto pb-10"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 #1F2937'
      }}
    >
      {/* Header */}
      <div className="flex gap-15 items-center pt-5 border-b border-[#1B2A4E] pb-3">
        <BsArrowLeft
          className="w-6 h-6 text-white ml-8 cursor-pointer hover:text-gray-300 transition-colors"
          onClick={() => router.back()}
        />
        <p className="font-space text-lg font-medium">Connect Wallet</p>
      </div>

      {/* Wallet Options Grid */}
      <div className="px-6 mt-8">
        <p className="text-sm text-gray-400 mb-4 text-center">
          Choose your preferred wallet to connect
        </p>
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {/* MetaMask */}
          <div
            onClick={() => handleConnect("metamask")}
            className={`bg-white text-black flex flex-col items-center p-5 rounded-xl space-y-3 cursor-pointer hover:scale-105 transition-all shadow-md ${
              selectedWallet === "metamask" ? "ring-2 ring-[#FF1414]" : ""
            }`}
          >
            <div className="bg-[#F6851B1A] w-16 h-16 flex items-center justify-center rounded-full">
              <Image src="/images/meta.png" alt="MetaMask" width={40} height={40} />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">MetaMask</p>
              <p className="text-xs text-gray-500">Popular</p>
            </div>
          </div>

          {/* WalletConnect */}
          <div
            onClick={() => handleConnect("walletconnect")}
            className={`bg-white text-black flex flex-col items-center p-5 rounded-xl space-y-3 cursor-pointer hover:scale-105 transition-all shadow-md ${
              selectedWallet === "walletconnect" ? "ring-2 ring-[#FF1414]" : ""
            }`}
          >
            <div className="bg-[#3B99FC1A] w-16 h-16 flex items-center justify-center rounded-full">
              <Image src="/images/chain.png" alt="WalletConnect" width={40} height={40} />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">WalletConnect</p>
              <p className="text-xs text-gray-500">Mobile Friendly</p>
            </div>
          </div>

          {/* Coinbase */}
          <div
            onClick={() => handleConnect("coinbase")}
            className={`bg-white text-black flex flex-col items-center p-5 rounded-xl space-y-3 cursor-pointer hover:scale-105 transition-all shadow-md ${
              selectedWallet === "coinbase" ? "ring-2 ring-[#FF1414]" : ""
            }`}
          >
            <div className="bg-[#0052FF1A] w-16 h-16 flex items-center justify-center rounded-full">
              <Image src="/images/coin.png" alt="Coinbase" width={40} height={40} />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">Coinbase</p>
              <p className="text-xs text-gray-500">Easy to use</p>
            </div>
          </div>

          {/* Guest Mode */}
          <div
            onClick={() => handleConnect("guest")}
            className={`bg-white text-black flex flex-col items-center p-5 rounded-xl space-y-3 cursor-pointer hover:scale-105 transition-all shadow-md ${
              selectedWallet === "guest" ? "ring-2 ring-[#FF1414]" : ""
            }`}
          >
            <div className="bg-[#6B7280] w-16 h-16 flex items-center justify-center rounded-full">
              <Image src="/images/avatar.png" alt="Guest" width={40} height={40} />
            </div>
            <div className="text-center">
              <p className="text-base font-semibold">Guest Mode</p>
              <p className="text-xs text-gray-500">Try it out</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connected State / Status */}
      <div className="flex justify-center flex-col items-center gap-4 mt-10 px-6">
        {wallet.connected ? (
          <>
            {/* Connection Success Badge */}
            <div className="bg-green-600/20 border border-green-500 rounded-full px-4 py-2 mb-2">
              <p className="text-green-400 text-sm font-semibold">✓ Wallet Connected</p>
            </div>

            {/* Wallet Info Cards */}
            <div className="flex flex-col gap-3 w-full max-w-md">
              {/* Address Card */}
              <div className="bg-[#1B2A4E99] px-5 py-4 rounded-xl backdrop-blur-sm border border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Connected Address</p>
                <div className="flex items-center justify-between">
                  <p className="font-mono text-sm">
                    {wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}
                  </p>
                  <button
                    onClick={copyAddress}
                    className="ml-2 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <FiCheck className="w-4 h-4 text-green-400" />
                    ) : (
                      <FiCopy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {isMockMode && (
                  <p className="text-xs text-yellow-400 mt-2 bg-yellow-400/10 px-2 py-1 rounded">
                    🧪 Mock Mode - Development Only
                  </p>
                )}
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnect}
              className="mt-4 py-6 bg-gradient-to-r from-gray-600 to-gray-700 flex gap-2 w-full max-w-md hover:from-gray-500 hover:to-gray-600 hover:scale-105 transition-all shadow-lg rounded-full"
            >
              <span className="text-base font-semibold">Disconnect Wallet</span>
            </Button>
          </>
        ) : (
          <div className="text-center pt-10">
            {isConnecting ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-[#FF1414] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-400">Connecting to wallet...</p>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Select a wallet above to get started
              </p>
            )}
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500 rounded-lg px-4 py-3 max-w-md">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
