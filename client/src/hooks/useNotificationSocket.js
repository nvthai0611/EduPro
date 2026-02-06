import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import socket from '../services/socket';
import { notificationKeys } from './useNotifications';
export const useNotificationSocket = (userId) => {
  const queryClient = useQueryClient();
  const reconnectAttempts = useRef(0);
  const isConnected = useRef(false);

  useEffect(() => {
    // Handler functions (defined outside to allow proper cleanup)
    const handleConnect = () => {
      isConnected.current = true;
      socket.emit('authenticate', { userId });
      reconnectAttempts.current = 0;
    };

    const handleDisconnect = (reason) => {

      isConnected.current = false;
    };

    const handleNewNotification = () => {      
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };

    const handleNotificationRead = () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };

    const handleNotificationReadAll = () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };
     

    const handleNotificationDeleted = () => {

      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };

    const handleUnreadCount = (count) => {
      // Directly update the cache without refetching
      queryClient.setQueryData(notificationKeys.unreadCount(), count);
    };

    const handleError = (error) => {
      console.error('[Socket] Error:', error);
    };

    const handleReconnect = (attemptNumber) => {
      reconnectAttempts.current = attemptNumber;
      // Refetch all data after reconnection
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
    };

    // Register all event handlers
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:read-all', handleNotificationReadAll);
    socket.on('notification:deleted', handleNotificationDeleted);
    socket.on('notification:count', handleUnreadCount);
    socket.on('error', handleError);
    socket.on('reconnect', handleReconnect);

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected, just authenticate
      socket.emit('authenticate', { userId });
    }

    // Cleanup on unmount or userId change
    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notification:read-all', handleNotificationReadAll);
      socket.off('notification:deleted', handleNotificationDeleted);
      socket.off('notification:count', handleUnreadCount);
      socket.off('error', handleError);
      socket.off('reconnect', handleReconnect);
      
      // Only disconnect if socket was connected in this hook instance
      if (isConnected.current) {
        socket.disconnect();
        isConnected.current = false;
      }
    };
  }, [userId, queryClient]);

  return {
    socket,
    isConnected: socket.connected,
  };
};

export default useNotificationSocket;
