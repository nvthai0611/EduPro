import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { TYPE_AUTH } from "../../constains/auth";
import { ERROR_MESSAGES } from "../../constains/error";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    let isValid = true;

    // --- CLIENT-SIDE VALIDATION CỰC KỸ ---

    // 1. Validate Email
    if (!email.trim()) {
      setEmailError("Email không được để trống!");
      isValid = false;
    } else if (!isValidEmail(email.trim())) {
      setEmailError("Email không đúng định dạng. Ví dụ: user@example.com");
      isValid = false;
    }

    // 2. Validate Mật khẩu (Cập nhật phần này)
    if (!password.trim()) {
      setPasswordError("Mật khẩu không được để trống!"); // Changed message
      isValid = false;
    } else if (password.trim().length < 8) {
      setPasswordError("Mật khẩu phải có ít nhất 8 ký tự."); // Changed message
      isValid = false;
    } else if (!/[A-Z]/.test(password.trim())) { // Ít nhất 1 chữ hoa
      setPasswordError("Mật khẩu phải chứa ít nhất một chữ cái viết hoa."); // Changed message
      isValid = false;
    } else if (!/[a-z]/.test(password.trim())) { // Ít nhất 1 chữ thường
      setPasswordError("Mật khẩu phải chứa ít nhất một chữ cái viết thường."); // Changed message
      isValid = false;
    // eslint-disable-next-line no-useless-escape
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password.trim())) { // Ít nhất 1 ký tự đặc biệt
      setPasswordError("Mật khẩu phải chứa ít nhất một ký tự đặc biệt."); // Changed message
      isValid = false;
    } else if (!/[0-9]/.test(password.trim())) { // Add check for at least 1 number
      setPasswordError("Mật khẩu phải chứa ít nhất một chữ số."); // Added this validation and message
      isValid = false;
    }


    // Nếu có lỗi client-side, dừng quá trình gửi form
    if (!isValid) {
      return;
    }

    // Nếu validation client-side thành công, bắt đầu gửi yêu cầu
    setIsLoading(true);
    try {
      const response = await login({
        email: email.trim(),
        password: password.trim(),
        type: TYPE_AUTH.MANAGER,
      });

      // --- SERVER-SIDE RESPONSE HANDLING ---
      if (!response.success) {
        if (response?.message) {
          if (typeof response.message === 'string') {
            setGeneralError(response.message);
          } else if (response.message.email) {
            setEmailError(response.message.email);
          } else if (response.message.password) {
            setPasswordError(response.message.password);
          } else {
            setGeneralError(
              ERROR_MESSAGES?.INVALID_EMAIL_OR_PASSWORD ||
              ERROR_MESSAGES?.INACTIVE_ACCOUNT ||
              ERROR_MESSAGES?.BLOCKED_ACCOUNT ||
              ERROR_MESSAGES?.PENDING_ACCOUNT ||
              ERROR_MESSAGES?.TOO_MANY_REQUESTS ||
              ERROR_MESSAGES?.SERVER_ERROR ||
              "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
            );
          }
        } else {
          setGeneralError(ERROR_MESSAGES.SERVER_ERROR || "Đã xảy ra lỗi không xác định từ máy chủ.");
        }
        setIsOpen(true);
        setIsLoading(false);
        return;
      }

      // --- Đăng nhập thành công ---
      if (response.success) {
        const decoded = jwtDecode(response.data.accessToken);
        if (decoded.role === TYPE_AUTH.ADMIN) {
          alert("Đăng nhập thành công với vai trò admin.");
          window.location.href = "/admin/dashboard";
        } else if (decoded.role === TYPE_AUTH.STAFF || decoded.role === TYPE_AUTH.MANAGER) {
          alert("Đăng nhập thành công với vai trò staff/manager.");
          window.location.href = "/staff";
        } else {
          setGeneralError("Bạn không có quyền truy cập vào hệ thống.");
        }
      }

      if (window.location.href === window.location.origin + '/') {
          setIsOpen(false);
      }
    } catch (error) {
      console.error("Login API call failed:", error);
      setGeneralError(ERROR_MESSAGES.SERVER_ERROR || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        zIndex: 999999,
      }}
      onClick={() => !isLoading && setIsOpen(false)}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "20px 24px",
          borderRadius: 6,
          width: 300,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          fontFamily: "Arial, sans-serif",
          userSelect: "none",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: 12,
            fontWeight: "bold",
            fontSize: 18,
            textAlign: "center",
          }}
        >
          Đăng nhập
        </h3>

        {generalError && (
          <p style={{ color: "red", margin: "0", fontSize: 14, textAlign: "center" }}>
            {generalError}
          </p>
        )}

        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
            setGeneralError("");
          }}
          style={{
            padding: "8px",
            fontSize: 16,
            borderRadius: 4,
            border: emailError ? "1px solid red" : "1px solid #ccc",
            outline: "none",
          }}
          autoFocus
          required
          disabled={isLoading}
        />
        {emailError && (
          <p style={{ color: "red", margin: "-8px 0 0 0", fontSize: 12 }}>
            {emailError}
          </p>
        )}

        <input
          type="password"
          id="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
            setGeneralError("");
          }}
          style={{
            padding: "8px",
            fontSize: 16,
            borderRadius: 4,
            border: passwordError ? "1px solid red" : "1px solid #ccc",
            outline: "none",
          }}
          required
          disabled={isLoading}
        />
        {passwordError && (
          <p style={{ color: "red", margin: "-8px 0 0 0", fontSize: 12 }}>
            {passwordError}
          </p>
        )}

        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: "10px",
            fontSize: 16,
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          style={{
            marginTop: 8,
            padding: "6px",
            fontSize: 14,
            backgroundColor: "transparent",
            color: "#007bff",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
          }}
          disabled={isLoading}
        >
          Hủy
        </button>
      </form>
    </div>
  );
}