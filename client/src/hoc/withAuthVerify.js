"use client";
import { useEffect, useState } from "react"; // Thêm React
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { AUTH_TOKEN } from "../constains/auth";
import { apiClient } from "../utils/clientAxios";

const withAuthVerify = (Component, allowedRoles = []) => {
  const WrappedComponent = (props) => {
    const navigate = useNavigate();
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const checkToken = async () => {
        const token = Cookies.get(AUTH_TOKEN.ACCESS_TOKEN);
        if (!token) {
          navigate("/dang-nhap");
          return;
        }

        try {
          const res = await apiClient.get("/auth/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const { role } = res.data;

          if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
            navigate("/");
            return;
          }

          setIsAuthenticated(true);
        } catch (err) {
          console.error("Token verification failed:", err);
          navigate("/dang-nhap");
        } finally {
          setIsVerifying(false);
        }
      };

      checkToken();
    }, [navigate, allowedRoles]);

    if (isVerifying) {
      return <div>Loading...</div>; // Dòng 47
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `WithAuthVerify(${
    Component.displayName || Component.name || "Component"
  })`;

  return WrappedComponent;
};

export default withAuthVerify;