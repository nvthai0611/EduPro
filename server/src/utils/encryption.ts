import crypto from "crypto";

const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-secret-key-32-bytes-long!!!";
const ALGORITHM = "aes-256-cbc";

// Đảm bảo key có độ dài 32 bytes
const getKey = (): Buffer => {
  const key = ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32);
  return Buffer.from(key, "utf-8");
};

/**
 * Mã hóa dữ liệu
 * @param data - Dữ liệu cần mã hóa (object hoặc string)
 * @returns Chuỗi đã mã hóa (hex)
 */
export const encryptData = (data: any): string => {
  try {
    const dataString = typeof data === "string" ? data : JSON.stringify(data);

    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);

    let encrypted = cipher.update(dataString, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Trả về iv + encrypted data (cách nhau bởi :)
    return iv.toString("hex") + ":" + encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Không thể mã hóa dữ liệu");
  }
};

/**
 * Giải mã dữ liệu
 * @param encryptedData - Chuỗi đã mã hóa (hex)
 * @returns Dữ liệu gốc (object hoặc string)
 */
export const decryptData = (encryptedData: string): any => {
  try {
    const parts = encryptedData.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];

    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    // Thử parse JSON, nếu không được thì trả về string
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Không thể giải mã dữ liệu");
  }
};

/**
 * Middleware để tự động giải mã request body nếu có header X-Encrypted
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
 * Helper để mã hóa response
 * @param data - Dữ liệu cần mã hóa
 * @returns Object với encryptedData
 */
export const encryptResponse = (data: any) => {
  return {
    encryptedData: encryptData(data),
  };
};

/**
 * Middleware để tự động mã hóa response nếu client yêu cầu
 */
export const encryptResponseMiddleware = (req: any, res: any, next: any) => {
  const originalJson = res.json.bind(res);

  res.json = function (data: any) {
    // Chỉ mã hóa nếu client gửi header yêu cầu
    if (req.headers["x-encrypt-response"] === "true") {
      res.setHeader("X-Encrypted", "true");
      return originalJson(encryptResponse(data));
    }
    return originalJson(data);
  };

  next();
};
