import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { decodeToken } from "../../utils/jwt";

interface RequestWithUser extends Request {
  decodedUserId?: string;
}

export const limitRequestsMiddleware = (() => {
  // Middleware decode token và attach decodedUserId
  const attachDecodedUser = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.render_id;
      if (!token) return next(); // guest fallback

      const decoded = await decodeToken(token);
      
      if (!decoded?.userId) return next();

      req.decodedUserId = decoded.userId; // gán tạm để rate-limit dùng
      next();
    } catch {
      next();
    }
  };

  // Middleware rate-limit
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 phút
    max: (req: RequestWithUser) => (req.decodedUserId ? 300 : 15),
    keyGenerator: (req: RequestWithUser) => req.decodedUserId,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: RequestWithUser, res) => {
      res.status(429).json({
        message: req.decodedUserId
          ? "Bạn đã vượt quá 300 request/phút"
          : "Bạn đã vượt quá 15 request/phút",
      });
    },
  });

  // Return middleware kết hợp
  return [attachDecodedUser, limiter];
})();
