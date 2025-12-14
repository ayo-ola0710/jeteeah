import { useCallback } from 'react';
import { useSocket } from '@/contexts/SocketContext';

export const useMultiplayer = () => {
  const { socket, connected, roomState, gameState, error } = useSocket();

  // Create room
  const createRoom = useCallback((): Promise<{ roomCode: string; playerId: string }> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('create_room', {});

      socket.once('room_created', (data: { roomCode: string; playerId: string }) => {
        resolve(data);
      });

      socket.once('error', (err: { message: string }) => {
        reject(new Error(err.message));
      });
    });
  }, [socket]);

  // Join room
  const joinRoom = useCallback((roomCode: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!socket) {
        reject(new Error('Socket not connected'));
        return;
      }

      socket.emit('join_room', { roomCode });

      const timeout = setTimeout(() => {
        reject(new Error('Join room timeout'));
      }, 5000);

      socket.once('room_state', () => {
        clearTimeout(timeout);
        resolve();
      });

      socket.once('error', (err: { message: string }) => {
        clearTimeout(timeout);
        reject(new Error(err.message));
      });
    });
  }, [socket]);

  // Toggle ready
  const toggleReady = useCallback(() => {
    if (!socket) return;
    socket.emit('player_ready');
  }, [socket]);

  // Start game (host only)
  const startGame = useCallback(() => {
    if (!socket) return;
    socket.emit('start_game');
  }, [socket]);

  // Change direction
  const changeDirection = useCallback((direction: { x: number; y: number }) => {
    if (!socket) return;
    socket.emit('change_direction', { direction });
  }, [socket]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!socket) return;
    socket.emit('leave_room');
  }, [socket]);

  return {
    socket,
    connected,
    roomState,
    gameState,
    error,
    createRoom,
    joinRoom,
    toggleReady,
    startGame,
    changeDirection,
    leaveRoom,
  };
};
