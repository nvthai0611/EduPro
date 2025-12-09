import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { Server } from 'socket.io';
import SocketService from "../../utils/socket/socket"

export class PaymentController {
  private paymentService: PaymentService;
  private socketService: SocketService;

  constructor(io: Server) {
    this.paymentService = new PaymentService(io);
    this.socketService = new SocketService(io);
  }

  // Webhook nhận thông báo từ Sepay
  async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.paymentService.handleWebhook(req.body);

      if (result.status === "completed") {
        // Emit đến đúng user
        this.socketService.emitToRoom(result.userId, "payment-webhook", result);
      }

      res.status(200).json(result);
    } catch (error) {
      // console.error('Error handling webhook:', error);
      res.status(500).json({ error: 'Something went wrong while handling the webhook.' });
    }
  }

  // Kiểm tra trạng thái giao dịch
  async verifyTransaction(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.paymentService.verifyTransaction(req.params.orderCode);
      res.json(result);
    } catch (error) {
      console.error('Error verifying transaction:', error);
      res.status(500).json({ error: 'Something went wrong while verifying the transaction.' });
    }
  }
}
