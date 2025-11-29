"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdReplay } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineTrophy } from "react-icons/hi2";
import { LuCoins } from "react-icons/lu";
import { FaTrophy } from "react-icons/fa";
import { useGame } from "../contexts/GameContext";
import { useRouter } from "next/navigation";
import { useLineraWallet } from "@/hooks/useLineraWallet";

const Gameover = () => {
  const { score, highScore, resetScore, isBlockchainMode, totalPoints } =
    useGame();
  const { wallet } = useLineraWallet();
  const router = useRouter();

  // Calculate points earned this game (score in blockchain mode)
  const pointsEarned = isBlockchainMode && wallet.connected ? score : 0;
  const isNewHighScore = score === highScore && score > 0;

  return (
    <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header with conditional high score celebration */}
      <div className="font-space text-center mb-8">
        <p className="text-4xl font-bold mb-3">Game Over</p>
        {isNewHighScore && (
          <div className="flex justify-center items-center gap-2 animate-pulse">
            <FaTrophy className="text-[#FDC200] text-2xl" />
            <p className="text-[#FDC200] text-xl font-semibold">New High Score!</p>
            <FaTrophy className="text-[#FDC200] text-2xl" />
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="flex flex-col items-center space-y-4 mb-8 w-full max-w-md">
        {/* Main Score Card */}
        <Card className="bg-gradient-to-br from-[#1B2A4E] to-[#0F172A] border-2 border-[#FF1414] font-raleway w-full text-white text-center shadow-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-400 font-normal">Your Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <p className="text-5xl font-bold text-white">{score}</p>
          </CardContent>
        </Card>

        {/* High Score & Points Cards */}
        <div className="flex gap-4 w-full">
          <Card className="bg-[#1B2A4E99] border-none font-raleway flex-1 text-white text-center rounded-xl backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-2">
                <HiOutlineTrophy className="w-8 h-8 text-[#FDC200]" />
              </div>
              <CardTitle className="text-xs text-gray-400 font-normal">High Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <p className="text-2xl font-bold">{highScore}</p>
            </CardContent>
          </Card>

          <Card className="bg-[#1B2A4E99] border-none font-raleway flex-1 text-white text-center rounded-xl backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-2">
                <LuCoins className="w-8 h-8 text-[#FF1414]" />
              </div>
              <CardTitle className="text-xs text-gray-400 font-normal">
                {isBlockchainMode ? "Earned" : "Points"}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              {isBlockchainMode && wallet.connected ? (
                <>
                  <p className="text-2xl font-bold text-[#FDC200]">
                    +{pointsEarned}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Total: {totalPoints.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Connect wallet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <Button
          className="py-7 bg-gradient-to-r from-[#FF1414] to-[#CC0000] flex gap-3 w-full hover:scale-105 transition-all shadow-lg shadow-red-500/30 border-none rounded-full"
          onClick={() => {
            resetScore();
            router.push("/game");
          }}
        >
          <MdReplay className="text-xl" />
          <span className="text-lg font-semibold">Play Again</span>
        </Button>
        <Button
          className="py-7 bg-white text-[#FF1414] flex gap-3 w-full hover:scale-105 hover:bg-gray-100 transition-all shadow-md rounded-full"
          onClick={() => router.push("/")}
        >
          <IoHomeOutline className="text-black text-xl" />
          <span className="text-lg font-semibold">Main Menu</span>
        </Button>
      </div>
    </div>
  );
};

export default Gameover;
