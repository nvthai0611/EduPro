import { Server, Socket } from 'socket.io';

class SocketService {
  private io: Server;
  private userSockets: Map<string, string> = new Map(); // Map userId to socketId

  constructor(io: Server) {
    this.io = io;
  }

  // Lắng nghe kết nối của client và phát sự kiện
  listen() {
    this.io.on('connection', (socket: Socket) => {
     
      // Handle authentication
      socket.on('authenticate', (data: { userId: string }) => {
        const { userId } = data;
        if (userId) {
          // Store user-socket mapping
          this.userSockets.set(userId, socket.id);
          
          // Join user's personal room
          socket.join(userId.toString());
          }
      });

      // Legacy support for join-room
      socket.on("join-room", (userId) => {
        socket.join(userId.toString());
        this.userSockets.set(userId.toString(), socket.id);
       });

      // Handle disconnect
      socket.on('disconnect', () => {
        // Remove user from mapping
        for (const [userId, socketId] of this.userSockets.entries()) {
          if (socketId === socket.id) {
            this.userSockets.delete(userId);
        break;
          }
        }
      });
    });
  }

  // Phát sự kiện từ server (broadcast to all)
  emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Phát sự kiện đến một room cụ thể (user's personal room)
  emitToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }

  // Phát sự kiện đến một user cụ thể
  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    } else {
      // Fallback to room-based emit
      this.io.to(userId).emit(event, data);
    }
  }

  // Notification-specific methods
  notifyNewNotification(userId: string, notification: any) {
    this.emitToUser(userId, 'notification:new', notification);
  }

  notifyNotificationRead(userId: string, notificationId: string) {
    this.emitToUser(userId, 'notification:read', { notificationId });
  }

  notifyAllNotificationsRead(userId: string, count: number) {
    this.emitToUser(userId, 'notification:read-all', { count });
  }

  notifyNotificationDeleted(userId: string, notificationId: string) {
    this.emitToUser(userId, 'notification:deleted', { notificationId });
  }

  notifyUnreadCount(userId: string, count: number) {
    this.emitToUser(userId, 'notification:count', count);
  }

  // Lắng nghe sự kiện từ client
  on(event: string, handler: (data: any) => void) {
    this.io.on(event, handler);
  }

  // Get connected users count
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  // Check if user is connected
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId);
  }
}

export default SocketService;
