# 🔐 Authentication Flow Documentation

## 📋 Tổng quan

Hệ thống authentication này sử dụng **JWT Token** được lưu trữ trong **Cookie** và **localStorage** với các tính năng:
- Automatic token injection vào mọi API request
- Cookie-first strategy với localStorage fallback
- Automatic token cleanup khi expired
- Security features (secure, sameSite, httpOnly support)

---

## 🔄 Luồng Authentication Hoàn Chỉnh

### 1. **Khởi tạo ứng dụng**

\`\`\`
App Start
    ↓
initSession()
    ↓
Check Cookie → Check localStorage → No Token
    ↓
User State: Not Authenticated
\`\`\`

**Code Flow:**
\`\`\`js
// 1. App khởi động
authService.initAuth()
    ↓
// 2. apiClient.initSession() được gọi
const token = getToken() // Ưu tiên cookie trước
    ↓
// 3. Nếu có token → User authenticated
// 4. Nếu không có token → User not authenticated
\`\`\`

### 2. **Quá trình Login**

\`\`\`
User Input Credentials
    ↓
authService.login(credentials)
    ↓
API Call: POST /auth/login
    ↓
Server Response: { success: true, token: "jwt...", user: {...} }
    ↓
storeAuthData(user, token, refreshToken)
    ↓
Save to Cookie + localStorage
    ↓
Update UI State: Authenticated
\`\`\`

**Chi tiết từng bước:**

#### Bước 1: User nhập thông tin
\`\`\`js
const credentials = {
  email: "user@example.com",
  phoneNumber: "0123456789"
}
\`\`\`

#### Bước 2: Gọi API login
\`\`\`js
const response = await apiClient.post("/auth/login", credentials)
// Request tự động có header: Content-Type: application/json
// Không có Authorization header (vì chưa login)
\`\`\`

#### Bước 3: Server trả về response
\`\`\`js
{
  success: true,
  message: "Đăng nhập thành công",
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  refreshToken: "refresh_token_here",
  user: {
    id: "user-123",
    email: "user@example.com",
    phoneNumber: "0123456789",
    fullName: "Nguyễn Văn A"
  }
}
\`\`\`

#### Bước 4: Lưu trữ dữ liệu
\`\`\`js
storeAuthData(user, token, refreshToken)
    ↓
// 4a. Lưu token
apiClient.setToken(token)
    → localStorage.setItem("accessToken", token)
    → setCookie("accessToken", token, 7 days)
    
// 4b. Lưu user data
localStorage.setItem("user_data", JSON.stringify(user))
setCookie("user_data", encodeURIComponent(JSON.stringify(user)), 7 days)

// 4c. Lưu refresh token
localStorage.setItem("refresh_token", refreshToken)
setCookie("refresh_token", refreshToken, 30 days)
\`\`\`

### 3. **Automatic Token Injection**

Sau khi login thành công, **MỌI API CALL** sẽ tự động có token:

\`\`\`
Any API Call
    ↓
Request Interceptor
    ↓
getToken() → Check Cookie first → Fallback localStorage
    ↓
Add Authorization: Bearer <token>
    ↓
Send Request with Token
\`\`\`

**Code Flow:**
\`\`\`js
// User gọi bất kỳ API nào
await apiClient.get("/user/profile")
await apiClient.post("/bookings", bookingData)
await apiClient.put("/user/update", userData)

    ↓ (Tất cả đều đi qua interceptor)

client.interceptors.request.use((config) => {
  const token = getToken() // Lấy từ cookie hoặc localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log("🔐 Token added to request header")
  }
  return config
})
\`\`\`

### 4. **Token Priority System**

\`\`\`
API Request
    ↓
getToken()
    ↓
1. Check Cookie first
    ↓
    ✅ Found → Use Cookie Token
    ❌ Not Found → Check localStorage
        ↓
        ✅ Found → Use localStorage Token + Sync to Cookie
        ❌ Not Found → No Token
\`\`\`

**Code Implementation:**
\`\`\`js
const getToken = () => {
  // Priority 1: Cookie
  const cookieToken = getCookie("accessToken")
  if (cookieToken) {
    console.log("🍪 Token loaded from cookie")
    return cookieToken
  }

  // Priority 2: localStorage (fallback)
  const localToken = localStorage.getItem("accessToken")
  if (localToken) {
    console.log("💾 Token loaded from localStorage")
    // Sync cookie với localStorage
    setCookie("accessToken", localToken, 7)
    return localToken
  }

  return null
}
\`\`\`

### 5. **Error Handling & Token Expiration**

\`\`\`
API Request with Token
    ↓
Server Response
    ↓
Status 401 (Unauthorized)
    ↓
Response Interceptor
    ↓
Clear All Auth Data
    ↓
Redirect to Login
\`\`\`

**Code Flow:**
\`\`\`js
client.interceptors.response.use(
  (response) => response, // Success case
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🚨 Token expired or invalid")
      
      // Clear all auth data
      setToken(null) // Xóa cả cookie và localStorage
      localStorage.removeItem("user_data")
      removeCookie("user_data")
      
      // User sẽ bị logout tự động
      return Promise.reject({
        status: 401,
        message: "Token hết hạn, vui lòng đăng nhập lại"
      })
    }
    return Promise.reject(error)
  }
)
\`\`\`

### 6. **Logout Process**

\`\`\`
User Click Logout
    ↓
authService.logout()
    ↓
Call Logout API (optional)
    ↓
clearAuthData()
    ↓
Clear Cookie + localStorage
    ↓
Update UI State: Not Authenticated
\`\`\`

**Code Flow:**
\`\`\`js
async logout() {
  try {
    // Optional: Notify server
    await apiClient.post("/auth/logout")
  } catch (error) {
    console.error("Logout API failed:", error)
  } finally {
    // Always clear local data
    this.clearAuthData()
  }
}

clearAuthData() {
  // Clear token
  setToken(null) // Xóa cả cookie và localStorage
  
  // Clear user data
  localStorage.removeItem("user_data")
  removeCookie("user_data")
  
  // Clear refresh token
  localStorage.removeItem("refresh_token")
  removeCookie("refresh_token")
}
\`\`\`

---

## 🍪 Cookie vs localStorage Strategy

### **Cookie-First Approach**

| Scenario | Cookie | localStorage | Action |
|----------|--------|--------------|---------|
| **Fresh Login** | ✅ Set | ✅ Set | Both updated |
| **App Reload** | ✅ Available | ✅ Available | Use Cookie |
| **Cookie Deleted** | ❌ Missing | ✅ Available | Restore Cookie from localStorage |
| **localStorage Cleared** | ✅ Available | ❌ Missing | Continue with Cookie |
| **Both Cleared** | ❌ Missing | ❌ Missing | User not authenticated |

### **Why Cookie First?**

1. **Automatic Sending**: Browser tự động gửi cookie với mọi request
2. **Security**: Có thể set HttpOnly (JS không truy cập được)
3. **Expiration**: Tự động hết hạn theo thời gian set
4. **Cross-tab Sync**: Tự động sync giữa các tab

---

## 🔒 Security Features

### **Cookie Security Options**

\`\`\`js
setCookie("accessToken", token, 7, {
  secure: true,        // Chỉ gửi qua HTTPS
  sameSite: "strict",  // Chống CSRF attacks
  httpOnly: false,     // JS có thể truy cập (để đọc token)
  path: "/"           // Available cho toàn bộ domain
})
\`\`\`

### **Security Best Practices**

1. **HTTPS Only**: Cookie chỉ được gửi qua HTTPS
2. **SameSite Strict**: Chống Cross-Site Request Forgery
3. **Automatic Cleanup**: Token tự động bị xóa khi expired
4. **No Sensitive Data**: Chỉ lưu token, không lưu password

---

## 📊 Data Flow Diagram

\`\`\`
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Login    │───▶│   AuthService    │───▶│   API Server    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Store Auth Data │    │ JWT Token +     │
                       │  Cookie + Local  │◀───│ User Data       │
                       └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │  All API Calls   │
                       │  Auto Include    │
                       │  Token in Header │
                       └──────────────────┘
\`\`\`

---

## 🧪 Testing Scenarios

### **Scenario 1: Normal Login Flow**
\`\`\`js
// 1. User login
await authService.login({ email: "test@test.com", phoneNumber: "123" })

// 2. Check storage
console.log("Cookie:", getCookie("accessToken"))
console.log("localStorage:", localStorage.getItem("accessToken"))

// 3. Test API call
await apiClient.get("/user/profile") // Should include token automatically
\`\`\`

### **Scenario 2: Cookie Deleted**
\`\`\`js
// 1. Login first
await authService.login(credentials)

// 2. Manually delete cookie
removeCookie("accessToken")

// 3. Make API call
await apiClient.get("/user/profile") 
// Token should be restored from localStorage to cookie
\`\`\`

### **Scenario 3: Token Expired**
\`\`\`js
// 1. Set expired token
setCookie("accessToken", "expired_token")

// 2. Make API call
await apiClient.get("/user/profile")
// Should get 401 error and auto-logout
\`\`\`

---

## 🚀 Implementation Checklist

- [x] **Cookie utilities** (set, get, remove)
- [x] **Token priority system** (cookie first, localStorage fallback)
- [x] **Request interceptor** (auto-inject token)
- [x] **Response interceptor** (handle 401 errors)
- [x] **AuthService integration** (login, logout, state management)
- [x] **Security options** (secure, sameSite, expiration)
- [x] **Error handling** (token expiration, network errors)
- [x] **Automatic cleanup** (clear all auth data on logout/error)

---

## 🔧 Configuration Options

\`\`\`js
// Cookie settings
const COOKIE_OPTIONS = {
  TOKEN_EXPIRY: 7,        // 7 days
  REFRESH_EXPIRY: 30,     // 30 days
  SECURE: true,           // HTTPS only
  SAME_SITE: "strict",    // CSRF protection
  HTTP_ONLY: false        // JS accessible
}

// API settings
const API_CONFIG = {
  BASE_URL: process.env.VITE_SERVER_API_V1,
  TIMEOUT: 10000,         // 10 seconds
  RETRY_ATTEMPTS: 3       // Retry failed requests
}
\`\`\`

---

## 📝 Summary

**Luồng hoạt động tóm tắt:**

1. **App khởi động** → Check cookie/localStorage → Determine auth state
2. **User login** → API call → Save token to cookie + localStorage
3. **Mọi API call** → Interceptor tự động thêm token từ cookie
4. **Token expired** → 401 error → Auto logout + clear data
5. **User logout** → Clear cookie + localStorage → Update UI

**Ưu điểm của approach này:**
- ✅ Hoàn toàn tự động
- ✅ Bảo mật cao
- ✅ Fallback mechanism
- ✅ Cross-tab synchronization
- ✅ Automatic cleanup

**Kết quả:** User không cần quan tâm đến token management, mọi thứ đều tự động! 🎯
