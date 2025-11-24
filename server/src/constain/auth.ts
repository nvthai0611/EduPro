// constants/messages.js
export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "Đăng ký thành công",
  INVALID_EMAIL_OR_PASSWORD: "Email hoặc mật khẩu không chính xác",
  INVALID_EMAIL_OR_PHONE: "Email hoặc số điện thoại không chính xác",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  VALIDATION_ERRORS: "Dữ liệu không hợp lệ",
  SERVER_ERROR: "Có lỗi xảy ra, vui lòng thử lại sau",
  INACTIVE_ACCOUNT: "Tài khoản đã bị vô hiệu hóa",
  BLOCKED_ACCOUNT: "Tài khoản đã bị khóa",
  PENDING_ACCOUNT: "Tài khoản đang chờ xác thực",
  UNAUTHORIZED: "Bạn không có quyền truy cập",
  INVALID_TOKEN: "Token không hợp lệ",
  EXPIRED_TOKEN: "Token đã hết hạn",
  TOKEN_NOT_FOUND: "Token không tồn tại",
  TOKEN_EXPIRED: "Token đã hết hạn",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  TOKEN_ACCEPT: "Token hợp lệ",
};

export  const AUTH_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
  PENDING: null,
  BLOCKED: null,
};

export  const TYPE_AUTH = {
  USER: "user",
  CUSTOMER: "customer",
  MANAGER: "manager",
  ADMIN: "admin",
  STAFF: "staff",
};

export  const POSITION = {
  MANAGER: "manager",
  SERVICE_STAFF: "serviceStaff",
};
