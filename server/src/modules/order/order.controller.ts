// src/controllers/order.controller.ts
import { Request, Response } from "express";
import OrderService from "./order.service";

const orderService = new OrderService();

class OrderController {
  // Tạo order cho 1 khóa học
  async createOrder(req: Request, res: Response) {
    try {
      
      const order = await orderService.createOrder(req.body);

      return res.json({
        message: "Tạo order thành công",
        order,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // Check user đã mua chưa
  async checkPurchased(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.query as any;

      const purchased = await orderService.checkUserPurchased(userId, courseId);
      
      return res.json({
        purchased: purchased ? true : false,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // API cập nhật thành paid (dùng cho socket hoặc webhook)
  async markAsPaid(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      
      const updated = await orderService.markOrderPaid(orderId);

      if (!updated) {
        return res.status(404).json({ message: "Order không tồn tại" });
      }

      return res.json({
        message: "Order đã thanh toán",
        order: updated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }
}

export default new OrderController();