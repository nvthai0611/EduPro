const express = require("express");
const router = express.Router();
const {
  createPaymentLink,
  handleWebhook,
  checkPaymentStatus,
} = require("../../controllers/v1/payos.controller");
const { authenticateToken } = require("../../middlewares/auth/authenticateToken");

// Public webhook (no auth required)
router.post("/receive-hook", handleWebhook);

// Authenticated routes
router.use(authenticateToken);

router.post("/payment", createPaymentLink);
router.get("/status/:orderId", checkPaymentStatus);

module.exports = router;
