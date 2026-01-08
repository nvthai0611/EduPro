import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useOptimizedAuth } from "../../hooks/useOptimizedAuth";

export default function AuthCallback() {
  // Optimized OAuth redirect handling with immediate redirect
  const [searchParams] = useSearchParams();
  const { handleOAuthSuccess, handleOAuthError } = useOptimizedAuth();
  useEffect(() => {
    const encodedAuth = searchParams.get("auth");
    let encodedDevice = searchParams.get("deviceId");
    const error = searchParams.get("error");

    if (error) {
      handleOAuthError(error);
      return;
    }

    // Xử lý auth param từ URL với tối ưu hóa
    if (encodedAuth && encodedDevice) {
      handleOAuthSuccess(encodedAuth, "render_id");
      handleOAuthSuccess(encodedDevice, "runtime_ctx");
    }
  }, [searchParams, handleOAuthSuccess, handleOAuthError]);

  return null;
}