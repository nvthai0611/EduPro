import { Server, Socket } from 'socket.io';

class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Lắng nghe kết nối của client và phát sự kiện
  listen() {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Phát sự kiện từ server
  emit(event: string, data: any) {
    this.io.emit(event, data);
  }

  // Lắng nghe sự kiện từ client
  on(event: string, handler: (data: any) => void) {
    this.io.on(event, handler);
  }
}

export default SocketService;
