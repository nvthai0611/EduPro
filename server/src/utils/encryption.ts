import CryptoJS from "crypto-js";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-secret-key-32-bytes-long!!!";

export const encryptData = (data: any): any => {
  try {
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      dataString,
      ENCRYPTION_KEY
    ).toString();

    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Không thể mã hóa dữ liệu");
  }
};

export const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedString) {
      throw new Error("Decryption failed");
    }

    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Không thể giải mã dữ liệu");
  }
};

/**
 * Middleware tự động giải mã request
 */
export const decryptMiddleware = (req: any, res: any, next: any) => {
  try {
    if (req.headers["x-encrypted"] === "true" && req.body?.encryptedData) {
      req.body = decryptData(req.body.encryptedData);
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Không thể giải mã dữ liệu",
      error: (error as Error).message,
    });
  }
};

/**
 * Middleware tự động mã hóa response
 */
export const encryptResponseMiddleware = (req: any, res: any, next: any) => {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    if (req.headers["x-encrypt-response"] === "true") {
      res.setHeader("X-Encrypted", "true");
      return originalJson(encryptData(data));
    }
    return originalJson(data);
  };

  next();
};