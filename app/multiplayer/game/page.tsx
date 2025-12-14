"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPause } from "react-icons/fi";
import { RiCloseLine } from "react-icons/ri";
import {
  IoMdArrowUp,
  IoMdArrowDown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from "react-icons/io";

// Player colors for multiplayer
const PLAYER_COLORS = [
  { bg: "bg-green-500", shadow: "shadow-green-500/30", name: "Green" },
  { bg: "bg-blue-500", shadow: "shadow-blue-500/30", name: "Blue" },
  { bg: "bg-red-500", shadow: "shadow-red-500/30", name: "Red" },
  { bg: "bg-yellow-500", shadow: "shadow-yellow-500/30", name: "Yellow" },
  { bg: "bg-purple-500", shadow: "shadow-purple-500/30", name: "Purple" },
  { bg: "bg-pink-500", shadow: "shadow-pink-500/30", name: "Pink" },
  { bg: "bg-orange-500", shadow: "shadow-orange-500/30", name: "Orange" },
  { bg: "bg-cyan-500", shadow: "shadow-cyan-500/30", name: "Cyan" },
];

interface Player {
  id: string;
  name: string;
  snake: { x: number; y: number }[];
  direction: { x: number; y: number };
  alive: boolean;
  score: number;
  color: number;
}

const MultiplayerGamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");

  const gridSize = 20;
  const [boardWidth] = useState(395);
  const [boardHeight] = useState(400);
  const boardSize = Math.min(boardWidth, boardHeight) / gridSize;

  // Mock multiplayer state (will be replaced with WebSocket)
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "You",
      snake: [{ x: 10, y: 10 }],
      direction: { x: 0, y: 0 },
      alive: true,
      score: 0,
      color: 0,
    },
  ]);

  const [food, setFood] = useState({ x: 5, y: 5 });
  const [paused, setPaused] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Player | null>(null);

  const currentPlayerId = "1"; // Mock player ID
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isAlive = currentPlayer?.alive || false;

  // Handle keyboard input
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isAlive || paused) return;

      // TODO: Send direction change to server via WebSocket
      switch (e.key) {
        case "ArrowUp":
          console.log("Move UP");
          break;
        case "ArrowDown":
          console.log("Move DOWN");
          break;
        case "ArrowLeft":
          console.log("Move LEFT");
          break;
        case "ArrowRight":
          console.log("Move RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isAlive, paused]);

  const handleLeaveGame = () => {
    // TODO: Disconnect from WebSocket
    router.push("/multiplayer");
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Game Info Bar */}
      <div className="bg-[#1E293B] border-b border-gray-800 p-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Room:</span>
            <span className="font-bold text-purple-400">{roomCode}</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="bg-blue-700/60 p-1.5 rounded-md hover:bg-blue-700"
              onClick={() => setPaused(!paused)}
            >
              <FiPause size={18} />
            </button>
            <button
              className="bg-red-500/80 p-1.5 rounded-md hover:bg-red-600"
              onClick={() => setShowLeaveModal(true)}
            >
              <RiCloseLine size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center bg-[#0F172A] relative">
        {/* Game Board */}
        <div
          className="relative border-b border-gray-800"
          style={{
            width: boardWidth,
            height: boardHeight,
            backgroundImage:
              "linear-gradient(to right, #1E293B 1px, transparent 1px), linear-gradient(to bottom, #1E293B 1px, transparent 1px)",
            backgroundSize: `${boardWidth / gridSize}px ${
              boardHeight / gridSize
            }px`,
          }}
        >
          {/* Food */}
          <div
            className="absolute bg-red-500 animate-pulse"
            style={{
              width: boardSize,
              height: boardSize,
              left: food.x * boardSize,
              top: food.y * boardSize,
            }}
          />

          {/* All Players' Snakes */}
          {players.map((player) =>
            player.snake.map((segment, i) => (
              <div
                key={`${player.id}-${i}`}
                className={`absolute rounded-sm ${
                  PLAYER_COLORS[player.color].bg
                } ${i === 0 ? PLAYER_COLORS[player.color].shadow : ""}`}
                style={{
                  width: boardSize,
                  height: boardSize,
                  left: segment.x * boardSize,
                  top: segment.y * boardSize,
                  opacity: player.alive ? 1 : 0.3,
                }}
              >
                {/* Head with eyes */}
                {i === 0 && player.alive && (
                  <div className="flex justify-center gap-1 mt-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Player Name Labels */}
          {players.map((player) => {
            const head = player.snake[0];
            return (
              <div
                key={`label-${player.id}`}
                className="absolute text-xs font-bold whitespace-nowrap pointer-events-none"
                style={{
                  left: head.x * boardSize,
                  top: head.y * boardSize - 20,
                  color: player.id === currentPlayerId ? "#FFF" : "#AAA",
                }}
              >
                {player.name} {!player.alive && "💀"}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pause Overlay */}
      {paused && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-20">
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-4">PAUSED</p>
            <p className="text-lg text-white/80">
              Click pause button again to resume
            </p>
          </div>
        </div>
      )}

      {/* Spectator Mode (when player is dead) */}
      {!isAlive && !gameOver && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-900/80 backdrop-blur-sm px-6 py-3 rounded-xl border border-red-500/50 z-10">
          <p className="text-xl font-bold">You&apos;ve been eliminated!</p>
          <p className="text-sm text-gray-300">Spectating...</p>
        </div>
      )}

      {/* Scores Sidebar */}
      <div className="absolute right-4 top-20 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 max-w-xs z-10">
        <h3 className="text-sm font-bold mb-3 text-gray-300">PLAYERS</h3>
        <div className="space-y-2">
          {players
            .sort((a, b) => b.score - a.score)
            .map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      PLAYER_COLORS[player.color].bg
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      !player.alive ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {player.name}
                  </span>
                </div>
                <span className="text-sm font-bold">{player.score}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="py-4 bg-[#0F172A] -mt-3">
        <div className="flex flex-col items-center gap-2">
          <button
            disabled={!isAlive}
            className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => console.log("UP")}
          >
            <IoMdArrowUp size={24} />
          </button>
          <div className="flex gap-25">
            <button
              disabled={!isAlive}
              className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => console.log("LEFT")}
            >
              <IoMdArrowDropleft size={24} />
            </button>
            <button
              disabled={!isAlive}
              className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => console.log("RIGHT")}
            >
              <IoMdArrowDropright size={24} />
            </button>
          </div>
          <button
            disabled={!isAlive}
            className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => console.log("DOWN")}
          >
            <IoMdArrowDown size={24} />
          </button>
        </div>
      </div>

      {/* Leave Game Modal */}
      {showLeaveModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Leave Game?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave the multiplayer game?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setShowLeaveModal(false)}
              >
                Stay
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={handleLeaveGame}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerGamePage;
