import { Server, Socket } from 'socket.io';

class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Lắng nghe kết nối của client và phát sự kiện
  listen() {
    this.io.on('connection', (socket: Socket) => {
      socket.on("join-room", (userId) => {
        socket.join(userId.toString());
        console.log("User joined room:", userId);
      });
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Phát sự kiện từ server
  emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  emitToRoom(roomId: string, event: string, data: any) {
    this.io.to(roomId).emit(event, data);
  }

  // Lắng nghe sự kiện từ client
  on(event: string, handler: (data: any) => void) {
    this.io.on(event, handler);
  }
}

export default SocketService;
