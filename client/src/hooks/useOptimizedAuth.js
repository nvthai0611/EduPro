import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Hook để tối ưu hóa OAuth authentication flow
 * Giảm delay từ 1-2s xuống gần như tức thì
 */
export const useOptimizedAuth = () => {
  const navigate = useNavigate();

  const handleOAuthSuccess = useCallback((encodedAuth, key) => {
    try {
      // Lưu cookie ngay lập tức
      const isProduction = import.meta.env.VITE_PROD === "production";
      const cookieOptions = `path=/; max-age=86400; ${
        isProduction ? "secure; samesite=none" : "samesite=lax"
      }`;
      document.cookie = `${key}=${encodedAuth}; ${cookieOptions}`;
      
      // Log thành công
      // console.log("🍪 Cookie saved successfully");
      
      // Navigate ngay lập tức mà không delay
      window.location.href = "/";
      
      // Show toast sau khi navigate để không block UI
      setTimeout(() => {
        toast.success("Đăng nhập thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 100);
      
      return true;
    } catch (error) {
      console.error("❌ OAuth processing error:", error);
      toast.error("Đăng nhập thất bại");
      return false;
    }
  }, [navigate]);

  const handleOAuthError = useCallback((errorMessage) => {
    console.error("❌ OAuth error:", errorMessage);
    toast.error(`Đăng nhập thất bại: ${errorMessage}`);
    navigate("/", { replace: true });
  }, [navigate]);

  return {
    handleOAuthSuccess,
    handleOAuthError
  };
};