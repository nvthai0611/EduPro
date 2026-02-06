import { io } from 'socket.io-client';

// Get API URL from environment or default
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:9999';

// Create socket instance
export const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect immediately
  withCredentials: true, // Send cookies for authentication
  transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
  reconnection: true, // Auto reconnect
  reconnectionDelay: 1000, // Wait 1s before reconnect
  reconnectionAttempts: 5, // Try 5 times
});



socket.on('connect_error', (error) => {
  console.error('[Socket] Connection error:', error.message);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
});

export default socket;
