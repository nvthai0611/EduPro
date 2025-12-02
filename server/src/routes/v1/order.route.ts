import { Router } from "express";
import orderController from "../../modules/order/order.controller";

const router = Router();

// Tạo đơn hàng (khi user bấm thanh toán)
router.post("/", orderController.createOrder);

// Tạo đơn hàng đã thanh toán ngay (dành cho admin cấp khóa học trực tiếp)
router.post("/paid-order", orderController.createPaidOrder);

// Kiểm tra user đã mua khóa học hay chưa
router.get("/check", orderController.checkPurchased);

// Xác nhận thanh toán thành công (webhook hoặc notify)
router.post("/mark-paid", orderController.markAsPaid);

export const orderRoutes: Router = router;
