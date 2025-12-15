"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { FaPlay, FaUsers, FaTrophy } from "react-icons/fa";
import { MdOutlineSwipe } from "react-icons/md";
import { RiProhibited2Line } from "react-icons/ri";

const page = () => {
  const router = useRouter();
  return (
    <div className="bg-[#0F172A] min-h-screen pb-10 flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center pt-12 pb-8">
        <p className="font-space text-6xl font-bold tracking-tight mb-3">
          JETEEAH
        </p>
        <p className="text-gray-400 text-base mt-1">Modern Snake Game</p>
        <div className="mt-4 px-4 py-1.5 bg-linear-to-r from-purple-600 to-blue-600 rounded-full shadow-lg shadow-purple-500/30">
          <p className="text-xs font-semibold">⛓️ Web3 Powered</p>
        </div>
      </div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        {/* Game Mode Selection */}
        <div className="flex flex-col justify-center items-center space-y-4 mb-12">
          <Button
            className="py-7 w-82 rounded-full bg-linear-to-r from-[#FF1414] to-[#CC0000] flex gap-3 hover:scale-105 transition-all shadow-lg shadow-red-500/30 border-none"
            onClick={() => router.push("/start")}
          >
            <FaPlay className="text-xl" />
            <span className="text-xl font-semibold">Single Player</span>
          </Button>
          <Button
            className="py-7 w-82 rounded-full bg-linear-to-r from-[#FFFFFF] to-[#FFFFFF] flex gap-3 hover:scale-105 transition-all shadow-md shadow-white/20 border-none text-black"
            onClick={() => router.push("/multiplayer")}
          >
            <FaUsers className="text-xl" />
            <span className="text-xl font-semibold">Multiplayer</span>
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-md mx-5">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <FaTrophy className="text-2xl text-yellow-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">High Scores</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <FaUsers className="text-2xl text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-gray-400">Multiplayer Mode</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
            <div className="text-2xl mx-auto mb-2">⛓️</div>
            <p className="text-xs text-gray-400">Blockchain Rewards</p>
          </div>
        </div>
      </div>

      <footer className="flex flex-col items-center pb-2 mt-10 text-xs mx-8">
        <div className="w-full rounded-[20px] bg-white/5 p-2 text-center">
          <h3 className="font-bold ">How to Play</h3>
          <div className="mt-3 grid grid-cols-3 gap-2 text-white">
            <div className="flex flex-col items-center gap-1">
              <span className="border border-white rounded-full p-2">
                <MdOutlineSwipe className="text-lg" />
              </span>
              <p className="text-xs">Swipe</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="border border-white rounded-full p-4"></span>
              <p className="text-xs">Eat</p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <RiProhibited2Line className="text-3xl" />
              <p className="text-xs">Avoid</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default page;
