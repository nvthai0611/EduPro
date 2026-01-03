import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_TOKEN } from "../constains/auth";

const AuthMiddleware = ({ allowedRoles, children }) => {
  const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
  let role = null;

  const hostname = typeof window !== "undefined" ? window.location.hostname : "";
  const isDash = hostname === "dash.fuedupro.com" || hostname.startsWith("dash.");

  const redirectTo = isDash ? "/login" : "/";

  if (!token) return <Navigate to={redirectTo} />;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (e) {
    return <Navigate to={redirectTo} />;
  }

  if (!allowedRoles.includes(role)) return <Navigate to={redirectTo} />;

  return children;
};

export default AuthMiddleware;
