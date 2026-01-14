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
      const user = req.user as any

      const session = await Session.findOne({
        userId: user._id,
        isValid: true,
        expiresAt: { $gt: new Date() },
      });

      if (!session) {
        return res.status(401).send('Invalid credentials');
      }

      const dataFinal = {
        render_id: user.sessionToken,
        runtime_ctx: session.deviceId
      }
      
      return res.json(dataFinal);
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