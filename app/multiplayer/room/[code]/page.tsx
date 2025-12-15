"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaCopy, FaCheck, FaCrown, FaUser } from "react-icons/fa";
import { useMultiplayer } from "@/hooks/useMultiplayer";

const RoomPage = () => {
  const params = useParams();
  const router = useRouter();
  const roomCode = params.code as string;
  
  const { roomState, toggleReady, startGame, leaveRoom, connected, socket } = useMultiplayer();
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Show loading if no room state yet
  if (!roomState) {
    return (
      <div className="bg-[#0F172A] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Loading room...</p>
          <p className="text-sm text-gray-500 mt-2">Room: {roomCode}</p>
        </div>
      </div>
    );
  }

  // Get current player info using socket ID
  const currentPlayer = roomState.players.find((p) => p.id === socket?.id);
  const isHost = currentPlayer?.isHost || false;
  const isReady = currentPlayer?.isReady || false;
  const allReady = roomState.players.every((p) => p.isReady);
  const canStart = roomState.players.length >= 2 && allReady && isHost && roomState.status === 'waiting';

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleReady = () => {
    toggleReady();
  };

  const handleStartGame = () => {
    if (canStart && !isStarting) {
      setIsStarting(true);
      startGame();
    }
  };

  const handleLeave = () => {
    leaveRoom();
    router.push("/multiplayer");
  };

  // Listen for game start
  useEffect(() => {
    if (roomState.status === 'playing') {
      router.push(`/multiplayer/game?room=${roomCode}`);
    }
  }, [roomState.status, roomCode, router]);

  return (
    <div className="bg-[#0F172A] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-xl text-gray-400 font-bold">Room:</span>
          <button
            onClick={copyRoomCode}
            className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span className="font-bold text-white tracking-wider">
              {roomCode}
            </span>
            {copied ? (
              <FaCheck className="text-green-400 text-xs" />
            ) : (
              <FaCopy className="text-white text-xs" />
            )}
          </button>
        </div>
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="bg-yellow-900/20 border-b border-yellow-500/30 p-3 text-center">
          <p className="text-yellow-400 text-sm">⚠️ Reconnecting...</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="max-w-2xl w-full">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Waiting for Players</h1>
            <p className="text-gray-400">
              Share the room code with friends to join
            </p>
          </div>

          {/* Players List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">
                Players ({roomState.players.length}/8)
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-gray-400">
                  {roomState.players.filter((p) => p.isReady).length} Ready
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {roomState.players.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
                    player.isReady
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-white/5 border border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        player.isReady ? "bg-green-500" : "bg-gray-600"
                      }`}
                    >
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{player.name}</span>
                        {player.isHost && (
                          <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                            <FaCrown className="text-yellow-400 text-xs" />
                            <span className="text-xs text-yellow-400">
                              Host
                            </span>
                          </div>
                        )}
                      </div>
                      {player.id === currentPlayer?.id && (
                        <span className="text-xs text-gray-400">(You)</span>
                      )}
                    </div>
                  </div>

                  {player.isReady ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <FaCheck />
                      <span className="text-sm font-semibold">Ready</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Waiting...</span>
                  )}
                </div>
              ))}

              {/* Empty Slots */}
              {[...Array(Math.max(0, 2 - roomState.players.length))].map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-dashed border-white/20"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <FaUser className="text-gray-500 text-sm" />
                  </div>
                  <span className="text-gray-500">Waiting for player...</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isHost && (
              <Button
                onClick={handleToggleReady}
                className={`w-full py-7 rounded-xl font-semibold text-lg shadow-lg border-none ${
                  isReady
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/30"
                }`}
              >
                {isReady ? "Cancel Ready" : "Ready Up"}
              </Button>
            )}

            {isHost && (
              <>
                <Button
                  onClick={handleStartGame}
                  disabled={!canStart || isStarting}
                  className={`w-full py-7 rounded-xl font-semibold text-lg shadow-lg border-none ${
                    canStart && !isStarting
                      ? "bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/30"
                      : "bg-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {isStarting
                    ? "Starting Game..."
                    : roomState.players.length < 2
                    ? "Waiting for Players..."
                    : !allReady
                    ? "Waiting for All Ready..."
                    : "Start Game"}
                </Button>

                {!canStart && roomState.players.length >= 2 && (
                  <p className="text-center text-sm text-gray-400">
                    All players must be ready to start
                  </p>
                )}
              </>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-xl">💡</div>
              <div className="text-sm text-gray-300">
                <strong className="text-white">Tip:</strong>{" "}
                {isHost
                  ? "As the host, you can start the game once all players are ready."
                  : "Mark yourself as ready when you're prepared to play!"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
