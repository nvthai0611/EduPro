import { Router } from 'express';
import { PaymentController } from '../../modules/payment/payment.controller';
import { Server } from 'socket.io';

const router = Router();

export const paymentRoutes = (io: Server) => {
  const paymentController = new PaymentController(io);

  // Webhook nhận giao dịch từ Sepay
  router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

  // Kiểm tra trạng thái giao dịch
  router.get('/verify/:orderCode', paymentController.verifyTransaction.bind(paymentController));

  return router;
};