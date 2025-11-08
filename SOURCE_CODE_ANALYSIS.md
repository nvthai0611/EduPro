# 📚 EduPro - Source Code Analysis Documentation

## 📋 Tổng Quan (Overview)

**EduPro** là một nền tảng giáo dục trực tuyến (E-Learning Platform) được xây dựng với kiến trúc Full-Stack hiện đại, cho phép người dùng học các khóa học trực tuyến, quản lý tiến độ học tập, và tương tác với nội dung giáo dục.

### 🎯 Mục Đích Hệ Thống
- Cung cấp nền tảng học tập trực tuyến với các khóa học đa dạng
- Quản lý tiến độ học tập và đánh giá của học viên
- Hỗ trợ thanh toán trực tuyến cho các khóa học
- Quản lý nội dung giáo dục (courses, lessons, modules)
- Hệ thống phân quyền cho Admin, Staff, và User
- Tích hợp AI Agent hỗ trợ học tập

---

## 🏗️ Kiến Trúc Tổng Quan (Architecture Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                    EduPro Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │   Client (SPA)   │  ◄────►  │  Server (API)    │        │
│  │                  │          │                  │        │
│  │  React + Vite    │  HTTP    │  Express.js      │        │
│  │  Redux Toolkit   │  REST    │  MongoDB         │        │
│  │  Socket.io       │  Socket  │  Socket.io       │        │
│  └──────────────────┘          └──────────────────┘        │
│          ▲                              ▲                   │
│          │                              │                   │
│          ▼                              ▼                   │
│  ┌──────────────────┐          ┌──────────────────┐        │
│  │  State Mgmt      │          │  Database        │        │
│  │  - Redux Store   │          │  - MongoDB       │        │
│  │  - Zustand       │          │  - Redis Queue   │        │
│  └──────────────────┘          └──────────────────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 Client-Side Architecture (Frontend)

### 📦 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **Vite** | 4.4.5 | Build Tool & Dev Server |
| **Redux Toolkit** | 1.9.7 | State Management |
| **Zustand** | 5.0.5 | Lightweight State Management |
| **React Router** | 6.19.0 | Routing |
| **Axios** | 1.9.0 | HTTP Client |
| **Socket.io Client** | 4.8.1 | Real-time Communication |
| **TailwindCSS** | 3.4.17 | Styling |
| **Shadcn/ui** | - | UI Components |
| **React Query** | 5.76.1 | Server State Management |
| **i18next** | 25.2.0 | Internationalization |

### 📂 Client Directory Structure

```
client/src/
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
├── index.css                    # Global styles
│
├── assets/                      # Static assets
│   ├── css/                     # CSS files
│   ├── scss/                    # SCSS files
│   ├── fonts/                   # Font files
│   └── images/                  # Image files
│
├── components/                  # Reusable components
│   ├── AuthForm/               # Authentication forms
│   ├── Banner/                 # Banner components
│   ├── Card/                   # Card components
│   ├── Carousel/               # Carousel components
│   ├── Comment/                # Comment components
│   ├── Course/                 # Course components
│   ├── Header.jsx              # Header component
│   ├── Lesson/                 # Lesson components
│   ├── LoadingSpinner/         # Loading indicators
│   ├── Navbar/                 # Navigation bar
│   ├── Sidebar.jsx             # Sidebar component
│   ├── Video/                  # Video player
│   └── ...                     # Other components
│
├── pages/                       # Page components
│   ├── About/                  # About page
│   ├── Admin/                  # Admin dashboard
│   ├── AI_Agent/               # AI Agent integration
│   ├── Auth/                   # Authentication pages
│   ├── Cart/                   # Shopping cart
│   ├── Courses/                # Course listing & details
│   ├── Home/                   # Homepage
│   ├── Learning/               # Learning interface
│   ├── Products/               # Products page
│   ├── Staff/                  # Staff dashboard
│   └── User/                   # User profile & settings
│
├── routes/                      # Routing configuration
│   ├── publicRoutes.jsx        # Public routes
│   └── privateRoutes.jsx       # Protected routes
│
├── layouts/                     # Layout components
│   └── (various layouts)
│
├── stores/                      # State management
│   ├── store.js                # Redux store
│   └── zustand/                # Zustand stores
│
├── services/                    # API services
│   ├── admin/                  # Admin services
│   ├── auth/                   # Auth services
│   ├── common/                 # Common services
│   ├── home/                   # Home services
│   └── user/                   # User services
│
├── middlewares/                 # Route middlewares
│   ├── AuthMiddleware.jsx      # Auth protection
│   └── GuestMiddleware.jsx     # Guest protection
│
├── hooks/                       # Custom hooks
│   ├── useClient.js
│   └── useTracking.js
│
├── utils/                       # Utility functions
│   ├── socket.js               # Socket.io client
│   └── ...
│
├── core/                        # Core functionality
│   └── Layout.jsx              # Layout manager
│
├── lib/                         # Third-party configs
│   └── i18n.js                 # i18n configuration
│
├── shadcn-ui/                   # Shadcn UI components
│   ├── components/             # UI components
│   ├── lib/                    # UI utilities
│   └── hooks/                  # UI hooks
│
├── constains/                   # Constants
└── data/                        # Static data
```

