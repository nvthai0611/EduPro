const express = require("express");
const router = express.Router();
const PayOS = require("@payos/node");
const axios = require("axios");
const { createPayosPaymentLinkController, handlePayosWebhookController } = require("../../../controllers/v1/users/cart.controller");
const authMiddleware = require("../../../middlewares/auth/v1/auth.middleware");
const { successResponse } = require("../../../utils/response");

require("dotenv").config();

const payos = new PayOS(process.env.PAYOS_CLIENT_ID, process.env.PAYOS_API_KEY, process.env.PAYOS_CHECKSUM_KEY)

// Fake Order for testing
const generateFakeOrder = () => ({
  orderCode: Math.floor(Date.now() / 1000),
  amount: 150000,
  description: "Thanh toán gói dịch vụ spa",
});

// tạo link thanh toán
router.post("/payment", authMiddleware, async (req, res) => {
  const { type } = req.body;
  console.log("Đang chọn thanh toán: ", type);

  if (!type) return res.status(400).json({ message: "Cần thêm type để biết loại thanh toán" });
  if (type == 'product') {
    createPayosPaymentLinkController(req, res)
  }
});

// Webhook trả về
router.post("/receive-hook", async (req, res) => {
  let parsedDescription = req.body.data.description;
  const type = parsedDescription;

  if (type.includes('Paymentforproduct')) {
    console.log("Thanh toán product");
    return await handlePayosWebhookController(req, res);
  }

  // TODO: xử lý các loại thanh toán khác nếu có
  return res.status(200).json({ message: "Webhook received but not handled (unknown type)" });
});


router.post("/payment-deposit", authMiddleware, async (req, res) => {
  const { amount, bookingData } = req.body;
  console.log("body:", bookingData, amount);
  const orderCode = `SePay${bookingData.phone}_${Date.now()}`;

  const paymentInfo = {
    bankName: "BIDV",
    accountNumber: "96247232323232323",
    accountName: "NGUYEN VAN TIEN HAI",
    amount: amount,
    note: orderCode
  };
  const qrUrl = `https://qr.sepay.vn/img?acc=${paymentInfo.accountNumber}&bank=${paymentInfo.bankName}&amount=${paymentInfo.amount}&des=${paymentInfo.note}&template=simple&download=true`;
  return successResponse(res, {
    ...paymentInfo,
    qrUrl
  },{}, 201, "Tạo thanh toán đặt cọc thành công");
});

router.post("/check-payment-status", async (req, res) => {
  const { note, amount } = req.body;
  console.log("note:", note, amount);
  try {
    const response = await axios.get("https://my.sepay.vn/userapi/transactions/list", {
      params: { account_number: "4271033504", limit: 20 },
      headers: { Authorization: `Bearer ${process.env.SEPAY_API_KEY}` }
    });
    console.log("response:", response.data);
    const found = response.data.transactions?.find(tx =>
      tx.transaction_content?.trim().includes(note.replace(/_/g, "")) &&
      parseInt(tx.amount_in) === parseInt(amount)
    );

    console.log("found:", found);
    if (found) {
      return res.json({ success: true, transaction: found });
    }

    return res.json({ success: false });
  } catch (err) {
    console.error("Error checking payment status:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
  module.exports = router;
