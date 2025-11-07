"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdReplay } from "react-icons/md";
import { IoHomeOutline } from "react-icons/io5";
import { HiOutlineTrophy } from "react-icons/hi2";
import { LuCoins } from "react-icons/lu";
import Image from "next/image";
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
  return (
    <div className="bg-[#0F172A] h-screen">
      <div className="font-space text-center pt-5 pb-5">
        <p>Game Over</p>
        <div className="flex justify-center pt-2 gap-3">
          <p className="text-[#FDC200]">New High Score </p>
          <Image src="/images/ball.png" alt="Image" width={40} height={10} />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center space-y-5 pb-15">
        <Card className="bg-[#1B2A4E99] border-none font-raleway w-85 text-white  text-center">
          <CardHeader>
            <CardTitle className="text-sm">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl -mt-7">{score}</p>
          </CardContent>
        </Card>
        <div className="flex gap-12">
          <Card className="bg-[#1B2A4E99] border-none font-raleway w-35 text-white  text-center">
            <CardHeader>
              <HiOutlineTrophy className="w-6 h-6 text-[#FDC200] ml-8 " />
              <CardTitle className="text-sm">High Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl -mt-7">{highScore}</p>
            </CardContent>
          </Card>
          <Card className="bg-[#1B2A4E99] border-none font-raleway w-35 text-white  text-center">
            <CardHeader>
              <LuCoins className="w-6 h-6 text-[#FDC200] ml-8 " />
              <CardTitle className="text-sm">
                {isBlockchainMode ? "Points Earned" : "Points"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isBlockchainMode && wallet.connected ? (
                <>
                  <p className="text-xl -mt-7 text-[#FDC200]">
                    +{pointsEarned}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Total: {totalPoints.toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="text-sm -mt-7 text-gray-400">Connect wallet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="flex flex-col gap-5 justify-center items-center -mt-5">
        <Button
          className="py-6.5 bg-[#FF1414] flex gap-5 w-80 hover:bg-[#f76f6f] cursor-pointer hover:scale-105"
          onClick={() => {
            resetScore();
            router.push("/game");
          }}
        >
          <MdReplay />
          Play Again
        </Button>
        <Button
          className=" py-6.5 bg-white text-[#FF1414] flex gap-3 w-80 cursor-pointer hover:scale-105 hover:bg-gray-200"
          onClick={() => router.push("/")}
        >
          <IoHomeOutline className="text-black" />
          Main Menu
        </Button>
      </div>
    </div>
  );
};

export default Gameover;
