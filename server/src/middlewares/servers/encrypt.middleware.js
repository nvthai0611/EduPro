require("dotenv").config();
const CryptoJS = require("crypto-js");

// Khóa mã hóa từ biến môi trường
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "dua_key_ma_hoa_vao_day_nhe_chung_may";

// Hàm mã hóa dữ liệu
const encryptData = (data) => {
  try {
    if (!data) return data;
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      dataString,
      ENCRYPTION_KEY
    ).toString();
    return { encryptedData: encrypted };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Không thể mã hóa dữ liệu");
  }
};

// Hàm giải mã dữ liệu
const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return encryptedData;
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) throw new Error("Decryption failed");
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Không thể giải mã dữ liệu");
  }
};

// Middleware mã hóa và giải mã
const encryptionMiddleware = (req, res, next) => {
  // Lưu hàm res.json gốc
  const originalJson = res.json;

  // Ghi đè res.json để mã hóa dữ liệu trả về
  res.json = function (data) {
    // Kiểm tra header X-Encrypted từ client
    const shouldEncrypt = req.headers["x-encrypted"] === "true";

    if (shouldEncrypt) {
      try {
        const encryptedResponse = encryptData(data);
        res.set("x-encrypted", "true"); // Báo cho client dữ liệu đã mã hóa
        return originalJson.call(this, encryptedResponse);
      } catch (error) {
        return originalJson.call(this, {
          status: 500,
          message: "Lỗi mã hóa dữ liệu",
          error: error.message,
        });
      }
    }
    // Nếu không mã hóa, dùng res.json bình thường
    return originalJson.call(this, data);
  };

  // Giải mã dữ liệu từ client nếu có
  if (req.headers["x-encrypted"] === "true" && req.body.encryptedData) {
    try {
      req.body = decryptData(req.body.encryptedData);
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Không thể giải mã dữ liệu từ client",
        error: error.message,
      });
    }
  }

  next();
};

module.exports = encryptionMiddleware;