### 🔑 Key Features (Client)

#### 1. **Authentication System**
- JWT-based authentication
- Cookie + localStorage strategy
- Automatic token injection
- Google OAuth integration
- OTP verification
- Face recognition (face-api.js)

#### 2. **State Management**
- **Redux Toolkit**: Global state (auth, cart, user)
- **Zustand**: Lightweight state for UI
- **React Query**: Server state & caching

#### 3. **Routing System**
- Public routes (accessible without login)
- Private routes (require authentication)
- Role-based access (Admin, Staff, User)
- Dynamic route protection

#### 4. **UI Components**
- Shadcn/ui component library
- Custom components
- Responsive design (TailwindCSS)
- Dark mode support
- Animation (AOS, GSAP)

#### 5. **Real-time Features**
- Socket.io integration
- Live notifications
- Real-time updates
- Chat functionality

#### 6. **Learning Platform Features**
- Course browser
- Video player
- Progress tracking
- Quiz & assessments
- Comments & reviews
- Certificate generation

---

## 🖥️ Server-Side Architecture (Backend)

### 📦 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | - | Runtime |
| **Express.js** | 4.21.1 | Web Framework |
| **MongoDB** | 8.9.4 (Mongoose) | Database |
| **Redis** | 5.6.1 (ioredis) | Queue & Cache |
| **Socket.io** | 4.8.1 | Real-time Communication |
| **JWT** | 9.0.2 | Authentication |
| **Bull** | 4.16.5 | Job Queue |
| **Passport** | 0.7.0 | OAuth Strategy |
| **Nodemailer** | 6.9.16 | Email Service |
| **Cloudinary** | 1.41.3 | File Upload |
| **PayOS** | 1.0.10 | Payment Gateway |
| **Swagger** | - | API Documentation |

### 📂 Server Directory Structure

```
server/
├── server.js                    # Entry point
│
└── src/
    ├── config/                  # Configuration files
    │   └── db.js               # Database connection
    │
    ├── models/                  # Database models (18 models)
    │   ├── user.model.js       # User schema
    │   ├── course.model.js     # Course schema
    │   ├── lesson.model.js     # Lesson schema
    │   ├── module.model.js     # Module schema
    │   ├── category.model.js   # Category schema
    │   ├── order.model.js      # Order schema
    │   ├── bundle.model.js     # Bundle schema
    │   ├── learning_path.model.js
    │   ├── user_progress.model.js
    │   ├── review.model.js     # Review schema
    │   ├── comment.model.js    # Comment schema
    │   ├── coupon.model.js     # Coupon schema
    │   ├── user_coupon.js      # User coupon schema
    │   ├── promotion.model.js  # Promotion schema
    │   ├── setting.model.js    # Settings schema
    │   ├── role.model.js       # Role schema
    │   ├── otp.model.js        # OTP schema
    │   └── blacklist.model.js  # Token blacklist
    │
    ├── controllers/             # Request handlers
    │   └── v1/                 # API version 1
    │       ├── admin/          # Admin controllers
    │       ├── auth/           # Auth controllers
    │       ├── common/         # Common controllers
    │       └── user/           # User controllers
    │
    ├── routes/                  # API routes
    │   ├── api.js              # Main API router
    │   └── v1/                 # Version 1 routes
    │       ├── admin/          # Admin routes
    │       ├── auth/           # Auth routes
    │       ├── common/         # Common routes
    │       ├── user/           # User routes
    │       ├── courses.routes.js
    │       ├── lessons.routes.js
    │       ├── bundles.routes.js
    │       ├── learning-paths.routes.js
    │       ├── comments.routes.js
    │       ├── reviews.routes.js
    │       ├── progress.routes.js
    │       ├── payment/        # Payment routes
    │       ├── payos.routes.js # PayOS integration
    │       └── purchase.routes.js
    │
    ├── services/                # Business logic
    │   ├── adminService/       # Admin services
    │   ├── authService/        # Auth services
    │   ├── commonService/      # Common services
    │   └── userService/        # User services
    │
    ├── middlewares/             # Express middlewares
    │   ├── auth/               # Auth middlewares
    │   ├── clients/            # Client middlewares
    │   └── servers/            # Server middlewares
    │
    ├── utils/                   # Utility functions
    │   ├── socket/             # Socket.io utils
    │   ├── queue/              # Bull queue
    │   ├── cron/               # Cron jobs
    │   ├── format/             # Data formatters
    │   └── templateString/     # Email templates
    │
    ├── passports/               # Passport strategies
    │   └── passport.google.js  # Google OAuth
    │
    ├── transformers/            # Data transformers
    │
    ├── constain/                # Constants
    │
    ├── core/                    # Core functionality
    │
    ├── database/                # Database utilities
    │   └── seeders/            # Database seeders
    │
    ├── oas-docs/                # OpenAPI/Swagger docs
    │   └── swagger.json
    │
    └── logs/                    # Application logs
```

