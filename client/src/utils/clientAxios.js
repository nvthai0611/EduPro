import axios from "axios";
import { AUTH_TOKEN } from "../constains/auth";
import CryptoJS from "crypto-js";
import { logger } from "./logger";

// Khởi tạo axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_V1 || "",
  timeout: 30000,
  withCredentials: true, //quan trọng để gửi cookie cross-origin
});

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const TOKEN_KEY = AUTH_TOKEN.ACCESS_TOKEN;
const DEVICE_KEY = AUTH_TOKEN.DEVICE_ID;

// --- COOKIE UTILITIES ---
const setCookie = (name, value, days = 7, options = {}) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  const isProduction = import.meta.env.VITE_PROD === "production" || window.location.hostname !== "localhost";

  const defaultOptions = {
    expires: expires.toUTCString(),
    path: "/",
    secure: isProduction || window.location.protocol === "https:", // true trong production
    sameSite: isProduction ? "None" : "Lax", // None cho cross-site trong production
  };

  const cookieOptions = { ...defaultOptions, ...options };
  let cookieString = `${name}=${value}`;
  Object.entries(cookieOptions).forEach(([key, val]) => {
    if (val === true) {
      cookieString += `; ${key}`;
    } else if (val !== false && val !== null && val !== undefined) {
      cookieString += `; ${key}=${val}`;
    }
  });
  document.cookie = cookieString;
};

const getCookie = (name) => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});
  return cookies[name] || null;
};

const removeCookie = (name, path = "/") => {
  const isLocalhost = window.location.hostname === "localhost";
  // const isProduction = import.meta.env.VITE_PROD === "production" || window.location.hostname !== "localhost";
  const expires = "Thu, 01 Jan 1970 00:00:00 GMT";

  // Xóa cookie không có domain (cho localhost)
  if (isLocalhost) {
    document.cookie = `${name}=; Path=${path}; Expires=${expires}; Max-Age=0; SameSite=Lax;`;
  } else {
    // Production: xóa với secure và sameSite=none
    document.cookie = `${name}=; Path=${path}; Expires=${expires}; Max-Age=0; SameSite=None; Secure;`;

    // Xóa cookie với domain có dấu chấm (.edu-pro-delta.vercel.app) để đảm bảo
    const baseDomain = window.location.hostname.replace(/^www\./, "");
    document.cookie = `${name}=; Path=${path}; Domain=.${baseDomain}; Expires=${expires}; Max-Age=0; SameSite=None; Secure;`;

    // Xóa cookie với domain không có dấu chấm (backup)
    document.cookie = `${name}=; Path=${path}; Domain=${baseDomain}; Expires=${expires}; Max-Age=0; SameSite=None; Secure;`;
  }
};


// --- TOKEN HANDLING ---
export const setToken = (token) => {
  if (token) {
    // Lưu vào cookie (primary)
    setCookie(TOKEN_KEY, token, 7); // 7 ngày
  } else {
    // Xóa khỏi cả localStorage và cookie
    removeCookie(TOKEN_KEY);
  }
};

// Cập nhật function để lấy token từ cookie trước
const getToken = () => {
  // Ưu tiên cookie trước
  const cookieToken = getCookie(TOKEN_KEY);
  if (cookieToken) {
    return cookieToken;
  }
  // Fallback to localStorage
  const localToken = localStorage.getItem(TOKEN_KEY);
  if (localToken) {
    // Sync cookie với localStorage
    setCookie(TOKEN_KEY, localToken, 7);
    return localToken;
  }

  return null;
};

const getDeviceId = () => {
  // Ưu tiên cookie trước
  const deviceId = getCookie(DEVICE_KEY);
  if (deviceId) {
    return deviceId;
  }
  // Fallback to localStorage
  const localToken = localStorage.getItem(DEVICE_KEY);
  if (localToken) {
    // Sync cookie với localStorage
    setCookie(DEVICE_KEY, localToken, 7);
    return localToken;
  }

  return null;
};

export const getTokenFromCookie = () => {
  return getCookie(TOKEN_KEY);
};

export const initSession = () => {
  const token = getToken();
  if (token) {
    logger.log("Session initialized with token");
  } else {
    console.log("No token found for session");
  }
};

// --- BASE URL HANDLING ---
export const setBaseUrl = (url) => {
  if (typeof url === "string" && url.trim()) {
    client.defaults.baseURL = url;
  }
};

// --- ENCRYPTION & DECRYPTION ---
const encryptData = (data) => {
  try {
    if (!data) return data;
    const dataString = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(
      dataString,
      ENCRYPTION_KEY
    ).toString();
    return { encryptedData: encrypted };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Không thể mã hóa dữ liệu");
  }
};

const decryptData = (encryptedData) => {
  try {
    if (!encryptedData) return encryptedData;
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedString) throw new Error("Decryption failed");
    return JSON.parse(decryptedString);
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Không thể giải mã dữ liệu");
  }
};


