/**
 * Particle Effects Component
 * Creates visual effects for score increases and achievements
 */

'use client';

import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  rotation?: number;
  rotationSpeed?: number;
}

interface ParticleEffectProps {
  trigger: number; // Increment this to trigger effect
  x?: number; // X position (0-100%)
  y?: number; // Y position (0-100%)
  color?: string;
  count?: number;
}

// Counter to ensure unique IDs across rapid triggers
let particleIdCounter = 0;

export function ParticleEffect({ trigger, x = 50, y = 50, color = '#FDC200', count = 15 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (trigger === 0) return;

    // Generate new particles with guaranteed unique IDs
    const baseId = Date.now() * 1000 + particleIdCounter;
    const newParticles: Particle[] = Array.from({ length: count }, (_, i) => ({
      id: baseId + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2, // Slight upward bias
      life: 1,
      color,
      size: Math.random() * 8 + 4
    }));

    particleIdCounter = (particleIdCounter + count) % 1000000; // Prevent overflow

    setParticles(prev => [...prev, ...newParticles]);

    // Animate particles
    const animationInterval = setInterval(() => {
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // Gravity
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0);
      });
    }, 16);

    // Cleanup after animation
    setTimeout(() => {
      clearInterval(animationInterval);
    }, 2000);

    return () => clearInterval(animationInterval);
  }, [trigger, x, y, color, count]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full transition-all"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 0 ${p.size}px ${p.color}`
          }}
        />
      ))}
    </div>
  );
}

// Confetti effect for special achievements
interface ConfettiProps {
  trigger: number;
  duration?: number;
}

// Counter for confetti unique IDs
let confettiIdCounter = 0;

export function ConfettiEffect({ trigger, duration = 3000 }: ConfettiProps) {
  const [active, setActive] = useState(false);
  const [confetti, setConfetti] = useState<Particle[]>([]);

  const colors = ['#FFD700', '#FF1414', '#00FF00', '#FF69B4', '#00BFFF', '#FF4500'];

  useEffect(() => {
    if (trigger === 0) return;

    setActive(true);
    
    // Create burst of confetti with unique IDs
    const baseId = Date.now() * 1000 + confettiIdCounter;
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: baseId + i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() * -6) - 4,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 10 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 20
    }));

    confettiIdCounter = (confettiIdCounter + 50) % 1000000; // Prevent overflow

    setConfetti(pieces);

    // Animate
    const interval = setInterval(() => {
      setConfetti(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vx: p.vx * 0.98,
          vy: p.vy + 0.3,
          life: p.life - (1000 / duration / 60),
          rotation: (p.rotation || 0) + (p.rotationSpeed || 0)
        })).filter(p => p.life > 0)
      );
    }, 16);

    setTimeout(() => {
      clearInterval(interval);
      setActive(false);
      setConfetti([]);
    }, duration);

    return () => clearInterval(interval);
  }, [trigger, duration]);

  if (!active && confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            transform: `translate(-50%, -50%) rotate(${p.rotation || 0}deg)`,
            borderRadius: '2px'
          }}
        />
      ))}
    </div>
  );
}

// Plus points animation
interface PlusPointsProps {
  points: number;
  show: boolean;
  onComplete?: () => void;
}

export function PlusPointsAnimation({ points, show, onComplete }: PlusPointsProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed top-1/3 left-1/2 transform -translate-x-1/2 pointer-events-none z-50">
      <div className="animate-bounce-up text-4xl font-bold text-yellow-400 drop-shadow-lg">
        +{points}
      </div>
      <style jsx>{`
        @keyframes bounce-up {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(1);
            opacity: 0;
          }
        }
        .animate-bounce-up {
          animation: bounce-up 1s ease-out;
        }
      `}</style>
    </div>
  );
}
