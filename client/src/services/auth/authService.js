import { AUTH_TOKEN, TYPE_AUTH } from "../../constains/auth";
import { apiClient } from "../../utils/clientAxios";
import Cookies from "js-cookie";

function decodeJWT(token) {
  const payload = token.split(".")[1];
  return JSON.parse(atob(payload));
}

class AuthService {
  constructor() {
    this.userKey = AUTH_TOKEN.USER_DATA;
    this.accessTokenKey = AUTH_TOKEN.ACCESS_TOKEN;
    this.refreshTokenKey = AUTH_TOKEN.REFRESH_TOKEN;
  }

  getUser() {
    if (typeof window === "undefined") return null;

    try {
      return decodeJWT(Cookies.get(this.accessTokenKey));
    } catch {
      return null;
    }
  }

  getRefreshToken() {
    if (typeof window === "undefined") return null;
    return Cookies.get(this.refreshTokenKey);
  }

  storeUserData(user, refreshToken = null) {
    const isProduction = import.meta.env.VITE_PROD === "production";
    const cookieOptions = {
      sameSite: isProduction ? "None" : "Lax",
      secure: isProduction,
      path: "/",
    };

    Cookies.set(this.userKey, JSON.stringify(user), cookieOptions);

    if (refreshToken) {
      Cookies.set(this.refreshTokenKey, refreshToken, cookieOptions);
    }
  }

  clearAuthData() {
    // Domain phải khớp với server cookie domain: .edu-pro-delta.vercel.app
    const domain = import.meta.env.VITE_PROD === "production" ? ".edu-pro-delta.vercel.app" : undefined;

    // Xoá với cả domain và không domain để đảm bảo
    [undefined, domain].forEach((d) => {
      Cookies.remove(this.userKey, { path: "/", domain: d });
      Cookies.remove(this.refreshTokenKey, { path: "/", domain: d });
      Cookies.remove(this.accessTokenKey, { path: "/", domain: d });
    });

    // Nếu có lưu token vào cookie riêng
    apiClient.removeCookie(this.userKey);
    apiClient.removeCookie(this.refreshTokenKey);
    apiClient.removeCookie(this.accessTokenKey);

    apiClient.setToken(null); // clear localStorage / token trong header
    localStorage.clear();
  }

  isAuthenticated() {
    return !!(apiClient.getTokenFromCookie() && this.getUser());
  }

  async register(credentials) {
    try {
      const response = await apiClient.post("/auth/register", { data: credentials });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Đăng ký thất bại. Vui lòng thử lagi.",
      };
    }
  }

  async checkExistEmailOrPhone(email, phoneNumber) {
    try {
      const response = await apiClient.post("/auth/check-email-phone", { email, phoneNumber });
      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Xác thực thất bại, vui lòng kiểm tra lại",
      };
    }
  }

  async login(credentials) {
    try {
      let url = "/auth/login";
      if (credentials.type === TYPE_AUTH.MANAGER) {
        url = "/auth/login/manager";
      }
      const response = await apiClient.post(url, { data: credentials });
      const res = response.data;

      if (response.success && res.accessToken && res.user) {
        apiClient.setToken(res.accessToken); // lưu token vào cookie

        this.storeUserData(res.user, null);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || "Đăng nhập thất bại. Vui lòng thử lại.",
      };
    }
  }

  async logout() {
    try {
      const token = apiClient.getTokenFromCookie();
      if (!token) {
        return { success: true, message: "No active session" };
      }
      const res = await apiClient.get("/auth/logout");

      if (res) {
        return {
          success: true,
          message: res.message || "Đăng xuất thành công",
          data: res,
        };
      }
    } catch (error) {
      return { success: false, message: error.message || "Đăng xuất thất bại" };
    } finally {
      this.clearAuthData(); // Xóa dữ liệu xác thực (token, user, etc.)
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) return false;

      const response = await apiClient.post("/auth/refresh", { refreshToken });

      if (response.success && response.token && response.user) {
        apiClient.setToken(response.token);
        this.storeUserData(
          response.user,
          response.refreshToken || refreshToken
        );
        return true;
      }

      return false;
    } catch (error) {
      this.clearAuthData();
      return false;
    }
  }

  getAuthState() {
    return {
      user: this.getUser(),
      token: apiClient.getTokenFromCookie(),
      isAuthenticated: this.isAuthenticated(),
      isLoading: false,
    };
  }

  async updateProfile(userData) {
    try {
      const response = await apiClient.put("/auth/profile", userData);

      if (response.success && response.user) {
        const updatedUser = {
          ...this.getUser(),
          ...response.user,
        };
        this.storeUserData(updatedUser);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message:
          error.message || "Cập nhật thông tin thất bại. Vui lòng thử lại.",
      };
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      return await apiClient.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      return {
        success: false,
        message: error.message || "Đổi mật khẩu thất bại.",
      };
    }
  }

  initAuth() {
    apiClient.initSession();
    const user = this.getUser();
    const token = apiClient.getTokenFromCookie();

    if (user && !token) {
      this.refreshToken();
    }
  }

  async fetchCurrentUser() {
    try {
      const response = await apiClient.get("/auth/users");
      if (response.data && response.data.success && response.data.data) {
        this.storeUserData(response.data.data);
        return response.data.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async sendEmailResetPassword(email) {
    return await apiClient.post("/auth/forgot-password-email", { email });
  }

  async confirmEmailResetPassword(token) {
    return await apiClient.post("/auth/confirm-reset-password", { token });
  }
}

export const authService = new AuthService();
export default authService;
