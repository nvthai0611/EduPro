// src/services/order.service.ts
import OrderRepository from "./order.repository";
import { Types } from "mongoose";

class OrderService {
  async createOrder(payload: {
    userId: string;
    courseId: string;
    courseTitle: string;
    price: number;
    paymentMethod: string;
    notes: string;
  }) {
    return OrderRepository.createOrder({
      userId: new Types.ObjectId(payload.userId),
      courseId: new Types.ObjectId(payload.courseId),
      courseTitle: payload.courseTitle,
      price: payload.price,
      paymentMethod: payload.paymentMethod as any,
      notes: payload.notes as any,
    });
  }

  async getOrderById(orderId: string) {
    return OrderRepository.getOrderById(orderId);
  }

  async markOrderPaid(orderId: string) {
    return OrderRepository.markAsPaid(orderId);
  }

  async checkUserPurchased(userId: string, courseId: string) {
    return OrderRepository.hasUserPurchasedCourse(userId, courseId);
  }
}

export default new OrderService();