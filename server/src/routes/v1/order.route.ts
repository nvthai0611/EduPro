import { Router } from "express";
import orderController from "../../modules/order/order.controller";
import authenticateToken from "../../middlewares/auth/authenticateToken";

const router = Router();

// Tạo đơn hàng (khi user bấm thanh toán)
router.post("/", authenticateToken, orderController.createOrder);

// Tạo đơn hàng đã thanh toán ngay (dành cho admin cấp khóa học trực tiếp)
router.post("/paid-order", authenticateToken, orderController.createPaidOrder);

// Kiểm tra user đã mua khóa học hay chưa
router.get("/check", orderController.checkPurchased);

// Xác nhận thanh toán thành công (webhook hoặc notify)
router.post("/mark-paid", authenticateToken, orderController.markAsPaid);

export const orderRoutes: Router = router;
