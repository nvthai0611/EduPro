const express = require("express");
const userController = require("../../../controllers/v1/auth/user.controller");
const authMiddleware = require("../../../middlewares/auth/v1/auth.middleware");
const uploadCloud = require("../../../middlewares/servers/imageUpload");
const cartRouter = require('../user/cart.routes')
const orderRouter = require('../user/order.routes')
const router = express.Router();

// Lấy danh sách người dùng
router.get("/", authMiddleware, userController.index);
router.get("/providers", userController.getProviders);
router.get("/update/:id", authMiddleware, userController.getDetailUser);
router.get("/check/:email", userController.getUserByEmail);
router.put(
  "/update/:id",
  authMiddleware,
  uploadCloud.single("image"),
  userController.updateUser
);

//getAllBooking
router.get("/:id/bookings", authMiddleware, userController.getAllBookingByID);

//getAllBookingPendingAndConfirmById
router.get("/:id/bookings-pending-confirm", authMiddleware, userController.getAllBookingPendingAndConfirm);
//getAllBookingHistory and rating
router.get("/:id/booking-history", authMiddleware, userController.getAllBookingHistory
);

// create rating and feedback
router.post("/:id/rating-and-feedback", authMiddleware, userController.createRating);
// getAllCoupons
router.get("/:id/coupons", authMiddleware, userController.getAllCoupons);
//api homepage

router.post(
  "/coupon/validate-code",
  authMiddleware,
  userController.validateCouponCode
);

//user-profile
router.get('/user-profile', authMiddleware, userController.getUserProfileController);
router.put("/change-password", authMiddleware, userController.changePasswordController);
router.put('/change-user-profile', authMiddleware, userController.changeUserProfileController)
router.put("/change-avatar", authMiddleware, uploadCloud.single('image'), userController.changeImageProfileController);
router.post('/send-otp', userController.sendOTPController)
router.post('/resend-otp', userController.resendOTPController)
router.post('/verify-otp', userController.verifyOTPController)

router.use("/cart", authMiddleware, cartRouter);
router.use("/orders", authMiddleware, orderRouter);

module.exports = router;
