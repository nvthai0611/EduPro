const express = require("express");
const router = express.Router();
const moment = require("moment");
const qs = require("qs");
const CryptoJS = require("crypto-js");
const axios = require("axios");
const User = require("../../../models/user.model");
// APP INFO, STK TEST: 4111 1111 1111 1111
const config = {
  app_id: "2553",
  key1: "PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL",
  key2: "kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz",
  endpoint: "https://sb-openapi.zalopay.vn/v2/create",
};

// API Tạo Đơn Hàng và Gửi Thanh Toán
router.post("/payment", async (req, res) => {
  const { user_id, amount, description, method, rank } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!user_id || !amount || !description || !method || !rank) {
    return res.status(400).json({ message: "Thiếu dữ liệu đầu vào" });
  }
  try {
    // Kiểm tra user có tồn tại không
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    // Tạo mã giao dịch
    const transID = Math.floor(Math.random() * 1000000);
    const app_trans_id = `${moment().format("YYMMDD")}_${transID}`;
    // Lưu đơn hàng
    // let order = new Order({
    //   app_trans_id,
    //   user: user._id, // Đảm bảo dùng ObjectId
    //   amount,
    //   description,
    //   method,
    //   rank,
    //   status: "pending",
    // });
    // await order.save();
    // Dữ liệu embed (chứa URL chuyển hướng sau khi thanh toán)
    const embed_data = {
      redirecturl: "http://localhost:3001/quan-ly/nap-tien-thanh-cong",
    };
    // Chuẩn bị dữ liệu gửi đến cổng thanh toán
    const orderData = {
      app_id: config.app_id,
      app_trans_id,
      app_user: user._id.toString(), // Chuyển ObjectId thành string
      app_time: Date.now(),
      item: JSON.stringify([]),
      embed_data: JSON.stringify(embed_data),
      amount,
      callback_url:"https://cf20-58-186-240-10.ngrok-free.app/api/zalo/callback",
      description,
      bank_code: "",
    };

    // Tạo MAC (mã bảo mật)
    const data = `${config.app_id}|${orderData.app_trans_id}|${orderData.app_user}|${orderData.amount}|${orderData.app_time}|${orderData.embed_data}|${orderData.item}`;
    orderData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

    // Gửi request đến cổng thanh toán
    const result = await axios.post(config.endpoint, null, {
      params: orderData,
    });

    return res.status(200).json(result.data);
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    return res
      .status(500)
      .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
});
/**
 * method: POST
 * description: callback để Zalopay Server call đến khi thanh toán thành công.
 * Khi và chỉ khi ZaloPay đã thu tiền khách hàng thành công thì mới gọi API này để thông báo kết quả.
 */
// API Xác Nhận Thanh Toán từ ZaloPay
router.post("/callback", async (req, res) => {
  let result = {};
  try {
    const { data, mac } = req.body;

    // Tạo chữ ký xác minh
    const expectedMac = CryptoJS.HmacSHA256(data, config.key2).toString();
    if (mac !== expectedMac) {
      return res.json({ return_code: -1, return_message: "Invalid MAC" });
    }

    // Parse dữ liệu từ ZaloPay
    const paymentData = JSON.parse(data);
    const { app_trans_id } = paymentData;

    // Cập nhật trạng thái đơn hàng
    // const order = await Order.findOne({ app_trans_id });
    // if (!order) {
    //   return res.json({ return_code: 0, return_message: "Order not found" });
    // }
    // order.status = "success";
    // await order.save();
    console.log(`Order ${app_trans_id} đã thanh toán thành công!`);
    result.return_code = 1;
    result.return_message = "Success";
  } catch (error) {
    console.error("Lỗi callback:", error);
    result.return_code = 0;
    result.return_message = "Callback error";
  }

  return res.json(result);
});

/**
 * method: POST
 * Sandbox	POST	https://sb-openapi.zalopay.vn/v2/query
 * Real	POST	https://openapi.zalopay.vn/v2/query
 * description:
 * Khi user thanh toán thành công,
 * ZaloPay sẽ gọi callback (notify) tới merchant để merchant cập nhật trạng thái
 * đơn hàng Thành Công trên hệ thống. Trong thực tế callback có thể bị miss do lỗi Network timeout,
 * Merchant Service Unavailable/Internal Error...
 * nên Merchant cần hiện thực việc chủ động gọi API truy vấn trạng thái đơn hàng.
 */

router.post("/check-status-order", async (req, res) => {
  const { app_trans_id } = req.body;

  let postData = {
    app_id: config.app_id,
    app_trans_id, // Input your app_trans_id
  };

  let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
  postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

  let postConfig = {
    method: "post",
    url: "https://sb-openapi.zalopay.vn/v2/query",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify(postData),
  };

  try {
    const result = await axios(postConfig);
    console.log(result.data);
    return res.status(200).json(result.data);
    /**
     * kết quả mẫu
      {
        "return_code": 1, // 1 : Thành công, 2 : Thất bại, 3 : Đơn hàng chưa thanh toán hoặc giao dịch đang xử lý
        "return_message": "",
        "sub_return_code": 1,
        "sub_return_message": "",
        "is_processing": false,
        "amount": 50000,
        "zp_trans_id": 240331000000175,
        "server_time": 1711857138483,
        "discount_amount": 0
      }
    */
  } catch (error) {
    console.log("lỗi");
    console.log(error);
  }
});
module.exports = router;
