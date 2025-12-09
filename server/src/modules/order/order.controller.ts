// src/controllers/order.controller.ts
import { Request, Response } from "express";
import OrderService from "./order.service";
import axios from "axios";
import User, { IUserDocument } from "../user/user.model";
import mongoose from "mongoose";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "https://muddiest-bob-veillike.ngrok-free.dev/"
    : "https://edupro-qnsy.onrender.com/";

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
      await axios.post(`${BASE_URL}api/v1/admin/user/purchase/course`, {
        userId: order.userId,
        courseId: order.courseId,
        price: order.price,
        orderId: order._id,
      });

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

  // Đăng ký khóa học miễn phí (salePrice = 0)
  async enrollFreeCourse(req: Request, res: Response) {
    try {
      const { userId, courseId, courseTitle } = req.body;

      if (!userId || !courseId || !courseTitle) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      // Validate ObjectId
      if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(courseId)
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid ID format",
        });
      }

      // Check if user exists
      const user = await User.findById(userId) as IUserDocument | null;
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if user already purchased this course
      if (user.hasPurchasedCourse(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đăng ký khóa học này rồi",
        });
      }

      // Tạo order với price = 0 và status = paid
      const order = await OrderService.createOrder({
        userId,
        courseId,
        courseTitle,
        price: 0,
        paymentMethod: "free",
        statusOrder: "completed",
        paymentStatus: "paid",
      });

      // Thêm course vào purchasedCourses của user (gọi trực tiếp model thay vì HTTP)
      const orderId = (order as any)._id;
      await user.addPurchasedCourse(
        new mongoose.Types.ObjectId(courseId),
        0,
        new mongoose.Types.ObjectId(orderId)
      );

      return res.json({
        success: true,
        message: "Đăng ký khóa học miễn phí thành công",
        order,
      });
    } catch (error: any) {
      console.error("Error enrolling free course:", error);
      console.error("Error details:", error.message);
      if (error.stack) {
        console.error("Stack trace:", error.stack);
      }
      
      // Check if user already purchased
      if (error.message === "Course already purchased") {
        return res.status(400).json({
          success: false,
          message: "Bạn đã đăng ký khóa học này rồi",
        });
      }

      return res.status(500).json({
        success: false,
        message: "Lỗi server khi đăng ký khóa học",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

export default new OrderController();
