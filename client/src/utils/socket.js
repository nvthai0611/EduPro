// src/utils/socketService.js
import { io } from "socket.io-client";
const socketURL = import.meta.env.VITE_PROD === 'development' ? "http://localhost:9999" : "https://express.haeispa.online"; 

class SocketService {
  socket = null;
  // config socket connection
  connect() {
    if (!this.socket) {
      this.socket = io(socketURL, {
        withCredentials: true,
        transports: ["websocket"], // tránh lỗi CORS
      });

      this.socket.on("connect", () => {
        console.log("Connected:", this.socket.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected");
      });
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  emit(event, data) {
    this.socket?.emit(event, data);
  }

  on(event, handler) {
    this.socket?.on(event, handler);
  }

  off(event, handler) {
    this.socket?.off(event, handler);
  }
}

export default new SocketService();
