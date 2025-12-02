// src/repositories/order.repository.ts
import Order, { IOrder } from "./order.model";
import { Types } from "mongoose";

class OrderRepository {
  async getAllOrders() {
    return await Order.find({
      statusOrder: "completed",
      paymentStatus: "paid",
    })
      .populate("userId", "fullName email")
      .populate("courseId", "title thumbnail description")
      .lean();
  }

  async createOrder(data: Partial<IOrder>) {
    return Order.create(data);
  }

  async getOrderById(orderId: string) {
    return Order.findById(orderId);
  }

  async getUserOrderForCourse(userId: string, courseId: string) {
    return Order.findOne({ userId, courseId });
  }

  async updateOrder(order: IOrder) {
    return order.save();
  }

  async markAsPaid(orderId: string) {
    return Order.findById(orderId).then((order) => {
      if (!order) return null;
      return order.markAsPaid();
    });
  }

  // Check user đã mua khóa học chưa
  async hasUserPurchasedCourse(userId: string, courseId: string) {
    return Order.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      statusOrder: "completed",
      paymentStatus: "paid"
    });
  }
}

export default new OrderRepository();