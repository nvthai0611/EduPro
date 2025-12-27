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
# Quy tắc đặt tên nhánh
git checkout -b feat/author/feature-name/date-created

# Quy tắc đặt tên commit
git commit -m "[author/date-created] feature-name"


## 🧠 CẤU TRÚC THƯ MỤC

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
