# 🏦 Hệ thống đặt cọc thông minh cho Spa Booking

## 📋 Tổng quan

Hệ thống đặt cọc thông minh được tích hợp vào quy trình booking spa, giúp giảm thiểu rủi ro thất thoát và đảm bảo cam kết của khách hàng.

## 🎯 Chính sách đặt cọc

### Tiêu chí đặt cọc:
- **Tổng tiền booking > 500K**: Đặt cọc 10%–30%
- **Số dịch vụ ≥ 3**: Đặt cọc cố định 100K
- **Thời lượng booking ≥ 90 phút**: Đặt cọc 20%
- **Booking giờ cao điểm (17h–20h)**: Luôn yêu cầu đặt cọc

### Tỷ lệ đặt cọc:
- **Booking giá trị cao (>1M)**: 30%
- **Booking giá trị trung bình (500K-1M)**: 10%
- **Booking thời lượng dài (≥90 phút)**: 20%
- **Giờ cao điểm**: Tối thiểu 10%
- **Giới hạn tối đa**: 50% tổng tiền booking

## 🛠️ Cấu trúc hệ thống

### 1. Utility Functions (`utils/depositPolicy.js`)
```javascript
// Phân tích yêu cầu đặt cọc
const analysis = analyzeDepositRequirement({
  totalPrice: 800000,
  selectedServices: [...],
  selectedTime: "18:00",
  selectedDate: {...}
});

// Tạo thông báo đặt cọc
const message = generateDepositMessage(analysis);
```

### 2. Components

#### DepositModal (`components/DepositModal/DepositModal.jsx`)
- Modal hiển thị thông tin đặt cọc
- Chọn phương thức thanh toán (PayOS, ZaloPay, MoMo)
- Xử lý thanh toán đặt cọc

#### DepositInfo (`components/DepositInfo/DepositInfo.jsx`)
- Component hiển thị thông tin đặt cọc trong trang xác nhận
- Hiển thị lý do đặt cọc và thông tin chi tiết

### 3. Services (`services/user/depositService.js`)

#### Thanh toán đặt cọc:
```javascript
// Tạo thanh toán PayOS
const payosResult = await createPayOSDeposit(depositData);

// Tạo thanh toán ZaloPay
const zalopayResult = await createZaloPayDeposit(depositData);

// Tạo thanh toán MoMo
const momoResult = await createMoMoDeposit(depositData);
```

#### Tạo booking:
```javascript
// Tạo booking với đặt cọc
const bookingWithDeposit = await createBookingWithDeposit(bookingData, depositInfo);

// Tạo booking không đặt cọc
const bookingWithoutDeposit = await createBookingWithoutDeposit(bookingData);
```

### 4. Store Integration (`stores/zustand/bookingStore.js`)
```javascript
// Các trường đặt cọc trong store
depositStatus: false,
depositAmount: 0,
depositPercentage: 0,
depositReasons: [],
paymentMethod: null,
```

## 🔄 Quy trình hoạt động

### 1. Phân tích đặt cọc
```javascript
// Trong ConfirmBooking.jsx
const depositAnalysis = analyzeDepositRequirement({
  totalPrice,
  selectedServices,
  selectedTime,
  selectedDate,
});

if (depositAnalysis.requiresDeposit) {
  // Hiển thị modal đặt cọc
  setDepositModal({ isOpen: true, analysis: depositAnalysis });
}
```

### 2. Xử lý thanh toán
```javascript
// Xử lý thanh toán đặt cọc
const handleProceedWithDeposit = async (paymentMethod, depositAmount) => {
  const paymentResult = await processDepositPayment(paymentMethod, depositData);
  
  if (paymentResult.success) {
    // Chuyển hướng đến trang thanh toán
    window.location.href = paymentResult.redirectUrl;
  }
};
```

