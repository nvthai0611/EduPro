import jwt from 'jsonwebtoken';
import morgan from "morgan";
import fs from "fs";
import path from "path";
import requestIp from "request-ip";
import geoip from "geoip-lite";
import { Request } from "express";

/* Tạo thư mục logs nếu chưa có */
// Luôn trỏ về server/src
const srcDir = path.resolve(process.cwd(), "src");

// server/src/logs
const logDir = path.join(srcDir, "logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/* Stream ghi file */
const logStream = fs.createWriteStream(
  path.join(logDir, "access.log"),
  { flags: "a" }
);

/* Custom token IP */
morgan.token("ip", (req: Request) => {
  return requestIp.getClientIp(req) || "unknown";
});

/* Custom token GEO */
morgan.token("geo", (req: Request) => {
  const ip = requestIp.getClientIp(req);
  if (!ip) return "Unknown";

  if (ip === "::1" || ip === "127.0.0.1") {
    return "Localhost";
  }

  const geo = geoip.lookup(ip);
  if (!geo) return "Unknown";

  return `${geo.country || ""}-${geo.city || ""}`;
});

/* token USER */
morgan.token("userId", (req: any) => {
  return req.user?.id || "guest";
});

morgan.token("email", (req: any) => {
  return req.user?.email || "guest";
});

/* Format log */
const format =
  `[:date[iso]] ` +
  `:ip (:geo) ` +
  `userId=:userId email=:email ` +
  `":method :url" ` +
  `:status - :response-time ms`;

export const morganLogger = morgan(format, {
  stream: logStream,
});
