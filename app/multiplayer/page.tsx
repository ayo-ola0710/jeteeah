"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaPlus, FaSignInAlt, FaArrowLeft, FaCopy } from "react-icons/fa";
import { useMultiplayer } from "@/hooks/useMultiplayer";
import toast from "react-hot-toast";

const MultiplayerPage = () => {
  const router = useRouter();
  const { createRoom, joinRoom, connected, error } = useMultiplayer();
  
  const [roomCode, setRoomCode] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);
    try {
      const { roomCode } = await createRoom();
      setGeneratedCode(roomCode);
      setShowCreateModal(true);
      toast.success('Room created successfully!');
    } catch (err: any) {
      const friendlyMessage = err.message?.includes('not connected') 
        ? 'Unable to connect to server. Please check your connection.'
        : err.message || 'Could not create room. Please try again.';
      toast.error(friendlyMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (roomCode.trim().length !== 6) return;

    setIsJoining(true);
    try {
      await joinRoom(roomCode.toUpperCase());
      // Small delay to ensure socket is fully joined before navigation
      await new Promise(resolve => setTimeout(resolve, 100));
      router.push(`/multiplayer/room/${roomCode.toUpperCase()}`);
      toast.success('Joined room successfully!');
    } catch (err: any) {
      const friendlyMessage = err.message?.includes('not found')
        ? 'Room not found. Please check the code and try again.'
        : err.message?.includes('full')
        ? 'This room is full. Please try another room.'
        : err.message?.includes('not connected')
        ? 'Unable to connect to server. Please check your connection.'
        : err.message || 'Could not join room. Please try again.';
      toast.error(friendlyMessage);
    } finally {
      setIsJoining(false);
    }
  };

  const handleGoToRoom = () => {
    router.push(`/multiplayer/room/${generatedCode}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success('Room code copied to clipboard!');
  };

  return (
    <div className="bg-[#0F172A] min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <button
          onClick={() => router.push("/home")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-xl font-bold mr-20">Multiplayer Lobby</h1>
      </div>

      {/* Connection Status */}
      {!connected && (
        <div className="bg-yellow-900/20 border-b border-yellow-500/30 p-3 text-center">
          <p className="text-yellow-400 text-sm">⚠️ Connecting to server...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border-b border-red-500/30 p-3 text-center">
          <p className="text-red-400 text-sm">❌ {error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 ">
        <div className="max-w-md w-full space-y-8">
          {/* Create Room */}
          <div className=" backdrop-blur-xl rounded-2xl p-6 border border-red-500/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-linear-to-br rounded-xl flex items-center justify-center shrink-0">
                <FaPlus className="text-xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Create Room</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Start a new game room and invite your friends
                </p>
                <Button
                  onClick={handleCreateRoom}
                  disabled={!connected || isCreating}
                  className="w-full bg-red-600/90 hover:bg-red-500 cursor-pointer text-white py-6 rounded-xl font-semibold shadow-lg shadow-red-60 border-none disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create New Room'}
                </Button>
              </div>
            </div>
          </div>

          {/* Join Room */}
          <div className=" backdrop-blur-xl rounded-2xl p-6 border border-white/40">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
                <FaSignInAlt className="text-xl text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">Join Room</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Enter a 6-character room code to join
                </p>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="ENTER CODE"
                    maxLength={6}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                    className="w-full bg-white/10 border border-white/30 rounded-xl px-4 py-2 text-center text-xl font-bold tracking-widest placeholder-gray-500 focus:outline-none focus:border-white transition-colors"
                  />
                  <Button
                    onClick={handleJoinRoom}
                    disabled={roomCode.trim().length !== 6 || !connected || isJoining}
                    className="w-full bg-white/90 text-black hover:bg-white/80 cursor-pointer disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50  py-6 rounded-xl font-semibold shadow-lg shadow-green-500/30 border-none"
                  >
                    {isJoining ? 'Joining...' : 'Join Room'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <p className="text-sm text-gray-400">
                  <strong className="text-white">How it works:</strong> Create a
                  room to get a unique code, share it with friends, and start
                  playing when everyone joins!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Success Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="rounded-2xl p-8 max-w-md w-full border border-red-500/40 shadow-2xl bg-[#1E293B]">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPlus className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Room Created!</h3>
              <p className="text-gray-400 text-sm">
                Share this code with your friends
              </p>
            </div>

            {/* Room Code Display */}
            <div className="bg-white/10 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 text-center mb-2">
                ROOM CODE
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-bold tracking-widest text-white">
                  {generatedCode}
                </p>
                <button
                  onClick={copyToClipboard}
                  className="p-3 bg-red-600/20 hover:bg-red-500/70 rounded-lg transition-colors"
                  title="Copy code"
                >
                  <FaCopy className="text-white" />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-6 rounded-xl font-semibold border-none cursor-pointer"
              >
                Close
              </Button>
              <Button
                onClick={handleGoToRoom}
                className="flex-1 bg-linear-to-r from-red-600 to-red-600/70 hover:from-red-500 hover:to-red-500/80 cursor-pointer text-white py-6 rounded-xl font-semibold shadow-lg shadow-purple-500/30 border-none"
              >
                Go to Room
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiplayerPage;
