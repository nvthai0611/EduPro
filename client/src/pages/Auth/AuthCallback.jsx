import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AUTH_TOKEN } from "../../constains/auth";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("auth");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const isProd = import.meta.env.MODE === "production";

    const cookieOptions = {
      path: "/",
      sameSite: "lax",
      ...(isProd && { domain: ".fuedupro.com" }),
    };

    Cookies.set(AUTH_TOKEN.ACCESS_TOKEN, token, cookieOptions);

    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return null;
}