### 3. Callback xử lý kết quả
```javascript
// Trong DepositCallback.jsx
if (returnCode === '1') {
  // Thanh toán thành công
  const bookingResult = await createBookingWithDeposit(bookingData, depositInfo);
  // Xóa thông tin đặt cọc
  clearDepositInfo();
}
```

## 📱 Giao diện người dùng

### 1. Thông tin đặt cọc trong trang xác nhận
- Hiển thị số tiền đặt cọc và tỷ lệ
- Liệt kê lý do đặt cọc
- Thông tin chi tiết (số dịch vụ, thời lượng, giờ cao điểm)

### 2. Modal đặt cọc
- Chọn phương thức thanh toán
- Thông tin bảo mật
- Tùy chọn đặt lịch không đặt cọc

### 3. Trang callback
- Hiển thị kết quả thanh toán
- Thông tin giao dịch
- Điều hướng sau thanh toán

## 🔧 Cấu hình

### 1. Ngưỡng đặt cọc (`utils/depositPolicy.js`)
```javascript
export const DEPOSIT_THRESHOLDS = {
  TOTAL_PRICE: 500000, // 500K VND
  SERVICE_COUNT: 3, // Số dịch vụ
  DURATION_MINUTES: 90, // Thời lượng booking
  PEAK_HOURS: {
    START: 17, // 17h
    END: 20, // 20h
  },
  FIXED_DEPOSIT: 100000, // 100K VND
};
```

### 2. Tỷ lệ đặt cọc
```javascript
export const DEPOSIT_RATES = {
  HIGH_VALUE: { min: 0.10, max: 0.30 }, // 10-30%
  DURATION_BASED: 0.20, // 20%
};
```

## 🚀 Tích hợp với hệ thống hiện có

### 1. Backend API
- Cập nhật model Booking để thêm các trường đặt cọc
- Tạo API endpoints cho thanh toán đặt cọc
- Xử lý webhook từ các cổng thanh toán

### 2. Frontend Routes
```javascript
// Thêm route cho callback
{
  path: "/booking/deposit/callback",
  element: <DepositCallback />
}
```

### 3. Database Schema
```javascript
// Thêm vào model Booking
depositStatus: { type: Boolean, default: false },
depositAmount: { type: Number, default: 0 },
depositPercentage: { type: Number, default: 0 },
depositReasons: [{ type: String }],
paymentMethod: { type: String },
paymentId: { type: String },
```

## 📊 Monitoring và Analytics

### 1. Tracking
- Tỷ lệ booking cần đặt cọc
- Tỷ lệ thanh toán đặt cọc thành công
- Phương thức thanh toán phổ biến

### 2. Reporting
- Báo cáo doanh thu đặt cọc
- Phân tích hành vi khách hàng
- Hiệu quả chính sách đặt cọc

## 🔒 Bảo mật

### 1. Thanh toán
- Mã hóa SSL 256-bit
- Xác thực giao dịch
- Bảo mật thông tin cá nhân

### 2. Dữ liệu
- Lưu trữ an toàn thông tin đặt cọc
- Xóa dữ liệu tạm sau khi xử lý
- Backup và recovery

## 🧪 Testing

### 1. Unit Tests
```javascript
// Test phân tích đặt cọc
test('should require deposit for high value booking', () => {
  const analysis = analyzeDepositRequirement({
    totalPrice: 600000,
    selectedServices: [],
    selectedTime: "14:00"
  });
  expect(analysis.requiresDeposit).toBe(true);
});
```

### 2. Integration Tests
- Test quy trình thanh toán end-to-end
- Test callback handling
- Test error scenarios

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✅ Tích hợp hệ thống đặt cọc thông minh
- ✅ Hỗ trợ PayOS, ZaloPay, MoMo
- ✅ UI/UX cho modal đặt cọc
- ✅ Callback handling
- ✅ Store integration

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ:
- Email: support@spabooking.com
- Hotline: 1900-xxxx
- Documentation: [Link to docs] 