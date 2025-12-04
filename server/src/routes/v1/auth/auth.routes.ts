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

      // Luôn tạo JWT mới mỗi lần đăng nhập Google
      // Cho phép user đăng nhập từ nhiều thiết bị
      const accessToken = await createAccessToken({
        userId: (req.user as any)["_id"],
        role: (req.user as any).role || "customer",
        image: (req.user as any).image,
      });
      console.log("🔑 Access token created, length:", accessToken.length);

      // Cập nhật sessionToken mới nhất (optional - để track login gần nhất)
      await userService.updateUser(user._id, {
        sessionToken: accessToken,
        sessionTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });

      const isProduction = process.env.NODE_ENV === "production";

      // Cookie options - domain phải là undefined cho localhost
      const cookieOptions = {
        sameSite: isProduction ? "none" : "strict", // lax thay vì strict để CORS hoạt động
        secure: isProduction,
        httpOnly: false,
        domain: isProduction ? "edu-pro-delta.vercel.app" : undefined, // undefined cho localhost
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      };

      // Set cookie với token (backup nếu FE không lưu được)
      res.cookie("render_id", accessToken, cookieOptions as any);
      console.log("🍪 Cookie set with options:", cookieOptions);

      // Mã hóa token và gửi về FE để FE tự lưu vào cookie
      // Dùng tên ngắn gọn 'auth' thay vì 'token' để không lộ ý định
      const encodedToken = Buffer.from(accessToken).toString("base64");
      const redirectUrl = `${process.env.FRONTEND_URL}?auth=${encodedToken}`;
      console.log("🔄 Redirecting to:", redirectUrl);
      return res.redirect(redirectUrl);
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

    await userService.updateUser(decoded.userId, {
      $unset: { sessionToken: "" },
      $set: { sessionTokenExpiresAt: "" },
    } as any);

    // Xóa token khỏi cookie
    res.clearCookie("render_id");

    res.status(200).send("Logged out successfully");
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export const authRoutes: Router = router;
