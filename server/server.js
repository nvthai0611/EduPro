const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require("morgan");
const { Server } = require("socket.io");
const socketService = require("./src/utils/socket/socket");
const PayOS = require("@payos/node");
const axios = require("axios");
const fs = require("fs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const connectFlash = require("connect-flash");
const cors = require("cors");
const connectDB = require("./src/config/db");

//Test bull
const { ExpressAdapter } = require('@bull-board/express');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');

dotenv.config();
const passport = require("passport");
const passportGoogle = require("./src/passports/passport.google");
const apiRouter = require("./src/routes/api");
const User = require("./src/models/user.model");

// Cron
require("./src/utils/cron/cronUser");
require("./src/utils/cron/promotion.cron");
require("./src/utils/cron/coupons.cron");
require("./src/utils/cron/userCoupons.cron");
require("./src/utils/cron/learningReminders.cron");

//queue
const couponEmailQueue = require("./src/utils/queue/couponEmail.queue");
const app = express();

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://haeispa.online",
  "http://localhost:9999",
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// ================= Bull Queue =================
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [new BullAdapter(couponEmailQueue)],
  serverAdapter
});

app.use('/admin/queues', serverAdapter.getRouter());
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
passport.use("google", passportGoogle);
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
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
const swaggerOptions = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Spa Booking API",
      version: "0.1.0",
      description: "This is a simple CRUD API with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Spa Booking",
        email: "hainvthe172670@fpt.edu.vn",
      },
    },
    servers: [
      {
        url: "http://localhost:9999",
        description: "Development server",
      },
    ],
  },
  apis: [
    "./src/routes/v1/user/booking_public/*.js",
    "./src/models/*.js",
    "./src/controllers/*.js",
  ],
};
const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// ================= API Routes =================
app.use("/api/v1", apiRouter);

// ================= 404 & Error Handler =================
app.use((req, res, next) => {
  res.status(404).json({ error: "Không tìm thấy trang" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || "Internal Server Error",
  });
});

// ================= MongoDB Connect =================
connectDB();

// ================= PayOS =================
const payos = new PayOS(
  process.env.PAYOS_CLIENT_ID,
  process.env.PAYOS_API_KEY,
  process.env.PAYOS_CHECKSUM_KEY
);

// ================= Auto Update Ngrok Webhook =================
global.ngrokWebhookUrl = "";
const updateNgrokWebhookUrl = async () => {
  if (process.env.USE_NGROK !== "true") return;

  try {
    const res = await axios.get("http://127.0.0.1:4040/api/tunnels");
    const httpsTunnel = res.data.tunnels.find(t => t.proto === "https");
    if (httpsTunnel) {
      global.ngrokWebhookUrl = `${httpsTunnel.public_url}/api/v1/payos/receive-hook`;
      console.log("✅ Ngrok Webhook URL:", global.ngrokWebhookUrl);
      await payos.confirmWebhook(global.ngrokWebhookUrl);
    } else {
      console.warn("⚠️ Không tìm thấy tunnel dạng https.");
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy webhook URL:", err.message);
  }
};


// ================= Start Server =================
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });
socketService(io);

const PORT = process.env.PORT || 9999;

updateNgrokWebhookUrl().then(() => {
  server.listen(PORT, () => {
    const domain =
      process.env.NODE_ENV === "production"
        ? `https://express.haeispa.online`
        : `http://localhost:${PORT}`;
    console.log(`🚀 Server đang chạy tại: ${domain}`);
  });
});