### 🔑 Key Features (Server)

#### 1. **Authentication & Authorization**
- JWT-based authentication
- Refresh token mechanism
- Role-based access control (RBAC)
- Google OAuth 2.0
- OTP verification
- Token blacklisting
- Session management

#### 2. **Database Models (18 Models)**

| Model | Purpose |
|-------|---------|
| `user` | User accounts & profiles |
| `role` | User roles & permissions |
| `course` | Course information |
| `lesson` | Lesson content |
| `module` | Course modules |
| `category` | Course categories |
| `learning_path` | Learning paths |
| `bundle` | Course bundles |
| `user_progress` | Learning progress tracking |
| `order` | Purchase orders |
| `review` | Course reviews |
| `comment` | Comments on lessons |
| `coupon` | Discount coupons |
| `user_coupon` | User-specific coupons |
| `promotion` | Promotional campaigns |
| `setting` | System settings |
| `otp` | OTP codes |
| `blacklist` | Blacklisted tokens |

#### 3. **API Architecture**
- RESTful API design
- Versioned API (v1)
- Swagger/OpenAPI documentation
- Request validation
- Error handling middleware
- Rate limiting
- CORS configuration

#### 4. **Background Jobs & Cron**
- **Cron Jobs**:
  - `cronUser.js` - User-related tasks
  - `promotion.cron.js` - Promotion management
  - `coupons.cron.js` - Coupon expiration
  - `userCoupons.cron.js` - User coupon cleanup
  - `learningReminders.cron.js` - Learning reminders

- **Queue System (Bull)**:
  - Email sending queue
  - Notification queue
  - Bull Board for monitoring

#### 5. **Real-time Features**
- Socket.io server
- Real-time notifications
- Live chat
- Progress updates
- Online user tracking

#### 6. **Payment Integration**
- PayOS payment gateway
- Order management
- Transaction tracking
- Refund handling
- Webhook processing

#### 7. **File Upload**
- Cloudinary integration
- Image upload
- Video upload
- Document upload
- Multi-file support

#### 8. **Email Service**
- Nodemailer integration
- Template-based emails
- Queue-based sending
- Email verification
- Password reset
- Promotional emails

---

## 🔐 Authentication Flow

### Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  Authentication Flow                         │
└─────────────────────────────────────────────────────────────┘

1. Login Request
   ↓
   User → Client → POST /auth/login → Server
                                        ↓
                                    Validate Credentials
                                        ↓
                                    Generate JWT Token
                                        ↓
                                    Return Token + User Data

2. Token Storage
   ↓
   Client receives response
   ↓
   Store in Cookie (7 days)
   ↓
   Store in localStorage (backup)
   ↓
   Update Redux state

3. Automatic Token Injection
   ↓
   Every API call
   ↓
   Request Interceptor
   ↓
   Get token from Cookie/localStorage
   ↓
   Add to Authorization header
   ↓
   Send request with token

