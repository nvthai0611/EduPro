const express = require("express");
const { getAllUserCustomerController, getAllBookingController, getAllCouponsController, createUserCouponController, getAllUserCouponsController, sendGiftCouponController } = require("../../../../controllers/v1/admin/customer_care.controller");
const authMiddleware = require("../../../../middlewares/auth/v1/auth.middleware");
const adminMiddleware = require("../../../../middlewares/auth/v1/admin.middleware");
const router = express.Router();

router.get('/customer', authMiddleware, adminMiddleware, getAllUserCustomerController)
router.get('/booking', authMiddleware, adminMiddleware, getAllBookingController)
router.get('/coupons', authMiddleware, adminMiddleware, getAllCouponsController)
router.get('/user-coupons', authMiddleware, adminMiddleware, getAllUserCouponsController)
router.post('/coupons', authMiddleware, adminMiddleware, createUserCouponController)
router.post('/send-coupons', authMiddleware, adminMiddleware, sendGiftCouponController)
module.exports = router