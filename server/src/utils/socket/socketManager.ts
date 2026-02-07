import { Server } from 'socket.io';
import SocketService from './socket';
class SocketManager {
  private static instance: SocketManager;
  private socketService: SocketService | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  setSocketService(socketService: SocketService) {
    this.socketService = socketService;
  }

  getSocketService(): SocketService | null {
    return this.socketService;
  }

  // Convenience methods for notifications
  notifyNewNotification(userId: string, notification: any) {
    this.socketService?.notifyNewNotification(userId, notification);
  }

  notifyNotificationRead(userId: string, notificationId: string) {
    this.socketService?.notifyNotificationRead(userId, notificationId);
  }

  notifyAllNotificationsRead(userId: string, count: number) {
    this.socketService?.notifyAllNotificationsRead(userId, count);
  }

  notifyNotificationDeleted(userId: string, notificationId: string) {
    this.socketService?.notifyNotificationDeleted(userId, notificationId);
  }

  notifyUnreadCount(userId: string, count: number) {
    this.socketService?.notifyUnreadCount(userId, count);
  }
}

export default SocketManager.getInstance();