// --- INTERCEPTORS ---
client.interceptors.request.use((config) => {
  // Lấy token từ cookie hoặc localStorage
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  const isFormData = config.data instanceof FormData;
  
  // Mã hóa dữ liệu nếu cần (KHÔNG áp dụng cho FormData)

  const deviceId = getDeviceId();
  if (deviceId) {
    config.headers["X-Device-Id"] = deviceId;
  }

  // Mã hóa dữ liệu nếu cần
  if (
    !isFormData &&
    config.encrypt &&
    config.data &&
    ["post", "put", "patch"].includes(config.method)
  ) {
    config.data = encryptData(config.data);
    config.headers["X-Encrypted"] = "true";
  }
  
  // Nếu là FormData, để axios tự động set Content-Type với boundary
  if (isFormData) {
    // Xóa Content-Type để axios tự động set với boundary đúng
    delete config.headers['Content-Type'];
  }

  return config;
});

client.interceptors.response.use(
  (res) => {
    // Giải mã dữ liệu nếu server trả về dữ liệu mã hóa
    if (res.headers["x-encrypted"] === "true" && res.data.encryptedData) {
      const decrypted = decryptData(res.data.encryptedData);
      // Giữ lại structure response, chỉ thay thế encryptedData bằng data
      res.data = {
        success: res.data.success,
        data: decrypted,
        ...res.data
      };
      delete res.data.encryptedData;
    }
    return res;
  },
  (err) => {
    const { response } = err;
    // Trong interceptor response lỗi 401
    if (response?.status === 401) {
      console.warn("🚨 Unauthorized - Token expired or invalid");
      // Xóa token khỏi cả localStorage và cookie
      setToken(null);
      removeCookie(TOKEN_KEY);
      removeCookie("render_id");
      localStorage.clear();

      // Redirect về login
      window.location.href = `${import.meta.env.VITE_CLIENT_URL}`;
      return Promise.reject({
        status: 401,
        message: "Token hết hạn hoặc không hợp lệ",
        error: err,
      });
    }

    if (response?.status === 404) {
      // 404 không nên reload page hoặc logout
      console.warn("🚨 Resource not found:", err.config?.url);
      return Promise.reject({
        status: 404,
        message: response.data?.message || "Không tìm thấy tài nguyên",
        error: err,
      });
    }
    if (response?.status === 400) {
      return Promise.reject({
        status: 400,
        message: response.data?.message || "Dữ liệu không hợp lệ",
        error: err,
      });
    }
    if (response?.status >= 500) {
      return Promise.reject({
        status: response.status,
        message: response.data?.message || "Lỗi máy chủ, vui lòng thử lại",
        error: err,
      });
    }
    return Promise.reject({
      status: response?.status || 0,
      message: response?.data?.message || "Lỗi không xác định",
      error: err,
    });
  }
);

// --- API REQUEST WRAPPER ---
const send = async (
  method,
  url,
  {
    data = null,
    params = null,
    timeout = null,
    contentType = "application/json",
    encrypt = false,
  } = {}
) => {
  const config = {
    method,
    url,
    encrypt,
  };

  if (data && ["post", "put", "patch"].includes(method)) {
    if (contentType === "application/json") {
      config.data = encrypt ? data : data;
      config.headers = { "Content-Type": "application/json" };
    } else if (contentType === "multipart/form-data") {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach((item) => formData.append(key, item));
        } else {
          formData.append(key, data[key]);
        }
      });
      config.data = formData;
      config.headers = { "Content-Type": "multipart/form-data" };
    } else if (contentType === "application/x-www-form-urlencoded") {
      const urlEncodedData = new URLSearchParams();
      Object.keys(data).forEach((key) => {
        urlEncodedData.append(key, data[key]);
      });
      config.data = urlEncodedData;
      config.headers = { "Content-Type": "application/x-www-form-urlencoded" };
    } else {
      config.data = data;
      config.headers = { "Content-Type": contentType };
    }
  }

  if (params && ["get", "delete"].includes(method)) {
    config.params = params;
  }

  if (timeout) {
    config.timeout = timeout;
  }

  const response = await client(config);
  return response.data;
};

// --- API CLIENT PUBLIC INTERFACE ---
export const apiClient = {
  get: (
    url,
    params,
    timeout,
    contentType = "application/json",
    encrypt = false
  ) => send("get", url, { params, timeout, contentType, encrypt }),
  post: (
    url,
    data,
    timeout,
    contentType = "application/json",
    encrypt = false
  ) => send("post", url, { data, timeout, contentType, encrypt }),
  put: (
    url,
    data,
    timeout,
    contentType = "application/json",
    encrypt = false
  ) => send("put", url, { data, timeout, contentType, encrypt }),
  patch: (
    url,
    data,
    timeout,
    contentType = "application/json",
    encrypt = false
  ) => send("patch", url, { data, timeout, contentType, encrypt }),
  delete: (
    url,
    params,
    timeout,
    contentType = "application/json",
    encrypt = false
  ) => send("delete", url, { params, timeout, contentType, encrypt }),

  // Expose utilities
  setToken,
  setBaseUrl,
  initSession,
  getTokenFromCookie,
  setCookie,
  getCookie,
  removeCookie,
};