4. Token Verification (Server)
   ↓
   Extract token from header
   ↓
   Verify JWT signature
   ↓
   Check if token is blacklisted
   ↓
   Decode user data
   ↓
   Attach user to request object
   ↓
   Proceed to route handler

5. Token Expiration Handling
   ↓
   Server returns 401 Unauthorized
   ↓
   Response Interceptor catches error
   ↓
   Clear all auth data
   ↓
   Redirect to login page
```

### Authentication Methods

1. **Email/Phone + Password**
2. **Google OAuth 2.0**
3. **OTP Verification**
4. **Face Recognition** (Client-side)

---

## 🗄️ Database Design

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  phoneNumber: String,
  password: String (hashed),
  fullName: String,
  avatar: String,
  role: ObjectId (ref: Role),
  status: String,
  isVerified: Boolean,
  googleId: String,
  faceDescriptor: Array,
  createdAt: Date,
  updatedAt: Date
}
```

#### Courses Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  thumbnail: String,
  category: ObjectId (ref: Category),
  instructor: ObjectId (ref: User),
  price: Number,
  discountPrice: Number,
  duration: Number,
  level: String,
  modules: [ObjectId] (ref: Module),
  rating: Number,
  totalStudents: Number,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Lessons Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  module: ObjectId (ref: Module),
  videoUrl: String,
  duration: Number,
  order: Number,
  resources: Array,
  quiz: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### User Progress Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  course: ObjectId (ref: Course),
  lesson: ObjectId (ref: Lesson),
  completedLessons: [ObjectId],
  progress: Number,
  lastAccessedAt: Date,
  completedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛣️ API Routes Overview

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with credentials
- `POST /logout` - Logout user
- `POST /refresh-token` - Refresh access token
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password
- `POST /verify-email` - Verify email
- `POST /send-otp` - Send OTP
- `POST /verify-otp` - Verify OTP
- `GET /google` - Google OAuth login
- `GET /google/callback` - Google OAuth callback

### Course Routes (`/api/v1/courses`)
- `GET /` - Get all courses
- `GET /:id` - Get course by ID
- `POST /` - Create course (Admin/Staff)
- `PUT /:id` - Update course (Admin/Staff)
- `DELETE /:id` - Delete course (Admin)
- `GET /:id/modules` - Get course modules
- `GET /:id/lessons` - Get course lessons

### User Routes (`/api/v1/user`)
- `GET /profile` - Get user profile
- `PUT /profile` - Update profile
- `GET /courses` - Get enrolled courses
- `GET /progress` - Get learning progress
- `POST /enroll/:courseId` - Enroll in course
- `POST /upload-avatar` - Upload avatar

### Admin Routes (`/api/v1/admin`)
- `GET /users` - Get all users
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /courses` - Manage courses
- `GET /orders` - View all orders
- `GET /statistics` - Get statistics
- `POST /coupons` - Create coupon
- `PUT /settings` - Update settings

### Order/Payment Routes (`/api/v1`)
- `POST /purchase` - Purchase course
- `GET /orders` - Get user orders
- `POST /payment/payos` - PayOS payment
- `POST /payment/webhook` - Payment webhook

### Review Routes (`/api/v1/reviews`)
- `POST /courses/:id` - Add review
- `GET /courses/:id` - Get course reviews
- `PUT /:id` - Update review
- `DELETE /:id` - Delete review

### Comment Routes (`/api/v1/comments`)
- `POST /lessons/:id` - Add comment
- `GET /lessons/:id` - Get lesson comments
- `PUT /:id` - Update comment
- `DELETE /:id` - Delete comment

---

## 🔄 Data Flow Examples

### Example 1: User Enrolls in Course

```
1. User clicks "Enroll" button
   ↓
2. Client: POST /api/v1/purchase
   Headers: { Authorization: Bearer <token> }
   Body: { courseId: "xxx", paymentMethod: "payos" }
   ↓
3. Server: Verify user & token
   ↓
4. Server: Check course availability
   ↓
5. Server: Create order record
   ↓
6. Server: Process payment via PayOS
   ↓
7. Server: Update user enrolled courses
   ↓
8. Server: Create user progress record
   ↓
9. Server: Send confirmation email (queue)
   ↓
10. Server: Return success response
    ↓
11. Client: Update UI, redirect to course
```

### Example 2: Real-time Notification

```
1. Server event occurs (e.g., new comment)
   ↓
2. Server: socket.emit('newComment', data)
   ↓
