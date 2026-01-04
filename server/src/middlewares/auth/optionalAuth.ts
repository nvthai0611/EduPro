import UserService from "../../modules/user/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../../utils/jwt";
import { errorResponse } from "../../utils/response";
import Session from "../../modules/session/session.model";

const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.render_id;

    if (!token) {
      return next();
    } else {
      const decoded = await decodeToken(token);
      const user = await UserService.getUserById(decoded.userId);

      if (!user) {
        return errorResponse(res, {}, 401, "Người dùng không tồn tại");
      }
      const session = await Session.findOne({
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return errorResponse(res, {}, 401, "Phiên đăng nhập không hợp lệ");
      }

      // const currentDeviceId = req.headers['x-desktop-ref'] as string;
      // const currentIp = req.ip;

      // if (session.deviceId !== currentDeviceId || session.ip !== currentIp) {
      //   // session.isValid = false;
      //   // await session.save();
      //   return errorResponse(res, {}, 401, "Thiết bị không hợp lệ");
      // }

      if (user.status === false) {
        return errorResponse(res, {}, 401, "Tài khoản đã bị vô hiệu hóa");
      }

      return next();
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, {}, 401, "Lỗi xác thực");
  }
};

export default optionalAuth;