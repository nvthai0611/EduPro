// // socket.ts
// import { Server } from "socket.io";

// export const socketService = (io: Server) => {
//   io.on("connection", (socket) => {
//     console.log(`Client connected: ${socket.id}`);

//     // Phát sự kiện khi có kết nối
//     socket.emit('payment-webhook', {
//       orderId: '12345',
//       amount: 500000,
//       status: 'Success',
//       message: 'Payment successful!'
//     });

//     // Lắng nghe sự kiện từ client
//     socket.on('payment-status', (data) => {
//       console.log('Received payment status from client:', data);
//     });

//     socket.on("disconnect", () => {
//       console.log(`Client disconnected: ${socket.id}`);
//     });
//   });
// };


// src/utils/socketService.ts
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

      // Phát sự kiện khi có kết nối
      socket.emit('payment-webhook', {
        orderId: '12345',
        amount: 500000,
        status: 'Success',
        message: 'Payment successful!'
      });

      // Lắng nghe sự kiện từ client
      socket.on('payment-status', (data) => {
        console.log('Received payment status from client:', data);
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

  // Lắng nghe sự kiện từ client
  on(event: string, handler: (data: any) => void) {
    this.io.on(event, handler);
  }
}

export default SocketService;
