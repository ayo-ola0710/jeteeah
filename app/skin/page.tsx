"use client";

import { useState, useEffect } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { LuCoins } from "react-icons/lu";
import { useRouter } from "next/navigation";
import SkinCard from "@/components/SkinCard";
import { useGame } from "../contexts/GameContext";
import { useLineraWallet } from "@/hooks/useLineraWallet";
import { SnakeContract } from "@/lib/contract-operations";

const Skins = () => {
  const router = useRouter();
  const { totalPoints } = useGame();
  const { wallet } = useLineraWallet();
  const [ownedSkins, setOwnedSkins] = useState<number[]>([0]); // 0 is default skin
  const [activeSkin, setActiveSkin] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch owned skins from blockchain
  useEffect(() => {
    const fetchSkins = async () => {
      if (wallet.connected) {
        // TODO: Implement getOwnedSkins from contract when ready
        // For now, all skins are available in demo mode
        setOwnedSkins([0, 1, 2, 3, 4, 5]);
      }
    };
    fetchSkins();
  }, [wallet.connected]);

  const handleSelectSkin = async (skinId: number) => {
    if (!ownedSkins.includes(skinId)) return;
    
    setLoading(true);
    // TODO: Implement selectSkin contract call
    setActiveSkin(skinId);
    setLoading(false);
  };

  const handlePurchaseSkin = async (skinId: number, cost: number) => {
    if (!wallet.connected) {
      alert("Please connect your wallet first!");
      router.push("/wallet");
      return;
    }

    if (totalPoints < cost) {
      alert(`Insufficient points! You need ${cost} points.`);
      return;
    }

    setLoading(true);
    // TODO: Implement purchaseSkin contract call
    // Simulate purchase for now
    setTimeout(() => {
      setOwnedSkins([...ownedSkins, skinId]);
      alert("Skin purchased successfully!");
      setLoading(false);
    }, 1000);
  };

  const skins = [
    { id: 0, color: "#FF1414", name: "Classic Red", cost: 0, tag: "Default", tagColor: "#10B981" },
    { id: 1, color: "#FFF8F8", name: "Snow White", cost: 50, tag: "Common", tagColor: "#10B981" },
    {
      id: 2,
      color: "#8B5CF6",
      name: "Purple Haze",
      cost: 100,
      tag: "Rare",
      tagColor: "#0076C6",
    },
    {
      id: 3,
      color: "#FDC200",
      name: "Golden Majesty",
      cost: 300,
      tag: "Epic",
      tagColor: "#8E0085",
    },
    {
      id: 4,
      color: "#10B981",
      name: "Emerald Dream",
      cost: 150,
      tag: "Rare",
      tagColor: "#0076C6",
    },
    {
      id: 5,
      color: "#3B82F6",
      name: "Ocean Blue",
      cost: 200,
      tag: "Epic",
      tagColor: "#8E0085",
    },
  ];

  return (
    <div className="bg-[#0F172A] h-full flex flex-col">
      <div className="flex gap-23 items-center pt-7">
        <BsArrowLeft
          className="w-6 h-6 text-white ml-8 cursor-pointer"
          onClick={() => router.back()}
        />
        <p className="font-space text-xl font-medium">Snake Skins</p>
      </div>
      <div className="flex justify-end mr-7 mt-3">
        <p className="flex items-center gap-2 bg-[#1B2A4E99] p-1 rounded-3xl w-25 ">
          <LuCoins className="w-6 h-6 text-[#FF1414] ml-2" />
          <p>{totalPoints.toLocaleString()}</p>
        </p>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1B2A4E99] p-6 rounded-lg">
            <p className="text-white">Processing...</p>
          </div>
        </div>
      )}

      <div className="flex-1 space-y-3 mt-3 overflow-y-auto pb-4">
        {skins.map((skin) => (
          <SkinCard
            key={skin.id}
            color={skin.color}
            name={skin.name}
            isActive={activeSkin === skin.id}
            isLocked={!ownedSkins.includes(skin.id)}
            cost={skin.cost}
            tag={skin.tag}
            tagColor={skin.tagColor}
            onSelect={() => {
              if (ownedSkins.includes(skin.id)) {
                handleSelectSkin(skin.id);
              } else {
                handlePurchaseSkin(skin.id, skin.cost);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Skins;
