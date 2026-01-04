import { Request, Response } from "express";
import userService from "../user/user.service";
import { createAccessToken } from "../../utils/jwt";
import crypto from "crypto";
import Session from "../session/session.model";

class AuthController {
  /**
   * Login for admin/manager with email and password
   * POST /api/v1/auth/login/manager
   */
  async loginManager(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Email và mật khẩu là bắt buộc",
        });
      }

      // Find user by email
      const user = await userService.getUserByEmail(email.trim().toLowerCase());

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      // Check if user has password (not OAuth user)
      if (!user.password) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản này không hỗ trợ đăng nhập bằng mật khẩu",
        });
      }

      // Check if user role is admin (only admin can login via manager portal)
      if (user.role !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Bạn không có quyền truy cập vào hệ thống quản trị",
        });
      }

      // Check account status
      if (user.status === false) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên",
        });
      }

      // Verify password
      const isPasswordValid = await (user as any).comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không đúng",
        });
      }

      const sessionId = crypto.randomUUID();

      // Create access token
      const accessToken = await createAccessToken({
        userId: (user as any)._id,
        role: user.role,
        image: user.image,
        sessionId: sessionId,
      });     

      await Session.deleteMany({ userId: (user as any)._id });

      // Lưu phiên đăng nhập mới
      await Session.create({
        userId: (user as any)._id,
        sessionId,
        // deviceId: req.headers["x-desktop-ref"],
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const isProduction = process.env.NODE_ENV === "production";

      // Cookie options
      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict", // lax thay vì strict để CORS hoạt động
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? ".fuedupro.com" : undefined, // undefined cho localhost
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      // Set cookie
      res.cookie("render_id", accessToken, cookieOptions as any);

      // Return response
      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        data: {
          accessToken,
          user: {
            _id: (user as any)._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            image: user.image,
            status: user.status,
            accessToken: accessToken,
          },
        },
      });
    } catch (error) {
      console.error("Login Manager Error:", error);
      return res.status(500).json({
        success: false,
        message: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}

export default new AuthController();