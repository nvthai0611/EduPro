import UserService from "../../modules/user/user.service";
import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../../utils/jwt";
import { errorResponse } from "../../utils/response";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ưu tiên cookie trước, fallback sang Authorization header
    let accessToken = req.cookies?.render_id;
    
    // Nếu không có cookie, thử lấy từ Authorization header
    if (!accessToken && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      // Xử lý cả "Bearer token" và chỉ "token"
      if (authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.substring(7).trim();
      } else {
        // Nếu không có "Bearer ", có thể là token trực tiếp
        accessToken = authHeader.trim();
      }
    }

    if (!accessToken) {
      return errorResponse(
        res,
        {},
        401,
        "Token không hợp lệ hoặc không được cung cấp"
      );
    }

    // Verify token
    const decode = await decodeToken(accessToken);
    if (!decode) {
      return errorResponse(res, {}, 401, "Token không hợp lệ");
    }

    // Get user
    const user = await UserService.getUserById(decode.userId);
    if (!user) {
      return errorResponse(res, {}, 401, "Người dùng không tồn tại");
    }

    // Check user status
    if (!user.isActive || !user.confirmEmail) {
      return errorResponse(res, {}, 401, "Tài khoản chưa được kích hoạt");
    }

    // Kiểm tra session token có match không
    if (user.sessionToken === undefined || user.sessionToken !== accessToken) {
      return errorResponse(
        res,
        {},
        401,
        "Phiên đăng nhập của bạn đã hết hạn. Bạn đã đăng nhập ở thiết bị khác."
      );
    }

    // CHECK SESSION EXPIRATION
    if (
      user.sessionTokenExpiresAt === null ||
      user.sessionTokenExpiresAt < new Date()
    ) {
      return errorResponse(
        res,
        {},
        401,
        "Token đã hết hạn, vui lòng đăng nhập lại"
      );
    }

    // Refresh session expiration (tự động extend 24h)
    const newExpiresAt = new Date();
    newExpiresAt.setHours(newExpiresAt.getHours() + 24);
    
    await UserService.updateUser(decode.userId, {
      sessionTokenExpiresAt: newExpiresAt,
    });

    // Attach user to request
    req.user = {
      id: user["_id"],
      userId: decode.userId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      image: user.image,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return errorResponse(res, {}, 401, "Lỗi xác thực");
  }
};

export default authenticateToken;