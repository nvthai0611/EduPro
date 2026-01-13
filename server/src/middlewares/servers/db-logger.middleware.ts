import { Request, Response, NextFunction } from "express";
import requestIp from "request-ip";
import geoip from "geoip-lite";
import { AccessLogModel } from "../../modules/logs/accessLog.model";

export function dbLogger(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", async () => {
    try {
      const ip = requestIp.getClientIp(req) || "unknown";

      let geo = "Unknown";
      if (ip === "::1" || ip === "127.0.0.1") {
        geo = "Localhost";
      } else {
        const g = geoip.lookup(ip);
        if (g) {
          geo = `${g.country || ""}-${g.city || ""}`;
        }
      }

      await AccessLogModel.create({
        ip,
        geo,
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        responseTime: Date.now() - start,
        userId: req.user?.id,
        email: req.user?.email,
      });
    } catch (err) {
      console.error("DB Logger error:", err);
    }
  });

  next();
}
