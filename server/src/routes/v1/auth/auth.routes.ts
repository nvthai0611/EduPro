import { Router, Request, Response } from "express";
import passport from "passport";

import { createAccessToken, decodeToken } from "../../../utils/jwt";
import userService from "../../../modules/user/user.service";

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

      const user = req.user as any;

      // Kiểm tra xem người dùng đã có sessionToken chưa
      const existingUser = await userService.getUserById(user._id);
      if (existingUser?.sessionToken) {
        // Nếu đã có sessionToken, từ chối đăng nhập
        return res.redirect(`${process.env.FRONTEND_URL}?error=User already logged in`);
      }

      // Generate JWT
      const accessToken = await createAccessToken({
        userId: (req.user as any)["_id"],
        role: (req.user as any).role || "customer",
        image: (req.user as any).image,
      });

      // Cập nhật sessionToken cho người dùng
      existingUser.sessionToken = accessToken;
      await userService.updateUser(user._id, { sessionToken: accessToken });

      const isProduction = process.env.NODE_ENV === "production";

      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict",
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? "edu-pro-delta.vercel.app" : undefined,
      };

      res.cookie("render_id", accessToken, cookieOptions as any);

      return res.redirect(process.env.FRONTEND_URL!);
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

router.get("/logout", async (req: Request, res: Response) => {
  const token = req.cookies.render_id;
  if (!token) return res.status(400).send("You are not logged in");

  try {
    const decoded: any = await decodeToken(token);

    await userService.updateUser(decoded.userId, { $unset: { sessionToken: "" } } as any);

    // Xóa token khỏi cookie
    res.clearCookie("render_id");

    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
})

export const authRoutes: Router = router;
