const PayOS = require("@payos/node");
require("dotenv").config();
const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY)

module.exports = function setupSocket(io) {
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

   // Client yêu cầu vào phòng theo role và branch
  socket.on("joinRoom", ({ role, branchId }) => {
    let roomName = "staff"; // mặc định
    if (branchId) {
      roomName = `branch_${branchId}`;
    }

    socket.join(roomName);
    console.log(`👤 ${role} joined room ${roomName}`);
  });
    // Gửi thông báo đến room
    socket.on("sendNotification", (data) => {
      console.log("Notification received:", data);
      io.to(data.room).emit("receiveNotification", data);
    });

    // Nhận yêu cầu tạo thanh toán
    // Tạo thanh toán khi client yêu cầu
    socket.on("init_payment", async ({ room, amount, description }) => {
      try {
        const orderCode = Number(String(Date.now()).slice(-10));

        const body = {
          orderCode,
          amount,
          description,
          returnUrl: process.env.FRONTEND_URL + "/qr-code-results",
          cancelUrl: process.env.FRONTEND_URL + "/qr-code-results",
          webhookUrl: process.env.PAYOS_WEBHOOK_URL,
        };

        const paymentLinkResponse = await payos.createPaymentLink(body);
        const { qrCode, checkoutUrl } = paymentLinkResponse;
        const room = "staff"; // Mặc định là room staff
        // Gửi QR code cho room tương ứng
        io.to(room).emit("payment_ready", {
          amount,
          description,
          qrCode,
          checkoutUrl,
        });
      } catch (err) {
        console.error("PayOS error:", err?.response?.data || err);
        io.to(room).emit("payment_error", "Không tạo được QR");
      }
    });
    //Nhận đơn hàng mới từ client user → bắn cho admin. Đây là cho phần checkout success Orders
    socket.on("new_order", (orderData) => {
      console.log("New order received:", orderData);
      const adminRoom = io.sockets.adapter.rooms.get("admin");
      console.log("👥 Admin room sockets:", adminRoom ? [...adminRoom] : "❌ Empty");
      io.to("admin").emit("admin_new_order", orderData);
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
