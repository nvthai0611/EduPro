import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "../constains/auth";

const AuthMiddleware = ({ allowedRoles, children }) => {
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
  let role = null;

  if (!token) return <Navigate to="/" />;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (e) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) return <Navigate to="/" />;

  return children;
};

export default AuthMiddleware;
