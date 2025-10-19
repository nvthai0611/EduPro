import { Outlet, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN, TYPE_AUTH } from "../constains/auth";
import Cookies from "js-cookie";

const GuestMiddleware = () => {
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);

  if (!token) {
    return <Outlet />;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // Nếu token hết hạn
    if (decoded.exp && decoded.exp < currentTime) {
      return <Navigate to="/dang-nhap" replace />;
    }

    const role = decoded.role;

    // Nếu là USER hoặc CUSTOMER -> redirect về trang chủ
    if (role === TYPE_AUTH.USER || role === TYPE_AUTH.CUSTOMER) {
      return <Navigate to="/" replace />;
    }

    // Các role khác thì redirect theo vai trò
    switch (role) {
      case TYPE_AUTH.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case TYPE_AUTH.STAFF:
      case TYPE_AUTH.MANAGER:
        return <Navigate to="/staff/schedule" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Token không hợp lệ
    return <Navigate to="/dang-nhap" replace />;
  }
};

export default GuestMiddleware;