3. Connected clients receive event
   ↓
4. Client: Update UI in real-time
   ↓
5. Client: Show notification toast
```

---

## 🎨 UI Component Architecture

### Component Hierarchy

```
App.jsx
└── Layout (Core)
    ├── Header
    │   ├── Logo
    │   ├── Navbar
    │   └── UserMenu
    │
    ├── Main Content
    │   └── Routes
    │       ├── Public Routes
    │       │   ├── Home
    │       │   ├── About
    │       │   ├── Courses
    │       │   └── Auth
    │       │
    │       └── Private Routes
    │           ├── User Dashboard
    │           ├── Learning Interface
    │           ├── Admin Dashboard
    │           └── Staff Dashboard
    │
    └── Footer
```

### Reusable Components

1. **Form Components**
   - Input fields
   - Select dropdowns
   - Checkboxes
   - Radio buttons
   - File upload

2. **Display Components**
   - Cards (Course, User, Product)
   - Modals/Dialogs
   - Tooltips
   - Alerts/Toasts
   - Progress bars

3. **Navigation Components**
   - Breadcrumbs
   - Pagination
   - Tabs
   - Sidebar

4. **Media Components**
   - Video player
   - Image carousel
   - Audio player

---

## 🔧 Configuration & Environment

### Client Environment Variables (.env)
```env
VITE_SERVER_API_V1=http://localhost:9999/api/v1
VITE_SOCKET_URL=http://localhost:9999
VITE_PROD=development
VITE_CLOUDINARY_CLOUD_NAME=xxx
```

### Server Environment Variables (.env)
```env
# Database
MONGO_URI=mongodb://localhost:27017/edupro

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRES_IN=30d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx

# PayOS
PAYOS_CLIENT_ID=xxx
PAYOS_API_KEY=xxx
PAYOS_CHECKSUM_KEY=xxx

# Google OAuth
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_CALLBACK_URL=http://localhost:9999/api/v1/auth/google/callback

