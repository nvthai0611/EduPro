import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "../constains/auth";

const RoleRedirect = () => {
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    const role = decoded?.role;
    if (role === "manager") return <Navigate to="/staff/dashboard" />;
    if (role === "staff") return <Navigate to="/staff/schedule" />;
  } catch (e) {
    return <Navigate to="/" />;
  }

  return <Navigate to="/" />;
};

export default RoleRedirect;
