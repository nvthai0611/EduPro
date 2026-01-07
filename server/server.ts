import express from "express";
import http from "http";
import helmet from "helmet";
import morgan from "morgan";
import { Server } from "socket.io";
import SocketService from "./src/utils/socket/socket";
import PayOS from "@payos/node";
import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectFlash from "connect-flash";
import cors from "cors";
import connectDB from "./src/config/db";

// //Test bull
// const { ExpressAdapter } = require('@bull-board/express');
// const { createBullBoard } = require('@bull-board/api');
// const { BullAdapter } = require('@bull-board/api/bullAdapter');

dotenv.config();
import passport from "passport";
import "./src/passports/passport.google";
import { apiRouter } from "./src/routes/api";
import { limitRequestsMiddleware } from "./src/middlewares/auth/limitRequest.middleware";
import requireAuth from "./src/middlewares/auth/requireActiveAuth";
// const User = require("./src/models/user.model");

// // Cron
// require("./src/utils/cron/cronUser");
// require("./src/utils/cron/promotion.cron");
// require("./src/utils/cron/coupons.cron");
// require("./src/utils/cron/userCoupons.cron");
// require("./src/utils/cron/learningReminders.cron");

//queue
// const couponEmailQueue = require("./src/utils/queue/couponEmail.queue");
const app = express();

// ================= Security Headers =================
// Hide X-Powered-By header
app.disable('x-powered-by');

// Add security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false, // Allow embedding
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow CORS
}));

app.set('trust proxy', true); // Cấu hình express tin tưởng proxy

// Add custom security headers
app.use((req, res, next) => {
  // Remove Server header
  res.removeHeader('Server');
  res.removeHeader('X-Powered-By');

  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
});

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  'http://fuedupro.local:5173',
  'http://dash.fuedupro.local:5173',
  "http://localhost:3000",
  "http://localhost:9999",
  "https://www.fuedupro.com",
  "https://dash.fuedupro.com",
  "https://edu-pro-delta.vercel.app",
];
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "x-desktop-ref"],
  exposedHeaders: ["x-encrypted"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// // ================= Bull Queue =================
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/admin/queues');

// createBullBoard({
//   queues: [new BullAdapter(couponEmailQueue)],
//   serverAdapter
// });

// app.use('/admin/queues', serverAdapter.getRouter());
// ================= Middleware =================
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use(
  session({
    secret: "setting express01",
    resave: false,
    saveUninitialized: true,
    name: "setting-session",
  })
);
app.use(connectFlash());
app.use(passport.initialize());
app.use(passport.session());

// ================= Passport =================
// passport.google.ts registers the Google strategy when imported
passport.serializeUser((user: any, done: any) => done(null, (user as any).id));
passport.deserializeUser(async (id: any, done: any) => {
  try {
    const User =
      require("./src/models/user.model").default ||
      require("./src/models/user.model");
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
// ================= Body Parser =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



// ================= Request Log =================
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ================= Swagger =================
// const swaggerOptions = {
//   definition: {
//     openapi: "3.1.0",
//     info: {
//       title: "Spa Booking API",
//       version: "0.1.0",
//       description: "This is a simple CRUD API with Swagger",
//       license: {
//         name: "MIT",
//         url: "https://spdx.org/licenses/MIT.html",
//       },
//       contact: {
//         name: "Spa Booking",
//         email: "hainvthe172670@fpt.edu.vn",
//       },
//     },
//     servers: [
//       {
//         url: "http://localhost:9999",
//         description: "Development server",
//       },
//     ],
//   },
//   apis: [
//     "./src/routes/v1/user/booking_public/*.js",
//     "./src/models/*.js",
//     "./src/controllers/*.js",
//   ],
// };
// const specs = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// ================= MongoDB Connect =================
connectDB();

// ================= PayOS =================
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID as string,
  process.env.PAYOS_API_KEY as string,
  process.env.PAYOS_CHECKSUM_KEY as string
);

// ================= Auto Update Ngrok Webhook =================
declare global {
  // eslint-disable-next-line no-var
  var ngrokWebhookUrl: string;
}
global.ngrokWebhookUrl = "";
const updateNgrokWebhookUrl = async () => {
  if (process.env.USE_NGROK !== "true") return;

  try {
    const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
    const httpsTunnel = res.data.tunnels.find((t: any) => t.proto === "https");
    if (httpsTunnel) {
      global.ngrokWebhookUrl = `${httpsTunnel.public_url}/api/v1/payos/receive-hook`;
      console.log("✅ Ngrok Webhook URL:", global.ngrokWebhookUrl);
      await payos.confirmWebhook(global.ngrokWebhookUrl);
    } else {
      console.warn("⚠️ Không tìm thấy tunnel dạng https.");
    }
  } catch (err: any) {
    console.error("❌ Lỗi khi lấy webhook URL:", err.message);
  }
};

// ================= Start Server =================
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

const socketService = new SocketService(io);
socketService.listen();

// ================= API Routes =================
app.use("/api/v1", limitRequestsMiddleware, apiRouter(io));

// ================= 404 & Error Handler =================
app.use((req, res, next) => {
  res.status(404).json({ error: "Không tìm thấy trang" });
});

app.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 9999;

updateNgrokWebhookUrl().then(() => {
  server.listen(PORT, () => {
    const domain =
      process.env.NODE_ENV === "production"
        ? `https://edu-pro-delta.vercel.app/`
        : `http://localhost:${PORT}`;
    console.log(`🚀 Server đang chạy tại: ${domain}`);
  });
});