# Server
PORT=9999
NODE_ENV=development
```

---

## 🚀 Getting Started

### Client Setup
```bash
cd client
npm install
npm run dev
```

### Server Setup
```bash
cd server
npm install
npm run dev
```

### Prerequisites
- Node.js (v16+)
- MongoDB (v6+)
- Redis (for queue)
- Cloudinary account
- PayOS account (for payment)

---

## 🧪 Testing & Development

### Available Scripts

#### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

#### Server
- `npm run dev` - Start with nodemon
- `npm test` - Run tests

### Development Tools
- **Bull Board**: Queue monitoring at `/admin/queues`
- **Swagger UI**: API docs at `/api-docs`
- **Morgan**: HTTP request logging
- **Redux DevTools**: State debugging
- **React DevTools**: Component debugging

---

## 📊 Performance Optimizations

### Client-Side
1. **Code Splitting**: Route-based lazy loading
2. **Caching**: React Query for server state
3. **Memoization**: useMemo, useCallback
4. **Image Optimization**: Lazy loading, responsive images
5. **Bundle Optimization**: Vite tree-shaking

### Server-Side
1. **Database Indexing**: MongoDB indexes
2. **Caching**: Redis for frequent queries
3. **Queue System**: Bull for async tasks
4. **Connection Pooling**: MongoDB connection pool
5. **Compression**: gzip middleware

---

## 🔒 Security Measures

### Client-Side Security
1. **XSS Protection**: DOMPurify for user content
2. **CSRF Protection**: SameSite cookies
3. **Secure Storage**: HttpOnly cookies for tokens
4. **Content Security Policy**: CSP headers
5. **Input Validation**: Form validation

### Server-Side Security
1. **Authentication**: JWT with refresh tokens
2. **Authorization**: Role-based access control
3. **Rate Limiting**: Prevent brute force
4. **Input Validation**: Request validation middleware
5. **SQL Injection**: Mongoose query sanitization
6. **CORS**: Whitelist allowed origins
7. **Helmet**: Security headers
8. **Password Hashing**: bcrypt
9. **Token Blacklisting**: Invalidated tokens

---

## 📈 Scalability Considerations

### Current Architecture
- Monolithic server application
- Single MongoDB instance
- Redis for queue management
- Socket.io for real-time features

### Future Improvements
1. **Microservices**: Split into separate services
2. **Load Balancing**: Nginx reverse proxy
3. **Database Sharding**: Horizontal scaling
4. **CDN**: Static asset delivery
5. **Caching Layer**: Redis caching
6. **Message Queue**: RabbitMQ/Kafka
7. **Containerization**: Docker + Kubernetes

---

## 📝 Code Quality & Standards

### Naming Conventions
- **Files**: camelCase.jsx, kebab-case.js
- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

### Code Structure
- **Modular**: Separate concerns
- **DRY**: Don't repeat yourself
- **SOLID**: Design principles
- **Comments**: Explain complex logic
- **Error Handling**: Try-catch blocks

---

## 🐛 Common Issues & Solutions

### Client Issues
1. **Token expired**: Automatic logout & redirect
2. **CORS errors**: Check server CORS config
3. **Socket connection**: Verify socket URL
4. **Build errors**: Clear node_modules, reinstall

### Server Issues
1. **MongoDB connection**: Check connection string
2. **Port in use**: Kill existing process
3. **Queue not processing**: Check Redis connection
4. **Email not sending**: Verify SMTP credentials

---

## 📚 Documentation References

### External Documentation
- [React Docs](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://www.mongodb.com/docs)
- [Socket.io Docs](https://socket.io/docs)
- [Redux Toolkit](https://redux-toolkit.js.org)

### Internal Documentation
- `client/note.md` - Authentication flow
- `client/note.txt` - Folder structure
- `server/oas-docs/swagger.json` - API documentation

---

## 👥 Team & Roles

### Roles in System
1. **Admin**: Full system access
   - User management
   - Course management
   - Settings configuration
   - Analytics & reports

2. **Staff**: Content management
   - Create/edit courses
   - Manage lessons
   - Respond to comments
   - View analytics

3. **User**: Learning access
   - Browse courses
   - Enroll in courses
   - Track progress
   - Submit reviews
   - Comment on lessons

---

## 📊 Statistics & Metrics

### Current Codebase
- **Total Files**: 425+ files
- **Client Files**: 287 JS/JSX files
- **Server Files**: 138 JS files
- **Database Models**: 18 models
- **API Routes**: 50+ endpoints
- **Components**: 60+ React components
- **Pages**: 11 major pages

---

## 🎯 Feature Roadmap

### Current Features ✅
- User authentication & authorization
- Course browsing & enrollment
- Video-based learning
- Progress tracking
- Payment integration
- Real-time notifications
- Comments & reviews
- Admin dashboard
- Coupon system
- Email notifications

### Planned Features 🚧
- AI-powered recommendations
- Live streaming classes
- Advanced analytics
- Mobile app
- Gamification
- Peer-to-peer learning
- Certificate blockchain
- Multi-language support (enhanced)

---

## 🔄 Deployment

### Client Deployment
- **Platform**: Vercel, Netlify, or custom
- **Build Command**: `npm run build`
- **Output Directory**: `dist/`

### Server Deployment
- **Platform**: Heroku, DigitalOcean, AWS, or custom
- **Process Manager**: PM2
- **Database**: MongoDB Atlas
- **Cache**: Redis Cloud

---

## 📞 Support & Maintenance

### Error Logging
- Server logs in `server/src/logs/`
- Client errors: Browser console
- API errors: Response interceptor

### Monitoring
- Bull Board: Queue monitoring
- MongoDB Compass: Database monitoring
- Application logs: File-based logging

---

## 🏁 Conclusion

EduPro là một nền tảng học tập trực tuyến được xây dựng với kiến trúc hiện đại, scalable và bảo mật cao. Hệ thống được thiết kế theo nguyên tắc **separation of concerns**, với client và server hoàn toàn độc lập, giao tiếp qua REST API và WebSocket.

### Key Strengths
✅ **Modern Stack**: React, Express, MongoDB
✅ **Real-time**: Socket.io integration
✅ **Secure**: JWT, OAuth, role-based access
✅ **Scalable**: Queue system, caching
✅ **User-friendly**: Responsive UI, smooth UX
✅ **Well-documented**: Swagger API docs

### Development Best Practices Applied
✅ **Clean Code**: Readable, maintainable
✅ **Modular Architecture**: Easy to extend
✅ **Error Handling**: Comprehensive error management
✅ **Security First**: Multiple security layers
✅ **Performance**: Optimized for speed

---

**Document Version**: 1.0
**Last Updated**: November 2025
**Author**: EduPro Development Team

