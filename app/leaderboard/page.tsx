"use client";

import { BsArrowLeft } from "react-icons/bs";
import { useRouter } from "next/navigation";
import Leaderboard from "@/components/Leaderboard";
import { useLineraWallet } from "@/hooks/useLineraWallet";

const LeaderboardPage = () => {
  const router = useRouter();
  const wallet = useLineraWallet();

  return (
    <div className="bg-[#0F172A] min-h-screen overflow-y-scroll pb-10">
      <div className="flex gap-23 items-center pt-7 mb-5">
        <BsArrowLeft
          className="w-6 h-6 text-white ml-8 cursor-pointer hover:scale-110 transition-transform"
          onClick={() => router.back()}
        />
        <p className="font-space text-xl font-medium">Leaderboard</p>
      </div>

      {!wallet.wallet.connected ? (
        <div className="mx-5 mt-20 text-center">
          <p className="text-gray-400 mb-4">Connect your wallet to view the leaderboard</p>
          <button
            onClick={() => wallet.connect()}
            className="bg-[#FF1414] text-white px-6 py-3 rounded-lg hover:bg-[#f76f6f] transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <div className="mx-5">
          <Leaderboard />
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
