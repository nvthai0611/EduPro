import { Router, Request, Response } from "express";
import passport from "passport";

import { createAccessToken } from "../../../utils/jwt";

const router: Router = Router();

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
      if (!req.user) {
        return res.redirect(process.env.FRONTEND_URL!);
      }

      // Generate JWT
      const accessToken = await createAccessToken({
        userId: (req.user as any)["_id"],
        role: (req.user as any).role || "customer",
        image: (req.user as any).image,
      });

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict",
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? "edu-pro-delta.vercel.app" : undefined,
      };

      // Set cookie với token
      res.cookie("render_id", accessToken, cookieOptions as any);

      // Mã hóa token bằng Base64 để bảo mật khi truyền qua URL
      // Dùng tên tham số ngắn gọn để không lộ ý định
      const encodedToken = Buffer.from(accessToken).toString("base64");
      return res.redirect(`${process.env.FRONTEND_URL}?auth=${encodedToken}`);
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

export const authRoutes: Router = router;
