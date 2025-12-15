"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiPause } from "react-icons/fi";
import { RiCloseLine } from "react-icons/ri";
import {
  IoMdArrowUp,
  IoMdArrowDown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from "react-icons/io";
import { useMultiplayer } from "@/hooks/useMultiplayer";

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

const MultiplayerGamePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");

  const { gameState, socket, changeDirection, leaveRoom } = useMultiplayer();

  const gridSize = 20;
  const [boardWidth] = useState(395);
  const [boardHeight] = useState(400);
  const boardSize = Math.min(boardWidth, boardHeight) / gridSize;

  const [paused, setPaused] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Get game data from Socket.IO
  const players = gameState?.players || [];
  const food = gameState?.food || { x: 5, y: 5 };
  const gameStatus = gameState?.status || 'waiting';

  const currentPlayerId = socket?.id;
  const currentPlayer = players.find((p) => p.id === currentPlayerId);
  const isAlive = currentPlayer?.alive || false;
  const gameOver = gameStatus === 'finished';
  const alivePlayers = players.filter((p) => p.alive);
  const winner = alivePlayers.length === 1 ? alivePlayers[0] : null;

  // Show loading if no game state
  if (!gameState) {
    return (
      <div className="bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading game...</p>
          <p className="text-sm text-gray-500 mt-2">Room: {roomCode}</p>
        </div>
      </div>
    );
  }

  // Handle keyboard input - send to server
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!isAlive || paused) return;

      let direction = null;
      switch (e.key) {
        case "ArrowUp":
          direction = { x: 0, y: -1 };
          break;
        case "ArrowDown":
          direction = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
          direction = { x: -1, y: 0 };
          break;
        case "ArrowRight":
          direction = { x: 1, y: 0 };
          break;
      }

      if (direction) {
        changeDirection(direction);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isAlive, paused, changeDirection]);

  const handleLeaveGame = () => {
    leaveRoom();
    router.push("/multiplayer");
  };

  const handleDirectionButton = (direction: { x: number; y: number }) => {
    if (isAlive && !paused) {
      changeDirection(direction);
    }
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
        <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-gradient-to-br from-red-900/90 to-orange-900/90 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-red-500/50 z-10 shadow-2xl max-w-sm">
          <div className="text-center">
            <p className="text-2xl font-bold mb-2">💀 You've been eliminated!</p>
            <p className="text-sm text-gray-200 mb-3">Spectating remaining players...</p>
            <div className="bg-black/30 rounded-lg p-3">
              <p className="text-xs text-gray-300">
                <span className="font-bold text-white">{alivePlayers.length}</span> player{alivePlayers.length !== 1 ? 's' : ''} still alive
              </p>
              <p className="text-xs text-gray-400 mt-1">Waiting for game to finish</p>
            </div>
          </div>
        </div>
      )}

      {/* Scores Sidebar */}
      <div className="absolute  top-10 bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20 max-w-xs z-10 flex">
        <div className=" flex items-center justify-center gap-4">
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
            onClick={() => handleDirectionButton({ x: 0, y: -1 })}
          >
            <IoMdArrowUp size={24} />
          </button>
          <div className="flex gap-25">
            <button
              disabled={!isAlive}
              className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => handleDirectionButton({ x: -1, y: 0 })}
            >
              <IoMdArrowDropleft size={24} />
            </button>
            <button
              disabled={!isAlive}
              className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => handleDirectionButton({ x: 1, y: 0 })}
            >
              <IoMdArrowDropright size={24} />
            </button>
          </div>
          <button
            disabled={!isAlive}
            className="bg-linear-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            onClick={() => handleDirectionButton({ x: 0, y: 1 })}
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

      {/* Game Over Modal */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-40">
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-md mx-4 text-center border-2 border-purple-500/50 shadow-2xl">
            <div className="mb-6">
              {winner ? (
                <>
                  <div className="text-6xl mb-4">🏆</div>
                  <h2 className="text-3xl font-bold text-yellow-400 mb-2">
                    {winner.id === currentPlayerId ? "You Won!" : `${winner.name} Wins!`}
                  </h2>
                  <p className="text-gray-300">
                    Final Score: <span className="font-bold text-white">{winner.score}</span>
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">🤝</div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Game Over!
                  </h2>
                  <p className="text-gray-300">It's a tie!</p>
                </>
              )}
            </div>

            {/* Final Scores */}
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-bold text-gray-300 mb-3">FINAL SCORES</h3>
              <div className="space-y-2">
                {players
                  .sort((a, b) => b.score - a.score)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-2 rounded-lg ${
                        index === 0 ? 'bg-yellow-500/20 border border-yellow-500/50' : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                        <div
                          className={`w-3 h-3 rounded-full ${PLAYER_COLORS[player.color].bg}`}
                        />
                        <span className={`font-semibold ${player.id === currentPlayerId ? 'text-white' : 'text-gray-300'}`}>
                          {player.name} {player.id === currentPlayerId && '(You)'}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">{player.score}</span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={handleLeaveGame}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
            >
              Back to Lobby
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerGamePage;
