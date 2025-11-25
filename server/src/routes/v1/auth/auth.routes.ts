import { Router, Request, Response } from "express";
import passport from "passport";

import * as authController from "../../../controllers/v1/auth/auth.controller";
import { createAccessToken, refreshAccessToken } from "../../../utils/jwt";
import UserTransformer from "../../../modules/user/user.transformers";
import { encryptAES } from "../../../utils/crypto";

const router: Router = Router();

// ===============================
//        FORGOT PASSWORD
// ===============================
router.post('/forgot-password-email', authController.sendLinkResetPassword);

router.post('/confirm-reset-password', authController.confirmEmailResetPassword);


// ===============================
//        GOOGLE AUTH
// ===============================

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email", "https://www.googleapis.com/auth/userinfo.profile"],
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
      });

      const refreshToken = await refreshAccessToken();

      // FIX: Truyền user vào transformer
      const user_parse = new UserTransformer(req.user).response(req.user as any);

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict",
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? "haeispa.online" : undefined,
      };

      // Set Cookies
      res.cookie("user_data", user_parse, cookieOptions as any);
      res.cookie("accessToken", accessToken, cookieOptions as any);
      res.cookie("refreshToken", refreshToken, cookieOptions as any);

      // // user_data
      // res.cookie("layout_snapshot", await encryptAES(`${JSON.stringify(user_parse)}`), cookieOptions as any);

      // // accessToken
      // res.cookie("render_id", await encryptAES(`${accessToken}`), cookieOptions as any);

      // // refreshToken
      // res.cookie("viewport_sig", await encryptAES(`${refreshToken}`), cookieOptions as any);

      return res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

export const authRoutes: Router = router;
