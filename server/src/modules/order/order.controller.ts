// src/controllers/order.controller.ts
import { Request, Response } from "express";
import OrderService from "./order.service";
import axios from "axios";

const BASE_URL = process.env.NODE_ENV === 'development' ? "https://muddiest-bob-veillike.ngrok-free.dev/" : "https://edu-pro-delta.vercel.app/";

class OrderController {
  async getOrders(req: Request, res: Response) {
    try {
      const orders = await OrderService.getAllOrders();
      return res.json(orders);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // Tạo order cho 1 khóa học
  async createOrder(req: Request, res: Response) {
    try {

      const order = await OrderService.createOrder(req.body);

      return res.json({
        message: "Tạo order thành công",
        order,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // Tạo order đã thanh toán ngay (dành cho admin cấp khóa học trực tiếp)
  async createPaidOrder(req: Request, res: Response) {
    try {
      const newOrder = await OrderService.createOrder(req.body);
      const order = await OrderService.getOrderById(newOrder._id.toString());
      await axios.post(
        `${BASE_URL}api/v1/admin/user/purchase/course`,
        {
          userId: order.userId,
          courseId: order.courseId,
          price: order.price,
          orderId: order._id
        }
      );

      return res.json({
        message: "Tạo order thành công",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  }

  // Xóa order
  async deleteOrder(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await OrderService.deleteOrder(id);

      return res.json({
        message: "Xóa order thành công",
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

      const purchased = await OrderService.checkUserPurchased(userId, courseId);

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

      const updated = await OrderService.markOrderPaid(orderId);

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