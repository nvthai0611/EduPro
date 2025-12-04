# Encryption Utility - Backend

Tiện ích mã hóa/giải mã dữ liệu sử dụng AES-256-CBC cho backend.

## Cài đặt

Module `crypto` đã có sẵn trong Node.js, không cần install thêm.

## Cấu hình

Thêm vào `.env`:

```env
ENCRYPTION_KEY=your-secret-key-32-bytes-long!!!
```

**Lưu ý:** Key phải giống với `VITE_ENCRYPTION_KEY` ở frontend để mã hóa/giải mã được.

## Sử dụng

### 1. Import

```typescript
import {
  encryptData,
  decryptData,
  encryptResponse,
  decryptMiddleware,
  encryptResponseMiddleware,
} from "../utils/encryption";
```

### 2. Mã hóa dữ liệu thủ công

```typescript
// Mã hóa object
const user = { id: 1, name: "John" };
const encrypted = encryptData(user);
// Output: "abc123:def456..." (iv:encryptedData)

// Giải mã
const decrypted = decryptData(encrypted);
// Output: { id: 1, name: "John" }
```

### 3. Mã hóa response

```typescript
router.get("/sensitive-data", (req, res) => {
  const sensitiveData = {
    ssn: "123-45-6789",
    creditCard: "1234-5678-9012-3456",
  };

  res.setHeader("X-Encrypted", "true");
  res.json(encryptResponse(sensitiveData));
});
```

### 4. Sử dụng Middleware

#### a. Giải mã request tự động

```typescript
import express from "express";
import { decryptMiddleware } from "./utils/encryption";

const app = express();
app.use(express.json());

// Áp dụng cho tất cả routes
app.use(decryptMiddleware);

// Hoặc áp dụng cho route cụ thể
router.post("/secure-endpoint", decryptMiddleware, (req, res) => {
  // req.body đã được giải mã tự động
  console.log(req.body); // { username: "john", password: "secret" }
  res.json({ success: true });
});
```

#### b. Mã hóa response tự động

```typescript
import { encryptResponseMiddleware } from "./utils/encryption";

// Áp dụng cho tất cả routes
app.use(encryptResponseMiddleware);

router.get("/user", (req, res) => {
  // Response sẽ tự động mã hóa nếu client gửi header X-Encrypt-Response: true
  res.json({ id: 1, name: "John" });
});
```

### 5. Frontend gửi request với mã hóa

```javascript
// Client (Frontend)
const response = await apiClient.post(
  "/secure-endpoint",
  { username: "john", password: "secret" },
  null,
  "application/json",
  true // encrypt = true
);
```

## Flow hoàn chỉnh

### Request được mã hóa:

```
Frontend → encryptData(body) → Send POST → Backend → decryptMiddleware → Controller
```

### Response được mã hóa:

```
Controller → res.json(data) → encryptResponseMiddleware → encryptData → Frontend → decryptData
```

## Ví dụ đầy đủ

```typescript
import express from "express";
import {
  decryptMiddleware,
  encryptResponseMiddleware,
  encryptResponse,
} from "./utils/encryption";

const app = express();
app.use(express.json());

// Global middlewares
app.use(decryptMiddleware); // Tự động giải mã request
app.use(encryptResponseMiddleware); // Tự động mã hóa response nếu client yêu cầu

// Route example
router.post("/auth/login", async (req, res) => {
  // req.body đã được giải mã (nếu client gửi encrypted)
  const { email, password } = req.body;

  const user = await authenticate(email, password);

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Response sẽ tự động mã hóa nếu client gửi header X-Encrypt-Response: true
  res.json({
    success: true,
    data: {
      token: user.token,
      user: user,
    },
  });
});

// Route với mã hóa bắt buộc
router.get("/sensitive-data", (req, res) => {
  const data = { ssn: "123-45-6789" };

  // Luôn mã hóa response này
  res.setHeader("X-Encrypted", "true");
  res.json(encryptResponse(data));
});
```

## Lưu ý bảo mật

1. **ENCRYPTION_KEY phải giống nhau** giữa frontend và backend
2. **Không commit key** vào git - dùng environment variables
3. **HTTPS bắt buộc** trong production
4. **Mã hóa sensitive data** như password, credit card, SSN
5. **IV (Initialization Vector)** được tạo random mỗi lần mã hóa để tăng bảo mật

## Troubleshooting

### Lỗi "Không thể giải mã dữ liệu"

- Kiểm tra `ENCRYPTION_KEY` giống nhau giữa FE và BE
- Kiểm tra format của encrypted data (phải có dạng `iv:encryptedData`)

### Lỗi "Invalid encrypted data format"

- Data bị corrupt trong quá trình truyền
- Kiểm tra encoding (phải là hex)
