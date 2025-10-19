const express = require("express");
const authController = require("../../../controllers/v1/auth/auth.controller");
const authMiddleware = require("../../../middlewares/auth/v1/auth.middleware");
const passport = require("passport");
const { createAccessToken, refreshAccessToken } = require("../../../utils/jwt");
const router = express.Router();
const UserTransformer = require("../../../transformers/user.transformers");

router.get("/users", authMiddleware, authController.profile);
router.post("/login", authController.login);
router.post("/login/manager", authController.loginManager);
router.post("/register", authController.register);
router.get("/logout", authMiddleware, authController.logout);
router.get("/verify-token", authMiddleware, authController.verifyToken);
router.post('/check-email-phone', authController.checkExistsPhoneOrEmail);
// đăng nhập với google
// Hainvt setting
router.get("/google", passport.authenticate("google"));
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect(process.env.FRONTEND_URL);
      }

      const accessToken = await createAccessToken({
        userId: req.user._id,
        role: "customer",
      });

      const refreshToken = await refreshAccessToken();
      const user_parse = new UserTransformer(req.user);

      const isProduction = process.env.NODE_ENV === "production";

      // Tự động xác định domain nếu production
      const cookieDomain = isProduction ? "haeispa.online" : undefined;

      const cookieOptions = {
        sameSite: isProduction ? "None" : "Strict", // None nếu muốn share giữa FE-BE
        secure: isProduction, // bắt buộc với SameSite=None
        httpOnly: false, // FE cần đọc user_data, accessToken
        domain: cookieDomain,
      };

      res.cookie("user_data", user_parse, cookieOptions);
      res.cookie("accessToken", accessToken, cookieOptions);

      // Nếu cần lưu refreshToken sau này
      // res.cookie("refreshToken", refreshToken, cookieOptions);

      return res.redirect(process.env.FRONTEND_URL);
    } catch (error) {
      console.error("Google Callback Error:", error);
      return res.redirect(`${process.env.FRONTEND_URL}?error=Server Error`);
    }
  }
);

router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/change-password", authMiddleware, authController.changePassword);

router.post('/forgot-password-email', authController.sendLinkResetPassword)
router.post('/confirm-reset-password', authController.confirmEmailResetPassword)
module.exports = router;
