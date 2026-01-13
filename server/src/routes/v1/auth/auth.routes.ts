import { Router, Request, Response } from "express";
import passport from "passport";
import crypto from "crypto";
import requestIp from "request-ip";

import { createAccessToken, decodeToken } from "../../../utils/jwt";
import userService from "../../../modules/user/user.service";
import authController from "../../../modules/auth/auth.controller";
import Session from "../../../modules/session/session.model";
import { addTokenToBlacklist } from "../../../modules/blacklist/blacklist.service";
import { basicAuth } from "../../../middlewares/auth/basicAuth";

const router: Router = Router();

// ===============================
//     ADMIN LOGIN
// ===============================

router.get("/login/admin", basicAuth({ realm: 'Admin Area' }), authController.loginManager);

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
      const deviceId = crypto.randomUUID();

      // Luôn tạo JWT mới mỗi lần đăng nhập Google
      // Cho phép user đăng nhập từ nhiều thiết bị
      const accessToken = await createAccessToken({
        userId: (req.user as any)["_id"],
        role: (req.user as any).role || "customer",
        image: (req.user as any).image,
        sessionId: sessionId,
      });
      console.log("🔑 Access token created, length:", accessToken.length);

      await userService.updateUser(user._id, {
        sessionToken: accessToken,
      });

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
        deviceId,
        userAgent: req.headers["user-agent"],
        ip: requestIp.getClientIp(req),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      try {
        const redirectUrlObj = new URL(process.env.FRONTEND_URL!);
        redirectUrlObj.searchParams.set("auth", accessToken);
        redirectUrlObj.searchParams.set("deviceId", deviceId);
        return res.redirect(redirectUrlObj.toString());
      } catch (e) {
        const redirectUrl = `${process.env.FRONTEND_URL}?auth=${accessToken}&deviceId=${deviceId}`;
        return res.redirect(redirectUrl);
      }
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

router.get("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.render_id || req.query.token;

  if (!token) return res.status(400).send("You are not logged in");

  try {
    // lưu token vào blacklist
    const decoded: any = await decodeToken(token);

    await addTokenToBlacklist(token);

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
