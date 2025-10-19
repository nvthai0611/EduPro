const PayOS = require("@payos/node");
const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Course = require("../../models/course.model");
const Bundle = require("../../models/bundle.model");
const Coupon = require("../../models/coupon.model");
const { responseSuccess, responseError } = require("../../utils/response");

require("dotenv").config();

const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

// Create PayOS payment link for course/bundle purchase
const createPaymentLink = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.user.id;

    // Get order
    const order = await Order.findById(orderId).populate("items.itemId");
    if (!order) {
      return res.status(404).json(responseError("Không tìm thấy đơn hàng"));
    }

    // Check if order belongs to user
    if (order.userId.toString() !== userId) {
      return res.status(403).json(responseError("Bạn không có quyền truy cập đơn hàng này"));
    }

    // Check if order is still pending
    if (order.statusOrder !== "pending") {
      return res.status(400).json(responseError("Đơn hàng đã được xử lý"));
    }

    // Generate order code
    const orderCode = Math.floor(Date.now() / 1000) + Math.floor(Math.random() * 1000);

    // Create payment data
    const paymentData = {
      orderCode: orderCode,
      amount: order.total,
      description: `Thanh toán khóa học - ${order.items.map(item => item.title).join(", ")}`,
      items: order.items.map(item => ({
        name: item.title,
        quantity: 1,
        price: item.discountedPrice,
      })),
      returnUrl: `${process.env.FRONTEND_URL}/payment/success?orderId=${orderId}`,
      cancelUrl: `${process.env.FRONTEND_URL}/payment/cancel?orderId=${orderId}`,
    };

    // Create payment link
    const paymentLink = await payos.createPaymentLink(paymentData);

    // Update order with payment info
    order.paymentId = orderCode.toString();
    order.statusOrder = "processing";
    await order.save();

    res.json(
      responseSuccess({
        paymentUrl: paymentLink.checkoutUrl,
        orderCode: orderCode,
        amount: order.total,
        description: paymentData.description,
      })
    );
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json(responseError("Lỗi khi tạo link thanh toán"));
  }
};

// Handle PayOS webhook
const handleWebhook = async (req, res) => {
  try {
    const { data } = req.body;
    const { orderCode, status } = data;

    console.log("PayOS Webhook received:", { orderCode, status });

    // Find order by payment ID
    const order = await Order.findOne({ paymentId: orderCode.toString() });
    if (!order) {
      console.log("Order not found for payment ID:", orderCode);
      return res.status(200).json({ message: "Order not found" });
    }

    if (status === "PAID") {
      // Mark order as completed
      await order.markAsPaid(orderCode.toString());

      // Add purchased items to user
      const user = await User.findById(order.userId);
      
      for (const item of order.items) {
        if (item.type === "course") {
          await user.addPurchasedCourse(item.itemId, item.discountedPrice, orderCode.toString());
        } else if (item.type === "bundle") {
          await user.addPurchasedBundle(item.itemId, item.discountedPrice, orderCode.toString());
        }
      }

      // Increment coupon usage if used
      if (order.couponUsed) {
        const coupon = await Coupon.findById(order.couponUsed);
        if (coupon) {
          await coupon.incrementUsage();
        }
      }

      // Update course/bundle student counts
      for (const item of order.items) {
        if (item.type === "course") {
          await Course.findByIdAndUpdate(item.itemId, {
            $inc: { totalStudents: 1 },
          });
        } else if (item.type === "bundle") {
          await Bundle.findByIdAndUpdate(item.itemId, {
            $inc: { totalStudents: 1 },
          });
        }
      }

      console.log("Payment processed successfully for order:", order._id);
    } else if (status === "CANCELLED") {
      // Mark order as cancelled
      order.statusOrder = "cancelled";
      order.paymentStatus = "failed";
      await order.save();
      
      console.log("Payment cancelled for order:", order._id);
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Error handling PayOS webhook:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

// Check payment status
const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json(responseError("Không tìm thấy đơn hàng"));
    }

    if (order.userId.toString() !== userId) {
      return res.status(403).json(responseError("Bạn không có quyền truy cập đơn hàng này"));
    }

    res.json(
      responseSuccess({
        orderId: order._id,
        status: order.statusOrder,
        paymentStatus: order.paymentStatus,
        total: order.total,
        items: order.items,
        createdAt: order.createdAt,
      })
    );
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json(responseError("Lỗi khi kiểm tra trạng thái thanh toán"));
  }
};

module.exports = {
  createPaymentLink,
  handleWebhook,
  checkPaymentStatus,
};
