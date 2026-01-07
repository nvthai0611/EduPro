import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "../constains/auth";

const AuthMiddleware = ({ allowedRoles, children }) => {
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);

  const hostname = window.location.hostname;
  const isDash = hostname.startsWith("dash.");

  const redirectTo = isDash ? "/login" : "/";

  if (!token) return <Navigate to={redirectTo} replace />;

  try {
    const { role } = jwtDecode(token);
    if (!allowedRoles.includes(role)) {
      return <Navigate to={redirectTo} replace />;
    }
  } catch {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthMiddleware;
