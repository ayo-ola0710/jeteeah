"use client";
import { useState, useEffect, useRef } from "react";
import { FiPause } from "react-icons/fi";
import { RiCloseLine } from "react-icons/ri";
import { IoMdArrowUp, IoMdArrowDown } from "react-icons/io";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";
import { useGame } from "../contexts/GameContext";
import { useRouter } from "next/navigation";
import { useLineraWallet } from "@/hooks/useLineraWallet";
import BlockchainStatus from "@/components/BlockchainStatus";
import { ParticleEffect, ConfettiEffect } from "@/components/ParticleEffects";


const SnakeGamePage = () => {
  const {
    score,
    setScore,
    updateHighScore,
    resetScore,
    isBlockchainMode,
    endGameOnChain,
    highScore,
    setIsGameActive,
  } = useGame();
  const { wallet } = useLineraWallet();
  const router = useRouter();
  const gridSize = 20;
  const [boardWidth, setBoardWidth] = useState(395);
  const [boardHeight, setBoardHeight] = useState(400); // Adjusted for control buttons
  const boardSize = Math.min(boardWidth, boardHeight) / gridSize;
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [particleTrigger, setParticleTrigger] = useState(0);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  
  // Use ref to track if food was just eaten
  const foodEatenRef = useRef(false);

  // Reset score and game state when component mounts or gameKey changes
  useEffect(() => {
    resetScore();
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection({ x: 0, y: 0 });
    setGameOver(false);
    setPaused(false);
    setIsGameActive(false); // Game starts inactive until first move
  }, [gameKey, resetScore, setIsGameActive]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track game active state based on direction
  useEffect(() => {
    const isMoving = direction.x !== 0 || direction.y !== 0;
    setIsGameActive(isMoving && !gameOver && !paused);
  }, [direction, gameOver, paused, setIsGameActive]);

  // handle movement
  useEffect(() => {
    const handleKey = (e: { key: unknown }) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          setDirection({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          setDirection({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // game loop
  useEffect(() => {
    if (gameOver || paused) return;

    const loop = setInterval(() => {
      setSnake((prev) => {
        const newHead = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        // Wrap around screen edges without border
        if (newHead.x < 0) newHead.x = gridSize - 1;
        if (newHead.x >= gridSize) newHead.x = 0;
        if (newHead.y < 0) newHead.y = gridSize - 1;
        if (newHead.y >= gridSize) newHead.y = 0;

        // Check if snake bites itself
        const snakeBody = prev.slice(1);
        const hitSelf = snakeBody.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        );
        if (hitSelf) {
          setGameOver(true);
          return prev;
        }

        let newSnake = [];
        if (newHead.x === food.x && newHead.y === food.y) {
          // Snake ate food
          newSnake = [newHead, ...prev];
          
          // Update food position
          setFood({
            x: Math.floor(Math.random() * gridSize),
            y: Math.floor(Math.random() * gridSize),
          });
          
          // Mark that food was eaten (handle score in separate effect)
          foodEatenRef.current = true;
        } else {
          newSnake = [newHead, ...prev.slice(0, -1)];
        }

        return newSnake;
      });
    }, 200);
    return () => clearInterval(loop);
  }, [direction, food, gameOver, paused]);

  // Handle score updates when food is eaten (separate from snake update)
  useEffect(() => {
    if (foodEatenRef.current) {
      foodEatenRef.current = false;
      console.log('🍎 Food eaten! Updating score...');
      
      // Update score using functional form
      setScore((prevScore) => {
        const newScore = prevScore + 5;
        console.log(`📊 Score: ${prevScore} → ${newScore}`);
        
        // Defer visual effects to avoid setState-in-render issues
        queueMicrotask(() => {
          // Trigger particle effect
          setParticleTrigger((prev) => prev + 1);

          // Check for new high score and trigger confetti
          if (newScore > highScore) {
            setConfettiTrigger((prev) => prev + 1);
          }
        });
        
        return newScore;
      });
    }
  }, [snake, highScore]); // Depend on snake and highScore

  // Handle game over
  useEffect(() => {
    if (gameOver) {
      updateHighScore(score);

      // If blockchain mode is enabled, end game on chain
      if (isBlockchainMode && wallet.connected) {
        endGameOnChain().then(() => {
          router.push("/gameover");
        });
      } else {
        router.push("/gameover");
      }
    }
  }, [
    gameOver,
    score,
    updateHighScore,
    router,
    isBlockchainMode,
    wallet.connected,
    endGameOnChain,
  ]);

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white flex flex-col">
      {/* Particle Effects */}
      <ParticleEffect
        trigger={particleTrigger}
        x={50}
        y={50}
        color={isBlockchainMode ? "#FDC200" : "#10B981"}
        count={isBlockchainMode ? 20 : 10}
      />
      <ConfettiEffect trigger={confettiTrigger} />

      {/* Blockchain Status */}
      <BlockchainStatus />

      {/* Game grid container */}
      <div className="flex-1 flex items-center justify-center bg-[#0F172A] relative mt">
        {/* Game grid - fixed size */}
        <div
          className="relative border-b border-gray-800 mt-12"
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
          className={`absolute ${
            isBlockchainMode
              ? "bg-yellow-400 shadow-lg shadow-yellow-500/50 animate-pulse"
              : "bg-red-500"
          }`}
          style={{
            width: boardSize,
            height: boardSize,
            left: food.x * boardSize,
            top: food.y * boardSize,
          }}
        />

        {/* Snake */}
        {snake.map((s, i) => (
          <div
            key={i}
            className={`absolute rounded-sm ${
              isBlockchainMode
                ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md shadow-yellow-500/30"
                : "bg-green-500"
            }`}
            style={{
              width: boardSize,
              height: boardSize,
              left: s.x * boardSize,
              top: s.y * boardSize,
            }}
          >
            {i === 0 && (
              <div className="flex justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
                <div className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
      </div>

      {/* Pause Overlay */}
      {paused && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-20 mt-15">
          <div className="text-center">
            <p className="text-4xl font-bold text-white mb-4">PAUSED</p>
            <p className="text-lg text-white/80">
              Click pause button again to resume
            </p>
          </div>
        </div>
      )}

      {/* Score Box - in front of grid */}
      <div
        className={`absolute top-1 left-1/2 -translate-x-1/2 px-3 py-2 rounded-lg text-sm z-10 ${
          isBlockchainMode
            ? "bg-yellow-600/70 border border-yellow-400/50"
            : "bg-blue-700/60"
        }`}
      >
       <div className="flex flex-row gap-2 items-center">
         <p className="opacity-80 border-r border-white/20 pr-2">Score</p>
        <p className="text-white font-bold">{score}</p>
       </div>
        {isBlockchainMode && (
          <p className="text-xs text-yellow-200 mt-1">🔗 On-Chain</p>
        )}
      </div>

      {/* Top-right Icons - in front of grid */}
      <div className="absolute  flex justify-between gap-80 mt-1.5 mx-2 z-10">
        <button
          className="bg-blue-700/60 p-1.5 rounded-md hover:bg-blue-700"
          onClick={() => setPaused(!paused)}
        >
          <FiPause size={18} />
        </button>
        <button
          className="bg-red-500/80 p-1.5 rounded-md hover:bg-red-600"
          onClick={() => setShowCancelModal(true)}
        >
          <RiCloseLine size={18} />
        </button>
      </div>

      {/* Control Buttons - Modern Design */}
      <div className="py-4 bg-[#0F172A] -mt-3 ">
        <div className="flex flex-col items-center gap-2">
          <button
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            onClick={() => setDirection({ x: 0, y: -1 })}
          >
            <IoMdArrowUp size={24} />
          </button>
          <div className="flex gap-25">
            <button
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
              onClick={() => setDirection({ x: -1, y: 0 })}
            >
              <IoMdArrowDropleft size={24} />
            </button>
            <button
              className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
              onClick={() => setDirection({ x: 1, y: 0 })}
            >
              <IoMdArrowDropright size={24} />
            </button>
          </div>
          <button
            className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
            onClick={() => setDirection({ x: 0, y: 1 })}
          >
            <IoMdArrowDown size={24} />
          </button>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Cancel Game?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel the game? Your current progress
              will be lost.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Playing
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                onClick={() => router.push("/start")}
              >
                Cancel Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGamePage;
