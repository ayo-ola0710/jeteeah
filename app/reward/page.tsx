"use client";

import { BsArrowLeft } from "react-icons/bs";
import { LuCoins } from "react-icons/lu";
import { HiOutlineGift } from "react-icons/hi";
import { TbTargetArrow } from "react-icons/tb";
import { FaBolt } from "react-icons/fa6";
import { HiOutlineTrophy } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import AchievementCard from "@/components/AchievementCard";
import PointsDashboard from "@/components/PointsDashboard";
import { useGame } from "../contexts/GameContext";
import { useLineraWallet } from "@/hooks/useLineraWallet";

const Page = () => {
  const router = useRouter();
  const { totalPoints, highScore, isBlockchainMode } = useGame();
  const { wallet } = useLineraWallet();

  // Define achievements based on high score
  const achievements = [
    {
      icon: (
        <TbTargetArrow className="w-8 h-8 text-[#FF1414] bg-white p-1 rounded-full" />
      ),
      title: "First Step",
      description: "Score 50 Points in a single Game",
      reward: 50,
      requirement: 50,
      isCompleted: highScore >= 50,
    },
    {
      icon: (
        <FaBolt className="w-8 h-8 text-[#FF1414] bg-white p-1 rounded-full" />
      ),
      title: "Century",
      description: "Score 100 Points in a single Game",
      reward: 100,
      requirement: 100,
      isCompleted: highScore >= 100,
    },
    {
      icon: (
        <HiOutlineTrophy className="w-8 h-8 text-[#FF1414] bg-white p-1 rounded-full" />
      ),
      title: "Double Century",
      description: "Score 200 Points in a single Game",
      reward: 200,
      requirement: 200,
      isCompleted: highScore >= 200,
    },
    {
      icon: (
        <HiOutlineTrophy className="w-8 h-8 text-[#FDC200] bg-white p-1 rounded-full" />
      ),
      title: "Triple Century",
      description: "Score 300 Points in a single Game",
      reward: 300,
      requirement: 300,
      isCompleted: highScore >= 300,
    },
    {
      icon: (
        <HiOutlineTrophy className="w-8 h-8 text-[#8B5CF6] bg-white p-1 rounded-full" />
      ),
      title: "Half Millennium",
      description: "Score 500 Points in a single Game",
      reward: 500,
      requirement: 500,
      isCompleted: highScore >= 500,
    },
    {
      icon: (
        <HiOutlineTrophy className="w-8 h-8 text-[#FF1414] bg-white p-1 rounded-full" />
      ),
      title: "Legendary",
      description: "Score 1000 Points in a single Game",
      reward: 1000,
      requirement: 1000,
      isCompleted: highScore >= 1000,
    },
  ];

  const completedAchievements = achievements.filter(
    (a) => a.isCompleted
  ).length;
  const totalRewardsEarned = achievements
    .filter((a) => a.isCompleted)
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="bg-[#0F172A] h-screen overflow-y-auto pb-5"
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#4B5563 #1F2937'
      }}
    >
      <div className="flex gap-17 items-center pt-5 border-b border-[#1B2A4E] pb-3">
        <BsArrowLeft
          className="w-6 h-6 text-white ml-8 cursor-pointer"
          onClick={() => router.back()}
        />
        <p className="font-space text-xl font-medium">Reward</p>
        <div className="flex justify-end mr-7 mt-3">
        <p className="flex items-center gap-2 bg-[#1B2A4E99] p-1 rounded-3xl w-20 ">
          <LuCoins className="w-6 h-6 text-[#FF1414] ml-2" />
          <p>{totalPoints.toLocaleString()}</p>
        </p>
      </div>
      </div>
      
      <div className="mx-5">
        {/* Points Dashboard - Blockchain Integration */}
        {isBlockchainMode && wallet.connected && (
          <div className="mb-5">
            <PointsDashboard />
          </div>
        )}

        <div className="border border-[#FF1414]  bg-[#1B2A4E99] font-space space-y-5 p-2 rounded-md mt-8">
          <div className="flex items-center gap-3">
            <HiOutlineGift className="w-6 h-6 text-[#FF1414]" />
            <div>
              <p>Token Reward</p>
              <p className="text-sm text-[#C7B2B2] pt-3">
                Complete achievement to unlock token
              </p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl">
              {totalPoints}
            </p>
            <p className="text-sm">Total Token Earned</p>
            <div className="mt-3 text-xs text-gray-400">
              <p>
                {completedAchievements} of {achievements.length} achievements
                completed
              </p>
              <p className="text-green-400">
                +{totalRewardsEarned} bonus points earned
              </p>
            </div>
          </div>
        </div>
        <div className="font-space pt-3">
          <div className="flex justify-between items-center mb-3">
            <p>Achievements</p>
            <p className="text-xs text-gray-400">High Score: {highScore}</p>
          </div>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <AchievementCard
                key={index}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                reward={achievement.reward}
                isCompleted={achievement.isCompleted}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
