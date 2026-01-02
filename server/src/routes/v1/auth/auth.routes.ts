import { Router, Request, Response } from "express";
import passport from "passport";
import crypto from "crypto";

import { createAccessToken, decodeToken } from "../../../utils/jwt";
import userService from "../../../modules/user/user.service";
import authController from "../../../modules/auth/auth.controller";
import Session from "../../../modules/session/session.model";

const router: Router = Router();

// ===============================
//     MANAGER/ADMIN LOGIN
// ===============================

router.post("/login/manager", authController.loginManager);

// ===============================
//        GOOGLE AUTH
// ===============================

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "profile",
      "email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
    session: false,
  }),
  async (req: Request, res: Response) => {
    try {
      console.log(
        "🔍 Google Callback - User:",
        req.user ? "Found" : "Not found"
      );

      if (!req.user) {
        console.log("❌ No user, redirecting to:", process.env.FRONTEND_URL);
        return res.redirect(process.env.FRONTEND_URL!);
      }

      const user = req.user as any;
      console.log("✅ User authenticated:", user.email || user._id);

      const sessionId = crypto.randomUUID();

      // Luôn tạo JWT mới mỗi lần đăng nhập Google
      // Cho phép user đăng nhập từ nhiều thiết bị
      const accessToken = await createAccessToken({
        userId: (req.user as any)["_id"],
        role: (req.user as any).role || "customer",
        image: (req.user as any).image,
        sessionId: sessionId,
      });
      console.log("🔑 Access token created, length:", accessToken.length);

      // Vô hiệu hóa các phiên đăng nhập trước đó của user
      // await Session.updateMany(
      //   { userId: user._id, isValid: true },
      //   { $set: { isValid: false } }
      // );
      await Session.deleteMany({ userId: user._id });

      // Lưu phiên đăng nhập mới
      await Session.create({
        userId: user._id,
        sessionId,
        deviceId: req.cookies.runtime_ctx,
        userAgent: req.headers["user-agent"],
        ip: req.ip,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const isProduction = process.env.NODE_ENV === "production";
      const adminDomain = isProduction ? "https://dash.fuedupro.com" : "http://dash.fuedupro.local:5173";

      // Cookie options - domain phải là undefined cho localhost
      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict", // lax thay vì strict để CORS hoạt động
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? ".fuedupro.com" : undefined, // undefined cho localhost
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      // Mã hóa token và gửi về FE để FE tự lưu vào cookie
      // Dùng tên ngắn gọn 'auth' thay vì 'token' để không lộ ý định
      res.cookie("render_id", accessToken, cookieOptions as any);

      if (user?.role !== "admin") {
        // Set cookie với token (backup nếu FE không lưu được)
        // res.cookie("render_id", accessToken, cookieOptions as any);
        console.log("🍪 Cookie set with options:", cookieOptions);

        const redirectUrl = `${process.env.FRONTEND_URL}?auth=${accessToken}`;
        return res.redirect(redirectUrl);
      } else {
        res.redirect(`${adminDomain}/auth/callback?auth=${accessToken}`);
      }
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

router.get("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.render_id || req.query.token;
  console.log(token);

  if (!token) return res.status(400).send("You are not logged in");

  try {
    const decoded: any = await decodeToken(token);

    await userService.updateUser(decoded.userId, {
      $unset: {
        sessionToken: 1,
        sessionTokenExpiresAt: 1,
      },
    } as any);

    await Session.updateOne(
      { sessionId: decoded.sessionId },
      { isValid: false }
    );

    // Xóa token khỏi cookie
    res.clearCookie("render_id");
    res.clearCookie("runtime_ctx");

    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export const authRoutes: Router = router;
