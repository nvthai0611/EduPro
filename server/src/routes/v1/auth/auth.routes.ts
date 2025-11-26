import { Router, Request, Response } from "express";
import passport from "passport";

import * as authController from "../../../controllers/v1/auth/auth.controller";
import { createAccessToken, decodeToken, refreshAccessToken } from "../../../utils/jwt";
import UserTransformer from "../../../modules/user/user.transformers";

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
        image: (req.user as any).image
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

      // accessToken
      res.cookie("render_id", accessToken, cookieOptions as any);

      return res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

export const authRoutes: Router = router;
