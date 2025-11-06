"use client";

import { Button } from "@/components/ui/button";
import { BsArrowLeft } from "react-icons/bs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLineraWallet } from "@/hooks/useLineraWallet";
import { useGame } from "../contexts/GameContext";
import { useState } from "react";

const Wallet = () => {
  const router = useRouter();
  const wallet = useLineraWallet();
  const { totalPoints, isBlockchainMode, setBlockchainMode } = useGame();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleConnect = async (walletType: string) => {
    setSelectedWallet(walletType);
    await wallet.connect();

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
    wallet.disconnect();
    setSelectedWallet(null);
  };

  return (
    <div className="bg-[#0F172A] h-full">
      <div className="flex gap-23 items-center pt-7">
        <BsArrowLeft
          className="w-6 h-6 text-white ml-8 cursor-pointer"
          onClick={() => router.back()}
        />
        <p className="font-space text-xl font-medium">Wallet</p>
      </div>
      <div className="font-raleway grid grid-cols-2 mx-10 gap-5 mt-5 mb-5">
        <div
          onClick={() => handleConnect("metamask")}
          className={`bg-white w-35 text-black flex flex-col justify-center items-center p-2 rounded-md space-y-2 cursor-pointer hover:scale-105 transition-transform ${
            selectedWallet === "metamask" ? "ring-2 ring-[#FF1414]" : ""
          }`}
        >
          <div className="bg-[#F6851B1A] w-15 p-5 rounded-full">
            <Image src="/images/meta.png" alt="Image" width={50} height={50} />
          </div>
          <div className="text-center">
            <p className="text-xl">MetaMask</p>
            <p className="text-sm text-[#9CA3AF]">Popular</p>
          </div>
        </div>
        <div
          onClick={() => handleConnect("walletconnect")}
          className={`bg-white w-35 text-black flex flex-col justify-center items-center p-2 rounded-md space-y-2 cursor-pointer hover:scale-105 transition-transform ${
            selectedWallet === "walletconnect" ? "ring-2 ring-[#FF1414]" : ""
          }`}
        >
          <div className="bg-[#3B99FC1A] w-15 p-5 rounded-full">
            <Image src="/images/chain.png" alt="Image" width={50} height={50} />
          </div>
          <div className="text-center">
            <p className="text-[16px]">Wallet Connect</p>
            <p className="text-sm text-[#9CA3AF]">Mobile Friendly</p>
          </div>
        </div>
        <div
          onClick={() => handleConnect("coinbase")}
          className={`bg-white w-35 text-black flex flex-col justify-center items-center p-2 rounded-md space-y-2 cursor-pointer hover:scale-105 transition-transform ${
            selectedWallet === "coinbase" ? "ring-2 ring-[#FF1414]" : ""
          }`}
        >
          <div className="bg-[#0052FF1A] w-15 p-5 rounded-full">
            <Image src="/images/coin.png" alt="Image" width={50} height={50} />
          </div>
          <div className="text-center">
            <p className="text-xl">Coinbase</p>
            <p className="text-sm text-[#9CA3AF]">Easy to use</p>
          </div>
        </div>
        <div
          onClick={() => handleConnect("guest")}
          className={`bg-white w-35 text-black flex flex-col justify-center items-center p-2 rounded-md space-y-2 cursor-pointer hover:scale-105 transition-transform ${
            selectedWallet === "guest" ? "ring-2 ring-[#FF1414]" : ""
          }`}
        >
          <div className="bg-[#0052FF1A] w-15 p-5 rounded-full">
            <Image
              src="/images/avatar.png"
              alt="Image"
              width={50}
              height={50}
            />
          </div>
          <div className="text-center">
            <p className="text-xl">Guest Mode</p>
            <p className="text-sm text-[#9CA3AF]">Social Login</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center gap-4 -mt-10">
        {wallet.wallet.connected ? (
          <>
            <div className="flex gap-4 pt-10">
              <div className="bg-[#1B2A4E99] px-6 py-3 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Connected Address</p>
                <p className="font-mono text-sm">
                  {wallet.wallet.address?.slice(0, 6)}...
                  {wallet.wallet.address?.slice(-4)}
                </p>
                {wallet.isMockMode && (
                  <p className="text-xs text-yellow-400 mt-1">Mock Mode</p>
                )}
              </div>
              <div className="bg-[#1B2A4E99] px-6 py-3 rounded-lg text-center">
                <p className="text-sm text-gray-400 mb-1">Points Balance</p>
                <p className="text-2xl text-[#FDC200]">
                  {totalPoints.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={handleDisconnect}
              className="py-6.5 bg-gray-600 flex gap-5 w-80 hover:bg-gray-700 cursor-pointer hover:scale-105"
            >
              Disconnect Wallet
            </Button>
          </>
        ) : (
          <div className="text-center pt-20">
            <p className="text-sm text-gray-400 mb-4">
              {wallet.isConnecting
                ? "Connecting..."
                : "Select a wallet above to connect"}
            </p>
            {wallet.error && (
              <p className="text-sm text-red-400 mb-4">{wallet.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;
