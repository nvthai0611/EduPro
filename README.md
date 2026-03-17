# 🚀 EDUPRO PLATFORM – FULLSTACK DOCUMENTATION

EduPro là nền tảng **E-learning tích hợp Community, Forum, Job Marketplace và Communication**,  
cho phép người dùng **học tập – trao đổi kiến thức – thuê hỗ trợ – giao tiếp realtime** trong cùng một hệ sinh thái.

---

## 🎯 GIỚI THIỆU

EduPro hướng tới việc xây dựng **một nền tảng học tập và hỗ trợ toàn diện**, bao gồm:
- Bán khóa học (LMS)
- Cộng đồng & Forum hỏi đáp
- Thuê hỗ trợ / freelancer
- Chat & Video realtime

---

## 🛠 CÔNG NGHỆ SỬ DỤNG

### 🔹 Frontend (Client)
- ReactJS
- Vite
- TypeScript
- React Router DOM
- TanStack Query (React Query)
- Axios
- Tailwind CSS
- Shadcn/UI
- Lucide React

### 🔹 Backend (Server)
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (Authentication)
- bcryptjs
- dotenv
- cors
- multer
- socket.io

### 🔹 Công cụ
- Git / GitHub
- Postman
- MongoDB Compass
- VS Code

---

## ⚙️ CÀI ĐẶT DỰ ÁN

1) Backend

```bash
cd server
npm install
npm run dev
```

Server chạy tại: http://localhost:9999

2) Frontend

```bash
cd client
npm install
npm run dev
```

Client chạy tại: http://localhost:5173

Frontend giao tiếp với Backend thông qua REST API và WebSocket.

3) Trường hợp lỗi khi npm install (peer dependency conflict)

```bash
npm install --legacy-peer-deps
# hoặc
npm i --legacy-peer-deps
```

## 📏 QUY ƯỚC ĐẶT TÊN & CODING RULE

QUY TẮC ĐẶT TÊN FOLDER
- Tất cả chữ thường (lowercase)
- Nếu nhiều từ → dùng dấu gạch ngang “-”
- Không dùng khoảng trắng
- Không dùng tiếng Việt có dấu
- Không dùng ký tự đặc biệt (@#$%!?)

QUY TẮC ĐẶT TÊN FILE
- File JS/TS component → Dùng PascalCase cho component React.
- File thường (utils, hooks, service) → Dùng camelCase

QUY TẮC IMPORT
- Import phải đúng EXACT chữ hoa – thường
---

## 📏 QUY ƯỚC COMMIT CODE
QUY TẮC ĐẶT TÊN NHÁNH
git checkout -b feat/author/feature-name/date-created

QUY TẮC ĐẶT TÊN COMMIT
git commit -m "[author/date-created] feature-name"



## 👤 ĐÓNG GÓP CÁ NHÂN – Nguyễn Văn Tiến Hải (nvthai0611)

> *Dành cho nhà tuyển dụng – tóm tắt những gì tôi đã thực hiện trong dự án EduPro:*

1. **Khởi tạo & kiến trúc dự án**: Thiết lập toàn bộ cấu trúc Full-stack từ đầu (ReactJS + Vite frontend, Node.js + Express + MongoDB backend), định nghĩa coding convention và chuẩn hóa cấu trúc thư mục theo mô hình MVC.
2. **Hệ thống xác thực & bảo mật**: Xây dựng luồng đăng nhập/đăng ký với JWT, tích hợp đăng nhập Google qua Passport.js, triển khai OTP qua email, mã hóa dữ liệu nhạy cảm, và subdomain routing riêng cho khu vực admin (dash.*).
3. **Backend API đầy đủ**: Thiết kế và triển khai 18+ Mongoose models (User, Course, Lesson, Order, Coupon, Promotion, Review, …) cùng toàn bộ lớp controllers, services và routes cho admin, user và public endpoints.
4. **Tích hợp thanh toán & đơn hàng**: Tích hợp cổng thanh toán PayOS, xử lý xác thực giao dịch qua webhook, quản lý giỏ hàng và lịch sử đơn hàng người dùng.
5. **Tiện ích hạ tầng**: Xây dựng email service (Nodemailer + queue), upload ảnh lên Cloudinary, cron jobs tự động (nhắc nhở học tập, phân phối coupon, gia hạn promotion), socket.io realtime, và Swagger API documentation.
6. **Giao diện người dùng (Frontend)**: Phát triển các React component cốt lõi: Navbar, Layout, VideoPlayer, CourseCard, AuthForm, Admin Dashboard với biểu đồ doanh thu, trang quản lý coupon và chăm sóc khách hàng.
7. **Tính năng khóa học**: Triển khai slug-based URL cho khóa học, theo dõi tiến độ học tập của người dùng (user_progress), tích hợp AI Agent 3D hỗ trợ học viên.
8. **Quản lý dự án & teamwork**: Review và merge hơn 100 pull request từ các thành viên nhóm, duy trì nhánh development ổn định, hỗ trợ giải quyết conflict code cho cả team.

---

## 🧠 CẤU TRÚC THƯ MỤC

```text
src/
 └── modules/
      └── user/
           ├── user.controller.ts
           ├── user.service.ts
           ├── user.repository.ts
           ├── user.dto.ts
           ├── user.transformer.ts
           ├── user.model.ts
           └── index.ts
 └── routes.ts
 └── app.ts
