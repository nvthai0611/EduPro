import { Router } from 'express';
import { PaymentController } from '../../modules/payment/payment.controller';
import { Server } from 'socket.io';

const router = Router();

// Khởi tạo server socket.io
let io: Server; 

const paymentController = new PaymentController(io);

// Webhook nhận giao dịch từ Sepay
router.post('/webhook', paymentController.handleWebhook.bind(paymentController));

// Kiểm tra trạng thái giao dịch
router.get('/verify/:orderCode', paymentController.verifyTransaction.bind(paymentController));

export const paymentRoutes: Router = router;